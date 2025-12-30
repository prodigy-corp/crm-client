"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmployees } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";
import { History, Star, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { GoalList } from "./_components/goal-list";
import { AppraisalHistoryList } from "./_components/history-list";
import { KPIList } from "./_components/kpi-list";
import { PerformanceOverview } from "./_components/overview";
import { ReviewList } from "./_components/review-list";

export default function PerformancePage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some((r) =>
    ["ADMIN", "SUPER_ADMIN"].includes(r),
  );
  const isManager = user?.roles?.includes("MANAGER") || isAdmin;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  // Initialize selectedEmployeeId if user is employee or when employees list loads
  useEffect(() => {
    // If user is just an employee, they see themselves
    // Note: We'd ideally have an employeeId on the user object.
    // For now, if we don't have it, we'll let the user select if they are manager/admin.
  }, [user]);

  const { data: employeesData } = useEmployees(undefined, !!isManager);
  const employees = employeesData?.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Performance Management
          </h1>
          <p className="text-muted-foreground">
            Track KPIs, goals, and conduct performance reviews.
          </p>
        </div>

        {isManager && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Viewing for:</span>
            <Select
              value={selectedEmployeeId}
              onValueChange={setSelectedEmployeeId}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((emp: any) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!selectedEmployeeId && isManager ? (
        <div className="rounded-lg border bg-muted/50 p-10 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Select an employee</h2>
          <p className="mx-auto mt-2 max-w-xs text-muted-foreground">
            Please select an employee from the dropdown above to view their
            performance metrics and history.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="kpis" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden md:inline">KPIs</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden md:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden md:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden md:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PerformanceOverview employeeId={selectedEmployeeId} />
          </TabsContent>

          <TabsContent value="kpis">
            <KPIList employeeId={selectedEmployeeId} isManager={!!isManager} />
          </TabsContent>

          <TabsContent value="goals">
            <GoalList employeeId={selectedEmployeeId} isManager={!!isManager} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewList
              employeeId={selectedEmployeeId}
              isManager={!!isManager}
            />
          </TabsContent>

          <TabsContent value="history">
            <AppraisalHistoryList employeeId={selectedEmployeeId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
