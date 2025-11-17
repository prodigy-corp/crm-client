"use client";

import { useDashboardStats, useRecentActivities } from "@/hooks/use-admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Spinner from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import {
  LuUsers,
  LuUserCheck,
  LuUserPlus,
  LuFileText,
  LuEye,
  LuPencil,
  LuMessageSquare,
  LuClock,
  LuCheck,
  LuTrendingUp as LuChart,
  LuActivity,
  LuInfo,
  LuTrendingUp,
} from "react-icons/lu";
import type { DashboardStats, RecentActivities } from "@/lib/api/admin";
import { Skeleton } from "@/components/ui/skeleton";

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
}

const StatCard = ({ title, value, icon: Icon, description, color, trend }: StatCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`rounded-lg bg-primary/10 p-2`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}>
            <LuTrendingUp className={`h-3 w-3 ${
              trend.isPositive ? "" : "rotate-180"
            }`} />
            {trend.value}%
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Skeleton Loader Component
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-1 h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const AdminDashboardPage = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  // Memoized stat cards configuration
  const statsCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total Users",
        value: stats.users.total,
        icon: LuUsers,
        description: "All registered users",
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        title: "Active Users",
        value: stats.users.active,
        icon: LuUserCheck,
        description: "Currently active users",
        color: "text-green-600 dark:text-green-400",
      },
      {
        title: "New Users (7d)",
        value: stats.users.recent,
        icon: LuUserPlus,
        description: "Users joined this week",
        color: "text-cyan-600 dark:text-cyan-400",
      },
      {
        title: "Total Blogs",
        value: stats.blogs.total,
        icon: LuFileText,
        description: "All blog posts",
        color: "text-purple-600 dark:text-purple-400",
      },
      {
        title: "Published Blogs",
        value: stats.blogs.published,
        icon: LuEye,
        description: "Live blog posts",
        color: "text-emerald-600 dark:text-emerald-400",
      },
      {
        title: "Draft Blogs",
        value: stats.blogs.draft,
        icon: LuPencil,
        description: "Unpublished drafts",
        color: "text-orange-600 dark:text-orange-400",
      },
      {
        title: "Total Comments",
        value: stats.comments.total,
        icon: LuMessageSquare,
        description: "All comments",
        color: "text-pink-600 dark:text-pink-400",
      },
      {
        title: "Pending Comments",
        value: stats.comments.pending,
        icon: LuClock,
        description: "Awaiting moderation",
        color: "text-yellow-600 dark:text-yellow-400",
      },
      {
        title: "Approved Comments",
        value: stats.comments.approved,
        icon: LuCheck,
        description: "Approved comments",
        color: "text-teal-600 dark:text-teal-400",
      },
      {
        title: "Total Views",
        value: stats.analytics.totalViews,
        icon: LuChart,
        description: "All-time blog views",
        color: "text-indigo-600 dark:text-indigo-400",
      },
    ];
  }, [stats]);

  // Memoized recent activities
  const allActivities = useMemo(() => {
    if (!activities) return [];

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
        title: `New user: ${user.name}`,
        subtitle: user.email,
        timestamp: user.createdAt,
      });
    });

    activities.recentBlogs?.forEach((blog) => {
      combined.push({
        id: blog.id,
        type: "blog",
        title: blog.title,
        subtitle: `by ${blog.author.name}`,
        status: blog.status,
        timestamp: blog.createdAt,
      });
    });

    activities.recentComments?.forEach((comment) => {
      combined.push({
        id: comment.id,
        type: "comment",
        title: `Comment on: ${comment.blog.title}`,
        subtitle: comment.content.substring(0, 60) + (comment.content.length > 60 ? "..." : ""),
        status: comment.status,
        timestamp: comment.createdAt,
      });
    });

    return combined.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 15);
  }, [activities]);

  if (statsLoading) {
    return <DashboardSkeleton />;
  }

  if (statsError) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <LuInfo className="mx-auto h-12 w-12 text-destructive" />
          <p className="mt-4 text-lg font-medium text-destructive">Error loading dashboard</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {statsError.message || "Please check your connection and try again"}
          </p>
        </div>
      </div>
    );
  }


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

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      PUBLISHED: { variant: "default", label: "Published" },
      DRAFT: { variant: "secondary", label: "Draft" },
      PENDING: { variant: "outline", label: "Pending" },
      APPROVED: { variant: "default", label: "Approved" },
    };

    const config = variants[status] || { variant: "secondary" as const, label: status };
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of your application statistics and recent activities
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LuActivity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription className="mt-1">
                Latest updates across users, blogs, and comments
              </CardDescription>
            </div>
            {allActivities.length > 0 && (
              <Badge variant="secondary">{allActivities.length} activities</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : allActivities.length > 0 ? (
            <div className="space-y-3">
              {allActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{activity.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {activity.subtitle}
                        </p>
                      </div>
                      {activity.status && (
                        <div className="shrink-0">
                          {getStatusBadge(activity.status)}
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
              <div className="text-center">
                <LuActivity className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No recent activities found</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
