import { Asset, assetApi } from "@/lib/api/assets";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAssets = () => {
  return useQuery({
    queryKey: ["assets"],
    queryFn: assetApi.getAssets,
    select: (data) => data.data,
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => assetApi.getAsset(id),
    enabled: !!id,
    select: (data) => data.data,
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assetApi.createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create asset");
    },
  });
};

export const useUpdateAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Asset> }) =>
      assetApi.updateAsset(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", variables.id] });
      toast.success("Asset updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update asset");
    },
  });
};

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assetApi.deleteAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      toast.success("Asset deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete asset");
    },
  });
};

export const useAssignAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      employeeId,
      condition,
    }: {
      id: string;
      employeeId: string;
      condition?: string;
    }) => assetApi.assignAsset(id, { employeeId, condition }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", variables.id] });
      toast.success("Asset assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign asset");
    },
  });
};

export const useReturnAsset = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, returnNote }: { id: string; returnNote?: string }) =>
      assetApi.returnAsset(id, { returnNote }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", variables.id] });
      toast.success("Asset returned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to return asset");
    },
  });
};

export const useReportDamage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) =>
      assetApi.reportDamage(id, description),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["assets", variables.id] });
      toast.success("Damage reported successfully");
    },
  });
};

export const useEmployeeAssets = (employeeId: string) => {
  return useQuery({
    queryKey: ["employee-assets", employeeId],
    queryFn: () => assetApi.getEmployeeAssets(employeeId),
    enabled: !!employeeId,
  });
};
