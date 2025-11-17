"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import {
  useCreateRole,
  useDeleteRole,
  usePermissions,
  useRoles,
  useUpdateRole,
} from "@/hooks/use-admin";
import { CreateRoleDto, Role, UpdateRoleDto } from "@/lib/api/admin";
import { yupResolver } from "@hookform/resolvers/yup";
import { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  LuEllipsis,
  LuEye,
  LuKey,
  LuPencil,
  LuPlus,
  LuShield,
  LuTrash2,
} from "react-icons/lu";
import * as yup from "yup";
import { ScrollArea } from "@/components/ui/scroll-area";

// Validation schemas
const roleSchema = yup.object({
  name: yup
    .string()
    .required("Role name is required")
    .min(2, "Name must be at least 2 characters"),
  description: yup.string().optional(),
  permissions: yup.array().of(yup.string().required()).optional(),
});

// Define form data type to match API expectations
type RoleFormData = {
  name: string;
  description?: string;
  permissions?: string[];
};

const AdminRolesPage = () => {
  // State
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  // Hooks
  const router = useRouter();
  const { data: roles, isLoading, error } = useRoles();
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();
  const deleteRoleMutation = useDeleteRole();

  // Form
  const form = useForm<RoleFormData>({
    resolver: yupResolver(roleSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  // Handlers
  const handleCreateRole = (data: RoleFormData) => {
    createRoleMutation.mutate(data as CreateRoleDto, {
      onSuccess: () => {
        setOpenCreateDialog(false);
        form.reset();
      },
    });
  };

  const handleEditRole = (data: RoleFormData) => {
    if (!editingRole) return;

    updateRoleMutation.mutate(
      { id: editingRole.id, data: data as UpdateRoleDto },
      {
        onSuccess: () => {
          setEditingRole(null);
          form.reset();
        },
      },
    );
  };

  const openEditDialog = (role: Role) => {
    setEditingRole(role);
    const permissionNames = (role.permissions || []).map((p: any) => 
      typeof p === 'object' ? p.name : p
    );
    form.reset({
      name: role.name,
      description: role.description || "",
      permissions: permissionNames,
    });
  };

  const togglePermission = (permissionName: string) => {
    const currentPermissions = form.watch('permissions') || [];
    const newPermissions = currentPermissions.includes(permissionName)
      ? currentPermissions.filter((p) => p !== permissionName)
      : [...currentPermissions, permissionName];
    form.setValue('permissions', newPermissions);
  };

  // Table columns
  const columns: ColumnDef<Role>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <LuShield className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{role.name}</div>
              {role.description && (
                <div className="text-sm text-muted-foreground">
                  {role.description}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissions = row.original.permissions || [];
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 3).map((permission, index) => (
              <Badge key={`${permission}-${index}`} variant="secondary" className="text-xs">
                {typeof permission === 'object' ? (permission as any)?.name : permission}
              </Badge>
            ))}
            {permissions.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{permissions.length - 3} more
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.createdAt), {
            addSuffix: true,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <LuEllipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/admin/roles/${role.id}`)}>
                <LuEye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditDialog(role)}>
                <LuPencil className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteRoleMutation.mutate(role.id)}
                disabled={deleteRoleMutation.isPending}
                className="text-destructive focus:text-destructive"
              >
                <LuTrash2 className="mr-2 h-4 w-4" />
                Delete Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Error loading roles
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "Please check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Roles & Permissions</h1>
        <Button onClick={() => setOpenCreateDialog(true)}>
          <LuPlus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Roles
            </CardTitle>
            <LuShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Permissions
            </CardTitle>
            <LuKey className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {/* Table */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <DataTable data={roles || []} columns={columns} />
        )}
      </div>

      {/* Create/Edit Role Dialog */}
      <Dialog
        open={openCreateDialog || !!editingRole}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCreateDialog(false);
            setEditingRole(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Edit Role" : "Create Role"}
            </DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Update the role details and assign permissions."
                : "Create a new role with specific permissions."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(
              editingRole ? handleEditRole : handleCreateRole,
            )}
            autoComplete="off"
          >
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Role Name</FieldLabel>
                      <Input {...field} id="name" placeholder="Admin" />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">
                        Description (Optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="description"
                        placeholder="Role description..."
                        value={field.value || ""}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Permissions ({form.watch('permissions')?.length || 0} selected)
                  </Label>
                  {permissionsLoading ? (
                    <div className="flex h-32 items-center justify-center">
                      <Spinner className="h-6 w-6" />
                    </div>
                  ) : (
                    <ScrollArea className="h-64 rounded-md border p-4">
                      <div className="space-y-3">
                        {permissions && permissions.length > 0 ? (
                          permissions.map((permission: any) => {
                            const permissionName = typeof permission === 'object' ? permission.name : permission;
                            const permissionDesc = typeof permission === 'object' ? permission.description : '';
                            const isChecked = (form.watch('permissions') || []).includes(permissionName);
                            
                            return (
                              <div
                                key={permissionName}
                                className="flex items-start space-x-3 rounded-lg p-2 hover:bg-accent"
                              >
                                <Checkbox
                                  id={`permission-${permissionName}`}
                                  checked={isChecked}
                                  onCheckedChange={() => togglePermission(permissionName)}
                                />
                                <div className="flex-1 space-y-1">
                                  <label
                                    htmlFor={`permission-${permissionName}`}
                                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {permissionName}
                                  </label>
                                  {permissionDesc && (
                                    <p className="text-xs text-muted-foreground">
                                      {permissionDesc}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-sm text-muted-foreground">
                            No permissions available
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </FieldGroup>
              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={() => {
                    setOpenCreateDialog(false);
                    setEditingRole(null);
                    form.reset();
                  }}
                  type="button"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createRoleMutation.isPending || updateRoleMutation.isPending
                  }
                >
                  {editingRole ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Role Dialog */}
      {viewingRole && (
        <Dialog
          open={!!viewingRole}
          onOpenChange={(open) => !open && setViewingRole(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Role Details</DialogTitle>
              <DialogDescription>
                View role information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Role Name</h4>
                <p className="text-sm text-muted-foreground">
                  {viewingRole.name}
                </p>
              </div>
              {viewingRole.description && (
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {viewingRole.description}
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-medium">
                  Permissions ({viewingRole.permissions?.length || 0})
                </h4>
                <div className="mt-2 flex flex-wrap gap-1">
                  {viewingRole.permissions?.map((permission, index) => (
                    <Badge
                      key={`${permission}-${index}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      {typeof permission === 'object' ? (permission as any)?.name : permission}
                    </Badge>
                  )) || (
                    <p className="text-sm text-muted-foreground">
                      No permissions assigned
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Created</h4>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(viewingRole.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminRolesPage;
