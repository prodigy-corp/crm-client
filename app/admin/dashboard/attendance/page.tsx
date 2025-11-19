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
    EmployeeAttendance,
} from "@/lib/api/admin";
import { useAllAttendance } from "@/hooks/use-admin";
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

    const {
        data: attendanceData,
        isLoading,
        error,
    } = useAllAttendance(
        {
            page,
            limit,
            search: searchTerm || undefined,
            status: statusFilter === "ALL" ? undefined : statusFilter,
            fromDate: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
            toDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        },
        !isAuthLoading && !!user && canViewAttendance,
    );

    // Calculate stats from fetched data
    const stats = useMemo(() => {
        if (!attendanceData?.data) return { present: 0, absent: 0, late: 0, onLeave: 0 };

        return attendanceData.data.reduce((acc: any, record: EmployeeAttendance) => {
            switch (record.status) {
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
    }, [attendanceData?.data]);

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

    const columns: ColumnDef<EmployeeAttendance>[] = [
        {
            accessorKey: "employee.name",
            header: "Employee",
            cell: ({ row }) => {
                const employee = row.original.employee;
                if (!employee) return <span className="text-muted-foreground">Unknown</span>;

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
            accessorKey: "employee.designation",
            header: "Designation",
            cell: ({ row }) => (
                <span className="text-sm">
                    {row.original.employee?.designation || "—"}
                </span>
            ),
        },
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => (
                <span className="text-sm">
                    {format(new Date(row.original.date), "MMM dd, yyyy")}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                return getStatusBadge(row.original.status);
            },
        },
        {
            accessorKey: "checkInAt",
            header: "Check In",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-1 text-sm">
                        <LuLogIn className="h-3 w-3 text-green-600" />
                        {row.original.checkInAt ? format(new Date(row.original.checkInAt), "hh:mm a") : "—"}
                    </div>
                );
            },
        },
        {
            accessorKey: "checkOutAt",
            header: "Check Out",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-1 text-sm">
                        <LuLogOut className="h-3 w-3 text-red-600" />
                        {row.original.checkOutAt ? format(new Date(row.original.checkOutAt), "hh:mm a") : "—"}
                    </div>
                );
            },
        },
        {
            accessorKey: "workingHours",
            header: "Working Hours",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-1 text-sm">
                        <LuClock className="h-3 w-3 text-muted-foreground" />
                        {row.original.workingHours ? `${Number(row.original.workingHours).toFixed(2)} hrs` : "—"}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/dashboard/employees/${row.original.employeeId}?tab=attendance`)}
                    >
                        <LuEye className="h-4 w-4" />
                    </Button>
                );
            },
        },
    ];

    const handleExport = () => {
        if (!attendanceData?.data) return;

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
            ...attendanceData.data.map((record: EmployeeAttendance) => {
                return [
                    record.employee?.name || "",
                    record.employee?.employeeCode || "",
                    record.employee?.designation || "",
                    format(new Date(record.date), "yyyy-MM-dd"),
                    record.checkInAt ? format(new Date(record.checkInAt), "hh:mm a") : "",
                    record.checkOutAt ? format(new Date(record.checkOutAt), "hh:mm a") : "",
                    record.workingHours || "",
                    record.status,
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
            <div className="flex h-full items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isAuthError || !user) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">
                    Please log in to view attendance.
                </p>
                <Button onClick={() => router.push("/auth/login")}>Log In</Button>
            </div>
        );
    }

    if (!canViewAttendance) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <p className="text-destructive">
                    You do not have permission to view attendance.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
                    <p className="text-muted-foreground">
                        Monitor employee attendance and working hours.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <LuDownload className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                            <LuUser className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Present
                            </p>
                            <h3 className="text-2xl font-bold">{stats.present}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            <LuUser className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Absent
                            </p>
                            <h3 className="text-2xl font-bold">{stats.absent}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                            <LuClock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Late
                            </p>
                            <h3 className="text-2xl font-bold">{stats.late}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                            <LuCalendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                On Leave
                            </p>
                            <h3 className="text-2xl font-bold">{stats.onLeave}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative flex-1 md:max-w-sm">
                            <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as EmployeeAttendanceStatus | "ALL")
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <LuFilter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Statuses</SelectItem>
                                <SelectItem value="PRESENT">Present</SelectItem>
                                <SelectItem value="ABSENT">Absent</SelectItem>
                                <SelectItem value="LATE">Late</SelectItem>
                                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                            </SelectContent>
                        </Select>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !dateRange && "text-muted-foreground",
                                    )}
                                >
                                    <LuCalendar className="mr-2 h-4 w-4" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="flex">
                                    <div className="border-r p-2">
                                        <div className="flex flex-col gap-1">
                                            {dateRangePresets.map((preset) => (
                                                <Button
                                                    key={preset.label}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="justify-start text-xs"
                                                    onClick={() => {
                                                        setDateRange(preset.getValue());
                                                    }}
                                                >
                                                    {preset.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={(range) => setDateRange(range as DateRange)}
                                        numberOfMonths={2}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                        {(searchTerm || statusFilter !== "ALL" || dateRange.from) && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("ALL");
                                    setDateRange({ from: undefined, to: undefined });
                                }}
                                className="h-8 px-2 lg:px-3"
                            >
                                Reset
                                <LuX className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex h-32 items-center justify-center">
                        <Spinner />
                    </div>
                ) : error ? (
                    <div className="flex h-32 items-center justify-center text-destructive">
                        Failed to load attendance data
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={attendanceData?.data || []}
                        pagination={{
                            page: page,
                            limit: limit,
                            total: attendanceData?.meta?.total || 0,
                            totalPages: attendanceData?.meta?.totalPages || 1,
                        }}
                        onPageChange={setPage}
                        onPageSizeChange={setLimit}
                    />
                )}
            </Card>
        </div>
    );
}