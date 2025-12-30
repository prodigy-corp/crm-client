import apiClient, { ApiResponse } from "../api-client";

export interface KPI {
  id: string;
  name: string;
  description?: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  period: string;
  status: "ACTIVE" | "ACHIEVED" | "FAILED";
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  weight: number;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  employeeId: string;
}

export interface PerformanceReview {
  id: string;
  rating: number;
  feedback: string;
  strengths?: string;
  improvementAreas?: string;
  reviewDate: string;
  periodStart: string;
  periodEnd: string;
  status: "DRAFT" | "FINALIZED";
  employeeId: string;
  reviewerId: string;
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface AppraisalHistory {
  id: string;
  promotionEligible: boolean;
  salaryIncrementEligible: boolean;
  notes?: string;
  employeeId: string;
  reviewId: string;
  review: PerformanceReview;
  createdAt: string;
}

export const performanceApi = {
  // KPIs
  getEmployeeKPIs: (employeeId: string) =>
    apiClient.get<ApiResponse<KPI[]>>(
      `/performance/kpis/employee/${employeeId}`,
    ),
  createKPI: (data: Partial<KPI>) =>
    apiClient.post<ApiResponse<KPI>>("/performance/kpis", data),
  updateKPI: (id: string, data: Partial<KPI>) =>
    apiClient.patch<ApiResponse<KPI>>(`/performance/kpis/${id}`, data),
  deleteKPI: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/performance/kpis/${id}`),

  // Goals
  getEmployeeGoals: (employeeId: string) =>
    apiClient.get<ApiResponse<Goal[]>>(
      `/performance/goals/employee/${employeeId}`,
    ),
  createGoal: (data: Partial<Goal>) =>
    apiClient.post<ApiResponse<Goal>>("/performance/goals", data),
  updateGoal: (id: string, data: Partial<Goal>) =>
    apiClient.patch<ApiResponse<Goal>>(`/performance/goals/${id}`, data),
  deleteGoal: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/performance/goals/${id}`),

  // Reviews
  getEmployeeReviews: (employeeId: string) =>
    apiClient.get<ApiResponse<PerformanceReview[]>>(
      `/performance/reviews/employee/${employeeId}`,
    ),
  createReview: (data: Partial<PerformanceReview>) =>
    apiClient.post<ApiResponse<PerformanceReview>>(
      "/performance/reviews",
      data,
    ),
  finalizeReview: (id: string) =>
    apiClient.patch<ApiResponse<PerformanceReview>>(
      `/performance/reviews/${id}/finalize`,
    ),

  // Appraisals
  getEmployeeAppraisalHistory: (employeeId: string) =>
    apiClient.get<ApiResponse<AppraisalHistory[]>>(
      `/performance/appraisals/employee/${employeeId}`,
    ),
};
