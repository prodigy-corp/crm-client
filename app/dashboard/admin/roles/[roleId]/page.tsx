"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/ui/spinner";
import {
  usePermissions,
  useRole,
  useUpdateRole,
} from "@/hooks/use-admin";
import { UpdateRoleDto } from "@/lib/api/admin";
import { formatDistanceToNow } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LuArrowLeft,
  LuCheck,
  LuChevronDown,
  LuChevronRight,
  LuKey,
  LuSave,
  LuShield,
  LuX,
} from "react-icons/lu";

const RoleDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const roleId = params.roleId as string;

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Hooks
  const { data: role, isLoading: roleLoading, error: roleError } = useRole(roleId);
  const { data: permissions, isLoading: permissionsLoading } = usePermissions();
  const updateRoleMutation = useUpdateRole();

  // Initialize selected permissions when role data loads
  useEffect(() => {
    if (role) {
      const permissionNames = (role.permissions || []).map((p: any) =>
        typeof p === "object" ? p.name : p
      );
      setSelectedPermissions(permissionNames);
    }
  }, [role]);

  // Check for changes
  useEffect(() => {
    if (role) {
      const originalPermissions = (role.permissions || []).map((p: any) =>
        typeof p === "object" ? p.name : p
      );
      const changed =
        JSON.stringify([...selectedPermissions].sort()) !==
        JSON.stringify([...originalPermissions].sort());
      setHasChanges(changed);
    }
  }, [selectedPermissions, role]);

  const togglePermission = (permissionName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  const handleSave = async () => {
    if (!role) return;

    const updateData: UpdateRoleDto = {
      permissions: selectedPermissions,
    };

    updateRoleMutation.mutate(
      { id: role.id, data: updateData },
      {
        onSuccess: () => {
          setIsEditing(false);
          setHasChanges(false);
        },
      }
    );
  };

  const handleCancel = () => {
    if (role) {
      const permissionNames = (role.permissions || []).map((p: any) =>
        typeof p === "object" ? p.name : p
      );
      setSelectedPermissions(permissionNames);
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  if (roleLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (roleError || !role) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Error loading role
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {roleError?.message || "Role not found"}
          </p>
          <Button
            onClick={() => router.push("/dashboard/admin/roles")}
            className="mt-4"
          >
            <LuArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const rolePermissions = (role.permissions || []).map((p: any) =>
    typeof p === "object" ? p.name : p
  );

  // Group permissions by their group field
  const groupPermissions = (perms: any[]) => {
    if (!perms) return {};
    
    const grouped: Record<string, any[]> = {};
    perms.forEach((perm: any) => {
      const group = typeof perm === "object" ? perm.group || "Other" : "Other";
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(perm);
    });
    return grouped;
  };

  const groupedPermissions = groupPermissions(permissions || []);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Initialize all groups as expanded
  useEffect(() => {
    if (permissions) {
      const groups = Object.keys(groupedPermissions);
      const expanded: Record<string, boolean> = {};
      groups.forEach(group => expanded[group] = true);
      setExpandedGroups(expanded);
    }
  }, [permissions]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/admin/roles")}
          >
            <LuArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Role Details</h1>
            <p className="text-sm text-muted-foreground">
              View and manage role permissions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={updateRoleMutation.isPending}
              >
                <LuX className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <LuSave className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <LuKey className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Role Information */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <LuShield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>Role Information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Description</Label>
              <p className="mt-1 text-sm">
                {role.description || "No description provided"}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="mt-1 text-sm">
                {formatDistanceToNow(new Date(role.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Last Updated</Label>
              <p className="mt-1 text-sm">
                {formatDistanceToNow(new Date(role.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                Total Permissions
              </Label>
              <p className="mt-1 text-2xl font-bold">
                {selectedPermissions.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Management */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Select or deselect permissions for this role"
                    : "View all permissions assigned to this role"}
                </CardDescription>
              </div>
              {isEditing && (
                <Badge variant={hasChanges ? "default" : "secondary"}>
                  {hasChanges ? "Modified" : "No Changes"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {permissionsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Spinner className="h-6 w-6" />
              </div>
            ) : isEditing ? (
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                  {Object.keys(groupedPermissions).length > 0 ? (
                    Object.entries(groupedPermissions).map(([group, perms]: [string, any]) => {
                      const groupPerms = perms as any[];
                      const isExpanded = expandedGroups[group];
                      const selectedCount = groupPerms.filter((p: any) => {
                        const name = typeof p === "object" ? p.name : p;
                        return selectedPermissions.includes(name);
                      }).length;

                      return (
                        <div key={group} className="space-y-2">
                          <div
                            className="flex cursor-pointer items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                            onClick={() => toggleGroup(group)}
                          >
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <LuChevronDown className="h-4 w-4" />
                              ) : (
                                <LuChevronRight className="h-4 w-4" />
                              )}
                              <h3 className="font-semibold capitalize">{group}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {selectedCount}/{groupPerms.length}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                const allSelected = groupPerms.every((p: any) => {
                                  const name = typeof p === "object" ? p.name : p;
                                  return selectedPermissions.includes(name);
                                });
                                
                                if (allSelected) {
                                  // Deselect all in group
                                  const groupNames = groupPerms.map((p: any) => 
                                    typeof p === "object" ? p.name : p
                                  );
                                  setSelectedPermissions(prev => 
                                    prev.filter(p => !groupNames.includes(p))
                                  );
                                } else {
                                  // Select all in group
                                  const groupNames = groupPerms.map((p: any) => 
                                    typeof p === "object" ? p.name : p
                                  );
                                  setSelectedPermissions(prev => [
                                    ...new Set([...prev, ...groupNames])
                                  ]);
                                }
                              }}
                            >
                              {selectedCount === groupPerms.length ? "Deselect All" : "Select All"}
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className="ml-6 space-y-2">
                              {groupPerms.map((permission: any) => {
                                const permissionName =
                                  typeof permission === "object"
                                    ? permission.name
                                    : permission;
                                const permissionDesc =
                                  typeof permission === "object"
                                    ? permission.description
                                    : "";
                                const isChecked = selectedPermissions.includes(permissionName);

                                return (
                                  <div
                                    key={permissionName}
                                    className="flex items-start space-x-3 rounded-lg p-2 transition-colors hover:bg-accent"
                                  >
                                    <Checkbox
                                      id={`permission-${permissionName}`}
                                      checked={isChecked}
                                      onCheckedChange={() => togglePermission(permissionName)}
                                    />
                                    <div className="flex-1 space-y-1">
                                      <label
                                        htmlFor={`permission-${permissionName}`}
                                        className="flex cursor-pointer items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        {permissionName}
                                        {isChecked && (
                                          <LuCheck className="h-4 w-4 text-primary" />
                                        )}
                                      </label>
                                      {permissionDesc && (
                                        <p className="text-xs text-muted-foreground">
                                          {permissionDesc}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
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
            ) : (
              <div className="space-y-4">
                {rolePermissions.length > 0 ? (
                  <div className="space-y-4">
                    {(Object.entries(
                      rolePermissions.reduce((acc: Record<string, string[]>, perm: string) => {
                        const permObj = permissions?.find(
                          (p: any) => (typeof p === "object" ? p.name : p) === perm
                        );
                        const group = permObj && typeof permObj === "object" 
                          ? (permObj as any).group || "Other" 
                          : "Other";
                        if (!acc[group]) acc[group] = [];
                        acc[group].push(perm);
                        return acc;
                      }, {})
                    ) as [string, string[]][]).map(([group, perms]) => (
                      <div key={group} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold capitalize text-sm">{group}</h4>
                          <Badge variant="outline" className="text-xs">
                            {perms.length}
                          </Badge>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {perms.map((permission: string, index: number) => {
                            const permissionObj = permissions?.find(
                              (p: any) =>
                                (typeof p === "object" ? p.name : p) === permission
                            );
                            const description =
                              permissionObj && typeof permissionObj === "object"
                                ? (permissionObj as any).description
                                : "";

                            return (
                              <div
                                key={`${permission}-${index}`}
                                className="flex items-start gap-3 rounded-lg border p-3"
                              >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <LuKey className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">
                                    {permission}
                                  </p>
                                  {description && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-sm text-muted-foreground">
                      No permissions assigned to this role
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleDetailPage;
