"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
    LuUser,
    LuClock,
    LuDollarSign,
    LuInfo,
    LuArrowLeft,
} from "react-icons/lu";
import { useEmployee } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmployeeDetailsTab } from "./employee-details-tab";
import { AttendanceTab } from "./attendance-tab";
import { SalaryTab } from "./salary-tab";

export default function EmployeeDetailPage() {
    const params = useParams();
    const employeeId = params.id as string;
    const { user, isLoading: isAuthLoading } = useAuth();

    const canViewEmployees = !!user?.permissions?.includes(
        "admin.employees.view",
    );
    const canManageEmployees = !!user?.permissions?.includes(
        "admin.employees.manage",
    );

    const {
        data: employeeData,
        isLoading,
        error,
    } = useEmployee(employeeId, !isAuthLoading && !!user && canViewEmployees);

    if (isAuthLoading || isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (error || !employeeData) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <LuInfo className="mx-auto h-12 w-12 text-destructive" />
                    <p className="mt-4 text-lg font-medium text-destructive">
                        Error loading employee
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {(error as any)?.message || "Employee not found"}
                    </p>
                    <Link href="/admin/dashboard/employees" className="mt-4 inline-block">
                        <Button variant="outline">
                            <LuArrowLeft className="mr-2 h-4 w-4" />
                            Back to Employees
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!canViewEmployees) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <LuInfo className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-lg font-medium">Access denied</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        You do not have permission to view employee details.
                    </p>
                </div>
            </div>
        );
    }

    const employee = employeeData;

    const getStatusBadge = (status: string) => {
        const variants: Record<string, string> = {
            ACTIVE:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            INACTIVE:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
            RESIGNED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };

        return (
            <Badge className={variants[status] || variants.INACTIVE}>
                {status.toLowerCase()}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Link href="/admin/dashboard/employees">
                            <Button variant="ghost" size="sm">
                                <LuArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                            {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-semibold">{employee.name}</h1>
                                {getStatusBadge(employee.status)}
                            </div>
                            <p className="text-muted-foreground">
                                {employee.designation || "No designation"} •{" "}
                                {employee.employeeCode || "No code"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="details">
                        <LuUser className="mr-2 h-4 w-4" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="attendance">
                        <LuClock className="mr-2 h-4 w-4" />
                        Attendance
                    </TabsTrigger>
                    <TabsTrigger value="salary">
                        <LuDollarSign className="mr-2 h-4 w-4" />
                        Salary
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                    <EmployeeDetailsTab employee={employee} />
                </TabsContent>

                <TabsContent value="attendance">
                    <AttendanceTab
                        employeeId={employeeId}
                        canManage={canManageEmployees}
                    />
                </TabsContent>

                <TabsContent value="salary">
                    <SalaryTab employeeId={employeeId} canManage={canManageEmployees} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
