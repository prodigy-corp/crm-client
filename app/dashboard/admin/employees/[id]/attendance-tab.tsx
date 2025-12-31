"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import Spinner from "@/components/ui/spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    LuClock,
    LuLogIn,
    LuLogOut,
    LuCirclePlus,
    LuCalendar,
    LuDownload,
    LuFilter,
} from "react-icons/lu";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    EmployeeAttendance,
    EmployeeAttendanceStatus,
    EmployeeAttendanceQueryParams,
} from "@/lib/api/admin";
import {
    useEmployeeAttendance,
    useEmployeeCheckIn,
    useEmployeeCheckOut,
} from "@/hooks/use-admin";
import { ManualAttendanceDialog } from "./manual-attendance-dialog";

interface AttendanceTabProps {
    employeeId: string;
    canManage: boolean;
}

export function AttendanceTab({ employeeId, canManage }: AttendanceTabProps) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [statusFilter, setStatusFilter] = useState<
        EmployeeAttendanceStatus | "ALL"
    >("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [openManualDialog, setOpenManualDialog] = useState(false);

    const queryParams: EmployeeAttendanceQueryParams = {
        page,
        limit,
        ...(statusFilter !== "ALL" && { status: statusFilter }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
    };

    const {
        data: attendanceData,
        isLoading,
        error,
    } = useEmployeeAttendance(employeeId, queryParams);

    const checkInMutation = useEmployeeCheckIn();
    const checkOutMutation = useEmployeeCheckOut();

    const handleCheckIn = () => {
        checkInMutation.mutate(
            { id: employeeId },
            {
                onSuccess: () => {
                    toast.success("Check-in recorded successfully");
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to record check-in");
                },
            },
        );
    };

    const handleCheckOut = () => {
        checkOutMutation.mutate(
            { id: employeeId },
            {
                onSuccess: () => {
                    toast.success("Check-out recorded successfully");
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to record check-out");
                },
            },
        );
    };

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
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => (
                <div className="font-medium">
                    {format(new Date(row.original.date), "MMM dd, yyyy")}
                </div>
            ),
        },
        {
            accessorKey: "checkInAt",
            header: "Check In",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.checkInAt
                        ? format(new Date(row.original.checkInAt), "hh:mm a")
                        : "—"}
                </div>
            ),
        },
        {
            accessorKey: "checkOutAt",
            header: "Check Out",
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.checkOutAt
                        ? format(new Date(row.original.checkOutAt), "hh:mm a")
                        : "—"}
                </div>
            ),
        },
        {
            accessorKey: "workingHours",
            header: "Working Hours",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.workingHours
                        ? `${Number(row.original.workingHours).toFixed(2)} hrs`
                        : "—"}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
    ];

    const handleExport = () => {
        if (!attendanceData?.data) return;

        const csv = [
            ["Date", "Check In", "Check Out", "Working Hours", "Status"],
            ...attendanceData.data.map((record) => [
                format(new Date(record.date), "yyyy-MM-dd"),
                record.checkInAt
                    ? format(new Date(record.checkInAt), "HH:mm:ss")
                    : "",
                record.checkOutAt
                    ? format(new Date(record.checkOutAt), "HH:mm:ss")
                    : "",
                record.workingHours?.toString() || "",
                record.status,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-${employeeId}-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (error) {
        return (
            <Card className="p-6">
                <p className="text-center text-destructive">
                    Error loading attendance records
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            {canManage && (
                <Card className="p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <LuClock className="h-5 w-5" />
                        Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Button
                            onClick={handleCheckIn}
                            disabled={checkInMutation.isPending}
                        >
                            <LuLogIn className="mr-2 h-4 w-4" />
                            {checkInMutation.isPending ? "Recording..." : "Check In"}
                        </Button>
                        <Button
                            onClick={handleCheckOut}
                            disabled={checkOutMutation.isPending}
                            variant="outline"
                        >
                            <LuLogOut className="mr-2 h-4 w-4" />
                            {checkOutMutation.isPending ? "Recording..." : "Check Out"}
                        </Button>
                        <Button
                            onClick={() => setOpenManualDialog(true)}
                            variant="secondary"
                        >
                            <LuCirclePlus className="mr-2 h-4 w-4" />
                            Manual Entry
                        </Button>
                    </div>
                </Card>
            )}

            {/* Filters */}
            <Card className="p-6">
                <div className="mb-4 flex items-center gap-2">
                    <LuFilter className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Filters</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">From Date</label>
                        <Input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">To Date</label>
                        <Input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as EmployeeAttendanceStatus | "ALL")
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PRESENT">Present</SelectItem>
                                <SelectItem value="ABSENT">Absent</SelectItem>
                                <SelectItem value="LATE">Late</SelectItem>
                                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
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

            {/* Attendance Records */}
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <LuCalendar className="h-5 w-5" />
                        Attendance Records
                    </h3>
                    {attendanceData?.meta && (
                        <p className="text-sm text-muted-foreground">
                            Total: {attendanceData.meta.total} records
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
                        data={attendanceData?.data || []}
                        pagination={attendanceData?.meta}
                        onPageChange={setPage}
                        onPageSizeChange={(newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                        }}
                    />
                )}
            </Card>

            {/* Manual Attendance Dialog */}
            <ManualAttendanceDialog
                employeeId={employeeId}
                open={openManualDialog}
                onOpenChange={setOpenManualDialog}
            />
        </div>
    );
}
