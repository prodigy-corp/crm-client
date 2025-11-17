"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  useBanners, 
  useDeleteBanner, 
  useReorderBanners 
} from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import type { Banner, ContentQueryParams } from "@/lib/api/admin";
import { 
  LuPlus, 
  LuSearch, 
  LuMenu, 
  LuPencil, 
  LuTrash2, 
  LuEye, 
  LuEyeOff, 
  LuMove,
  LuCalendar,
  LuUser,
  LuFilter,
  LuRefreshCw,
  LuInfo,
  LuTriangle,
  LuCheck,
  LuX,
  LuMegaphone
} from "react-icons/lu";
import BannerForm from "@/components/forms/banner-form";
import { toast } from "sonner";

const BannersPage = () => {
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const canViewCmsSettings = !!user?.permissions?.includes("admin.settings.view");
  const canManageCmsSettings = !!user?.permissions?.includes("admin.settings.update");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "info" | "warning" | "success" | "error" | "promotion"
  >("all");
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryParams: ContentQueryParams = {
    search: searchTerm || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    limit: 50,
  };

  const { data: bannersData, isLoading, error, refetch } = useBanners(
    queryParams,
    !isAuthLoading && !!user && canViewCmsSettings
  );
  const banners = bannersData?.data || [];

  const deletebannerMutation = useDeleteBanner();
  const reorderMutation = useReorderBanners();

  const handleDelete = async (bannerId: string) => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to delete banners.");
      return;
    }
    try {
      await deletebannerMutation.mutateAsync(bannerId);
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  const handleEdit = (banner: Banner) => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update banners.");
      return;
    }
    setSelectedBanner(banner);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to create banners.");
      return;
    }
    setSelectedBanner(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedBanner(null);
    setIsEditMode(false);
    refetch();
  };

  const getTypeIcon = (type: Banner["type"]) => {
    switch (type) {
      case "info":
        return <LuInfo className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <LuTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <LuCheck className="h-4 w-4 text-green-500" />;
      case "error":
        return <LuX className="h-4 w-4 text-red-500" />;
      case "promotion":
        return <LuMegaphone className="h-4 w-4 text-purple-500" />;
      default:
        return <LuInfo className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type: Banner["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "promotion":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isAuthLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthError || !user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Failed to load user information.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!canViewCmsSettings) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to view banners.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>Error loading banners: {error.message}</p>
              <Button onClick={() => refetch()} className="mt-4">
                <LuRefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-1">
            Manage site-wide banners and notifications
          </p>
        </div>
        {canManageCmsSettings && (
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <LuPlus className="h-4 w-4" />
            Create Banner
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search banners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="sm:w-48">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="promotion">Promotion</option>
              </select>
            </div>

            <Button variant="outline" onClick={() => refetch()}>
              <LuRefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{banners.length}</div>
            <p className="text-xs text-muted-foreground">Total Banners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {banners.filter(b => b.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">
              {banners.filter(b => !b.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {banners.filter(b => b.isDismissible).length}
            </div>
            <p className="text-xs text-muted-foreground">Dismissible</p>
          </CardContent>
        </Card>
      </div>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Banners ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No banners found</p>
              {canManageCmsSettings && (
                <Button onClick={handleCreate} className="mt-4">
                  <LuPlus className="mr-2 h-4 w-4" />
                  Create Your First Banner
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LuMove className="h-4 w-4 text-gray-400 cursor-move" />
                          <span className="font-mono text-sm">{banner.displayOrder}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(banner.type)}
                          <Badge className={getTypeBadgeColor(banner.type)}>
                            {banner.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{banner.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {banner.message || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {banner.isActive ? (
                            <LuEye className="h-4 w-4 text-green-500" />
                          ) : (
                            <LuEyeOff className="h-4 w-4 text-gray-400" />
                          )}
                          <Badge variant={banner.isActive ? "default" : "secondary"}>
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {banner.isDismissible && (
                            <Badge variant="outline" className="text-xs">
                              Dismissible
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {banner.startDate && (
                            <div className="flex items-center gap-1 text-green-600">
                              <LuCalendar className="h-3 w-3" />
                              {formatDate(banner.startDate)}
                            </div>
                          )}
                          {banner.endDate && (
                            <div className="flex items-center gap-1 text-red-600">
                              <LuCalendar className="h-3 w-3" />
                              {formatDate(banner.endDate)}
                            </div>
                          )}
                          {!banner.startDate && !banner.endDate && (
                            <span className="text-gray-400">Always</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          <div>{formatDate(banner.updatedAt)}</div>
                          {banner.updatedBy && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <LuUser className="h-3 w-3" />
                              {banner.updatedBy}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {canManageCmsSettings && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <LuMenu className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(banner)}>
                                <LuPencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e: Event) => e.preventDefault()}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <LuTrash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{banner.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(banner.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {canManageCmsSettings && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Banner" : "Create Banner"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update the banner details below"
                  : "Fill in the details to create a new banner"}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <BannerForm
                banner={selectedBanner || undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* TODO: Add Banner Form Modal/Dialog */}
      {/* This would be implemented similar to the hero section form */}
    </div>
  );
};

export default BannersPage;
