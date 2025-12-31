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
    EmployeeAttendanceStatus,
    UpsertEmployeeAttendanceDto,
} from "@/lib/api/admin";
import { useUpsertEmployeeAttendance } from "@/hooks/use-admin";

interface ManualAttendanceDialogProps {
    employeeId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManualAttendanceDialog({
    employeeId,
    open,
    onOpenChange,
}: ManualAttendanceDialogProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<UpsertEmployeeAttendanceDto>({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            status: "PRESENT",
        },
    });

    const upsertMutation = useUpsertEmployeeAttendance();
    const status = watch("status");

    const onSubmit = (data: UpsertEmployeeAttendanceDto) => {
        // Calculate working hours if both times provided
        let workingHours: number | undefined;
        if (data.checkInAt && data.checkOutAt) {
            const checkIn = new Date(`${data.date}T${data.checkInAt}`);
            const checkOut = new Date(`${data.date}T${data.checkOutAt}`);
            workingHours =
                (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        }

        upsertMutation.mutate(
            {
                id: employeeId,
                data: {
                    ...data,
                    checkInAt: data.checkInAt
                        ? `${data.date}T${data.checkInAt}:00Z`
                        : undefined,
                    checkOutAt: data.checkOutAt
                        ? `${data.date}T${data.checkOutAt}:00Z`
                        : undefined,
                    workingHours,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Attendance record saved successfully");
                    reset();
                    onOpenChange(false);
                },
                onError: (error: any) => {
                    toast.error(error.message || "Failed to save attendance");
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Manual Attendance Entry</DialogTitle>
                    <DialogDescription>
                        Create or update attendance record for a specific date.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                            id="date"
                            type="date"
                            {...register("date", { required: "Date is required" })}
                            max={new Date().toISOString().split("T")[0]}
                        />
                        {errors.date && (
                            <p className="text-sm text-destructive">{errors.date.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={status}
                            onValueChange={(value: EmployeeAttendanceStatus) =>
                                setValue("status", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRESENT">Present</SelectItem>
                                <SelectItem value="ABSENT">Absent</SelectItem>
                                <SelectItem value="LATE">Late</SelectItem>
                                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {status !== "ABSENT" && (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="checkInAt">Check In Time</Label>
                                    <Input
                                        id="checkInAt"
                                        type="time"
                                        {...register("checkInAt")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="checkOutAt">Check Out Time</Label>
                                    <Input
                                        id="checkOutAt"
                                        type="time"
                                        {...register("checkOutAt")}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                                💡 Working hours will be calculated automatically if both times
                                are provided
                            </p>
                        </>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? "Saving..." : "Save Attendance"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
