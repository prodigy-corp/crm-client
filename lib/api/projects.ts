import apiClient from "../api-client";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED";
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost: number;
  progress: number;
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

export interface ProjectAnalytics {
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  taskStatusBreakdown: { status: string; _count: number }[];
  taskPriorityBreakdown: { priority: string; _count: number }[];
  budget?: number;
  actualCost: number;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ProjectDashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  statusBreakdown: { status: string; _count: number }[];
}

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
  getDashboardStats: () =>
    apiClient.get<{ data: ProjectDashboardStats }>("/projects/dashboard/stats"),
  getProjectAnalytics: (id: string) =>
    apiClient.get<{ data: ProjectAnalytics }>(`/projects/${id}/analytics`),
  getProjectComments: (id: string) =>
    apiClient.get<{ data: ProjectComment[] }>(`/projects/${id}/comments`),
  addProjectComment: (id: string, content: string) =>
    apiClient.post<{ data: ProjectComment }>(`/projects/${id}/comments`, {
      content,
    }),
};
