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
  LuLogOut,
  LuInfo,
} from "react-icons/lu";
import {
  AdminEmployee,
  AdminEmployeeQueryParams,
  EmployeeStatus,
} from "@/lib/api/admin";
import {
  useEmployees,
  useDeleteEmployee,
  useResignEmployee,
} from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CreateEmployeeDialog } from "./create-employee-dialog";
import { EditEmployeeDialog } from "./edit-employee-dialog";
import { ViewEmployeeDialog } from "./view-employee-dialog";

const AdminEmployeesPage = () => {
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<AdminEmployee | null>(
    null,
  );
  const [viewingEmployee, setViewingEmployee] = useState<AdminEmployee | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryParams: AdminEmployeeQueryParams = {
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const canViewEmployees = !!user?.permissions?.includes("admin.employees.view");
  const canManageEmployees = !!user?.permissions?.includes("admin.employees.manage");

  const {
    data: employeesData,
    isLoading,
    error,
  } = useEmployees(
    queryParams,
    !isAuthLoading && !!user && canViewEmployees,
  );
  const deleteEmployeeMutation = useDeleteEmployee();
  const resignEmployeeMutation = useResignEmployee();

  const getStatusBadge = (status: EmployeeStatus) => {
    const variants: Record<EmployeeStatus, string> = {
      ACTIVE:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      INACTIVE:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      RESIGNED:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };

    return <Badge className={variants[status]}>{status.toLowerCase()}</Badge>;
  };

  const columns: ColumnDef<AdminEmployee>[] = [
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
        const employee = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium text-primary">
                {employee.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium">{employee.name}</div>
              <div className="text-sm text-muted-foreground">
                {employee.designation || "—"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "employeeCode",
      header: "Employee Code",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.employeeCode || "—"}
        </span>
      ),
    },
    {
      accessorKey: "mobileNumber",
      header: "Mobile",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.mobileNumber || "—"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: "baseSalary",
      header: "Base Salary",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.baseSalary.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "joiningDate",
      header: "Joined",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(row.original.joiningDate), {
            addSuffix: true,
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <LuEllipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setViewingEmployee(employee)}>
                <LuEye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              {canManageEmployees && (
                <>
                  <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                    <LuPencil className="mr-2 h-4 w-4" />
                    Edit Employee
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {employee.status !== "RESIGNED" && (
                    <DropdownMenuItem
                      onClick={() =>
                        resignEmployeeMutation.mutate({ id: employee.id, data: {} })
                      }
                      disabled={resignEmployeeMutation.isPending}
                    >
                      <LuLogOut className="mr-2 h-4 w-4" />
                      Mark Resigned
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => deleteEmployeeMutation.mutate(employee.id)}
                    disabled={deleteEmployeeMutation.isPending}
                    className="text-destructive focus:text-destructive"
                  >
                    <LuTrash2 className="mr-2 h-4 w-4" />
                    Delete Employee
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isAuthLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isAuthError || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <LuInfo className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-medium text-destructive">
            Failed to load user information
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!canViewEmployees) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <LuInfo className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Access denied</p>
          <p className="mt-2 text-sm text-muted-foreground">
            You do not have permission to view employees.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Error loading employees
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {(error as any).message ||
              "Please check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Employees Management</h1>
        {canManageEmployees && (
          <Button onClick={() => setOpenCreateDialog(true)}>
            <LuUserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as EmployeeStatus | "ALL")
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <LuFilter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="RESIGNED">Resigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={employeesData?.data || []}
            pagination={employeesData?.meta}
            onPageChange={setPage}
            onPageSizeChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </div>

      <CreateEmployeeDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <EditEmployeeDialog
        employee={editingEmployee}
        open={!!editingEmployee}
        onOpenChange={(open) => !open && setEditingEmployee(null)}
      />

      <ViewEmployeeDialog
        employee={viewingEmployee}
        open={!!viewingEmployee}
        onOpenChange={(open) => !open && setViewingEmployee(null)}
      />
    </div>
  );
};

export default AdminEmployeesPage;
