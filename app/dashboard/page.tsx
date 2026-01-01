"use client";

import {
  ProductivityWidget,
  ProjectOverviewWidget,
  TaskSummaryWidget,
} from "@/components/analytics/project-task-widgets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useRecentActivities } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import {
  useCheckIn,
  useCheckOut,
  useTodayAttendance,
} from "@/hooks/use-employee-attendance";
import {
  hasPermission,
  isAdmin,
  isEmployee,
  isSuperAdmin,
} from "@/lib/permissions";
import { formatDistanceToNow } from "date-fns";
import { Route } from "next";
import Link from "next/link";
import { useMemo } from "react";
import {
  LuActivity,
  LuCalendar,
  LuCircleCheckBig,
  LuClock,
  LuDollarSign,
  LuFileText,
  LuInfo,
  LuLogIn,
  LuLogOut,
  LuMessageSquare,
  LuTrendingUp,
  LuUserCheck,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  href?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  color,
  trend,
  href,
}: StatCardProps) => {
  const cardContent = (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/20 hover:shadow-md">
      <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
        <Icon className={`h-16 w-16 ${color}`} />
      </div>
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`rounded-full bg-background p-2 shadow-sm ring-1 ring-border`}
        >
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-0.5 rounded-full bg-background/50 px-2 py-0.5 text-xs font-medium ${
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              <LuTrendingUp
                className={`h-3 w-3 ${trend.isPositive ? "" : "rotate-180"}`}
              />
              {trend.value}%
            </div>
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href as Route} className="block h-full">
      {cardContent}
    </Link>
  ) : (
    <div className="h-full">{cardContent}</div>
  );
};

