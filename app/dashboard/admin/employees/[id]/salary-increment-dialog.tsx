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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CreateEmployeeSalaryIncrementDto } from "@/lib/api/admin";
import {
    useCreateEmployeeSalaryIncrement,
    useEmployee,
} from "@/hooks/use-admin";

interface SalaryIncrementDialogProps {
    employeeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SalaryIncrementDialog({
    employeeId,
    open,
    onOpenChange,
}: SalaryIncrementDialogProps) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<CreateEmployeeSalaryIncrementDto>();

    const { data: employeeData } = useEmployee(employeeId);
    const currentSalary = employeeData?.baseSalary || 0;

    const createIncrementMutation = useCreateEmployeeSalaryIncrement();
    const newSalary = watch("newSalary");

    const incrementAmount = newSalary
        ? parseFloat(newSalary.toString()) - currentSalary
        : 0;
    const incrementPercentage = currentSalary
        ? ((incrementAmount / currentSalary) * 100).toFixed(2)
        : "0";

    const onSubmit = (data: CreateEmployeeSalaryIncrementDto) => {
        createIncrementMutation.mutate(
            {
                id: employeeId,
                data: {
                    ...data,
                    newSalary: parseFloat(data.newSalary.toString()),
                },
            },
            {
                onSuccess: () => {
                    toast.success("Salary increment created successfully");
                    reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to create salary increment");
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Salary Increment</DialogTitle>
                    <DialogDescription>
                        Record a salary increment for this employee.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Current Salary Info */}
                    <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                            Current Base Salary
                        </p>
                        <p className="text-2xl font-bold">
                            {currentSalary.toLocaleString()}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newSalary">New Salary *</Label>
                        <Input
                            id="newSalary"
                            type="number"
                            step="0.01"
                            {...register("newSalary", {
                                required: "New salary is required",
                                validate: (value) =>
                                    parseFloat(value.toString()) > currentSalary ||
                                    "New salary must be greater than current salary",
                            })}
                        />
                        {errors.newSalary && (
                            <p className="text-sm text-destructive">
                                {errors.newSalary.message}
                            </p>
                        )}
                    </div>

                    {/* Increment Preview */}
                    {newSalary && incrementAmount > 0 && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Increment Amount</p>
                                    <p className="text-lg font-semibold text-primary">
                                        +{incrementAmount.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Percentage Increase</p>
                                    <p className="text-lg font-semibold text-primary">
                                        +{incrementPercentage}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="effectiveFrom">Effective From *</Label>
                        <Input
                            id="effectiveFrom"
                            type="date"
                            {...register("effectiveFrom", {
                                required: "Effective date is required",
                            })}
                        />
                        {errors.effectiveFrom && (
                            <p className="text-sm text-destructive">
                                {errors.effectiveFrom.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            {...register("reason")}
                            placeholder="e.g., Annual performance review, Promotion, etc."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createIncrementMutation.isPending}>
                            {createIncrementMutation.isPending
                                ? "Creating..."
                                : "Create Increment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
