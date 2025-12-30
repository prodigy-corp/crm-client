import apiClient from "../api-client";

export interface EmployeeProductivity {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  onTimeCompletion: number;
  overdueTasks: number;
  completionRate: number;
  efficiencyRate: number;
  message?: string;
}

export interface GlobalProductivityItem extends EmployeeProductivity {
  employeeId: string;
  name: string;
  photoUrl?: string;
}

export interface ProductivityFilter {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}

export const productivityApi = {
  getMyProductivity: (params?: ProductivityFilter) =>
    apiClient.get<EmployeeProductivity>("/productivity/my", { params }),
  getOverview: () =>
    apiClient.get<GlobalProductivityItem[]>("/productivity/overview"),
  getEmployeeProductivity: (id: string, params?: ProductivityFilter) =>
    apiClient.get<EmployeeProductivity>(`/productivity/employee/${id}`, {
      params,
    }),
};
