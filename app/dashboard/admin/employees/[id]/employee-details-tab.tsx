"use client";

import { Card } from "@/components/ui/card";
import { AdminEmployee } from "@/lib/api/admin";
import { formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface EmployeeDetailsTabProps {
  employee: AdminEmployee;
}

export function EmployeeDetailsTab({ employee }: EmployeeDetailsTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Contact Information */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          Contact Information
        </h3>
        <div className="space-y-3 text-sm">
          {employee.mobileNumber && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-muted-foreground">Mobile</p>
                <p className="font-medium">{employee.mobileNumber}</p>
              </div>
            </div>
          )}
          {employee.emailAddress && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
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
          <Briefcase className="h-5 w-5" />
          Job Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
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
            <DollarSign className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-muted-foreground">Base Salary</p>
              <p className="font-medium">
                {employee.baseSalary.toLocaleString()}
              </p>
            </div>
          </div>
          {employee.resignDate && (
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
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
