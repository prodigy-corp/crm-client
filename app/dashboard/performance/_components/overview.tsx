"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useEmployeeGoals,
  useEmployeeKPIs,
  useEmployeeReviews,
} from "@/hooks/use-performance";
import { LuHistory, LuStar, LuTarget, LuTrendingUp } from "react-icons/lu";

export function PerformanceOverview({ employeeId }: { employeeId: string }) {
  const { data: kpis } = useEmployeeKPIs(employeeId);
  const { data: goals } = useEmployeeGoals(employeeId);
  const { data: reviews } = useEmployeeReviews(employeeId);

  // Calculate stats
  const avgRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "N/A";

  const achievedKPIs = kpis?.filter((k) => k.status === "ACHIEVED").length || 0;
  const kpiCompletionRate = kpis?.length
    ? Math.round((achievedKPIs / kpis.length) * 100)
    : 0;

  const activeGoals =
    goals?.filter((g) => g.status === "IN_PROGRESS").length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <LuStar className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgRating} / 5</div>
          <p className="text-xs text-muted-foreground">
            Based on {reviews?.length || 0} reviews
          </p>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">KPI Completion</CardTitle>
          <LuTrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpiCompletionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {achievedKPIs} of {kpis?.length || 0} achieved
          </p>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
          <LuTarget className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeGoals}</div>
          <p className="text-xs text-muted-foreground">
            {goals?.length || 0} total assigned
          </p>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Appraisal Status
          </CardTitle>
          <LuHistory className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Up to date</div>
          <Badge variant="outline" className="mt-1 font-normal">
            Next review scheduled
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
