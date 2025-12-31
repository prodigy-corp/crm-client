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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    EmployeeSalaryPayment,
    EmployeeSalaryPaymentStatus,
} from "@/lib/api/admin";
import { useAllSalaryPayments, useUpdateEmployeeSalaryPaymentStatus } from "@/hooks/use-admin";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

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
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const canViewSalary = !!user?.permissions?.includes(
        "admin.employees.view",
    );

    const {
        data: salaryData,
        isLoading,
        error,
    } = useAllSalaryPayments(
        {
            page,
            limit,
            status: statusFilter === "ALL" ? undefined : statusFilter,
        },
        !isAuthLoading && !!user && canViewSalary,
    );

    const updateStatusMutation = useUpdateEmployeeSalaryPaymentStatus();

    const handleStatusUpdate = (
        employeeId: string,
        paymentId: string,
        newStatus: EmployeeSalaryPaymentStatus,
    ) => {
        updateStatusMutation.mutate(
            {
                employeeId,
                paymentId,
                status: newStatus,
            },
            {
                onSuccess: () => {
                    toast.success(`Payment status updated to ${newStatus}`);
                },
                onError: (error: any) => {
                    toast.error(
                        error.message || "Failed to update payment status",
                    );
                },
            },
        );
    };

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

    const columns: ColumnDef<EmployeeSalaryPayment>[] = [
        {
            accessorKey: "employee.name",
            header: "Employee",
            cell: ({ row }) => {
                const employee = row.original.employee;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <span className="text-sm font-medium text-primary">
                                {employee?.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                        </div>
                        <div>
                            <div className="font-medium">{employee?.name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground">
                                {employee?.employeeCode || "—"}
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
            accessorKey: "basicSalary",
            header: "Base Salary",
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    ৳{row.original.basicSalary.toLocaleString()}
                </span>
            ),
        },
        {
            accessorKey: "grossSalary",
            header: "Gross Salary",
            cell: ({ row }) => (
                <span className="text-sm font-medium">
                    ৳{row.original.grossSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
            ),
        },
        {
            accessorKey: "totalDeduction",
            header: "Deductions",
            cell: ({ row }) => (
                <span className="text-sm text-red-600">
                    -৳{row.original.totalDeduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
            ),
        },
        {
            accessorKey: "netPayable",
            header: "Net Payable",
            cell: ({ row }) => (
                <span className="text-sm font-semibold text-green-600">
                    ৳{row.original.netPayable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                                {getStatusBadge(payment.status)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() =>
                                    handleStatusUpdate(
                                        payment.employeeId,
                                        payment.id,
                                        "PAID",
                                    )
                                }
                            >
                                Mark as Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    handleStatusUpdate(
                                        payment.employeeId,
                                        payment.id,
                                        "PENDING",
                                    )
                                }
                            >
                                Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    handleStatusUpdate(
                                        payment.employeeId,
                                        payment.id,
                                        "CANCELLED",
                                    )
                                }
                                className="text-destructive"
                            >
                                Cancel Payment
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            accessorKey: "paymentDate",
            header: "Payment Date",
            cell: ({ row }) => {
                const date = row.original.paymentDate;
                return (
                    <span className="text-sm text-muted-foreground">
                        {date ? format(new Date(date), "MMM dd, yyyy") : "—"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const payment = row.original;
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/dashboard/admin/employees/${payment.employeeId}?tab=salary`,
                            )
                        }
                    >
                        <LuEye className="mr-2 h-4 w-4" />
                        Details
                    </Button>
                );
            },
        },
    ];

    // Filter data based on search term and date range
    // Note: Ideally this filtering should happen on the backend
    const filteredData = useMemo(() => {
        return salaryData?.data?.filter((payment) => {
            const matchesSearch =
                !searchTerm ||
                payment.employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.employee?.employeeCode?.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesDate = true;
            if (dateRange?.from && dateRange?.to) {
                const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : new Date(payment.year, payment.month - 1);
                matchesDate =
                    paymentDate >= dateRange.from &&
                    paymentDate <= dateRange.to;
            }

            return matchesSearch && matchesDate;
        });
    }, [salaryData?.data, searchTerm, dateRange]);

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
                "Month/Year",
            ],
            ...filteredData.map((payment) => {
                return [
                    payment.employee?.name || "",
                    payment.employee?.employeeCode || "",
                    payment.employee?.designation || "",
                    payment.basicSalary.toString(),
                    payment.grossSalary.toString(),
                    payment.totalDeduction.toString(),
                    payment.netPayable.toString(),
                    payment.status,
                    payment.paymentDate ? format(new Date(payment.paymentDate), "yyyy-MM-dd") : "",
                    `${payment.month}/${payment.year}`,
                ];
            }),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `salary-${dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : "all"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Calculate totals from filtered data
    const calculateTotals = () => {
        if (!filteredData) return { base: 0, gross: 0, deduction: 0, net: 0 };

        return filteredData.reduce(
            (acc, payment) => {
                return {
                    base: acc.base + Number(payment.basicSalary || 0),
                    gross: acc.gross + Number(payment.grossSalary || 0),
                    deduction: acc.deduction + Number(payment.totalDeduction || 0),
                    net: acc.net + Number(payment.netPayable || 0),
                };
            },
            { base: 0, gross: 0, deduction: 0, net: 0 },
        );
    };

    const totals = useMemo(() => {
        return calculateTotals();
    }, [filteredData]);

    if (isAuthLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (isLoading) {
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

            <Alert>
                <LuInfo className="h-4 w-4" />
                <AlertDescription>
                    This page shows actual salary payment records. You can update the status of each payment directly from the table.
                </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <LuDollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Net Payable
                            </p>
                            <h3 className="text-2xl font-bold">
                                ৳{totals.net.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                            <LuCreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Gross Salary
                            </p>
                            <h3 className="text-2xl font-bold">
                                ৳{totals.gross.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
                            <LuTrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Deductions
                            </p>
                            <h3 className="text-2xl font-bold">
                                ৳{totals.deduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                            <LuCalendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Base Salary
                            </p>
                            <h3 className="text-2xl font-bold">
                                ৳{totals.base.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-4">
                    <div className="relative w-full md:w-72">
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
                            setStatusFilter(
                                value as EmployeeSalaryPaymentStatus | "ALL",
                            )
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <LuFilter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
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
                                    <span>Pick a date range</span>
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
                                                className="justify-start text-sm"
                                                onClick={() =>
                                                    setDateRange(preset.getValue())
                                                }
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange?.from}
                                        selected={dateRange}
                                        onSelect={setDateRange}
                                        numberOfMonths={2}
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center gap-2">
                    {searchTerm || statusFilter !== "ALL" || dateRange?.from ? (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("ALL");
                                setDateRange({
                                    from: startOfMonth(new Date()),
                                    to: endOfMonth(new Date()),
                                });
                            }}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <LuX className="ml-2 h-4 w-4" />
                        </Button>
                    ) : null}
                    <Button variant="outline" onClick={handleExport}>
                        <LuDownload className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <Card>
                <DataTable
                    columns={columns}
                    data={filteredData || []}
                    pagination={{
                        page: page,
                        limit: limit,
                        total: salaryData?.meta?.total || 0,
                        totalPages: salaryData?.meta?.totalPages || 1,
                    }}
                    onPageChange={setPage}
                    onPageSizeChange={setLimit}
                />
            </Card>
        </div>
    );
}
