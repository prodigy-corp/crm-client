"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import Spinner from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Badge } from "@/components/ui/badge";
import { 
  LuEllipsis, 
  LuFileText, 
  LuSearch, 
  LuFilter,
  LuEye,
  LuPencil,
  LuTrash2,
  LuCheck,
  LuX,
  LuClock,
  LuPlus
} from "react-icons/lu";
import { BlogPost } from "@/lib/api/admin";
import { 
  useBlogs, 
  useUpdateBlogStatus, 
  useDeleteBlog,
  useBlogAnalytics 
} from "@/hooks/use-admin";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const AdminBlogsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
  const canViewBlogs = isAdmin || user?.permissions?.includes("admin.blog.view");
  const canCreateBlogs = isAdmin || user?.permissions?.includes("blog.create");
  const canUpdateBlogs = isAdmin || user?.permissions?.includes("blog.update");
  const canDeleteBlogs =
    isAdmin ||
    user?.permissions?.includes("blog.delete") ||
    user?.permissions?.includes("blog.delete.permanent");
  
  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");

  // Query parameters
  const queryParams = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  };

  // Hooks
  const { data: blogsData, isLoading, error } = useBlogs(
    queryParams,
    !isAuthLoading && !!user && !!canViewBlogs
  );
  const { data: analytics } = useBlogAnalytics(
    !isAuthLoading && !!user && !!canViewBlogs
  );
  const updateStatusMutation = useUpdateBlogStatus();
  const deleteBlogMutation = useDeleteBlog();

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateURL({ search: value || undefined, page: "1" });
  };

  const handleStatusFilter = (value: string) => {
    const filterValue = value === "all" ? "" : value;
    setStatusFilter(filterValue);
    updateURL({ status: filterValue || undefined, page: "1" });
  };

  const handlePageChange = (page: string) => {
    updateURL({ page });
  };

  const updateURL = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`?${newParams}`, { scroll: false });
  };

  const getStatusBadge = (status: BlogPost["status"]) => {
    const variants = {
      PUBLISHED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      DRAFT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };

    return (
      <Badge className={variants[status]}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  // Table columns
  const columns: ColumnDef<BlogPost>[] = [
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
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <div>
            <div className="font-medium">{blog.title}</div>
            <div className="text-sm text-muted-foreground">/{blog.slug}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "authorName",
      header: "Author",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.author?.name}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
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
      accessorKey: "publishedAt",
      header: "Published",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.publishedAt 
            ? formatDistanceToNow(new Date(row.original.publishedAt), { addSuffix: true })
            : "—"
          }
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const blog = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <LuEllipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}>
                <LuEye className="mr-2 h-4 w-4" />
                View Blog
              </DropdownMenuItem>
              {canUpdateBlogs && (
                <DropdownMenuItem
                  onClick={() => {
                    if (!canUpdateBlogs) {
                      toast.error("You do not have permission to update blogs.");
                      return;
                    }
                    router.push(`/admin/dashboard/blogs/${blog.id}/edit`);
                  }}
                >
                  <LuPencil className="mr-2 h-4 w-4" />
                  Edit Blog
                </DropdownMenuItem>
              )}
              {(canUpdateBlogs || canDeleteBlogs) && <DropdownMenuSeparator />}
              {canUpdateBlogs && blog.status === "DRAFT" && (
                <DropdownMenuItem 
                  onClick={() => {
                    if (!canUpdateBlogs) {
                      toast.error("You do not have permission to update blogs.");
                      return;
                    }
                    updateStatusMutation.mutate({ id: blog.id, status: "PUBLISHED" });
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                  <LuCheck className="mr-2 h-4 w-4" />
                  Publish
                </DropdownMenuItem>
              )}
              {canUpdateBlogs && blog.status === "PUBLISHED" && (
                <DropdownMenuItem 
                  onClick={() => {
                    if (!canUpdateBlogs) {
                      toast.error("You do not have permission to update blogs.");
                      return;
                    }
                    updateStatusMutation.mutate({ id: blog.id, status: "ARCHIVED" });
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                  <LuClock className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              {canDeleteBlogs && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      if (!canDeleteBlogs) {
                        toast.error("You do not have permission to delete blogs.");
                        return;
                      }
                      deleteBlogMutation.mutate(blog.id);
                    }}
                    disabled={deleteBlogMutation.isPending}
                    className="text-destructive focus:text-destructive"
                  >
                    <LuTrash2 className="mr-2 h-4 w-4" />
                    Delete Blog
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="rounded-xl border bg-card p-6">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isAuthError || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Failed to load user information</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please refresh the page or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!canViewBlogs) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium">Access denied</p>
          <p className="text-sm text-muted-foreground mt-2">
            You do not have permission to view blogs.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">Error loading blogs</p>
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
        <h1 className="text-2xl font-medium">Blogs Management</h1>
        {canCreateBlogs && (
          <Button onClick={() => router.push("/admin/dashboard/blogs/create")}>
            <LuPlus className="mr-2 h-4 w-4" />
            Create Blog
          </Button>
        )}
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Blogs
              </CardTitle>
              <LuFileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalBlogs || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
              <LuCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.publishedBlogs || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
              <LuClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.draftBlogs || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter || "all"} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <LuFilter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Spinner className="w-8 h-8" />
          </div>
        ) : (
          <>
            <DataTable data={blogsData?.data || []} columns={columns} />
            {blogsData?.meta && (
              <div className="mt-6">
                <Pagination 
                  meta={{
                    current_page: blogsData.meta.page,
                    last_page: blogsData.meta.totalPages,
                    total: blogsData.meta.total,
                    links: []
                  }} 
                  onPageChange={handlePageChange} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBlogsPage;
