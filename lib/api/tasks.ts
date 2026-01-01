import apiClient from "../api-client";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  estimatedHours?: number;
  projectId?: string;
  assigneeId?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
  };
  assignee?: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    name: string;
  };
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  dueDate?: string;
  projectId?: string;
  assigneeId?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface TaskQueryParams {
  projectId?: string;
  assigneeId?: string;
  status?: Task["status"];
}

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  priorityBreakdown: { priority: string; _count: number }[];
  completionRate: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface TaskTimeLog {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description?: string;
  logDate: string;
  user: {
    id: string;
    name: string;
  };
}

export const tasksApi = {
  getTasks: (params?: TaskQueryParams) =>
    apiClient.get<{ data: Task[] }>("/tasks", { params }),
  getTask: (id: string) => apiClient.get<{ data: Task }>(`/tasks/${id}`),
  createTask: (data: CreateTaskDto) =>
    apiClient.post<{ message: string; data: Task }>("/tasks", data),
  updateTask: (id: string, data: UpdateTaskDto) =>
    apiClient.patch<{ message: string; data: Task }>(`/tasks/${id}`, data),
  deleteTask: (id: string) =>
    apiClient.delete<{ message: string }>(`/tasks/${id}` as any),
  getTaskAnalytics: (params?: TaskQueryParams) =>
    apiClient.get<{ data: TaskAnalytics }>("/tasks/analytics/summary", {
      params,
    }),
  getTaskComments: (id: string) =>
    apiClient.get<{ data: TaskComment[] }>(`/tasks/${id}/comments`),
  addTaskComment: (id: string, content: string) =>
    apiClient.post<{ data: TaskComment }>(`/tasks/${id}/comments`, { content }),
  getTaskTimeLogs: (id: string) =>
    apiClient.get<{ data: TaskTimeLog[] }>(`/tasks/${id}/time-logs`),
  addTaskTimeLog: (
    id: string,
    data: { hours: number; description?: string; logDate?: string },
  ) => apiClient.post<{ data: TaskTimeLog }>(`/tasks/${id}/time-logs`, data),
};
