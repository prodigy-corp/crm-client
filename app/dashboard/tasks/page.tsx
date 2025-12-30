"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { useDeleteTask, useTasks } from "@/hooks/use-tasks";
import { Task } from "@/lib/api/tasks";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  Edit,
  Filter,
  List,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { TaskDialog } from "./_components/task-dialog";

export default function TasksPage() {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const { data: tasks, isLoading } = useTasks({
    projectId: projectId === "all" ? undefined : projectId,
    status: status === "all" ? undefined : (status as any),
  });

  const { data: projects } = useProjects();
  const deleteTask = useDeleteTask();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "TODO":
        return <Badge variant="secondary">To Do</Badge>;
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "LOW":
        return (
          <Badge
            variant="outline"
            className="border-gray-500 font-normal text-gray-500"
          >
            Low
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 font-normal text-blue-500"
          >
            Medium
          </Badge>
        );
      case "HIGH":
        return (
          <Badge
            variant="outline"
            className="border-orange-500 font-normal text-orange-500"
          >
            High
          </Badge>
        );
      case "URGENT":
        return (
          <Badge
            variant="outline"
            className="border-red-600 font-bold text-red-600"
          >
            Urgent
          </Badge>
        );
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
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
            Tasks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track and manage your tasks across all projects.
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedTask(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:items-center dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
            Filter by:
          </span>
        </div>

        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!tasks || tasks.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <List className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
            <p className="mt-2 text-sm text-gray-500">
              No tasks match your current filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="overflow-hidden transition-all hover:shadow-md dark:hover:bg-gray-800/50"
            >
              <CardContent className="p-0">
                <div className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="leading-none font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </h4>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <p className="line-clamp-1 text-sm text-gray-500">
                      {task.description || "No description."}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        <span>{task.project?.name || "No Project"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Due:{" "}
                          {task.dueDate
                            ? format(new Date(task.dueDate), "MMM d, y")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-between gap-4 border-t pt-4 sm:w-auto sm:border-0 sm:pt-0 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {task.assignee.name.charAt(0)}
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {task.assignee.name}
                          </span>
                        </div>
                      )}
                      {getStatusBadge(task.status)}
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
                            setSelectedTask(task);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
      />
    </div>
  );
}
