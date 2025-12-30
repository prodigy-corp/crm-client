import apiClient from "../api-client";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
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

export const tasksApi = {
  getTasks: (params?: TaskQueryParams) =>
    apiClient.get<Task[]>("/tasks", { params }),
  getTask: (id: string) => apiClient.get<Task>(`/tasks/${id}`),
  createTask: (data: CreateTaskDto) =>
    apiClient.post<{ message: string; data: Task }>("/tasks", data),
  updateTask: (id: string, data: UpdateTaskDto) =>
    apiClient.patch<{ message: string; data: Task }>(`/tasks/${id}`, data),
  deleteTask: (id: string) =>
    apiClient.delete<{ message: string }>(`/tasks/${id}` as any),
};
