"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEmployeeKPIs } from "@/hooks/use-performance";
import { format } from "date-fns";
import { Pencil, Plus } from "lucide-react";

export function KPIList({
  employeeId,
  isManager,
}: {
  employeeId: string;
  isManager: boolean;
}) {
  const { data: kpis, isLoading } = useEmployeeKPIs(employeeId);

  if (isLoading) return <div>Loading KPIs...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isManager && (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add KPI
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {kpis?.map((kpi) => {
          const percentage = Math.min(
            (Number(kpi.currentValue) / Number(kpi.targetValue)) * 100,
            100,
          );
          return (
            <Card key={kpi.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">
                    {kpi.name}
                  </CardTitle>
                  <Badge
                    variant={kpi.status === "ACTIVE" ? "default" : "secondary"}
                  >
                    {kpi.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {kpi.description}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Progress: {kpi.currentValue} {kpi.unit}
                    </span>
                    <span className="font-medium">
                      Target: {kpi.targetValue} {kpi.unit}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Period: {kpi.period}</span>
                    <span>
                      Last updated: {format(new Date(kpi.updatedAt), "PPP")}
                    </span>
                  </div>
                  {isManager && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full gap-2"
                    >
                      <Pencil className="h-3 w-3" />
                      Update Progress
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {(!kpis || kpis.length === 0) && (
          <div className="col-span-2 rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground">
            No KPIs found for this employee.
          </div>
        )}
      </div>
    </div>
  );
}
