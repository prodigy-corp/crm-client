'use client';

import { CreateDepartmentDialog } from '@/components/admin/departments/create-department-dialog';
import { EditDepartmentDialog } from '@/components/admin/departments/edit-department-dialog';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useDeleteDepartment, useDepartments } from '@/hooks/use-organization';
import type { Department } from '@/lib/api/organization';
import { hasPermission } from '@/lib/permissions';
import { LucideAlertCircle } from 'lucide-react';
import { useState } from 'react';
import {
    LuBuilding2,
    LuClock,
    LuPencil,
    LuPlus,
    LuTrash2,
    LuUsers,
} from 'react-icons/lu';

export default function DepartmentsPage() {
    const { user } = useAuth();
    const { data: departments, isLoading } = useDepartments();
    const deleteMutation = useDeleteDepartment();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);

    const canCreate = hasPermission(user, 'admin.departments.create');
    const canUpdate = hasPermission(user, 'admin.departments.update');
    const canDelete = hasPermission(user, 'admin.departments.delete');

    const handleDelete = async () => {
        if (!deletingDepartment) return;
        await deleteMutation.mutateAsync(deletingDepartment.id);
        setDeletingDepartment(null);
    };

    if (isLoading) {
        return <DepartmentsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage organizational departments and assign default shifts
                    </p>
                </div>
                {canCreate && (
                    <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                        <LuPlus className="h-4 w-4" />
                        Create Department
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Departments</CardDescription>
                        <CardTitle className="text-3xl">{departments?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Employees</CardDescription>
                        <CardTitle className="text-3xl">
                            {departments?.reduce((sum: number, dept: Department) => sum + (dept._count?.employees || 0), 0) || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>With Default Shift</CardDescription>
                        <CardTitle className="text-3xl">
                            {departments?.filter((dept: Department) => dept.defaultShiftId).length || 0}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Departments Grid */}
            {departments && departments.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {departments.map((department: Department) => (
                        <Card key={department.id} className="relative hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <LuBuilding2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{department.name}</CardTitle>
                                            {department.description && (
                                                <CardDescription className="mt-1 line-clamp-2">
                                                    {department.description}
                                                </CardDescription>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Employee Count */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <LuUsers className="h-4 w-4" />
                                    <span>{department._count?.employees || 0} employees</span>
                                </div>

                                {/* Default Shift */}
                                {department.defaultShift ? (
                                    <div className="flex items-center gap-2">
                                        <LuClock className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{department.defaultShift.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {department.defaultShift.startTime} - {department.defaultShift.endTime}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                        <LucideAlertCircle className="h-4 w-4" />
                                        <span>No default shift assigned</span>
                                    </div>
                                )}

                                {/* Actions */}
                                {(canUpdate || canDelete) && (
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        {canUpdate && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 gap-2"
                                                onClick={() => setEditingDepartment(department)}
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
                                                onClick={() => setDeletingDepartment(department)}
                                            >
                                                <LuTrash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                            <LuBuilding2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No departments yet</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-sm">
                            Create your first department to organize employees and assign shifts
                        </p>
                        {canCreate && (
                            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                                <LuPlus className="h-4 w-4" />
                                Create First Department
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Dialogs */}
            <CreateDepartmentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

            {editingDepartment && (
                <EditDepartmentDialog
                    department={editingDepartment}
                    open={!!editingDepartment}
                    onOpenChange={(open) => !open && setEditingDepartment(null)}
                />
            )}

            <AlertDialog open={!!deletingDepartment} onOpenChange={() => setDeletingDepartment(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deletingDepartment?.name}</strong>?
                            {deletingDepartment?._count?.employees ? (
                                <span className="block mt-2 text-destructive">
                                    This department has {deletingDepartment._count.employees} employees. Please
                                    reassign them before deleting.
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
                            disabled={!!deletingDepartment?._count?.employees}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function DepartmentsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
