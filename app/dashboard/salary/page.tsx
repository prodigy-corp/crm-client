"use client";

import { useEmployeeSalaryPayments, useEmployeeSalaryIncrements, useEmployeeProfile } from "@/hooks/use-employee";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    LuDollarSign,
    LuCalendar,
    LuTrendingUp,
    LuChevronLeft,
    LuChevronRight,
    LuDownload,
    LuCircleCheck,
    LuClock,
} from "react-icons/lu";
import { useState } from "react";
import { format } from "date-fns";

export default function SalaryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const { data: profile } = useEmployeeProfile();
    const { data: payments, isLoading: paymentsLoading } = useEmployeeSalaryPayments({
        page: currentPage,
        limit: 10,
        month: filters.month,
        year: filters.year,
    });

    const { data: increments, isLoading: incrementsLoading } = useEmployeeSalaryIncrements();

    const getMonthName = (month: number) => {
        const date = new Date();
        date.setMonth(month - 1);
        return format(date, "MMMM");
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            paid: {
                icon: LuCircleCheck,
                className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            },
            pending: {
                icon: LuClock,
                className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
            >
                <Icon className="h-3 w-3" />
                {status.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Salary</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    View your salary payments and increments
                </p>
            </div>

            {/* Current Salary Overview */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-white/90">
                            Current Salary
                        </CardTitle>
                        <LuDollarSign className="h-5 w-5 text-white/90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">৳{profile?.data?.baseSalary || "0"}</div>
                        <p className="text-xs text-white/80">Per month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Increments</CardTitle>
                        <LuTrendingUp className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {increments?.data?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Salary adjustments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Payments This Year</CardTitle>
                        <LuCalendar className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            {payments?.meta?.total || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Total transactions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Payments</CardTitle>
                    <CardDescription>Filter by month and year</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="month">Month</Label>
                            <select
                                id="month"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={filters.month}
                                onChange={(e) =>
                                    setFilters({ ...filters, month: parseInt(e.target.value) })
                                }
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                    <option key={month} value={month}>
                                        {getMonthName(month)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={filters.year}
                                onChange={(e) =>
                                    setFilters({ ...filters, year: parseInt(e.target.value) })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>Your salary payment records</CardDescription>
                </CardHeader>
                <CardContent>
                    {paymentsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Month
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Year
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Basic Salary
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Gross Salary
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Deductions
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Net Payable
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments?.data && payments.data.length > 0 ? (
                                            payments.data.map((payment: any) => (
                                                <tr
                                                    key={payment.id}
                                                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="px-4 py-3 text-sm font-medium">
                                                        {getMonthName(payment.month)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {payment.year}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        ৳{payment.basicSalary || 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                                                        ৳{payment.grossSalary || 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-red-600">
                                                        -৳{payment.totalDeduction || 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-primary">
                                                        ৳{payment.netPayable || 0}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {getStatusBadge(payment.status)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="gap-1"
                                                        >
                                                            <LuDownload className="h-3 w-3" />
                                                            Download
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                                >
                                                    No payment records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {payments?.meta && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {payments.data?.length || 0} of{" "}
                                        {payments.meta.total} records
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <LuChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => p + 1)}
                                            disabled={
                                                currentPage === payments.meta.totalPages
                                            }
                                        >
                                            Next
                                            <LuChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Salary Increments */}
            <Card>
                <CardHeader>
                    <CardTitle>Salary Increments</CardTitle>
                    <CardDescription>History of your salary adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                    {incrementsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                            </div>
                        </div>
                    ) : increments?.data && increments.data.length > 0 ? (
                        <div className="space-y-4">
                            {increments.data.map((increment: any) => (
                                <div
                                    key={increment.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                            <LuTrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                Salary Increment
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {format(
                                                    new Date(increment.effectiveFrom),
                                                    "MMM d, yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">
                                            +৳{increment.incrementAmount || 0}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            New: ৳{increment.newSalary || 0}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-gray-500">
                            No salary increments yet
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
