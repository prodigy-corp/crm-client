'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateDepartment, useShifts } from '@/hooks/use-organization';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Department, Shift, UpdateDepartmentDto } from '@/lib/api/organization';

interface EditDepartmentDialogProps {
    department: Department;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditDepartmentDialog({
    department,
    open,
    onOpenChange,
}: EditDepartmentDialogProps) {
    const { data: shifts, isLoading: shiftsLoading } = useShifts();
    const updateMutation = useUpdateDepartment();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<UpdateDepartmentDto>({
        defaultValues: {
            name: department.name,
            description: department.description || '',
            defaultShiftId: department.defaultShiftId || undefined,
        },
    });

    const defaultShiftId = watch('defaultShiftId');

    useEffect(() => {
        if (department) {
            reset({
                name: department.name,
                description: department.description || '',
                defaultShiftId: department.defaultShiftId || undefined,
            });
        }
    }, [department, reset]);

    const onSubmit = async (data: UpdateDepartmentDto) => {
        await updateMutation.mutateAsync({ id: department.id, data });
        onOpenChange(false);
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Department</DialogTitle>
                    <DialogDescription>Update department information and default shift</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Department Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">
                            Department Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-name"
                            placeholder="e.g., Engineering, Sales, Marketing"
                            {...register('name', { required: 'Department name is required' })}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                            id="edit-description"
                            placeholder="Brief description of this department"
                            rows={3}
                            {...register('description')}
                        />
                    </div>

                    {/* Default Shift */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-defaultShiftId">Default Shift (Optional)</Label>
                        <Select
                            value={defaultShiftId || '__none__'}
                            onValueChange={(value) => setValue('defaultShiftId', value === '__none__' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a default shift..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">No default shift</SelectItem>
                                {shiftsLoading ? (
                                    <SelectItem value="loading" disabled>
                                        Loading shifts...
                                    </SelectItem>
                                ) : shifts && shifts.length > 0 ? (
                                    shifts.map((shift: Shift) => (
                                        <SelectItem key={shift.id} value={shift.id}>
                                            {shift.name} ({shift.startTime} - {shift.endTime})
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>
                                        No shifts available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Changes will affect all employees in this department who don't have a personal shift
                        </p>
                    </div>

                    {/* Employee Count Info */}
                    {department._count?.employees ? (
                        <div className="rounded-lg bg-muted p-3">
                            <p className="text-sm text-muted-foreground">
                                This department currently has <strong>{department._count.employees}</strong>{' '}
                                employee{department._count.employees !== 1 ? 's' : ''}
                            </p>
                        </div>
                    ) : null}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Updating...' : 'Update Department'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
