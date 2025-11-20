"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import {
  AdminEmployee,
  UpdateAdminEmployeeDto,
  EmployeeStatus,
} from "@/lib/api/admin";
import { useUpdateEmployee } from "@/hooks/use-admin";
import { useDepartments, useShifts } from "@/hooks/use-organization";
import { Department, Shift } from "@/lib/api/organization";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";

interface EditEmployeeDialogProps {
  employee: AdminEmployee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
}: EditEmployeeDialogProps) {
  const updateEmployeeMutation = useUpdateEmployee();
  const { data: departments, isLoading: departmentsLoading } = useDepartments();
  const { data: shifts, isLoading: shiftsLoading } = useShifts();

  const [formData, setFormData] = useState<UpdateAdminEmployeeDto>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeCode: employee.employeeCode,
        name: employee.name,
        designation: employee.designation,
        mobileNumber: employee.mobileNumber,
        emailAddress: employee.emailAddress,
        joiningDate: employee.joiningDate,
        baseSalary: employee.baseSalary,
        status: employee.status,
        departmentId: employee.departmentId || undefined,
        shiftId: employee.shiftId || undefined,
      });
    }
  }, [employee]);

  const handleInputChange = (
    field: keyof UpdateAdminEmployeeDto,
  ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleNumberChange = (
    field: keyof UpdateAdminEmployeeDto,
  ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value ? Number(value) : undefined,
      }));
    };

  const handleStatusChange = (value: EmployeeStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!employee) return;

    updateEmployeeMutation.mutate(
      { id: employee.id, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update employee basic, contact, job, and salary information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeCode">Employee Code</Label>
                <Input
                  id="employeeCode"
                  value={formData.employeeCode || ""}
                  onChange={handleInputChange("employeeCode")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={handleInputChange("name")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation || ""}
                  onChange={handleInputChange("designation")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate || ""}
                  onChange={handleInputChange("joiningDate")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base Salary</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  min={0}
                  value={
                    formData.baseSalary !== undefined
                      ? String(formData.baseSalary)
                      : ""
                  }
                  onChange={handleNumberChange("baseSalary")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || employee.status}
                  onValueChange={(value) =>
                    handleStatusChange(value as EmployeeStatus)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="RESIGNED">Resigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <Select
                  value={formData.departmentId || "__none__"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      departmentId: value === "__none__" ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger id="departmentId">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No Department</SelectItem>
                    {departments?.map((dept: Department) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shiftId">Shift</Label>
                <Select
                  value={formData.shiftId || "__none__"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      shiftId: value === "__none__" ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger id="shiftId">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No Shift</SelectItem>
                    {shifts?.map((shift: Shift) => (
                      <SelectItem key={shift.id} value={shift.id}>
                        {shift.name} ({shift.startTime} - {shift.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact Information</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber || ""}
                  onChange={handleInputChange("mobileNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress || ""}
                  onChange={handleInputChange("emailAddress")}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateEmployeeMutation.isPending}>
              {updateEmployeeMutation.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Updating...
                </>
              ) : (
                "Update Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
