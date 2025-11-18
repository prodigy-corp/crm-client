"use client";

import { useEffect, useState } from "react";
import { AdminUser, UpdateUserDto } from "@/lib/api/admin";
import { useUpdateUser, useRoles } from "@/hooks/use-admin";
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
import { Checkbox } from "@/components/ui/checkbox";
import Spinner from "@/components/ui/spinner";

interface EditUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const updateUserMutation = useUpdateUser();
  const { data: rolesData, isLoading: rolesLoading } = useRoles();

  const [formData, setFormData] = useState<UpdateUserDto>({
    name: "",
    email: "",
    phone: "",
    status: "ACTIVE",
    roles: [],
    isEmailVerified: false,
    isTwoFactorEnabled: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        status: user.status,
        roles: user.roles?.map((ur) => ur.role.name) || [],
        isEmailVerified: user.emailVerified || user.isEmailVerified || false,
        isTwoFactorEnabled: user.isTwoFactorEnabled || false,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUserMutation.mutate(
      { id: user.id, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleRoleToggle = (roleName: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      const hasRole = currentRoles.includes(roleName);

      return {
        ...prev,
        roles: hasRole
          ? currentRoles.filter((r) => r !== roleName)
          : [...currentRoles, roleName],
      };
    });
  };

  if (!user) return null;

  const availableRoles = rolesData || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Basic Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Roles & Permissions</h4>
            {rolesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Spinner className="w-6 h-6" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={formData.roles?.includes(role.name) || false}
                      onCheckedChange={() => handleRoleToggle(role.name)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`role-${role.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {role.name}
                      </label>
                      {role.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {formData.roles && formData.roles.length === 0 && (
              <p className="text-sm text-muted-foreground">
                ⚠️ At least one role should be assigned
              </p>
            )}
          </div>

          {/* Security Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Security Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
                <Checkbox
                  id="emailVerified"
                  checked={formData.isEmailVerified}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isEmailVerified: !!checked })
                  }
                />
                <div className="flex-1">
                  <label
                    htmlFor="emailVerified"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Email Verified
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mark user's email as verified
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border bg-card">
                <Checkbox
                  id="twoFactor"
                  checked={formData.isTwoFactorEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isTwoFactorEnabled: !!checked })
                  }
                />
                <div className="flex-1">
                  <label
                    htmlFor="twoFactor"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Two-Factor Authentication
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enable or disable 2FA for this user
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
