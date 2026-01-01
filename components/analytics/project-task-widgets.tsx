"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectDashboardStats } from "@/hooks/use-projects";
import { useTaskAnalytics } from "@/hooks/use-tasks";
import { LuListTodo, LuProjector, LuTrendingUp } from "react-icons/lu";

export const ProjectOverviewWidget = () => {
  const { data: stats, isLoading } = useProjectDashboardStats();

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  const activeProjects = stats?.activeProjects || 0;
  const completedProjects = stats?.completedProjects || 0;
  const totalProjects = stats?.totalProjects || 0;
  const completionRate =
    totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-blue-50/50 to-indigo-50/50 transition-all hover:border-primary/20 hover:shadow-md dark:from-blue-900/10 dark:to-indigo-900/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Projects Overview
        </CardTitle>
        <LuProjector className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-2xl font-bold">{totalProjects}</div>
          <div className="text-xs font-medium text-muted-foreground">
            {activeProjects} Active
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-medium text-emerald-600">
              {Math.round(completionRate)}%
            </span>
          </div>
          <Progress value={completionRate} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
};

export const TaskSummaryWidget = () => {
  const { data: stats, isLoading } = useTaskAnalytics();

  if (isLoading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  const completionRate = stats?.completionRate || 0;
  const inProgress = stats?.inProgressTasks || 0;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-emerald-50/50 to-teal-50/50 transition-all hover:border-primary/20 hover:shadow-md dark:from-emerald-900/10 dark:to-teal-900/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Task Performance
        </CardTitle>
        <LuListTodo className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
          <div className="text-xs font-medium text-muted-foreground">
            {inProgress} In Progress
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-medium text-emerald-600">
              {completionRate}%
            </span>
          </div>
          <Progress value={completionRate} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
};

export const ProductivityWidget = () => {
  // This could show personal stats vs team average
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 transition-all hover:border-primary/20 hover:shadow-md dark:from-purple-900/10 dark:to-fuchsia-900/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Productivity
        </CardTitle>
        <LuTrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-2xl font-bold">8.5h</div>
          <div className="text-xs font-medium text-muted-foreground">
            Logged Today
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          +12% relative to your daily average
        </div>
      </CardContent>
    </Card>
  );
};
