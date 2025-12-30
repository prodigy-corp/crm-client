import {
  CreateTaskDto,
  TaskQueryParams,
  tasksApi,
  UpdateTaskDto,
} from "@/lib/api/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: (params?: TaskQueryParams) =>
    [...taskKeys.all, "list", params] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export const useTasks = (params?: TaskQueryParams) => {
  return useQuery({
    queryKey: taskKeys.lists(params),
    queryFn: () => tasksApi.getTasks(params),
    select: (data) => data.data,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getTask(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskDto) => tasksApi.createTask(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success(res.data.message || "Task created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDto }) =>
      tasksApi.updateTask(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id),
      });
      toast.success(res.data.message || "Task updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update task");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success(res.data.message || "Task deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete task");
    },
  });
};
