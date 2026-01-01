"use client";

import { CommentsSection } from "@/components/project-task/comments-section";
import { ProjectAnalytics } from "@/components/project-task/project-analytics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddProjectComment,
  useProject,
  useProjectAnalytics,
  useProjectComments,
} from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  FileText,
  ListTodo,
  User,
} from "lucide-react";
import { Route } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: analytics, isLoading: analyticsLoading } =
    useProjectAnalytics(id);
  const { data: comments, isLoading: commentsLoading } = useProjectComments(id);
  const { data: tasks, isLoading: tasksLoading } = useTasks({ projectId: id });

  const addCommentMutation = useAddProjectComment();

  if (projectLoading || analyticsLoading || commentsLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-96 rounded-xl md:col-span-2" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  const statusColors = {
    PLANNED:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    IN_PROGRESS:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    ON_HOLD:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    CANCELLED:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <div className="animate-in space-y-8 duration-500 fade-in">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
        <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Badge className={statusColors[project.status]}>
                {project.status}
              </Badge>
            </div>
            <p className="flex max-w-2xl items-center gap-2 text-muted-foreground">
              {project.description || "No description provided."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </div>
            <div className="flex min-w-[200px] items-center gap-3">
              <Progress value={project.progress} className="h-2 flex-1" />
              <span className="text-lg font-bold">{project.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-8 lg:col-span-2">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" /> Tasks
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Project Tasks</CardTitle>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/tasks?projectId=${id}`}>
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks?.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        No tasks found for this project.
                      </div>
                    ) : (
                      tasks?.map((task) => (
                        <div
                          key={task.id}
                          className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`rounded-full p-2 ${
                                task.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium transition-colors group-hover:text-primary">
                                <Link
                                  href={`/dashboard/tasks/${task.id}` as Route}
                                >
                                  {task.title}
                                </Link>
                              </h4>
                              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />{" "}
                                  {task.assignee?.name || "Unassigned"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />{" "}
                                  {task.dueDate
                                    ? format(new Date(task.dueDate), "MMM dd")
                                    : "No due date"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{task.priority}</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              {analytics && <ProjectAnalytics data={analytics} />}
            </TabsContent>

            <TabsContent value="details">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Timeline & Budget</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        Start Date
                      </span>
                      <span className="font-medium">
                        {project.startDate
                          ? format(new Date(project.startDate), "PPP")
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        End Date
                      </span>
                      <span className="font-medium">
                        {project.endDate
                          ? format(new Date(project.endDate), "PPP")
                          : "Not set"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        Budget
                      </span>
                      <span className="font-medium text-emerald-600">
                        ${project.budget?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        Spent
                      </span>
                      <span className="font-medium text-blue-600">
                        ${project.actualCost.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Resource Allocation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        Manager
                      </span>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {project.manager?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        Client
                      </span>
                      <span className="font-medium">
                        {project.client?.companyName ||
                          project.client?.name ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b py-2">
                      <span className="text-sm text-muted-foreground">
                        Total Tasks
                      </span>
                      <span className="font-medium">{tasks?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Collaboration */}
        <div className="space-y-8">
          <CommentsSection
            comments={comments || []}
            isAdding={addCommentMutation.isPending}
            onAddComment={(content) =>
              addCommentMutation.mutate({ id: project.id, content })
            }
            title="Project Discussions"
          />
        </div>
      </div>
    </div>
  );
}
