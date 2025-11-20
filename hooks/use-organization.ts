import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    organizationApi,
    type Department,
    type Shift,
    type CreateDepartmentDto,
    type UpdateDepartmentDto,
    type CreateShiftDto,
    type UpdateShiftDto,
} from '@/lib/api/organization';

// ==================== QUERY KEYS ====================

export const organizationKeys = {
    all: ['organization'] as const,

    departments: () => [...organizationKeys.all, 'departments'] as const,
    department: (id: string) => [...organizationKeys.departments(), id] as const,

    shifts: () => [...organizationKeys.all, 'shifts'] as const,
    shift: (id: string) => [...organizationKeys.shifts(), id] as const,
};

// ==================== DEPARTMENT HOOKS ====================

export const useDepartments = () => {
    return useQuery({
        queryKey: organizationKeys.departments(),
        queryFn: async () => {
            const response = await organizationApi.getDepartments();
            // Handle different response structures
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.data)) return response.data.data;
            // Default to empty array if structure doesn't match
            return [];
        },
    });
};

export const useDepartment = (id: string) => {
    return useQuery({
        queryKey: organizationKeys.department(id),
        queryFn: async () => {
            const response = await organizationApi.getDepartmentById(id);
            return response.data.data;
        },
        enabled: !!id,
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateDepartmentDto) => {
            const response = await organizationApi.createDepartment(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.departments() });
            toast.success('Department created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create department');
        },
    });
};

export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateDepartmentDto }) => {
            const response = await organizationApi.updateDepartment(id, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.departments() });
            queryClient.invalidateQueries({ queryKey: organizationKeys.department(variables.id) });
            toast.success('Department updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update department');
        },
    });
};

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await organizationApi.deleteDepartment(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.departments() });
            toast.success('Department deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete department');
        },
    });
};

// ==================== SHIFT HOOKS ====================

export const useShifts = () => {
    return useQuery({
        queryKey: organizationKeys.shifts(),
        queryFn: async () => {
            const response = await organizationApi.getShifts();
            // Handle different response structures
            if (Array.isArray(response.data)) return response.data;
            if (response.data && Array.isArray(response.data.data)) return response.data.data;
            return [];
        },
    });
};

export const useShift = (id: string) => {
    return useQuery({
        queryKey: organizationKeys.shift(id),
        queryFn: async () => {
            const response = await organizationApi.getShiftById(id);
            return response.data.data;
        },
        enabled: !!id,
    });
};

export const useCreateShift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateShiftDto) => {
            const response = await organizationApi.createShift(data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.shifts() });
            toast.success('Shift created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create shift');
        },
    });
};

export const useUpdateShift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateShiftDto }) => {
            const response = await organizationApi.updateShift(id, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.shifts() });
            queryClient.invalidateQueries({ queryKey: organizationKeys.shift(variables.id) });
            toast.success('Shift updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update shift');
        },
    });
};

export const useDeleteShift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await organizationApi.deleteShift(id);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.shifts() });
            toast.success('Shift deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete shift');
        },
    });
};
