import { productivityApi, ProductivityFilter } from "@/lib/api/productivity";
import { useQuery } from "@tanstack/react-query";

export const productivityKeys = {
  all: ["productivity"] as const,
  my: (params?: ProductivityFilter) =>
    [...productivityKeys.all, "my", params] as const,
  overview: () => [...productivityKeys.all, "overview"] as const,
  employee: (id: string, params?: ProductivityFilter) =>
    [...productivityKeys.all, "employee", id, params] as const,
};

export const useMyProductivity = (params?: ProductivityFilter) => {
  return useQuery({
    queryKey: productivityKeys.my(params),
    queryFn: () => productivityApi.getMyProductivity(params),
    select: (data) => data.data,
  });
};

export const useProductivityOverview = () => {
  return useQuery({
    queryKey: productivityKeys.overview(),
    queryFn: () => productivityApi.getOverview(),
    select: (data) => data.data,
  });
};

export const useEmployeeProductivity = (
  id: string,
  params?: ProductivityFilter,
) => {
  return useQuery({
    queryKey: productivityKeys.employee(id, params),
    queryFn: () => productivityApi.getEmployeeProductivity(id, params),
    select: (data) => data.data,
    enabled: !!id,
  });
};
