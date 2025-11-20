"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    LuPause,
    LuPlay,
    LuInfo,
    LuBuilding2,
} from "react-icons/lu";
import {
    AdminClient,
    AdminClientQueryParams,
    ClientStatus,
    ClientType,
} from "@/lib/api/admin";
import {
    useClients,
    useDeleteClient,
    useSuspendClient,
    useActivateClient,
} from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CreateClientDialog } from "./create-client-dialog";
import { EditClientDialog } from "./edit-client-dialog";
import { Route } from "next";

const AdminClientsPage = () => {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editingClient, setEditingClient] = useState<AdminClient | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
    const [typeFilter, setTypeFilter] = useState<ClientType | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const queryParams: AdminClientQueryParams = {
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        clientType: typeFilter !== "ALL" ? typeFilter : undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
    };

    const canViewClients = !!user?.permissions?.includes("admin.clients.view");
    const canManageClients = !!user?.permissions?.includes("admin.clients.manage");

    const {
        data: clientsData,
        isLoading,
        error,
    } = useClients(
        queryParams,
        !isAuthLoading && !!user && canViewClients,
    );
    const deleteClientMutation = useDeleteClient();
    const suspendClientMutation = useSuspendClient();
    const activateClientMutation = useActivateClient();

    const getStatusBadge = (status: ClientStatus) => {
        const variants: Record<ClientStatus, string> = {
            ACTIVE:
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            INACTIVE:
                "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
            SUSPENDED:
                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };

        return <Badge className={variants[status]}>{status.toLowerCase()}</Badge>;
    };

    const getTypeBadge = (type: ClientType) => {
        const variants: Record<ClientType, string> = {
            INDIVIDUAL:
                "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            BUSINESS:
                "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
            ENTERPRISE:
                "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        };

        return <Badge className={variants[type]}>{type.toLowerCase()}</Badge>;
    };

    const columns: ColumnDef<AdminClient>[] = [
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
            header: "Client",
            cell: ({ row }) => {
                const client = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {client.photoUrl ? (
                                <img
                                    src={client.photoUrl}
                                    alt={client.name}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            ) : client.companyName ? (
                                <LuBuilding2 className="h-5 w-5 text-primary" />
                            ) : (
                                <span className="text-sm font-medium text-primary">
                                    {client.name.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">
                                {client.companyName || client.emailAddress || "—"}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "clientCode",
            header: "Client Code",
            cell: ({ row }) => {
                const code = row.original.clientCode;
                return (
                    <span className="font-mono text-sm">{code || "—"}</span>
                );
            },
        },
        {
            accessorKey: "clientType",
            header: "Type",
            cell: ({ row }) => getTypeBadge(row.original.clientType),
        },
        {
            id: "contact",
            header: "Contact",
            cell: ({ row }) => {
                const client = row.original;
                return (
                    <div className="text-sm">
                        <div>{client.mobileNumber || "—"}</div>
                        {client.emailAddress && (
                            <div className="text-muted-foreground">{client.emailAddress}</div>
                        )}
                    </div>
                );
            },
        },
        {
            id: "business",
            header: "Business Info",
            cell: ({ row }) => {
                const client = row.original;
                return (
                    <div className="text-sm">
                        {client.industry && (
                            <div className="font-medium">{client.industry}</div>
                        )}
                        {client.city && client.country && (
                            <div className="text-muted-foreground">
                                {client.city}, {client.country}
                            </div>
                        )}
                        {!client.industry && !client.city && (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "financial",
            header: "Financial",
            cell: ({ row }) => {
                const client = row.original;
                return (
                    <div className="text-sm">
                        {Number(client.outstandingBalance) > 0 && (
                            <div className="text-red-600 font-medium">
                                Bal: ${Number(client.outstandingBalance).toFixed(2)}
                            </div>
                        )}
                        {Number(client.creditLimit) > 0 && (
                            <div className="text-muted-foreground">
                                Limit: ${Number(client.creditLimit).toFixed(2)}
                            </div>
                        )}
                        {Number(client.outstandingBalance) === 0 && Number(client.creditLimit) === 0 && (
                            <span className="text-muted-foreground">—</span>
                        )}
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
            id: "created",
            header: "Created",
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);
                return (
                    <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(date, { addSuffix: true })}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const client = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <LuEllipsis className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => router.push(`/admin/dashboard/clients/${client.id}` as Route)}
                            >
                                <LuEye className="mr-2 h-4 w-4" />
                                View Details
                            </DropdownMenuItem>
                            {canManageClients && (
                                <>
                                    <DropdownMenuItem onClick={() => setEditingClient(client)}>
                                        <LuPencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {client.status === "ACTIVE" && (
                                        <DropdownMenuItem
                                            onClick={() => suspendClientMutation.mutate(client.id)}
                                        >
                                            <LuPause className="mr-2 h-4 w-4" />
                                            Suspend
                                        </DropdownMenuItem>
                                    )}
                                    {client.status === "SUSPENDED" && (
                                        <DropdownMenuItem
                                            onClick={() => activateClientMutation.mutate(client.id)}
                                        >
                                            <LuPlay className="mr-2 h-4 w-4" />
                                            Activate
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Are you sure you want to delete this client? This action cannot be undone.",
                                                )
                                            ) {
                                                deleteClientMutation.mutate(client.id);
                                            }
                                        }}
                                        className="text-red-600"
                                    >
                                        <LuTrash2 className="mr-2 h-4 w-4" />
                                        Delete
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
            <div className="flex h-[50vh] items-center justify-center">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (!canViewClients) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
                <LuInfo className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium">Access Denied</p>
                <p className="text-sm text-muted-foreground">
                    You don&apos;t have permission to view clients.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clients</h1>
                    <p className="text-muted-foreground">
                        Manage your client database and relationships
                    </p>
                </div>
                {canManageClients && (
                    <Button onClick={() => setOpenCreateDialog(true)}>
                        <LuUserPlus className="mr-2 h-4 w-4" />
                        Add Client
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <LuSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search clients by name, code, email, or company..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="pl-9"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                        setStatusFilter(value as ClientStatus | "ALL");
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <LuFilter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={typeFilter}
                    onValueChange={(value) => {
                        setTypeFilter(value as ClientType | "ALL");
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <LuFilter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                        <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="flex h-[40vh] items-center justify-center">
                    <Spinner className="h-8 w-8" />
                </div>
            ) : error ? (
                <div className="flex h-[40vh] flex-col items-center justify-center gap-2">
                    <p className="text-lg font-medium text-red-600">Error loading clients</p>
                    <p className="text-sm text-muted-foreground">
                        {error instanceof Error ? error.message : "An error occurred"}
                    </p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={clientsData?.data || []}
                    pagination={{
                        page: clientsData?.meta.page || 1,
                        limit: clientsData?.meta.limit || 10,
                        total: clientsData?.meta.total || 0,
                        totalPages: clientsData?.meta.totalPages || 1,
                    }}
                    onPageChange={setPage}
                    onPageSizeChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                    }}
                />
            )}

            <CreateClientDialog
                open={openCreateDialog}
                onOpenChange={setOpenCreateDialog}
            />

            {editingClient && (
                <EditClientDialog
                    client={editingClient}
                    open={!!editingClient}
                    onOpenChange={(open) => {
                        if (!open) setEditingClient(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminClientsPage;