"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    LuClock,
    LuSearch,
    LuFilter,
    LuDownload,
    LuCalendar,
    LuInfo,
    LuUser,
    LuEye,
    LuLogIn,
    LuLogOut,
    LuX,
} from "react-icons/lu";
import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import {
    EmployeeAttendanceStatus,
    AdminEmployee,
} from "@/lib/api/admin";
import { useEmployees } from "@/hooks/use-admin";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type DateRange = {
    from: Date | undefined;
    to: Date | undefined;
};

const dateRangePresets = [
    {
        label: "Today",
        getValue: () => ({
            from: new Date(),
            to: new Date(),
        }),
    },
    {
        label: "This Month",
        getValue: () => ({
            from: startOfMonth(new Date()),
            to: endOfMonth(new Date()),
        }),
    },
    {
        label: "Last Month",
        getValue: () => {
            const lastMonth = subMonths(new Date(), 1);
            return {
                from: startOfMonth(lastMonth),
                to: endOfMonth(lastMonth),
            };
        },
    },
    {
        label: "Last 3 Months",
        getValue: () => ({
            from: subMonths(new Date(), 3),
            to: new Date(),
        }),
    },
    {
        label: "Last 6 Months",
        getValue: () => ({
            from: subMonths(new Date(), 6),
            to: new Date(),
        }),
    },
    {
        label: "This Year",
        getValue: () => ({
            from: startOfYear(new Date()),
            to: endOfYear(new Date()),
        }),
    },
    {
        label: "Last Year",
        getValue: () => {
            const lastYear = new Date(new Date().getFullYear() - 1, 0, 1);
            return {
                from: startOfYear(lastYear),
                to: endOfYear(lastYear),
            };
        },
    },
    {
        label: "All Time",
        getValue: () => ({
            from: undefined,
            to: undefined,
        }),
    },
];

