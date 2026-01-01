import {
  CreateProjectDto,
  projectsApi,
  UpdateProjectDto,
} from "@/lib/api/projects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectsApi.getProjects(),
    select: (data) => data.data.data,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getProject(id),
    select: (data) => data.data.data,
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectDto) => projectsApi.createProject(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(res.data.message || "Project created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
      });
      toast.success(res.data.message || "Project updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update project");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      toast.success(res.data.message || "Project deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete project");
    },
  });
};

export const useProjectDashboardStats = () => {
  return useQuery({
    queryKey: [...projectKeys.all, "dashboard-stats"],
    queryFn: () => projectsApi.getDashboardStats(),
    select: (data) => data.data.data,
  });
};

export const useProjectAnalytics = (id: string) => {
  return useQuery({
    queryKey: [...projectKeys.detail(id), "analytics"],
    queryFn: () => projectsApi.getProjectAnalytics(id),
    select: (data) => data.data.data,
    enabled: !!id,
  });
};

export const useProjectComments = (id: string) => {
  return useQuery({
    queryKey: [...projectKeys.detail(id), "comments"],
    queryFn: () => projectsApi.getProjectComments(id),
    select: (data) => data.data.data,
    enabled: !!id,
  });
};

export const useAddProjectComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      projectsApi.addProjectComment(id, content),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...projectKeys.detail(variables.id), "comments"],
      });
      toast.success("Comment added successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add comment");
    },
  });
};
