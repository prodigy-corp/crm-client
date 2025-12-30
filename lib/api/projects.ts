import apiClient from "../api-client";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
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
  description?: string;
  status?: Project["status"];
  startDate?: string;
  endDate?: string;
  clientId?: string;
  managerId?: string;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export const projectsApi = {
  getProjects: () => apiClient.get<Project[]>("/projects"),
  getProject: (id: string) => apiClient.get<Project>(`/projects/${id}`),
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
