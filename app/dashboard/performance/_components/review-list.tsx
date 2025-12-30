"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEmployeeReviews, useFinalizeReview } from "@/hooks/use-performance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CheckCircle2, MessageSquare, Star } from "lucide-react";

export function ReviewList({
  employeeId,
  isManager,
}: {
  employeeId: string;
  isManager: boolean;
}) {
  const { data: reviews, isLoading } = useEmployeeReviews(employeeId);
  const finalizeMutation = useFinalizeReview();

  if (isLoading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {isManager && (
          <Button size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            New Review Session
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card
            key={review.id}
            className={cn(
              review.status === "DRAFT" && "border-yellow-200 bg-yellow-50/10",
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">
                      Performance Review -{" "}
                      {format(new Date(review.reviewDate), "MMMM yyyy")}
                    </CardTitle>
                    <Badge
                      variant={
                        review.status === "FINALIZED" ? "default" : "outline"
                      }
                    >
                      {review.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Reviewer: {review.reviewer?.name} • Period:{" "}
                    {format(new Date(review.periodStart), "MMM d")} -{" "}
                    {format(new Date(review.periodEnd), "MMM d, yyyy")}
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded bg-primary/10 px-2 py-1 font-bold text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  {review.rating} / 5
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Overall Feedback
                  </h4>
                  <p className="border-l-2 border-primary/20 py-1 pl-3 text-sm text-muted-foreground italic">
                    "{review.feedback}"
                  </p>
                </div>
                <div className="space-y-4">
                  {review.strengths && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Strengths
                      </h4>
                      <p className="text-sm">{review.strengths}</p>
                    </div>
                  )}
                  {review.improvementAreas && (
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                        Areas for Improvement
                      </h4>
                      <p className="text-sm">{review.improvementAreas}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            {isManager && review.status === "DRAFT" && (
              <CardFooter className="flex justify-end gap-2 bg-muted/30 pt-4">
                <Button variant="outline" size="sm">
                  Edit Draft
                </Button>
                <Button
                  size="sm"
                  onClick={() => finalizeMutation.mutate(review.id)}
                  disabled={finalizeMutation.isPending}
                >
                  Finalize Review
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
        {(!reviews || reviews.length === 0) && (
          <div className="rounded-lg border-2 border-dashed py-10 text-center text-sm text-muted-foreground">
            No performance reviews found for this employee.
          </div>
        )}
      </div>
    </div>
  );
}
