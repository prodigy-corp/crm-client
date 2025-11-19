"use client";

import { AdminEmployee } from "@/lib/api/admin";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
    LuCalendar,
    LuPhone,
    LuMail,
    LuUser,
    LuBriefcase,
    LuDollarSign,
    LuMapPin,
    LuCreditCard,
    LuGraduationCap,
    LuUsers,
} from "react-icons/lu";

interface EmployeeDetailsTabProps {
    employee: AdminEmployee;
}

export function EmployeeDetailsTab({ employee }: EmployeeDetailsTabProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Information */}
            <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <LuUser className="h-5 w-5" />
                    Contact Information
                </h3>
                <div className="space-y-3 text-sm">
                    {employee.mobileNumber && (
                        <div className="flex items-start gap-3">
                            <LuPhone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-muted-foreground">Mobile</p>
                                <p className="font-medium">{employee.mobileNumber}</p>
                            </div>
                        </div>
                    )}
                    {employee.emailAddress && (
                        <div className="flex items-start gap-3">
                            <LuMail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{employee.emailAddress}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Job Information */}
            <Card className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <LuBriefcase className="h-5 w-5" />
                    Job Information
                </h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <LuCalendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-muted-foreground">Joined</p>
                            <p className="font-medium">
                                {formatDistanceToNow(new Date(employee.joiningDate), {
                                    addSuffix: true,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <LuDollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-muted-foreground">Base Salary</p>
                            <p className="font-medium">
                                {employee.baseSalary.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {employee.resignDate && (
                        <div className="flex items-start gap-3">
                            <LuCalendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-muted-foreground">Resigned</p>
                                <p className="font-medium">
                                    {formatDistanceToNow(new Date(employee.resignDate), {
                                        addSuffix: true,
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Additional details can be added here */}
        </div>
    );
}
