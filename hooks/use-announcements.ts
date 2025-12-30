import { Announcement, announcementsApi } from "@/lib/api/announcements";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (filters: string) =>
    [...announcementKeys.lists(), { filters }] as const,
  details: () => [...announcementKeys.all, "detail"] as const,
  detail: (id: string) => [...announcementKeys.details(), id] as const,
  active: () => [...announcementKeys.all, "active"] as const,
};

export function useAnnouncements() {
  return useQuery({
    queryKey: announcementKeys.lists(),
    queryFn: announcementsApi.getAnnouncements,
  });
}

export function useActiveAnnouncements() {
  return useQuery({
    queryKey: announcementKeys.active(),
    queryFn: announcementsApi.getActiveAnnouncements,
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: announcementKeys.detail(id),
    queryFn: () => announcementsApi.getAnnouncement(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
      toast.success("Announcement broadcasted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create announcement");
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) =>
      announcementsApi.updateAnnouncement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
      queryClient.invalidateQueries({
        queryKey: announcementKeys.detail(variables.id),
      });
      toast.success("Announcement updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update announcement");
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: announcementsApi.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: announcementKeys.all });
      toast.success("Announcement removed");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete announcement");
    },
  });
}
