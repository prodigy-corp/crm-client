import apiClient, { ApiResponse } from "@/lib/api-client";

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  attachment?: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  sentAt: string;
  isRead: boolean;
  sender?: User;
  receiver?: User;
}

export interface MessageRoom {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
  otherUser?: User;
  messages?: Message[];
  lastMessage?: Message | null;
  unreadCount?: number;
  _count?: {
    messages: number;
  };
}

export interface SidebarResponse {
  status: boolean;
  data: MessageRoom[];
  cursor: string | null;
  hasMore: boolean;
  message: string;
}

export interface RoomResponse {
  status: boolean;
  data: MessageRoom & {
    messages: Message[];
    otherUser: User;
  };
  cursor: string | null;
  hasMore: boolean;
  message: string;
}

export interface UsersResponse {
  status: boolean;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

export interface InitMessagePayload {
  receiverId: string;
  message: string;
}

export interface SendMessagePayload {
  message?: string;
  type?: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
}

// Message API
export const messageApi = {
  // Get sidebar (list of conversations)
  getSidebar: async (params?: {
    search?: string;
    cursor?: string;
    limit?: string;
  }): Promise<ApiResponse<SidebarResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.cursor) queryParams.append("cursor", params.cursor);
    if (params?.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/messages/sidebar${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get available users to start conversation
  getAvailableUsers: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<UsersResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    const queryString = queryParams.toString();
    const url = `/messages/users${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Get single room messages
  getRoom: async (
    roomId: string,
    params?: { cursor?: string; limit?: string },
  ): Promise<ApiResponse<RoomResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append("cursor", params.cursor);
    if (params?.limit) queryParams.append("limit", params.limit);

    const queryString = queryParams.toString();
    const url = `/messages/${roomId}${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Initiate new conversation
  initiateMessage: async (
    payload: InitMessagePayload,
  ): Promise<ApiResponse<{ roomId: string; data: Message | MessageRoom }>> => {
    const response = await apiClient.post("/messages/initiate", payload);
    return response.data;
  },

  // Send message in existing room
  sendMessage: async (
    roomId: string,
    payload: SendMessagePayload,
    files?: File[],
  ): Promise<ApiResponse<Message | Message[]>> => {
    if (files && files.length > 0) {
      const formData = new FormData();
      if (payload.message) formData.append("message", payload.message);
      formData.append("type", payload.type || "IMAGE");
      files.forEach((file) => formData.append("files", file));

      const response = await apiClient.post(
        `/messages/send/${roomId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    }

    const response = await apiClient.post(`/messages/send/${roomId}`, payload);
    return response.data;
  },

  // Mark messages as read
  markAsRead: async (roomId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch(`/messages/${roomId}/read`);
    return response.data;
  },

  // Delete single message
  deleteMessage: async (messageId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/messages/message/${messageId}`);
    return response.data;
  },

  // Delete entire room
  deleteRoom: async (roomId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete(`/messages/${roomId}`);
    return response.data;
  },
};

export default messageApi;
