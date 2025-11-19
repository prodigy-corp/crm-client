"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import {
  CreateAdminEmployeeDto,
  EmployeeStatus,
} from "@/lib/api/admin";
import { useCreateEmployee } from "@/hooks/use-admin";
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

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEmployeeDialog({
  open,
  onOpenChange,
}: CreateEmployeeDialogProps) {
  const createEmployeeMutation = useCreateEmployee();

  const [formData, setFormData] = useState<CreateAdminEmployeeDto>({
    name: "",
    joiningDate: "",
    baseSalary: 0,
    status: "ACTIVE",
  });

  const handleInputChange = (
    field: keyof CreateAdminEmployeeDto,
  ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleNumberChange = (
    field: keyof CreateAdminEmployeeDto,
  ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value ? Number(value) : 0,
      }));
    };

  const handleStatusChange = (value: EmployeeStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      joiningDate: "",
      baseSalary: 0,
      status: "ACTIVE",
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    createEmployeeMutation.mutate(formData, {
      onSuccess: () => {
        onOpenChange(false);
        resetForm();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>
            Add a new employee with basic, contact, job, and education information.
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
                  placeholder="EMP-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation || ""}
                  onChange={handleInputChange("designation")}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleInputChange("joiningDate")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Base Salary *</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  min={0}
                  value={formData.baseSalary || ""}
                  onChange={handleNumberChange("baseSalary")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "ACTIVE"}
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="userId">
                  User Account ID (Optional)
                </Label>
                <Input
                  id="userId"
                  value={formData.userId || ""}
                  onChange={handleInputChange("userId")}
                  placeholder="Enter user ID to link to existing account"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Link this employee to an existing user account. The system will automatically assign the &quot;employee&quot; role.
                </p>
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
                  placeholder="+8801..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternativeContactNumber">Alternative Contact</Label>
                <Input
                  id="alternativeContactNumber"
                  value={formData.alternativeContactNumber || ""}
                  onChange={handleInputChange("alternativeContactNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corporateContactNumber">Corporate Contact</Label>
                <Input
                  id="corporateContactNumber"
                  value={formData.corporateContactNumber || ""}
                  onChange={handleInputChange("corporateContactNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress || ""}
                  onChange={handleInputChange("emailAddress")}
                  placeholder="employee@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookProfileLink">Facebook Profile</Label>
                <Input
                  id="facebookProfileLink"
                  value={formData.facebookProfileLink || ""}
                  onChange={handleInputChange("facebookProfileLink")}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Personal & Family</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName || ""}
                  onChange={handleInputChange("fatherName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={formData.motherName || ""}
                  onChange={handleInputChange("motherName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={handleInputChange("dateOfBirth")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  value={formData.nationalId || ""}
                  onChange={handleInputChange("nationalId")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleInputChange("bloodGroup")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherContactNumber">Father's Contact</Label>
                <Input
                  id="fatherContactNumber"
                  value={formData.fatherContactNumber || ""}
                  onChange={handleInputChange("fatherContactNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherContactNumber">Mother's Contact</Label>
                <Input
                  id="motherContactNumber"
                  value={formData.motherContactNumber || ""}
                  onChange={handleInputChange("motherContactNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactNumber">Emergency Contact</Label>
                <Input
                  id="emergencyContactNumber"
                  value={formData.emergencyContactNumber || ""}
                  onChange={handleInputChange("emergencyContactNumber")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Bank & Education</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName || ""}
                  onChange={handleInputChange("bankName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name</Label>
                <Input
                  id="branchName"
                  value={formData.branchName || ""}
                  onChange={handleInputChange("branchName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber || ""}
                  onChange={handleInputChange("bankAccountNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sscRoll">SSC Roll</Label>
                <Input
                  id="sscRoll"
                  value={formData.sscRoll || ""}
                  onChange={handleInputChange("sscRoll")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sscRegistrationNumber">SSC Registration</Label>
                <Input
                  id="sscRegistrationNumber"
                  value={formData.sscRegistrationNumber || ""}
                  onChange={handleInputChange("sscRegistrationNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sscPassingYear">SSC Passing Year</Label>
                <Input
                  id="sscPassingYear"
                  type="number"
                  value={formData.sscPassingYear || ""}
                  onChange={handleNumberChange("sscPassingYear")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sscBoard">SSC Board</Label>
                <Input
                  id="sscBoard"
                  value={formData.sscBoard || ""}
                  onChange={handleInputChange("sscBoard")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sscResult">SSC Result</Label>
                <Input
                  id="sscResult"
                  value={formData.sscResult || ""}
                  onChange={handleInputChange("sscResult")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hscRoll">HSC Roll</Label>
                <Input
                  id="hscRoll"
                  value={formData.hscRoll || ""}
                  onChange={handleInputChange("hscRoll")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hscRegistrationNumber">HSC Registration</Label>
                <Input
                  id="hscRegistrationNumber"
                  value={formData.hscRegistrationNumber || ""}
                  onChange={handleInputChange("hscRegistrationNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hscPassingYear">HSC Passing Year</Label>
                <Input
                  id="hscPassingYear"
                  type="number"
                  value={formData.hscPassingYear || ""}
                  onChange={handleNumberChange("hscPassingYear")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hscBoard">HSC Board</Label>
                <Input
                  id="hscBoard"
                  value={formData.hscBoard || ""}
                  onChange={handleInputChange("hscBoard")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hscResult">HSC Result</Label>
                <Input
                  id="hscResult"
                  value={formData.hscResult || ""}
                  onChange={handleInputChange("hscResult")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorsRoll">Honors/Diploma Roll</Label>
                <Input
                  id="honorsRoll"
                  value={formData.honorsRoll || ""}
                  onChange={handleInputChange("honorsRoll")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorsRegistrationNumber">Honors/Diploma Registration</Label>
                <Input
                  id="honorsRegistrationNumber"
                  value={formData.honorsRegistrationNumber || ""}
                  onChange={handleInputChange("honorsRegistrationNumber")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorsPassingYear">Honors/Diploma Passing Year</Label>
                <Input
                  id="honorsPassingYear"
                  type="number"
                  value={formData.honorsPassingYear || ""}
                  onChange={handleNumberChange("honorsPassingYear")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorsInstitutionName">Honors/Diploma Institution</Label>
                <Input
                  id="honorsInstitutionName"
                  value={formData.honorsInstitutionName || ""}
                  onChange={handleInputChange("honorsInstitutionName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorsSubject">Honors/Diploma Subject</Label>
                <Input
                  id="honorsSubject"
                  value={formData.honorsSubject || ""}
                  onChange={handleInputChange("honorsSubject")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="honorsResult">Honors/Diploma Result</Label>
                <Input
                  id="honorsResult"
                  value={formData.honorsResult || ""}
                  onChange={handleInputChange("honorsResult")}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createEmployeeMutation.isPending ||
                !formData.name ||
                !formData.joiningDate ||
                !formData.baseSalary
              }
            >
              {createEmployeeMutation.isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