export default function AttendancePage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        EmployeeAttendanceStatus | "ALL"
    >("ALL");
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(),
        to: new Date(),
    });

    const canViewAttendance = !!user?.permissions?.includes(
        "admin.employees.view",
    );
    const canManageAttendance = !!user?.permissions?.includes(
        "admin.employees.manage",
    );

    const {
        data: employeesData,
        isLoading,
        error,
    } = useEmployees(
        {
            page,
            limit,
            search: searchTerm || undefined,
            status: "ACTIVE",
            sortBy: "name",
            sortOrder: "asc",
        },
        !isAuthLoading && !!user && canViewAttendance,
    );

    // Generate consistent mock attendance data per employee
    const getEmployeeMockData = (employeeId: string) => {
        // Use employee ID to generate consistent mock data
        const seed = employeeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const statuses: EmployeeAttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "ON_LEAVE"];
        const statusIndex = seed % statuses.length;

        return {
            status: statuses[statusIndex],
            checkIn: `${(9 + (seed % 2)).toString().padStart(2, "0")}:${((seed * 7) % 60).toString().padStart(2, "0")} AM`,
            checkOut: `${(5 + (seed % 3)).toString().padStart(2, "0")}:${((seed * 11) % 60).toString().padStart(2, "0")} PM`,
            workingHours: (7 + ((seed % 20) / 10)).toFixed(2),
        };
    };

    // Filter employees based on search, status, and date range
    const filteredData = useMemo(() => {
        return employeesData?.data?.filter((emp) => {
            const matchesSearch =
                !searchTerm ||
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());

            // Filter by status (using mock data)
            const mockData = getEmployeeMockData(emp.id);
            const matchesStatus = statusFilter === "ALL" || mockData.status === statusFilter;

            // Date range filtering note:
            // In production, you'd compare attendance record dates with dateRange.from/to
            // For now, we'll allow all dates since we don't have real attendance records
            const matchesDateRange = true; // All mock data is considered "today"

            return matchesSearch && matchesStatus && matchesDateRange;
        });
    }, [employeesData?.data, searchTerm, statusFilter, dateRange]);

    // Calculate stats from filtered data
    const stats = useMemo(() => {
        if (!filteredData) return { present: 0, absent: 0, late: 0, onLeave: 0 };

        return filteredData.reduce((acc, emp) => {
            const mockData = getEmployeeMockData(emp.id);
            switch (mockData.status) {
                case "PRESENT":
                    acc.present++;
                    break;
                case "ABSENT":
                    acc.absent++;
                    break;
                case "LATE":
                    acc.late++;
                    break;
                case "ON_LEAVE":
                    acc.onLeave++;
                    break;
            }
            return acc;
        }, { present: 0, absent: 0, late: 0, onLeave: 0 });
    }, [filteredData]);

    const getStatusBadge = (status: EmployeeAttendanceStatus) => {
        const variants: Record<EmployeeAttendanceStatus, string> = {
            PRESENT:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            ABSENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            LATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            ON_LEAVE:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };

        return (
            <Badge className={variants[status]}>
                {status.toLowerCase().replace("_", " ")}
            </Badge>
        );
    };

    const columns: ColumnDef<AdminEmployee>[] = [
        {
            accessorKey: "name",
            header: "Employee",
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-medium text-primary">
                                {employee.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {employee.employeeCode || "—"}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "designation",
            header: "Designation",
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.designation || "—"}
                </span>
            ),
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => {
                const mockData = getEmployeeMockData(row.original.id);
                return getStatusBadge(mockData.status);
            },
        },
        {
            id: "checkIn",
            header: "Check In",
            cell: ({ row }) => {
                const mockData = getEmployeeMockData(row.original.id);
                return (
                    <div className="flex items-center gap-1 text-sm">
                        <LuLogIn className="h-3 w-3 text-green-600" />
                        {mockData.checkIn}
                    </div>
                );
            },
        },
        {
            id: "checkOut",
            header: "Check Out",
            cell: ({ row }) => {
                const mockData = getEmployeeMockData(row.original.id);
                return (
                    <div className="flex items-center gap-1 text-sm">
                        <LuLogOut className="h-3 w-3 text-red-600" />
                        {mockData.checkOut}
                    </div>
                );
            },
        },
        {
            id: "workingHours",
            header: "Working Hours",
            cell: ({ row }) => {
                const mockData = getEmployeeMockData(row.original.id);
                return <span className="text-sm font-medium">{mockData.workingHours} hrs</span>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                router.push(
                                    `/admin/dashboard/employees/${employee.id}?tab=attendance`,
                                )
                            }
                        >
                            <LuEye className="mr-2 h-4 w-4" />
                            View
                        </Button>
                        {canManageAttendance && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Handle check-in action
                                }}
                            >
                                <LuLogIn className="mr-2 h-4 w-4" />
                                Check In
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    const handleExport = () => {
        if (!filteredData) return;

        const csv = [
            [
                "Employee Name",
                "Employee Code",
                "Designation",
                "Date",
                "Check In",
                "Check Out",
                "Working Hours",
                "Status",
            ],
            ...filteredData.map((emp) => {
                const mockData = getEmployeeMockData(emp.id);
                return [
                    emp.name,
                    emp.employeeCode || "",
                    emp.designation || "",
                    dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "",
                    mockData.checkIn,
                    mockData.checkOut,
                    mockData.workingHours,
                    mockData.status,
                ];
            }),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "all"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (isAuthLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (isAuthError || !user) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <LuInfo className="mx-auto h-12 w-12 text-destructive" />
                    <p className="mt-4 text-lg font-medium text-destructive">
                        Failed to load user information
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please refresh the page or try again later.
                    </p>
                </div>
            </div>
        );
    }

    if (!canViewAttendance) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <LuInfo className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Access denied</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You do not have permission to view attendance records.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-medium text-destructive">
                        Error loading attendance
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {(error as any).message ||
                            "Please check your connection and try again"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Attendance Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track and manage employee attendance records
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                            <LuUser className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Present
                            </p>
                            <p className="text-2xl font-semibold">
                                {stats.present}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                            <LuUser className="h-6 w-6 text-red-600 dark:text-red-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Absent
                            </p>
                            <p className="text-2xl font-semibold">{stats.absent}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                            <LuClock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Late
                            </p>
                            <p className="text-2xl font-semibold">{stats.late}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <LuCalendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                On Leave
                            </p>
                            <p className="text-2xl font-semibold">{stats.onLeave}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters and Table */}
            <Card className="p-6">
                <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <LuFilter className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">
                            Filters & Search
                        </h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">
                                Date Range
                            </label>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "flex-1 justify-start text-left font-normal",
                                                !dateRange.from && "text-muted-foreground",
                                            )}
                                        >
                                            <LuCalendar className="mr-2 h-4 w-4" />
                                            {dateRange.from ? (
                                                dateRange.to ? (
                                                    <>
                                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                                        {format(dateRange.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(dateRange.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <div className="flex flex-col sm:flex-row">
                                            <div className="border-b sm:border-b-0 sm:border-r bg-muted/30 p-3">
                                                <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                                                    Quick Select
                                                </p>
                                                <div className="space-y-1">
                                                    {dateRangePresets.map((preset) => (
                                                        <Button
                                                            key={preset.label}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="w-full justify-start font-normal hover:bg-primary/10"
                                                            onClick={() => {
                                                                setDateRange(preset.getValue());
                                                            }}
                                                        >
                                                            {preset.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <Calendar
                                                    mode="range"
                                                    selected={{
                                                        from: dateRange.from,
                                                        to: dateRange.to,
                                                    }}
                                                    onSelect={(range: any) => {
                                                        setDateRange({
                                                            from: range?.from,
                                                            to: range?.to,
                                                        });
                                                    }}
                                                    numberOfMonths={2}
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                {dateRange.from && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setDateRange({ from: undefined, to: undefined })
                                        }
                                    >
                                        <LuX className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Search
                            </label>
                            <div className="relative">
                                <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Status
                            </label>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) => {
                                    setStatusFilter(
                                        value as EmployeeAttendanceStatus | "ALL",
                                    );
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="PRESENT">
                                        Present
                                    </SelectItem>
                                    <SelectItem value="ABSENT">
                                        Absent
                                    </SelectItem>
                                    <SelectItem value="LATE">Late</SelectItem>
                                    <SelectItem value="ON_LEAVE">
                                        On Leave
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleExport} variant="outline">
                            <LuDownload className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <LuCalendar className="h-5 w-5" />
                        Attendance Records
                        {dateRange.from && dateRange.to && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({format(dateRange.from, "MMM dd")} -{" "}
                                {format(dateRange.to, "MMM dd, yyyy")})
                            </span>
                        )}
                    </h3>
                    {employeesData?.meta && (
                        <p className="text-sm text-muted-foreground">
                            Showing: {filteredData?.length || 0} / {employeesData.meta.total} employees
                        </p>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Spinner className="h-8 w-8" />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredData || []}
                        pagination={employeesData?.meta}
                        onPageChange={setPage}
                        onPageSizeChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />
                )}
            </Card>
        </div>
    );
}