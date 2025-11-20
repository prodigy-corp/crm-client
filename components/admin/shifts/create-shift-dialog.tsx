'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCreateShift } from '@/hooks/use-organization';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LuClock, LuCalendar, LuInfo } from 'react-icons/lu';
import type { CreateShiftDto, CreateShiftScheduleDto } from '@/lib/api/organization';

interface CreateShiftDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
];

export function CreateShiftDialog({ open, onOpenChange }: CreateShiftDialogProps) {
    const createMutation = useCreateShift();
    const [schedules, setSchedules] = useState<CreateShiftScheduleDto[]>(
        DAYS_OF_WEEK.map((day) => ({
            dayOfWeek: day.value,
            startTime: undefined,
            endTime: undefined,
            isOffDay: false,
            isHalfDay: false,
        }))
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<Omit<CreateShiftDto, 'schedules'>>({
        defaultValues: {
            lateToleranceMinutes: 15,
            earlyDepartureToleranceMinutes: 15,
        },
    });

    const defaultStartTime = watch('startTime');
    const defaultEndTime = watch('endTime');

    const updateSchedule = (dayOfWeek: number, updates: Partial<CreateShiftScheduleDto>) => {
        setSchedules((prev) =>
            prev.map((schedule) =>
                schedule.dayOfWeek === dayOfWeek ? { ...schedule, ...updates } : schedule
            )
        );
    };

    const onSubmit = async (data: Omit<CreateShiftDto, 'schedules'>) => {
        const shiftData: CreateShiftDto = {
            ...data,
            schedules: schedules.map((schedule) => ({
                ...schedule,
                // Only include custom times if they differ from default
                startTime:
                    schedule.startTime && schedule.startTime !== data.startTime
                        ? schedule.startTime
                        : undefined,
                endTime:
                    schedule.endTime && schedule.endTime !== data.endTime ? schedule.endTime : undefined,
            })),
        };

        await createMutation.mutateAsync(shiftData);
        handleClose();
    };

    const handleClose = () => {
        reset();
        setSchedules(
            DAYS_OF_WEEK.map((day) => ({
                dayOfWeek: day.value,
                startTime: undefined,
                endTime: undefined,
                isOffDay: false,
                isHalfDay: false,
            }))
        );
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Work Shift</DialogTitle>
                    <DialogDescription>
                        Create a new shift with default hours and customize the 7-day weekly schedule
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">
                                <LuClock className="h-4 w-4 mr-2" />
                                Basic Info
                            </TabsTrigger>
                            <TabsTrigger value="schedule">
                                <LuCalendar className="h-4 w-4 mr-2" />
                                Weekly Schedule
                            </TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-4 mt-4">
                            {/* Shift Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Shift Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Morning Shift, Evening Shift"
                                    {...register('name', { required: 'Shift name is required' })}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of this shift"
                                    rows={2}
                                    {...register('description')}
                                />
                            </div>

                            {/* Default Hours */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">
                                        Start Time <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        {...register('startTime', { required: 'Start time is required' })}
                                    />
                                    {errors.startTime && (
                                        <p className="text-sm text-destructive">{errors.startTime.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">
                                        End Time <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        {...register('endTime', { required: 'End time is required' })}
                                    />
                                    {errors.endTime && (
                                        <p className="text-sm text-destructive">{errors.endTime.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Tolerances */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lateToleranceMinutes">Late Tolerance (minutes)</Label>
                                    <Input
                                        id="lateToleranceMinutes"
                                        type="number"
                                        min="0"
                                        {...register('lateToleranceMinutes', { valueAsNumber: true })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="earlyDepartureToleranceMinutes">
                                        Early Departure (minutes)
                                    </Label>
                                    <Input
                                        id="earlyDepartureToleranceMinutes"
                                        type="number"
                                        min="0"
                                        {...register('earlyDepartureToleranceMinutes', { valueAsNumber: true })}
                                    />
                                </div>
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3 flex gap-2">
                                <LuInfo className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-xs text-muted-foreground">
                                    These are default hours. You can customize times for specific days in the Weekly
                                    Schedule tab.
                                </p>
                            </div>
                        </TabsContent>

                        {/* Weekly Schedule Tab */}
                        <TabsContent value="schedule" className="space-y-4 mt-4">
                            <div className="rounded-lg bg-muted/50 p-3 flex gap-2 mb-4">
                                <LuInfo className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <p className="text-xs text-muted-foreground">
                                    Customize each day's schedule. Mark off days and half days as needed. Times
                                    default to {defaultStartTime || '09:00'} - {defaultEndTime || '17:00'} if not
                                    specified.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {DAYS_OF_WEEK.map((day) => {
                                    const schedule = schedules.find((s) => s.dayOfWeek === day.value)!;
                                    return (
                                        <Card key={day.value}>
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-sm font-medium">{day.label}</CardTitle>
                                                    <div className="flex items-center gap-3">
                                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                            <Checkbox
                                                                checked={schedule.isHalfDay}
                                                                onCheckedChange={(checked) =>
                                                                    updateSchedule(day.value, {
                                                                        isHalfDay: checked as boolean,
                                                                        isOffDay: false,
                                                                    })
                                                                }
                                                                disabled={schedule.isOffDay}
                                                            />
                                                            <span className="text-xs text-muted-foreground">Half Day</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                                            <Checkbox
                                                                checked={schedule.isOffDay}
                                                                onCheckedChange={(checked) =>
                                                                    updateSchedule(day.value, {
                                                                        isOffDay: checked as boolean,
                                                                        isHalfDay: false,
                                                                    })
                                                                }
                                                            />
                                                            <span className="text-xs text-muted-foreground">Off Day</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            {!schedule.isOffDay && (
                                                <CardContent className="pt-0">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1.5">
                                                            <Label htmlFor={`start-${day.value}`} className="text-xs">
                                                                Start Time
                                                            </Label>
                                                            <Input
                                                                id={`start-${day.value}`}
                                                                type="time"
                                                                value={schedule.startTime || defaultStartTime || ''}
                                                                onChange={(e) =>
                                                                    updateSchedule(day.value, { startTime: e.target.value })
                                                                }
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label htmlFor={`end-${day.value}`} className="text-xs">
                                                                End Time
                                                            </Label>
                                                            <Input
                                                                id={`end-${day.value}`}
                                                                type="time"
                                                                value={schedule.endTime || defaultEndTime || ''}
                                                                onChange={(e) =>
                                                                    updateSchedule(day.value, { endTime: e.target.value })
                                                                }
                                                                className="h-9"
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Creating...' : 'Create Shift'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
