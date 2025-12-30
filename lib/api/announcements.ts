import { AxiosResponse } from "axios";
import api, { ApiResponse } from "../api-client";

export type AnnouncementType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "DANGER"
  | "PRIMARY";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  isActive: boolean;
  expiresAt?: string;
  createdBy?: string;
  creator?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const announcementsApi = {
  getAnnouncements: () =>
    api
      .get<ApiResponse<Announcement[]>>("/announcements")
      .then((res: AxiosResponse<ApiResponse<Announcement[]>>) => res.data),

  getActiveAnnouncements: () =>
    api
      .get<ApiResponse<Announcement[]>>("/announcements/active")
      .then((res: AxiosResponse<ApiResponse<Announcement[]>>) => res.data),

  getAnnouncement: (id: string) =>
    api
      .get<ApiResponse<Announcement>>(`/announcements/${id}`)
      .then((res: AxiosResponse<ApiResponse<Announcement>>) => res.data),

  createAnnouncement: (data: Partial<Announcement>) =>
    api
      .post<ApiResponse<Announcement>>("/announcements", data)
      .then((res: AxiosResponse<ApiResponse<Announcement>>) => res.data),

  updateAnnouncement: (id: string, data: Partial<Announcement>) =>
    api
      .patch<ApiResponse<Announcement>>(`/announcements/${id}`, data)
      .then((res: AxiosResponse<ApiResponse<Announcement>>) => res.data),

  deleteAnnouncement: (id: string) =>
    api
      .delete<ApiResponse<any>>(`/announcements/${id}`)
      .then((res: AxiosResponse<ApiResponse<any>>) => res.data),
};
