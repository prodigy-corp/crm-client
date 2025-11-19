"use client";

import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import {
    CreateEmployeeSalaryPaymentDto,
    EmployeeSalaryPaymentStatus,
} from "@/lib/api/admin";
import { useCreateEmployeeSalaryPayment } from "@/hooks/use-admin";

interface SalaryPaymentDialogProps {
    employeeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SalaryPaymentDialog({
    employeeId,
    open,
    onOpenChange,
}: SalaryPaymentDialogProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateEmployeeSalaryPaymentDto>({
        defaultValues: {
            status: "PENDING",
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        },
    });

    const createPaymentMutation = useCreateEmployeeSalaryPayment();

    const basicSalary = watch("basicSalary") || 0;
    const grossSalary = watch("grossSalary") || 0;
    const totalDeduction = watch("totalDeduction") || 0;

    // Auto-calculate net payable
    const netPayable = grossSalary - totalDeduction;

    const onSubmit = (data: CreateEmployeeSalaryPaymentDto) => {
        createPaymentMutation.mutate(
            {
                id: employeeId,
                data: {
                    ...data,
                    month: parseInt(data.month.toString()),
                    year: parseInt(data.year.toString()),
                    basicSalary: parseFloat(data.basicSalary.toString()),
                    grossSalary: parseFloat(data.grossSalary.toString()),
                    totalDeduction: parseFloat(data.totalDeduction.toString()),
                    netPayable,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Salary payment recorded successfully");
                    reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to record salary payment");
                },
            },
        );
    };

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

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Record Salary Payment</DialogTitle>
                    <DialogDescription>
                        Create a new salary payment record for this employee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Month and Year */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="month">Month *</Label>
                            <Select
                                value={watch("month")?.toString()}
                                onValueChange={(value) => setValue("month", parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthNames.map((month, index) => (
                                        <SelectItem key={index + 1} value={(index + 1).toString()}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year *</Label>
                            <Select
                                value={watch("year")?.toString()}
                                onValueChange={(value) => setValue("year", parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Salary Details */}
                    <div className="space-y-4 rounded-lg border p-4">
                        <h4 className="font-medium">Salary Breakdown</h4>

                        <div className="space-y-2">
                            <Label htmlFor="basicSalary">Basic Salary *</Label>
                            <Input
                                id="basicSalary"
                                type="number"
                                step="0.01"
                                {...register("basicSalary", {
                                    required: "Basic salary is required",
                                    min: { value: 0, message: "Must be a positive number" },
                                })}
                            />
                            {errors.basicSalary && (
                                <p className="text-sm text-destructive">
                                    {errors.basicSalary.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grossSalary">Gross Salary *</Label>
                            <Input
                                id="grossSalary"
                                type="number"
                                step="0.01"
                                {...register("grossSalary", {
                                    required: "Gross salary is required",
                                    min: { value: 0, message: "Must be a positive number" },
                                })}
                            />
                            {errors.grossSalary && (
                                <p className="text-sm text-destructive">
                                    {errors.grossSalary.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Including bonuses, allowances, etc.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalDeduction">Total Deductions *</Label>
                            <Input
                                id="totalDeduction"
                                type="number"
                                step="0.01"
                                {...register("totalDeduction", {
                                    required: "Total deduction is required",
                                    min: { value: 0, message: "Must be a positive number" },
                                })}
                            />
                            {errors.totalDeduction && (
                                <p className="text-sm text-destructive">
                                    {errors.totalDeduction.message}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Taxes, insurance, loans, etc.
                            </p>
                        </div>

                        {/* Net Payable (calculated) */}
                        <div className="rounded-lg bg-primary/10 p-4">
                            <p className="text-sm text-muted-foreground">Net Payable</p>
                            <p className="text-3xl font-bold text-primary">
                                {netPayable.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Gross Salary ({grossSalary.toLocaleString()}) - Deductions (
                                {totalDeduction.toLocaleString()})
                            </p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="paymentDate">Payment Date (Optional)</Label>
                            <Input
                                id="paymentDate"
                                type="date"
                                {...register("paymentDate")}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={watch("status")}
                                onValueChange={(value: EmployeeSalaryPaymentStatus) =>
                                    setValue("status", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createPaymentMutation.isPending}>
                            {createPaymentMutation.isPending
                                ? "Creating..."
                                : "Record Payment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
