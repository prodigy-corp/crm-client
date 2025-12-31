import apiClient from "../api-client";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  startDate?: string;
  endDate?: string;
  clientId?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
  manager?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
    companyName?: string;
  };
  _count?: {
    tasks: number;
  };
}

export interface CreateProjectDto {
  name: string;
  description?: string | null;
  status?: Project["status"];
  startDate?: string | null;
  endDate?: string | null;
  clientId?: string | null;
  managerId?: string | null;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export const projectsApi = {
  getProjects: () => apiClient.get<{ data: Project[] }>("/projects"),
  getProject: (id: string) =>
    apiClient.get<{ data: Project }>(`/projects/${id}`),
  createProject: (data: CreateProjectDto) =>
    apiClient.post<{ message: string; data: Project }>("/projects", data),
  updateProject: (id: string, data: UpdateProjectDto) =>
    apiClient.patch<{ message: string; data: Project }>(
      `/projects/${id}`,
      data,
    ),
  deleteProject: (id: string) =>
    apiClient.delete<{ message: string }>(`/projects/${id}` as any),
};
