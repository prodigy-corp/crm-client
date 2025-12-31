"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import {
    LuDollarSign,
    LuTrendingUp,
    LuCirclePlus,
    LuFileText,
    LuDownload,
} from "react-icons/lu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    EmployeeSalaryPayment,
    EmployeeSalaryPaymentStatus,
    EmployeeSalaryPaymentQueryParams,
} from "@/lib/api/admin";
import { useEmployeeSalaryPayments } from "@/hooks/use-admin";
import { SalaryIncrementDialog } from "./salary-increment-dialog";
import { SalaryPaymentDialog } from "./salary-payment-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUpdateEmployeeSalaryPaymentStatus } from "@/hooks/use-admin";

interface SalaryTabProps {
    employeeId: string;
    canManage: boolean;
}

export function SalaryTab({ employeeId, canManage }: SalaryTabProps) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [statusFilter, setStatusFilter] = useState<
        EmployeeSalaryPaymentStatus | "ALL"
    >("ALL");
    const [yearFilter, setYearFilter] = useState<number | "ALL">("ALL");
    const [openIncrementDialog, setOpenIncrementDialog] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

    const queryParams: EmployeeSalaryPaymentQueryParams = {
        page,
        limit,
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        ...(yearFilter !== "ALL" && { year: yearFilter }),
    };

    const {
        data: paymentsData,
        isLoading,
        error,
    } = useEmployeeSalaryPayments(employeeId, queryParams);

    const updateStatusMutation = useUpdateEmployeeSalaryPaymentStatus();

    const handleStatusUpdate = (
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
            PENDING:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
            PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            CANCELLED:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };

        return (
            <Badge className={variants[status]}>{status.toLowerCase()}</Badge>
        );
    };

    const columns: ColumnDef<EmployeeSalaryPayment>[] = [
        {
            accessorKey: "month",
            header: "Month",
            cell: ({ row }) => {
                const monthNames = [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                ];
                return (
                    <div className="font-medium">
                        {monthNames[row.original.month - 1]} {row.original.year}
                    </div>
                );
            },
        },
        {
            accessorKey: "basicSalary",
            header: "Basic Salary",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.basicSalary.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "grossSalary",
            header: "Gross Salary",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.grossSalary.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "totalDeduction",
            header: "Deductions",
            cell: ({ row }) => (
                <div className="text-sm text-destructive">
                    -{row.original.totalDeduction.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "netPayable",
            header: "Net Payable",
            cell: ({ row }) => (
                <div className="text-lg font-semibold text-primary">
                    {row.original.netPayable.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "paymentDate",
            header: "Payment Date",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.paymentDate
                        ? format(new Date(row.original.paymentDate), "MMM dd, yyyy")
                        : "—"}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const payment = row.original;
                if (!canManage) {
                    return getStatusBadge(payment.status);
                }
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
    ];

    const handleExport = () => {
        if (!paymentsData?.data) return;

        const csv = [
            [
                "Month",
                "Year",
                "Basic Salary",
                "Gross Salary",
                "Deductions",
                "Net Payable",
                "Payment Date",
                "Status",
            ],
            ...paymentsData.data.map((payment) => [
                payment.month.toString(),
                payment.year.toString(),
                payment.basicSalary.toString(),
                payment.grossSalary.toString(),
                payment.totalDeduction.toString(),
                payment.netPayable.toString(),
                payment.paymentDate || "",
                payment.status,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `salary-payments-${employeeId}-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Calculate summary stats
    const summary = paymentsData?.data.reduce(
        (acc, payment) => ({
            totalPaid:
                acc.totalPaid +
                (payment.status === "PAID" ? Number(payment.netPayable || 0) : 0),
            totalPending:
                acc.totalPending +
                (payment.status === "PENDING" ? Number(payment.netPayable || 0) : 0),
            totalDeductions: acc.totalDeductions + Number(payment.totalDeduction || 0),
        }),
        { totalPaid: 0, totalPending: 0, totalDeductions: 0 },
    );

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    if (error) {
        return (
            <Card className="p-6">
                <p className="text-center text-destructive">
                    Error loading salary information
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            {summary && (
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                <LuDollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                <p className="text-2xl font-bold">
                                    {summary.totalPaid.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                                <LuFileText className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pending</p>
                                <p className="text-2xl font-bold">
                                    {summary.totalPending.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                                <LuTrendingUp className="h-5 w-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Deductions
                                </p>
                                <p className="text-2xl font-bold">
                                    {summary.totalDeductions.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Quick Actions */}
            {canManage && (
                <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <LuDollarSign className="h-5 w-5" />
                        Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={() => setOpenIncrementDialog(true)}>
                            <LuTrendingUp className="mr-2 h-4 w-4" />
                            Create Salary Increment
                        </Button>
                        <Button
                            onClick={() => setOpenPaymentDialog(true)}
                            variant="secondary"
                        >
                            <LuCirclePlus className="mr-2 h-4 w-4" />
                            Record Payment
                        </Button>
                    </div>
                </Card>
            )}

            {/* Filters */}
            <Card className="p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Year</label>
                        <Select
                            value={yearFilter.toString()}
                            onValueChange={(value) =>
                                setYearFilter(value === "ALL" ? "ALL" : parseInt(value))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Years</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as EmployeeSalaryPaymentStatus | "ALL")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PAID">Paid</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end">
                        <Button onClick={handleExport} variant="outline" className="w-full">
                            <LuDownload className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Payment Records */}
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <LuFileText className="h-5 w-5" />
                        Payment History
                    </h3>
                    {paymentsData?.meta && (
                        <p className="text-sm text-muted-foreground">
                            Total: {paymentsData.meta.total} records
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
                        data={paymentsData?.data || []}
                        pagination={paymentsData?.meta}
                        onPageChange={setPage}
                        onPageSizeChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />
                )}
            </Card>

            {/* Dialogs */}
            <SalaryIncrementDialog
                employeeId={employeeId}
                open={openIncrementDialog}
                onOpenChange={setOpenIncrementDialog}
            />

            <SalaryPaymentDialog
                employeeId={employeeId}
                open={openPaymentDialog}
                onOpenChange={setOpenPaymentDialog}
            />
        </div>
    );
}
