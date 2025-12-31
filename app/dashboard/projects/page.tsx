"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteProject, useProjects } from "@/hooks/use-projects";
import { Project } from "@/lib/api/projects";
import { format } from "date-fns";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { ProjectDialog } from "./_components/project-dialog";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "PLANNED":
        return (
          <Badge variant="secondary">
            <Calendar className="mr-1 h-3 w-3" /> Planned
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-500 font-medium hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-500 font-medium hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "ON_HOLD":
        return (
          <Badge
            variant="outline"
            className="border-yellow-600 font-medium text-yellow-600"
          >
            <AlertCircle className="mr-1 h-3 w-3" /> On Hold
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Projects
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your project development and tracking.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedProject(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven't created any projects yet. Click the button above to
              get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg dark:hover:bg-gray-800/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="line-clamp-1 text-xl font-bold">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 min-h-[40px] text-sm text-gray-600 dark:text-gray-400">
                  {project.description || "No description provided."}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-xs text-gray-500 dark:border-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Start:{" "}
                      {project.startDate
                        ? format(new Date(project.startDate), "MMM d, yyyy")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Tasks: {project._count?.tasks || 0}</span>
                  </div>
                </div>
                {project.manager && (
                  <div className="pt-2">
                    <p className="mb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Manager
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {project.manager.name}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
      />
    </div>
  );
}
