'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useShifts, useDeleteShift } from '@/hooks/use-organization';
import { hasPermission } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    LuPlus,
    LuPencil,
    LuTrash2,
    LuClock,
    LuUsers,
    LuBuilding2,
    LuCalendar,
    LuSun,
    LuCloudRain,
} from 'react-icons/lu';
import { CreateShiftDialog } from '@/components/admin/shifts/create-shift-dialog';
import { EditShiftDialog } from '@/components/admin/shifts/edit-shift-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Shift } from '@/lib/api/organization';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function ShiftsPage() {
    const { user } = useAuth();
    const { data: shifts, isLoading } = useShifts();
    const deleteMutation = useDeleteShift();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);
    const [deletingShift, setDeletingShift] = useState<Shift | null>(null);

    const canCreate = hasPermission(user, 'admin.shifts.create');
    const canUpdate = hasPermission(user, 'admin.shifts.update');
    const canDelete = hasPermission(user, 'admin.shifts.delete');

    const handleDelete = async () => {
        if (!deletingShift) return;
        await deleteMutation.mutateAsync(deletingShift.id);
        setDeletingShift(null);
    };

    if (isLoading) {
        return <ShiftsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Work Shifts</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage work shifts with 7-day schedules, off days, and half days
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                        <LuPlus className="h-4 w-4" />
                        Create Shift
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Shifts</CardDescription>
                        <CardTitle className="text-3xl">{shifts?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Assigned to Employees</CardDescription>
                        <CardTitle className="text-3xl">
                            {shifts?.reduce((sum: number, shift: Shift) => sum + (shift._count?.employees || 0), 0) || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Assigned to Departments</CardDescription>
                        <CardTitle className="text-3xl">
                            {shifts?.reduce((sum: number, shift: Shift) => sum + (shift._count?.departments || 0), 0) || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Shifts Grid */}
            {shifts && shifts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {shifts.map((shift: Shift) => (
                        <Card key={shift.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <LuClock className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">{shift.name}</CardTitle>
                                            {shift.description && (
                                                <CardDescription className="mt-1">{shift.description}</CardDescription>
                                            )}
                                        </div>
                                    </div>
                                    {(canUpdate || canDelete) && (
                                        <div className="flex items-center gap-2">
                                            {canUpdate && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={() => setEditingShift(shift)}
                                                >
                                                    <LuPencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </Button>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2 text-destructive hover:text-destructive"
                                                    onClick={() => setDeletingShift(shift)}
                                                >
                                                    <LuTrash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Shift Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Default Hours</p>
                                        <p className="font-medium">
                                            {shift.startTime} - {shift.endTime}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foregrou nd mb-1">Late Tolerance</p>
                                        <p className="font-medium">{shift.lateToleranceMinutes} minutes</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Early Departure</p>
                                        <p className="font-medium">{shift.earlyDepartureToleranceMinutes} minutes</p>
                                    </div>
                                </div>

                                {/* Weekly Schedule */}
                                {shift.schedules && shift.schedules.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                            <LuCalendar className="h-4 w-4" />
                                            Weekly Schedule
                                        </h4>
                                        <div className="grid grid-cols-7 gap-2">
                                            {DAYS_OF_WEEK.map((day, index) => {
                                                const schedule = shift.schedules?.find((s) => s.dayOfWeek === index);
                                                const isOffDay = schedule?.isOffDay;
                                                const isHalfDay = schedule?.isHalfDay;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`p-3 rounded-lg border text-center ${isOffDay
                                                            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                                                            : isHalfDay
                                                                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800'
                                                                : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800'
                                                            }`}
                                                    >
                                                        <p className="text-xs font-medium mb-1">{day}</p>
                                                        {isOffDay ? (
                                                            <div className="flex flex-col items-center gap-1">
                                                                <LuCloudRain className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                                <span className="text-[10px] text-red-600 dark:text-red-400">
                                                                    OFF
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="text-xs font-mono">
                                                                    {schedule?.startTime || shift.startTime}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground">-</div>
                                                                <div className="text-xs font-mono">
                                                                    {schedule?.endTime || shift.endTime}
                                                                </div>
                                                                {isHalfDay && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="mt-1 text-[9px] px-1 py-0 h-4 border-amber-400"
                                                                    >
                                                                        HALF
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Assignment Info */}
                                <div className="flex items-center gap-6 text-sm text-muted-foreground pt-2 border-t">
                                    <div className="flex items-center gap-2">
                                        <LuUsers className="h-4 w-4" />
                                        <span>{shift._count?.employees || 0} employees</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuBuilding2 className="h-4 w-4" />
                                        <span>{shift._count?.departments || 0} departments</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                            <LuClock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No shifts yet</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-sm">
                            Create your first work shift to define schedules, off days, and working hours
                        </p>
                        {canCreate && (
                            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                                <LuPlus className="h-4 w-4" />
                                Create First Shift
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Dialogs */}
            <CreateShiftDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

            {editingShift && (
                <EditShiftDialog
                    shift={editingShift}
                    open={!!editingShift}
                    onOpenChange={(open) => !open && setEditingShift(null)}
                />
            )}

            <AlertDialog open={!!deletingShift} onOpenChange={() => setDeletingShift(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deletingShift?.name}</strong>?
                            {deletingShift?._count?.employees || deletingShift?._count?.departments ? (
                                <span className="block mt-2 text-destructive">
                                    This shift is assigned to {deletingShift._count.employees || 0} employees and{' '}
                                    {deletingShift._count.departments || 0} departments. Please reassign them before
                                    deleting.
                                </span>
                            ) : (
                                <span className="block mt-2">This action cannot be undone.</span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                            disabled={
                                !!(deletingShift?._count?.employees || deletingShift?._count?.departments)
                            }
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function ShiftsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
