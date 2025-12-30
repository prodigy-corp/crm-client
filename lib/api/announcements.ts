import { AxiosResponse } from "axios";
import api from "../api-client";

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
      .get<Announcement[]>("/announcements")
      .then((res: AxiosResponse<Announcement[]>) => res.data),

  getActiveAnnouncements: () =>
    api
      .get<Announcement[]>("/announcements/active")
      .then((res: AxiosResponse<Announcement[]>) => res.data),

  getAnnouncement: (id: string) =>
    api
      .get<Announcement>(`/announcements/${id}`)
      .then((res: AxiosResponse<Announcement>) => res.data),

  createAnnouncement: (data: Partial<Announcement>) =>
    api
      .post<Announcement>("/announcements", data)
      .then((res: AxiosResponse<Announcement>) => res.data),

  updateAnnouncement: (id: string, data: Partial<Announcement>) =>
    api
      .patch<Announcement>(`/announcements/${id}`, data)
      .then((res: AxiosResponse<Announcement>) => res.data),

  deleteAnnouncement: (id: string) =>
    api
      .delete(`/announcements/${id}`)
      .then((res: AxiosResponse<any>) => res.data),
};
