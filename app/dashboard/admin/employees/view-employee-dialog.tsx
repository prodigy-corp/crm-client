"use client";

import { AdminEmployee, EmployeeStatus } from "@/lib/api/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import {
  LuCalendar,
  LuPhone,
  LuMail,
  LuUser,
  LuBriefcase,
  LuDollarSign,
} from "react-icons/lu";

interface ViewEmployeeDialogProps {
  employee: AdminEmployee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusBadge = (status: EmployeeStatus) => {
  const variants: Record<EmployeeStatus, string> = {
    ACTIVE:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    INACTIVE:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    RESIGNED:
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <Badge className={variants[status]}>
      {status.toLowerCase()}
    </Badge>
  );
};

export function ViewEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: ViewEmployeeDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View detailed information about this employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{employee.name}</h3>
                {getStatusBadge(employee.status)}
              </div>
              <div className="text-sm text-muted-foreground">
                {employee.designation || "No designation"}
              </div>
              <div className="text-xs text-muted-foreground">
                ID: <span className="font-mono">{employee.id}</span>
                {employee.employeeCode && (
                  <>
                    {" "}| Code: <span className="font-mono">{employee.employeeCode}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <LuUser className="h-4 w-4" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              {employee.mobileNumber && (
                <div className="flex items-center gap-2">
                  <LuPhone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Mobile:</span>
                  <span className="font-medium">{employee.mobileNumber}</span>
                </div>
              )}
              {employee.emailAddress && (
                <div className="flex items-center gap-2">
                  <LuMail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{employee.emailAddress}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <LuBriefcase className="h-4 w-4" />
              Job Information
            </h4>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              <div className="flex items-center gap-2">
                <LuCalendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined:</span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(employee.joiningDate), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {employee.resignDate && (
                <div className="flex items-center gap-2">
                  <LuCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Resigned:</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(employee.resignDate), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <LuDollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Base Salary:</span>
                <span className="font-medium">
                  {employee.baseSalary.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground md:grid-cols-2">
            <div>
              Created: {" "}
              <span className="font-medium">
                {formatDistanceToNow(new Date(employee.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {employee.updatedAt && (
              <div>
                Last Updated: {" "}
                <span className="font-medium">
                  {formatDistanceToNow(new Date(employee.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
