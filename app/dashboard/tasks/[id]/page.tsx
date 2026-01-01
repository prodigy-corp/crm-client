"use client";

import { CommentsSection } from "@/components/project-task/comments-section";
import { TimeTracking } from "@/components/project-task/time-tracking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddTaskComment,
  useAddTaskTimeLog,
  useTask,
  useTaskComments,
  useTaskTimeLogs,
} from "@/hooks/use-tasks";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LuAlertCircle, LuClock, LuUser } from "react-icons/lu";

export default function TaskDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: task, isLoading: taskLoading } = useTask(id);
  const { data: comments, isLoading: commentsLoading } = useTaskComments(id);
  const { data: timeLogs, isLoading: timeLogsLoading } = useTaskTimeLogs(id);

  const addCommentMutation = useAddTaskComment();
  const addTimeLogMutation = useAddTaskTimeLog();

  if (taskLoading || commentsLoading || timeLogsLoading) {
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

  if (!task) return <div>Task not found</div>;

  const statusColors = {
    TODO: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    IN_PROGRESS:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    CANCELLED:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const priorityColors = {
    LOW: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    MEDIUM: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    HIGH: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    URGENT: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const actualHours =
    timeLogs?.reduce((acc, log) => acc + Number(log.hours), 0) || 0;
  const estimatedHours = task.estimatedHours || 0;
  const progressPercent =
    estimatedHours > 0
      ? Math.min((actualHours / estimatedHours) * 100, 100)
      : 0;

  return (
    <div className="animate-in space-y-8 duration-500 fade-in">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm">
        <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Link href={`/dashboard/projects/${task.projectId}`}>
                {task.project?.name || "Project"}
              </Link>
              <span>/</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {task.title}
              </h1>
              <Badge className={statusColors[task.status]}>{task.status}</Badge>
              <Badge
                variant="outline"
                className={priorityColors[task.priority]}
              >
                {task.priority}
              </Badge>
            </div>
            <p className="flex max-w-2xl items-center gap-2 text-muted-foreground">
              {task.description || "No description provided."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/tasks">Back to Tasks</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-8 lg:col-span-2">
          <Tabs defaultValue="time" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="time" className="flex items-center gap-2">
                <LuClock className="h-4 w-4" /> Time Tracking
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <LuAlertCircle className="h-4 w-4" /> Attributes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="time">
              <TimeTracking
                logs={timeLogs || []}
                isAdding={addTimeLogMutation.isPending}
                onAddLog={(data) =>
                  addTimeLogMutation.mutate({ id: task.id, data })
                }
              />
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Task Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-sm text-muted-foreground">
                      Assignee
                    </span>
                    <div className="flex items-center gap-2">
                      <LuUser className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {task.assignee?.name || "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-sm text-muted-foreground">
                      Due Date
                    </span>
                    <span className="font-medium">
                      {task.dueDate
                        ? format(new Date(task.dueDate), "PPP")
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-sm text-muted-foreground">
                      Creator
                    </span>
                    <span className="font-medium">
                      {task.creator?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b py-2">
                    <span className="text-sm text-muted-foreground">
                      Created At
                    </span>
                    <span className="font-medium">
                      {format(new Date(task.createdAt), "PPP")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Summary & Collaboration */}
        <div className="space-y-8">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">
                Work Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Progress vs Estimate</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg border bg-muted/50 p-3 text-center">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Estimated
                  </div>
                  <div className="text-lg font-bold">{estimatedHours}h</div>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3 text-center">
                  <div className="mb-1 text-xs text-muted-foreground">
                    Actual
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {actualHours}h
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <CommentsSection
            comments={comments || []}
            isAdding={addCommentMutation.isPending}
            onAddComment={(content) =>
              addCommentMutation.mutate({ id: task.id, content })
            }
            title="Task Discussion"
          />
        </div>
      </div>
    </div>
  );
}
