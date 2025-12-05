"use client";

import { ApiError } from "@/lib/api-client";
import {
  InitMessagePayload,
  messageApi,
  SendMessagePayload,
} from "@/lib/api/messages";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Query keys
export const messageKeys = {
  all: ["messages"] as const,
  sidebar: (search?: string) =>
    [...messageKeys.all, "sidebar", search] as const,
  room: (roomId: string) => [...messageKeys.all, "room", roomId] as const,
  users: (search?: string) => [...messageKeys.all, "users", search] as const,
};

// Get sidebar (conversation list)
export const useMessageSidebar = (search?: string) => {
  return useQuery({
    queryKey: messageKeys.sidebar(search),
    queryFn: () => messageApi.getSidebar({ search, limit: "20" }),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds
  });
};

// Get sidebar with infinite scroll
export const useInfiniteMessageSidebar = (search?: string) => {
  return useInfiniteQuery({
    queryKey: messageKeys.sidebar(search),
    queryFn: ({ pageParam }) =>
      messageApi.getSidebar({ search, cursor: pageParam, limit: "20" }),
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasMore ? lastPage.data?.cursor : undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  });
};

// Get available users
export const useAvailableUsers = (search?: string, enabled = true) => {
  return useQuery({
    queryKey: messageKeys.users(search),
    queryFn: () => messageApi.getAvailableUsers({ search, limit: 20 }),
    enabled,
    staleTime: 1000 * 60, // 1 minute
  });
};

// Get room messages
export const useMessageRoom = (roomId: string, enabled = true) => {
  return useQuery({
    queryKey: messageKeys.room(roomId),
    queryFn: () => messageApi.getRoom(roomId, { limit: "50" }),
    enabled: enabled && !!roomId,
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 5, // Auto-refresh every 5 seconds for real-time feel
  });
};

// Get room messages with infinite scroll
export const useInfiniteMessageRoom = (roomId: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: messageKeys.room(roomId),
    queryFn: ({ pageParam }) =>
      messageApi.getRoom(roomId, { cursor: pageParam, limit: "30" }),
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasMore ? lastPage.data?.cursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: enabled && !!roomId,
    staleTime: 1000 * 10,
  });
};

// Initiate new conversation
export const useInitiateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InitMessagePayload) =>
      messageApi.initiateMessage(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      toast.success("Message sent!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to send message");
    },
  });
};

// Send message
export const useSendMessage = (roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      files,
    }: {
      payload: SendMessagePayload;
      files?: File[];
    }) => messageApi.sendMessage(roomId, payload, files),
    onSuccess: () => {
      // Invalidate room messages and sidebar
      queryClient.invalidateQueries({ queryKey: messageKeys.room(roomId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.sidebar() });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to send message");
    },
  });
};

// Mark messages as read
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => messageApi.markAsRead(roomId),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.sidebar() });
      queryClient.invalidateQueries({ queryKey: messageKeys.room(roomId) });
    },
  });
};

// Delete message
export const useDeleteMessage = (roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messageApi.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.room(roomId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.sidebar() });
      toast.success("Message deleted");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete message");
    },
  });
};

// Delete room
export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomId: string) => messageApi.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      toast.success("Conversation deleted");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete conversation");
    },
  });
};
