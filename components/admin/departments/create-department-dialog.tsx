'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateDepartment, useShifts } from '@/hooks/use-organization';
import type { CreateDepartmentDto, Shift } from '@/lib/api/organization';
import { useForm } from 'react-hook-form';

interface CreateDepartmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateDepartmentDialog({ open, onOpenChange }: CreateDepartmentDialogProps) {
    const { data: shifts, isLoading: shiftsLoading } = useShifts();
    const createMutation = useCreateDepartment();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateDepartmentDto>();

    const defaultShiftId = watch('defaultShiftId');

    const onSubmit = async (data: CreateDepartmentDto) => {
        await createMutation.mutateAsync(data);
        reset();
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
                    <DialogTitle>Create Department</DialogTitle>
                    <DialogDescription>
                        Add a new department and optionally assign a default shift for all employees
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Department Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Department Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Engineering, Sales, Marketing"
                            {...register('name', { required: 'Department name is required' })}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of this department"
                            rows={3}
                            {...register('description')}
                        />
                    </div>

                    {/* Default Shift */}
                    <div className="space-y-2">
                        <Label htmlFor="defaultShiftId">Default Shift (Optional)</Label>
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
                            Employees in this department will inherit this shift unless they have a personal shift assigned
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Department'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
