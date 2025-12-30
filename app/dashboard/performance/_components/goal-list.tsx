"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEmployeeGoals } from "@/hooks/use-performance";
import { format } from "date-fns";
import { Plus, Target } from "lucide-react";

export function GoalList({
  employeeId,
  isManager,
}: {
  employeeId: string;
  isManager: boolean;
}) {
  const { data: goals, isLoading } = useEmployeeGoals(employeeId);

  if (isLoading) return <div>Loading goals...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isManager && (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Set Goal
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {goals?.map((goal) => (
          <Card key={goal.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-fit rounded-full bg-primary/10 p-2">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{goal.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs">
                      <span className="rounded bg-muted px-2 py-1">
                        Weight: {goal.weight}x
                      </span>
                      <span className="text-muted-foreground italic">
                        From {format(new Date(goal.startDate), "PPP")} to{" "}
                        {format(new Date(goal.endDate), "PPP")}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    goal.status === "PLANNED"
                      ? "outline"
                      : goal.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                  }
                >
                  {goal.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!goals || goals.length === 0) && (
          <div className="rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground">
            No goals found for this employee.
          </div>
        )}
      </div>
    </div>
  );
}
