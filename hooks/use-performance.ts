import {
  Goal,
  KPI,
  performanceApi,
  PerformanceReview,
} from "@/lib/api/performance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const performanceKeys = {
  all: ["performance"] as const,
  kpis: (employeeId: string) =>
    [...performanceKeys.all, "kpis", employeeId] as const,
  goals: (employeeId: string) =>
    [...performanceKeys.all, "goals", employeeId] as const,
  reviews: (employeeId: string) =>
    [...performanceKeys.all, "reviews", employeeId] as const,
  appraisals: (employeeId: string) =>
    [...performanceKeys.all, "appraisals", employeeId] as const,
};

// ==================== KPI Hooks ====================
export const useEmployeeKPIs = (employeeId: string) => {
  return useQuery({
    queryKey: performanceKeys.kpis(employeeId),
    queryFn: () => performanceApi.getEmployeeKPIs(employeeId),
    select: (res) => res.data.data,
    enabled: !!employeeId,
  });
};

export const useCreateKPI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<KPI>) => performanceApi.createKPI(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: performanceKeys.all });
      toast.success(res.data.message || "KPI created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create KPI");
    },
  });
};

export const useUpdateKPI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<KPI> }) =>
      performanceApi.updateKPI(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: performanceKeys.all });
      toast.success(res.data.message || "KPI updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update KPI");
    },
  });
};

// ==================== Goal Hooks ====================
export const useEmployeeGoals = (employeeId: string) => {
  return useQuery({
    queryKey: performanceKeys.goals(employeeId),
    queryFn: () => performanceApi.getEmployeeGoals(employeeId),
    select: (res) => res.data.data,
    enabled: !!employeeId,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Goal>) => performanceApi.createGoal(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: performanceKeys.all });
      toast.success(res.data.message || "Goal created successfully");
    },
  });
};

// ==================== Review Hooks ====================
export const useEmployeeReviews = (employeeId: string) => {
  return useQuery({
    queryKey: performanceKeys.reviews(employeeId),
    queryFn: () => performanceApi.getEmployeeReviews(employeeId),
    select: (res) => res.data.data,
    enabled: !!employeeId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PerformanceReview>) =>
      performanceApi.createReview(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: performanceKeys.all });
      toast.success(res.data.message || "Review submitted successfully");
    },
  });
};

export const useFinalizeReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => performanceApi.finalizeReview(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: performanceKeys.all });
      toast.success("Review finalized and appraisal history updated");
    },
  });
};

// ==================== Appraisal History Hooks ====================
export const useEmployeeAppraisalHistory = (employeeId: string) => {
  return useQuery({
    queryKey: performanceKeys.appraisals(employeeId),
    queryFn: () => performanceApi.getEmployeeAppraisalHistory(employeeId),
    select: (res) => res.data.data,
    enabled: !!employeeId,
  });
};
