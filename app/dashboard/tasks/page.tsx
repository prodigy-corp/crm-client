"use client";

import { KanbanBoard } from "@/components/project-task/kanban-board";
import { TaskAnalytics } from "@/components/project-task/task-analytics";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import {
  useDeleteTask,
  useTaskAnalytics,
  useTasks,
  useUpdateTask,
} from "@/hooks/use-tasks";
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
import { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { LuArmchair, LuLayoutDashboard, LuList } from "react-icons/lu";
import { TaskDialog } from "./_components/task-dialog";

export default function TasksPage() {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<string>("list");

  const queryParams = {
    projectId: projectId === "all" ? undefined : projectId,
    status: status === "all" ? undefined : (status as any),
  };

  const { data: tasks, isLoading } = useTasks(queryParams);
  const { data: analytics, isLoading: analyticsLoading } =
    useTaskAnalytics(queryParams);
  const { data: projects } = useProjects();

  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskMove = (taskId: string, newStatus: Task["status"]) => {
    updateTask.mutate({ id: taskId, data: { status: newStatus } });
  };

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "TODO":
        return <Badge variant="secondary">To Do</Badge>;
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-500 font-medium hover:bg-blue-600">
            In Progress
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-500 font-medium hover:bg-green-600">
            Completed
          </Badge>
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
            className="border-teal-500 bg-teal-50 font-normal text-teal-600 dark:bg-teal-900/10"
          >
            Low
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge
            variant="outline"
            className="border-blue-500 bg-blue-50 font-normal text-blue-600 dark:bg-blue-900/10"
          >
            Medium
          </Badge>
        );
      case "HIGH":
        return (
          <Badge
            variant="outline"
            className="border-amber-500 bg-amber-50 font-normal text-amber-600 dark:bg-amber-900/10"
          >
            High
          </Badge>
        );
      case "URGENT":
        return (
          <Badge
            variant="outline"
            className="border-red-600 bg-red-50 font-bold text-red-600 dark:bg-red-900/10"
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
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-6 duration-500 fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage your tasks across all projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={setView} className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-2 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <LuList className="h-4 w-4" /> List
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <LuLayoutDashboard className="h-4 w-4" /> Kanban
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <LuArmchair className="h-4 w-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col items-center gap-3 md:flex-row">
            <div className="flex items-center gap-2 px-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              <Filter className="h-3 w-3" />
              Filter
            </div>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="h-9 w-full text-xs md:w-[180px]">
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

            {view !== "kanban" && (
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 w-full text-xs md:w-[140px]">
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
            )}
          </div>
        </div>

        <TabsContent value="list" className="space-y-4">
          {!tasks || tasks.length === 0 ? (
            <EmptyState message="No tasks match your current filters." />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className="group overflow-hidden border-primary/5 transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-900 transition-colors group-hover:text-primary dark:text-gray-100">
                            <Link href={`/dashboard/tasks/${task.id}` as Route}>
                              {task.title}
                            </Link>
                          </h4>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="line-clamp-1 text-sm text-muted-foreground italic">
                          {task.description || "No description provided."}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                          <div className="flex items-center gap-1.5 rounded bg-primary/5 px-2 py-0.5 text-primary">
                            <Briefcase className="h-3 w-3" />
                            <span>{task.project?.name || "No Project"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Due:{" "}
                              {task.dueDate
                                ? format(new Date(task.dueDate), "MMM dd, yyyy")
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-6 border-t pt-4 md:justify-end md:border-0 md:pt-0">
                        <div className="flex items-center gap-4">
                          {task.assignee && (
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[10px] font-bold text-primary">
                                {task.assignee.name.charAt(0)}
                              </div>
                              <span className="hidden text-xs font-semibold text-muted-foreground lg:inline">
                                {task.assignee.name}
                              </span>
                            </div>
                          )}
                          {getStatusBadge(task.status)}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-primary/5"
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
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
        </TabsContent>

        <TabsContent value="kanban" className="outline-none">
          <KanbanBoard tasks={tasks || []} onTaskMove={handleTaskMove} />
        </TabsContent>

        <TabsContent value="analytics">
          {analyticsLoading ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
          ) : analytics ? (
            <TaskAnalytics data={analytics} />
          ) : (
            <EmptyState message="No analytics data available." />
          )}
        </TabsContent>
      </Tabs>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
      />
    </div>
  );
}

const EmptyState = ({ message }: { message: string }) => (
  <Card className="border-dashed bg-muted/20">
    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5">
        <List className="h-8 w-8 text-primary/30" />
      </div>
      <h3 className="text-lg font-bold">No tasks found</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
        {message}
      </p>
    </CardContent>
  </Card>
);
