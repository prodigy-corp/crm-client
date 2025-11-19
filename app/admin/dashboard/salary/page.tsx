"use client";

import { useState } from "react";
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
    LuDollarSign,
    LuSearch,
    LuFilter,
    LuDownload,
    LuInfo,
    LuEye,
    LuTrendingUp,
    LuCreditCard,
    LuCalendar,
    LuX,
} from "react-icons/lu";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import {
    AdminEmployee,
    EmployeeSalaryPaymentStatus,
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

export default function SalaryPage() {
    const router = useRouter();
    const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        EmployeeSalaryPaymentStatus | "ALL"
    >("ALL");
    const [dateRange, setDateRange] = useState<DateRange>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const canViewSalary = !!user?.permissions?.includes(
        "admin.employees.view",
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
        !isAuthLoading && !!user && canViewSalary,
    );

    const getStatusBadge = (status: EmployeeSalaryPaymentStatus) => {
        const variants: Record<EmployeeSalaryPaymentStatus, string> = {
            PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            PENDING:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            CANCELLED:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };

        return (
            <Badge className={variants[status]}>
                {status.toLowerCase()}
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
            accessorKey: "baseSalary",
            header: "Base Salary",
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    ৳{row.original.baseSalary.toLocaleString()}
                </span>
            ),
        },
        {
            id: "grossSalary",
            header: "Gross Salary",
            cell: ({ row }) => {
                // Mock calculation - in production, fetch from salary records
                const gross = row.original.baseSalary * 1.05; // 5% bonus
                return (
                    <span className="text-sm font-medium">
                        ৳{gross.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                );
            },
        },
        {
            id: "deductions",
            header: "Deductions",
            cell: ({ row }) => {
                // Mock deduction
                const deduction = row.original.baseSalary * 0.05; // 5% deduction
                return (
                    <span className="text-sm text-red-600">
                        -৳{deduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                );
            },
        },
        {
            id: "netPayable",
            header: "Net Payable",
            cell: ({ row }) => {
                // Mock calculation
                const gross = row.original.baseSalary * 1.05;
                const deduction = row.original.baseSalary * 0.05;
                const net = gross - deduction;
                return (
                    <span className="text-sm font-semibold text-green-600">
                        ৳{net.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                );
            },
        },
        {
            id: "status",
            header: "Status",
            cell: () => {
                // Mock status - in production, fetch from salary payment records
                const statuses: EmployeeSalaryPaymentStatus[] = [
                    "PAID",
                    "PENDING",
                ];
                const randomStatus =
                    statuses[Math.floor(Math.random() * statuses.length)];
                return getStatusBadge(randomStatus);
            },
        },
        {
            id: "paymentDate",
            header: "Payment Date",
            cell: () => {
                // Mock date
                return (
                    <span className="text-sm text-muted-foreground">
                        {format(new Date(), "MMM dd, yyyy")}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const employee = row.original;
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/admin/dashboard/employees/${employee.id}?tab=salary`,
                            )
                        }
                    >
                        <LuEye className="mr-2 h-4 w-4" />
                        View Details
                    </Button>
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
                "Base Salary",
                "Gross Salary",
                "Deductions",
                "Net Payable",
                "Status",
                "Payment Date",
                "Period",
            ],
            ...filteredData.map((emp) => {
                const gross = emp.baseSalary * 1.05;
                const deduction = emp.baseSalary * 0.05;
                const net = gross - deduction;
                return [
                    emp.name,
                    emp.employeeCode || "",
                    emp.designation || "",
                    emp.baseSalary.toString(),
                    gross.toFixed(2),
                    deduction.toFixed(2),
                    net.toFixed(2),
                    "PAID", // Mock
                    format(new Date(), "yyyy-MM-dd"),
                    dateRange.from && dateRange.to
                        ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                        : "All Time",
                ];
            }),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `salary-${dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "all"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Filter employees based on search
    const filteredData = employeesData?.data?.filter((emp) => {
        const matchesSearch =
            !searchTerm ||
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Calculate totals
    const calculateTotals = () => {
        if (!filteredData) return { base: 0, gross: 0, deduction: 0, net: 0 };

        return filteredData.reduce(
            (acc, emp) => {
                const gross = emp.baseSalary * 1.05;
                const deduction = emp.baseSalary * 0.05;
                const net = gross - deduction;

                return {
                    base: acc.base + emp.baseSalary,
                    gross: acc.gross + gross,
                    deduction: acc.deduction + deduction,
                    net: acc.net + net,
                };
            },
            { base: 0, gross: 0, deduction: 0, net: 0 },
        );
    };

    const totals = calculateTotals();

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

    if (!canViewSalary) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <LuInfo className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Access denied</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You do not have permission to view salary records.
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
                        Error loading salary data
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
                        Salary Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and track employee salary payments
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                            <LuDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Base Salary
                            </p>
                            <p className="text-2xl font-semibold">
                                ৳{totals.base.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                            <LuTrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Gross Payable
                            </p>
                            <p className="text-2xl font-semibold">
                                ৳{totals.gross.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                            <LuDollarSign className="h-6 w-6 text-red-600 dark:text-red-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Deductions
                            </p>
                            <p className="text-2xl font-semibold">
                                ৳{totals.deduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                            <LuCreditCard className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Net Payable
                            </p>
                            <p className="text-2xl font-semibold">
                                ৳{totals.net.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
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
                                Payment Period
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
                                        value as EmployeeSalaryPaymentStatus | "ALL",
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
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Cancelled
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
                        <LuDollarSign className="h-5 w-5" />
                        Salary Records
                        {dateRange.from && dateRange.to && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({format(dateRange.from, "MMM dd")} -{" "}
                                {format(dateRange.to, "MMM dd, yyyy")})
                            </span>
                        )}
                    </h3>
                    {employeesData?.meta && (
                        <p className="text-sm text-muted-foreground">
                            Total: {filteredData?.length || 0} employees
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
