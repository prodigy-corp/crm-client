"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  useHeroSections, 
  useDeleteHeroSection, 
  useReorderHeroSections 
} from "@/hooks/use-admin";
import type { HeroSection, ContentQueryParams } from "@/lib/api/admin";
import { 
  LuPlus, 
  LuSearch, 
  LuMenu, 
  LuPencil, 
  LuTrash2, 
  LuEye, 
  LuEyeOff, 
  LuMove,
  LuImage,
  LuCalendar,
  LuUser,
  LuFilter,
  LuRefreshCw
} from "react-icons/lu";
import { format } from "date-fns";
import { toast } from "sonner";
import HeroSectionForm from "./_components/hero-section-form";

const HeroSectionsPage = () => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const canViewHeroSections = !!user?.permissions?.includes("admin.settings.view");
  const canManageHeroSections = !!user?.permissions?.includes("admin.settings.update");
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [selectedHeroSection, setSelectedHeroSection] = useState<HeroSection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const queryParams: ContentQueryParams = {
    search: searchTerm || undefined,
    isActive: isActive,
    sortBy: "displayOrder",
    sortOrder: "asc",
  };

  const { data: heroSectionsData, isLoading, error, refetch } = useHeroSections(
    queryParams,
    !isAuthLoading && !!user && canViewHeroSections
  );
  const deleteHeroSectionMutation = useDeleteHeroSection();
  const reorderMutation = useReorderHeroSections();

  const heroSections = heroSectionsData?.data || [];
  const pagination = heroSectionsData;

  const handleEdit = (heroSection: HeroSection) => {
    if (!canManageHeroSections) {
      toast.error("You do not have permission to update hero sections.");
      return;
    }
    setSelectedHeroSection(heroSection);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    if (!canManageHeroSections) {
      toast.error("You do not have permission to create hero sections.");
      return;
    }
    setSelectedHeroSection(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!canManageHeroSections) {
      toast.error("You do not have permission to delete hero sections.");
      return;
    }
    try {
      await deleteHeroSectionMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete hero section:", error);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedHeroSection(null);
    setIsEditMode(false);
    refetch();
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    if (!canManageHeroSections) {
      toast.error("You do not have permission to reorder hero sections.");
      return;
    }
    const reorderedItems = [...heroSections];
    const [movedItem] = reorderedItems.splice(fromIndex, 1);
    reorderedItems.splice(toIndex, 0, movedItem);
    
    const ids = reorderedItems.map(item => item.id);
    
    try {
      await reorderMutation.mutateAsync(ids);
      toast.success("Hero sections reordered successfully");
    } catch (error) {
      console.error("Failed to reorder hero sections:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setIsActive(undefined);
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

  if (!canViewHeroSections) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>
              You do not have permission to view hero sections.
            </CardDescription>
          </CardHeader>
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
              <p>Error loading hero sections: {error.message}</p>
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
          <h1 className="text-3xl font-bold">Hero Sections</h1>
          <p className="text-muted-foreground">
            Manage your website's hero sections and call-to-action areas
          </p>
        </div>
        {canManageHeroSections && (
          <Button onClick={handleCreate}>
            <LuPlus className="mr-2 h-4 w-4" />
            Add Hero Section
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search hero sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <LuFilter className="mr-2 h-4 w-4" />
                    Status
                    {isActive !== undefined && (
                      <Badge variant="secondary" className="ml-2">
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsActive(undefined)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsActive(true)}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsActive(false)}>
                    Inactive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {(searchTerm || isActive !== undefined) && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Sections ({heroSections.length})</CardTitle>
          <CardDescription>
            {canManageHeroSections
              ? "Drag and drop to reorder hero sections"
              : "View your website's hero sections"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : heroSections.length === 0 ? (
            <div className="text-center py-8">
              <LuImage className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hero sections found</h3>
              <p className="text-muted-foreground">
                {searchTerm || isActive !== undefined
                  ? "Try adjusting your filters"
                  : "Get started by creating your first hero section"}
              </p>
              {!searchTerm && isActive === undefined && canManageHeroSections && (
                <Button onClick={handleCreate} className="mt-4">
                  <LuPlus className="mr-2 h-4 w-4" />
                  Add Hero Section
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Alignment</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {heroSections.map((heroSection, index) => (
                  <TableRow key={heroSection.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LuMove className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="text-sm font-mono">
                          {heroSection.displayOrder}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{heroSection.title}</div>
                        {heroSection.subtitle && (
                          <div className="text-sm text-muted-foreground">
                            {heroSection.subtitle}
                          </div>
                        )}
                        {heroSection.backgroundImage && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <LuImage className="h-3 w-3" />
                            Background image
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={heroSection.isActive ? "default" : "secondary"}>
                        {heroSection.isActive ? (
                          <>
                            <LuEye className="mr-1 h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <LuEyeOff className="mr-1 h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {heroSection.textAlignment || "left"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <LuCalendar className="h-3 w-3" />
                        {format(new Date(heroSection.updatedAt), "MMM d, yyyy")}
                      </div>
                      {heroSection.updatedBy && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <LuUser className="h-3 w-3" />
                          {heroSection.updatedBy}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {canManageHeroSections && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <LuMenu className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(heroSection)}>
                              <LuPencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e: Event) => e.preventDefault()}
                                  className="text-red-600"
                                >
                                  <LuTrash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Hero Section</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{heroSection.title}"? 
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(heroSection.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Hero Section Form Dialog */}
      {canManageHeroSections && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Edit Hero Section" : "Create Hero Section"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? "Update the hero section details below" 
                  : "Fill in the details to create a new hero section"}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <HeroSectionForm
                initialData={selectedHeroSection || undefined}
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

export default HeroSectionsPage;
