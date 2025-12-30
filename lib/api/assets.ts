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
    api.get<Asset[]>("/assets").then((res: AxiosResponse<Asset[]>) => res.data),

  getAsset: (id: string) =>
    api
      .get<Asset>(`/assets/${id}`)
      .then((res: AxiosResponse<Asset>) => res.data),

  createAsset: (data: Partial<Asset>) =>
    api
      .post<Asset>("/assets", data)
      .then((res: AxiosResponse<Asset>) => res.data),

  updateAsset: (id: string, data: Partial<Asset>) =>
    api
      .patch<Asset>(`/assets/${id}`, data)
      .then((res: AxiosResponse<Asset>) => res.data),

  deleteAsset: (id: string) =>
    api.delete(`/assets/${id}`).then((res: AxiosResponse<any>) => res.data),

  assignAsset: (id: string, data: { employeeId: string; condition?: string }) =>
    api
      .post(`/assets/${id}/assign`, data)
      .then((res: AxiosResponse<any>) => res.data),

  returnAsset: (id: string, data: { returnNote?: string }) =>
    api
      .post(`/assets/${id}/return`, data)
      .then((res: AxiosResponse<any>) => res.data),

  reportDamage: (id: string, description: string) =>
    api
      .post(`/assets/${id}/report-damage`, { description })
      .then((res: AxiosResponse<any>) => res.data),

  reportLoss: (id: string, description: string) =>
    api
      .post(`/assets/${id}/report-loss`, { description })
      .then((res: AxiosResponse<any>) => res.data),

  getEmployeeAssets: (employeeId: string) =>
    api
      .get<AssetAssignment[]>(`/assets/employee/${employeeId}`)
      .then((res: AxiosResponse<AssetAssignment[]>) => res.data),
};
