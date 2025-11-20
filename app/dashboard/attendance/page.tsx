"use client";

import { useEmployeeAttendance, useAttendanceStatistics } from "@/hooks/use-employee";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    LuCalendar,
    LuClock,
    LuCircleCheck,
    LuCircleX,
    LuTriangleAlert,
    LuChevronLeft,
    LuChevronRight,
} from "react-icons/lu";
import { useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function AttendancePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState({
        fromDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
        toDate: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    });

    const { data: attendance, isLoading } = useEmployeeAttendance({
        page: currentPage,
        limit: 10,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
    });

    const { data: stats, isLoading: statsLoading } = useAttendanceStatistics();

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            present: {
                icon: LuCircleCheck,
                className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            },
            absent: {
                icon: LuCircleX,
                className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            },
            late: {
                icon: LuTriangleAlert,
                className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            },
            on_leave: {
                icon: LuCalendar,
                className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
            >
                <Icon className="h-3 w-3" />
                {status.replace("_", " ").toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Track your attendance history and statistics
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                        <LuCalendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.data?.workingDays || 0}</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Present</CardTitle>
                        <LuCircleCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats?.data?.present || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.data?.workingDays
                                ? Math.round(
                                    ((stats.data.present || 0) / stats.data.workingDays) * 100
                                )
                                : 0}
                            % attendance
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        <LuCircleX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats?.data?.absent || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Days missed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                        <LuTriangleAlert className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats?.data?.late || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Leave: {stats?.data?.onLeave || 0}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Attendance</CardTitle>
                    <CardDescription>Filter by date range</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fromDate">From Date</Label>
                            <Input
                                id="fromDate"
                                type="date"
                                value={dateRange.fromDate}
                                onChange={(e) =>
                                    setDateRange({ ...dateRange, fromDate: e.target.value })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="toDate">To Date</Label>
                            <Input
                                id="toDate"
                                type="date"
                                value={dateRange.toDate}
                                onChange={(e) =>
                                    setDateRange({ ...dateRange, toDate: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>Your daily attendance records</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
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
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Check In
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Check Out
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Working Hours
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance?.data && attendance.data.length > 0 ? (
                                            attendance.data.map((record: any) => (
                                                <tr
                                                    key={record.id}
                                                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                                >
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <LuCalendar className="h-4 w-4 text-gray-500" />
                                                            {format(new Date(record.date), "MMM d, yyyy")}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {record.checkInAt ? (
                                                            <div className="flex items-center gap-2 text-green-600">
                                                                <LuClock className="h-4 w-4" />
                                                                {format(
                                                                    new Date(record.checkInAt),
                                                                    "hh:mm a"
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">--</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {record.checkOutAt ? (
                                                            <div className="flex items-center gap-2 text-red-600">
                                                                <LuClock className="h-4 w-4" />
                                                                {format(
                                                                    new Date(record.checkOutAt),
                                                                    "hh:mm a"
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">--</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold">
                                                        {record.workingHours
                                                            ? `${record.workingHours}h`
                                                            : "--"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {getStatusBadge(record.status)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                                >
                                                    No attendance records found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {attendance?.meta && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {attendance.data?.length || 0} of{" "}
                                        {attendance.meta.total} records
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
                                                currentPage === attendance.meta.totalPages
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
        </div>
    );
}
