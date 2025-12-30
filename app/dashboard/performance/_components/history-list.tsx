"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEmployeeAppraisalHistory } from "@/hooks/use-performance";
import { format } from "date-fns";
import { History, TrendingUp } from "lucide-react";

export function AppraisalHistoryList({ employeeId }: { employeeId: string }) {
  const { data: history, isLoading } = useEmployeeAppraisalHistory(employeeId);

  if (isLoading) return <div>Loading history...</div>;

  return (
    <div className="space-y-6">
      <div className="relative space-y-8 pl-8 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-muted">
        {history?.map((item) => (
          <div key={item.id} className="relative">
            <div className="absolute top-1.5 -left-8 flex h-7 w-7 items-center justify-center rounded-full border-4 border-background bg-primary text-white">
              <History className="h-3 w-3" />
            </div>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Appraisal Decision -{" "}
                    {format(new Date(item.createdAt), "PPP")}
                  </CardTitle>
                  <div className="flex gap-2">
                    {item.promotionEligible && (
                      <Badge className="border-none bg-green-100 text-green-700 shadow-none transition-none hover:bg-green-100">
                        Promotion Eligible
                      </Badge>
                    )}
                    {item.salaryIncrementEligible && (
                      <Badge className="border-none bg-blue-100 text-blue-700 shadow-none transition-none hover:bg-blue-100">
                        Salary Increment
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  Based on Performance Review rated{" "}
                  <strong>{item.review?.rating} / 5</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {item.notes ? (
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No specific outcome notes recorded.
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Outcome processed on{" "}
                    {format(new Date(item.createdAt), "PPP")}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                  >
                    View Original Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        {(!history || history.length === 0) && (
          <div className="-ml-8 rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground">
            No appraisal history recorded for this employee.
          </div>
        )}
      </div>
    </div>
  );
}
