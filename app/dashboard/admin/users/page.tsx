"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import {
  LuEllipsis,
  LuUserPlus,
  LuSearch,
  LuFilter,
  LuEye,
  LuPencil,
  LuTrash2,
  LuShield,
  LuShieldOff,
  LuMail,
  LuLock
} from "react-icons/lu";
import { AdminUser, UserQueryParams } from "@/lib/api/admin";
import {
  useUsers,
  useBlockUser,
  useUnblockUser,
  useDeleteUser,
  useVerifyUserEmail
} from "@/hooks/use-admin";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { ViewUserDialog } from "./view-user-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";

const AdminUsersPage = () => {
  // State
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [changePasswordUser, setChangePasswordUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING" | "ALL">("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Query parameters
  const queryParams: UserQueryParams = {
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  // Hooks
  const { data: usersData, isLoading, error } = useUsers(queryParams);
  const blockUserMutation = useBlockUser();
  const unblockUserMutation = useUnblockUser();
  const deleteUserMutation = useDeleteUser();
  const verifyEmailMutation = useVerifyUserEmail();

  // Handlers - no URL updates needed, just state changes

  const getStatusBadge = (status: AdminUser["status"]) => {
    const variants = {
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      BLOCKED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };

    return (
      <Badge className={variants[status]}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  // Table columns
  const columns: ColumnDef<AdminUser>[] = [
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
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.username || "—"}</span>
      ),
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        if (roles.length === 0) return <span className="text-muted-foreground">—</span>;

        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((userRole, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {userRole.role.name}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "emailVerified",
      header: "Email",
      cell: ({ row }) => {
        const isVerified = row.original.emailVerified || row.original.isEmailVerified;
        return (
          <div className="flex items-center gap-2">
            {isVerified ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Verified
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Unverified
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
          {formatDistanceToNow(new Date(row.original.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      accessorKey: "lastLoginAt",
      header: "Last Login",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.lastLoginAt
            ? formatDistanceToNow(new Date(row.original.lastLoginAt), { addSuffix: true })
            : "Never"
          }
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <LuEllipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewingUser(user)}>
                <LuEye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingUser(user)}>
                <LuPencil className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChangePasswordUser(user)}>
                <LuLock className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!(user.emailVerified || user.isEmailVerified) && (
                <DropdownMenuItem
                  onClick={() => verifyEmailMutation.mutate(user.id)}
                  disabled={verifyEmailMutation.isPending}
                >
                  <LuMail className="mr-2 h-4 w-4" />
                  Verify Email
                </DropdownMenuItem>
              )}
              {user.status === "BLOCKED" ? (
                <DropdownMenuItem
                  onClick={() => unblockUserMutation.mutate(user.id)}
                  disabled={unblockUserMutation.isPending}
                >
                  <LuShieldOff className="mr-2 h-4 w-4" />
                  Unblock User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => blockUserMutation.mutate(user.id)}
                  disabled={blockUserMutation.isPending}
                >
                  <LuShield className="mr-2 h-4 w-4" />
                  Block User
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteUserMutation.mutate(user.id)}
                disabled={deleteUserMutation.isPending}
                className="text-destructive focus:text-destructive"
              >
                <LuTrash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Error loading users</p>
          <p className="text-sm text-muted-foreground mt-2">
            {error.message || "Please check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Users Management</h1>
        <Button onClick={() => setOpenCreateDialog(true)}>
          <LuUserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <LuFilter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner className="w-8 h-8" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={usersData?.data || []}
            pagination={usersData?.meta}
            onPageChange={setPage}
            onPageSizeChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <EditUserDialog
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      />

      <ViewUserDialog
        user={viewingUser}
        open={!!viewingUser}
        onOpenChange={(open) => !open && setViewingUser(null)}
      />

      <ChangePasswordDialog
        user={changePasswordUser}
        open={!!changePasswordUser}
        onOpenChange={(open) => !open && setChangePasswordUser(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
