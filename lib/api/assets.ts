import { AxiosResponse } from "axios";
import api from "../api-client";

export type AssetStatus =
  | "AVAILABLE"
  | "ASSIGNED"
  | "UNDER_REPAIR"
  | "DAMAGED"
  | "LOST"
  | "DISPOSED";

export type AssetActivityType =
  | "ISSUE"
  | "RETURN"
  | "DAMAGE_REPORT"
  | "REPAIR_START"
  | "REPAIR_COMPLETE"
  | "LOSS_REPORT"
  | "DISPOSAL";

export interface Asset {
  id: string;
  name: string;
  type: string;
  model?: string;
  serialNumber: string;
  purchaseDate?: string;
  value?: number;
  status: AssetStatus;
  notes?: string;
  assignments?: AssetAssignment[];
  history?: AssetHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetAssignment {
  id: string;
  assetId: string;
  employeeId: string;
  assignedAt: string;
  returnedAt?: string;
  condition?: string;
  returnNote?: string;
  isCurrent: boolean;
  asset?: Asset;
  employee?: {
    id: string;
    name: string;
  };
}

export interface AssetHistory {
  id: string;
  assetId: string;
  activityType: AssetActivityType;
  description: string;
  performedBy?: string;
  date: string;
}

export const assetApi = {
  getAssets: () =>
    api.get<{ data: Asset[] }>("/assets").then((res: AxiosResponse<{ data: Asset[] }>) => res.data),

  getAsset: (id: string) =>
    api
      .get<{ data: Asset }>(`/assets/${id}`)
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  createAsset: (data: Partial<Asset>) =>
    api
      .post<{ data: Asset }>("/assets", data)
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  updateAsset: (id: string, data: Partial<Asset>) =>
    api
      .patch<{ data: Asset }>(`/assets/${id}`, data)
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  deleteAsset: (id: string) =>
    api.delete<{ data: Asset }>(`/assets/${id}`).then((res: AxiosResponse<{ data: Asset }>) => res.data),

  assignAsset: (id: string, data: { employeeId: string; condition?: string }) =>
    api
      .post<{ data: Asset }>(`/assets/${id}/assign`, data)
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  returnAsset: (id: string, data: { returnNote?: string }) =>
    api
      .post<{ data: Asset }>(`/assets/${id}/return`, data)
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  reportDamage: (id: string, description: string) =>
    api
      .post<{ data: Asset }>(`/assets/${id}/report-damage`, { description })
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  reportLoss: (id: string, description: string) =>
    api
      .post<{ data: Asset }>(`/assets/${id}/report-loss`, { description })
      .then((res: AxiosResponse<{ data: Asset }>) => res.data),

  getEmployeeAssets: (employeeId: string) =>
    api
      .get<{ data: AssetAssignment[] }>(`/assets/employee/${employeeId}`)
      .then((res: AxiosResponse<{ data: AssetAssignment[] }>) => res.data),
};