// Check-in/Check-out Widget for Employees
const CheckInOutWidget = () => {
  const { data: todayAttendance, isLoading } = useTodayAttendance();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  const isCheckedIn =
    todayAttendance?.checkInAt && !todayAttendance?.checkOutAt;
  const loading = checkInMutation.isPending || checkOutMutation.isPending;

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
      <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LuClock className="h-5 w-5 text-primary" />
              Today's Attendance
            </CardTitle>
            <CardDescription>Manage your daily work schedule</CardDescription>
          </div>
          <Badge
            variant={isCheckedIn ? "default" : "outline"}
            className="px-3 py-1"
          >
            {isCheckedIn ? "On Duty" : "Off Duty"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col rounded-xl border bg-background/60 p-4 backdrop-blur-sm">
                <span className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Check In
                </span>
                <div className="flex items-center gap-2">
                  {todayAttendance?.checkInAt ? (
                    <>
                      <LuCircleCheckBig className="h-4 w-4 text-emerald-500" />
                      <span className="text-lg font-semibold">
                        {new Date(todayAttendance.checkInAt).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-muted-foreground">
                      --:--
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col rounded-xl border bg-background/60 p-4 backdrop-blur-sm">
                <span className="mb-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Check Out
                </span>
                <div className="flex items-center gap-2">
                  {todayAttendance?.checkOutAt ? (
                    <>
                      <LuCircleCheckBig className="h-4 w-4 text-blue-500" />
                      <span className="text-lg font-semibold">
                        {new Date(
                          todayAttendance.checkOutAt,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-muted-foreground">
                      --:--
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {!isCheckedIn && !todayAttendance?.checkOutAt ? (
                <Button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="h-12 w-full text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
                >
                  <LuLogIn className="mr-2 h-5 w-5" />
                  Check In Now
                </Button>
              ) : isCheckedIn ? (
                <Button
                  onClick={handleCheckOut}
                  disabled={loading}
                  variant="destructive"
                  className="h-12 w-full text-base shadow-lg shadow-destructive/20 transition-all hover:shadow-destructive/30"
                >
                  <LuLogOut className="mr-2 h-5 w-5" />
                  Check Out
                </Button>
              ) : (
                <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary/50 p-3 text-center font-medium text-secondary-foreground">
                  <LuCircleCheckBig className="h-5 w-5" />
                  Attendance Completed
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Skeleton Loader
const DashboardSkeleton = () => (
  <div className="animate-in space-y-8 duration-500 fade-in">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Skeleton className="h-96 rounded-xl lg:col-span-2" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  </div>
);

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();

  const userIsEmployee = isEmployee(user);
  const userIsAdmin = isAdmin(user) || isSuperAdmin(user);

  const { data: stats, isLoading: statsLoading } =
    useDashboardStats(userIsAdmin);
  const { data: activities, isLoading: activitiesLoading } =
    useRecentActivities(userIsAdmin);

  // Memoized stat cards configuration
  const statsCards = useMemo(() => {
    if (!user) return [];

    const cards: StatCardProps[] = [];

    // Employee-specific stats
    if (userIsEmployee) {
      cards.push(
        {
          title: "Attendance Rate",
          value: "92%",
          icon: LuCalendar,
          description: "Present days this month",
          color: "text-emerald-600 dark:text-emerald-400",
          href: "/dashboard/attendance",
          trend: { value: 4.5, isPositive: true },
        },
        {
          title: "Current Salary",
          value: "$5,000",
          icon: LuDollarSign,
          description: "Projected for this month",
          color: "text-blue-600 dark:text-blue-400",
          href: "/dashboard/salary",
        },
      );
    }

    // Admin stats (permission-based) - Only show if stats are loaded
    if (userIsAdmin && stats && hasPermission(user, "admin.dashboard.view")) {
      // User Statistics
      if (hasPermission(user, "admin.users.view")) {
        cards.push(
          {
            title: "Total Users",
            value: stats.users.total,
            icon: LuUsers,
            description: "Registered accounts",
            color: "text-blue-600 dark:text-blue-400",
            href: "/dashboard/admin/users",
            trend: { value: 12, isPositive: true },
          },
          {
            title: "Active Now",
            value: stats.users.active,
            icon: LuUserCheck,
            description: "Currently online",
            color: "text-emerald-600 dark:text-emerald-400",
          },
        );
      }

      // Blog Statistics
      if (hasPermission(user, "admin.blog.view")) {
        cards.push(
          {
            title: "Total Blogs",
            value: stats.blogs.total,
            icon: LuFileText,
            description: "Published & drafts",
            color: "text-purple-600 dark:text-purple-400",
            href: "/dashboard/admin/blogs",
          },
          {
            title: "Pending Comments",
            value: stats.comments.pending,
            icon: LuMessageSquare,
            description: "Needs moderation",
            color: "text-amber-600 dark:text-amber-400",
          },
        );
      }
    }

    return cards;
  }, [stats, user, userIsEmployee, userIsAdmin]);

  // Memoized recent activities (for admins)
  const allActivities = useMemo(() => {
    if (!activities || !userIsAdmin) return [];

    const combined: Array<{
      id: string;
      type: "user" | "blog" | "comment";
      title: string;
      subtitle: string;
      status?: string;
      timestamp: string;
    }> = [];

    activities.recentUsers?.forEach((user) => {
      combined.push({
        id: user.id,
        type: "user",
        title: `New user joined`,
        subtitle: user.name,
        timestamp: user.createdAt,
      });
    });

    activities.recentBlogs?.forEach((blog) => {
      combined.push({
        id: blog.id,
        type: "blog",
        title: `Blog post ${blog.status.toLowerCase()}`,
        subtitle: blog.title,
        status: blog.status,
        timestamp: blog.createdAt,
      });
    });

    activities.recentComments?.forEach((comment) => {
      combined.push({
        id: comment.id,
        type: "comment",
        title: `New comment`,
        subtitle: `On "${comment.blog.title}"`,
        status: comment.status,
        timestamp: comment.createdAt,
      });
    });

    return combined
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 6);
  }, [activities, userIsAdmin]);

  const getActivityIcon = (type: "user" | "blog" | "comment") => {
    switch (type) {
      case "user":
        return <LuUserPlus className="h-4 w-4 text-blue-600" />;
      case "blog":
        return <LuFileText className="h-4 w-4 text-purple-600" />;
      case "comment":
        return <LuMessageSquare className="h-4 w-4 text-pink-600" />;
    }
  };

  if (authLoading || statsLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="inline-block rounded-full bg-muted/30 p-6">
            <LuInfo className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">Access Restricted</h2>
          <p className="text-muted-foreground">
            Please log in to view your dashboard
          </p>
          <Button asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="animate-in space-y-8 duration-500 fade-in">
      {/* Welcome Banner */}
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="pointer-events-none absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="relative z-10 space-y-1">
          <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Good{" "}
            {new Date().getHours() < 12
              ? "Morning"
              : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
            , {user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="flex items-center gap-2 text-muted-foreground">
            <LuCalendar className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          {userIsEmployee && hasPermission(user, "employee.profile.update") && (
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href={"/dashboard/profile" as Route}>
                <LuUserCheck className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Stats & Widgets */}
        <div className="space-y-8 lg:col-span-2">
          {/* Stats Grid */}
          {statsCards.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {statsCards.map((card, index) => (
                <StatCard key={index} {...card} />
              ))}

              {/* Project & Task Specific Widgets */}
              {hasPermission(user, "projects.read") && (
                <ProjectOverviewWidget />
              )}
              {hasPermission(user, "tasks.read") && <TaskSummaryWidget />}
              {userIsEmployee && <ProductivityWidget />}
            </div>
          )}

          {/* Quick Actions */}
          {userIsEmployee && (
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <LuActivity className="h-5 w-5 text-primary" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {hasPermission(user, "employee.attendance.read") && (
                  <Link
                    href={"/dashboard/attendance" as Route}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                        <div className="rounded-full bg-blue-50 p-3 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/20 dark:text-blue-400">
                          <LuCalendar className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">Attendance</h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            View history
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                {hasPermission(user, "employee.salary.read") && (
                  <Link href={"/dashboard/salary" as Route} className="group">
                    <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                        <div className="rounded-full bg-green-50 p-3 text-green-600 transition-transform group-hover:scale-110 dark:bg-green-900/20 dark:text-green-400">
                          <LuDollarSign className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">Salary</h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Check slips
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                {hasPermission(user, "employee.profile.update") && (
                  <Link href={"/dashboard/profile" as Route} className="group">
                    <Card className="h-full transition-all hover:border-primary/30 hover:shadow-md">
                      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                        <div className="rounded-full bg-purple-50 p-3 text-purple-600 transition-transform group-hover:scale-110 dark:bg-purple-900/20 dark:text-purple-400">
                          <LuUserCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">Profile</h4>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Update info
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Attendance Widget & Activity */}
        <div className="space-y-8">
          {/* Employee Check-in/Check-out Widget */}
          {userIsEmployee &&
            hasPermission(user, "employee.attendance.checkin") && (
              <CheckInOutWidget />
            )}

          {/* Recent Activities (Admin only) */}
          {userIsAdmin && hasPermission(user, "admin.dashboard.view") && (
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LuActivity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activitiesLoading ? (
                  <div className="space-y-4 p-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allActivities.length > 0 ? (
                  <div className="divide-y">
                    {allActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-muted">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {activity.title}
                            </p>
                            <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(activity.timestamp),
                                { addSuffix: true },
                              )}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {activity.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No recent activities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
