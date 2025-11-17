"use client";

import { useState } from "react";
import Image from "next/image";
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
  useTestimonials, 
  useDeleteTestimonial, 
  useReorderTestimonials 
} from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import type { Testimonial, ContentQueryParams } from "@/lib/api/admin";
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
  LuStar,
  LuQuote,
  LuBuilding
} from "react-icons/lu";
import TestimonialForm from "@/components/forms/testimonial-form";
import { toast } from "sonner";

const TestimonialsPage = () => {
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const canViewCmsSettings = !!user?.permissions?.includes("admin.settings.view");
  const canManageCmsSettings = !!user?.permissions?.includes("admin.settings.update");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "regular">("all");
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryParams: ContentQueryParams = {
    search: searchTerm || undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    isFeatured: featuredFilter === "all" ? undefined : featuredFilter === "featured",
    limit: 50,
  };

  const { data: testimonialsData, isLoading, error, refetch } = useTestimonials(
    queryParams,
    !isAuthLoading && !!user && canViewCmsSettings
  );
  const testimonials = testimonialsData?.data || [];

  const deleteTestimonialMutation = useDeleteTestimonial();
  const reorderMutation = useReorderTestimonials();

  const handleDelete = async (testimonialId: string) => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to delete testimonials.");
      return;
    }
    try {
      await deleteTestimonialMutation.mutateAsync(testimonialId);
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to update testimonials.");
      return;
    }
    setSelectedTestimonial(testimonial);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    if (!canManageCmsSettings) {
      toast.error("You do not have permission to create testimonials.");
      return;
    }
    setSelectedTestimonial(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedTestimonial(null);
    setIsEditMode(false);
    refetch();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <LuStar
            key={i}
            className={`w-3 h-3 ${
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating})</span>
      </div>
    );
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
              You do not have permission to view testimonials.
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
              <p>Error loading testimonials: {error.message}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600 mt-1">
            Manage customer testimonials and reviews
          </p>
        </div>
        {canManageCmsSettings && (
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <LuPlus className="h-4 w-4" />
            Add Testimonial
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
                  placeholder="Search testimonials..."
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

            {/* Featured Filter */}
            <div className="sm:w-48">
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Testimonials</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>
            </div>

            <Button variant="outline" onClick={() => refetch()}>
              <LuRefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{testimonials.length}</div>
            <p className="text-xs text-muted-foreground">Total Testimonials</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {testimonials.filter(t => t.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {testimonials.filter(t => t.isFeatured).length}
            </div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {testimonials.filter(t => t.rating && t.rating >= 4).length}
            </div>
            <p className="text-xs text-muted-foreground">4+ Stars</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <LuQuote className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p>No testimonials found</p>
              {canManageCmsSettings && (
                <Button onClick={handleCreate} className="mt-4">
                  <LuPlus className="mr-2 h-4 w-4" />
                  Add Your First Testimonial
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <LuMove className="h-4 w-4 text-gray-400 cursor-move" />
                          <span className="font-mono text-sm">{testimonial.displayOrder}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {testimonial.avatar ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              <Image
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <LuUser className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{testimonial.name}</div>
                            {testimonial.position && (
                              <div className="text-sm text-gray-600">{testimonial.position}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm line-clamp-2 text-gray-700">
                            "{testimonial.content}"
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {testimonial.rating ? (
                          renderStars(testimonial.rating)
                        ) : (
                          <span className="text-gray-400 text-sm">No rating</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {testimonial.isActive ? (
                              <LuEye className="h-4 w-4 text-green-500" />
                            ) : (
                              <LuEyeOff className="h-4 w-4 text-gray-400" />
                            )}
                            <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                              {testimonial.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {testimonial.isFeatured && (
                            <Badge variant="outline" className="text-xs w-fit">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {testimonial.company ? (
                          <div className="flex items-center gap-1 text-sm">
                            <LuBuilding className="h-3 w-3 text-gray-400" />
                            {testimonial.company}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          <div>{formatDate(testimonial.updatedAt)}</div>
                          {testimonial.updatedBy && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <LuUser className="h-3 w-3" />
                              {testimonial.updatedBy}
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
                              <DropdownMenuItem onClick={() => handleEdit(testimonial)}>
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
                                    <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the testimonial from "{testimonial.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(testimonial.id)}
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

      {/* TODO: Add Testimonial Form Modal/Dialog */}
      {/* This would be implemented similar to the hero section form */}

      {canManageCmsSettings && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Testimonial" : "Create Testimonial"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Update the testimonial details below"
                  : "Fill in the details to create a new testimonial"}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <TestimonialForm
                testimonial={selectedTestimonial || undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TestimonialsPage;
