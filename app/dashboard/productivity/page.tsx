"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  useMyProductivity,
  useProductivityOverview,
} from "@/hooks/use-productivity";
import {
  AlertCircle,
  BarChart,
  CheckCircle,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";

export default function ProductivityPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((role) =>
    ["ADMIN", "SUPER_ADMIN"].includes(role),
  );

  const { data: myStats, isLoading: isMyStatsLoading } = useMyProductivity();
  const { data: overview, isLoading: isOverviewLoading } =
    useProductivityOverview();

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: any,
    description?: string,
    color: string = "primary",
  ) => (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className={`rounded-lg p-1.5 bg-${color}/10 text-${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );

  if (isMyStatsLoading || (isAdmin && isOverviewLoading)) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Productivity
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor performance metrics and task completion efficiency.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {myStats && (
          <>
            {renderStatCard(
              "Task Completion",
              `${myStats.completionRate ? Number(myStats.completionRate.toFixed(1)) : 0}%`,
              <CheckCircle className="h-4 w-4" />,
              "Efficiency vs Deadlines",
              "green-500",
            )}
            {renderStatCard(
              "Efficiency Rate",
              `${myStats.efficiencyRate ? Number(myStats.efficiencyRate.toFixed(1)) : 0}%`,
              <TrendingUp className="h-4 w-4" />,
              "Weighted Performance",
              "blue-500",
            )}
            {renderStatCard(
              "Total Tasks",
              myStats.totalTasks,
              <BarChart className="h-4 w-4" />,
              "Assigned to you",
              "primary",
            )}
            {renderStatCard(
              "Overdue Tasks",
              myStats.overdueTasks,
              <AlertCircle className="h-4 w-4" />,
              "Require attention",
              "red-600",
            )}
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Task Breakdown
            </CardTitle>
            <CardDescription>
              Visual distribution of your current work status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {myStats && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <div className="h-2 w-2 rounded-full bg-green-500" />{" "}
                      Completed
                    </span>
                    <span className="font-bold">{myStats.completedTasks}</span>
                  </div>
                  <Progress
                    value={
                      (myStats.completedTasks / (myStats.totalTasks || 1)) * 100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <div className="h-2 w-2 rounded-full bg-blue-500" /> In
                      Progress
                    </span>
                    <span className="font-bold">{myStats.inProgressTasks}</span>
                  </div>
                  <Progress
                    value={
                      (myStats.inProgressTasks / (myStats.totalTasks || 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <div className="h-2 w-2 rounded-full bg-gray-400" /> To Do
                    </span>
                    <span className="font-bold">{myStats.todoTasks}</span>
                  </div>
                  <Progress
                    value={
                      (myStats.todoTasks / (myStats.totalTasks || 1)) * 100
                    }
                    className="h-2"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {isAdmin && overview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Performers
              </CardTitle>
              <CardDescription>
                Employee efficiency ranking across the organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {overview.slice(0, 5).map((employee, index) => (
                  <div
                    key={employee.employeeId}
                    className="group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary transition-all group-hover:scale-110">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm leading-none font-bold text-gray-900 dark:text-white">
                          {employee.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {employee.completedTasks} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">
                        {employee.efficiencyRate ? Number(employee.efficiencyRate.toFixed(1)) : 0}%
                      </div>
                      <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                        Efficiency
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isAdmin && overview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Employee Productivity Overview
            </CardTitle>
            <CardDescription>
              Detailed productivity stats for all employees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs tracking-widest text-gray-500 uppercase dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 font-bold">Employee</th>
                    <th className="px-6 py-4 font-bold">Tasks</th>
                    <th className="px-6 py-4 font-bold">Solved</th>
                    <th className="px-6 py-4 font-bold">Efficiency</th>
                    <th className="px-6 py-4 font-bold">On Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {overview.map((employee) => (
                    <tr
                      key={employee.employeeId}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                    >
                      <td className="px-6 py-4 font-medium">{employee.name}</td>
                      <td className="px-6 py-4">{employee.totalTasks}</td>
                      <td className="px-6 py-4">{employee.completedTasks}</td>
                      <td className="px-6 py-4 font-bold text-primary">
                        {employee.efficiencyRate ? Number(employee.efficiencyRate.toFixed(1)) : 0}%
                      </td>
                      <td className="px-6 py-4 font-medium text-green-500">
                        {employee.onTimeCompletion} tasks
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
