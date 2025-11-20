import { employeeApi, type EmployeeAttendance } from "@/lib/api/employee";
import type { ApiResponse } from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const employeeKeys = {
    all: ["employee"] as const,
    profile: () => [...employeeKeys.all, "profile"] as const,
    attendance: () => [...employeeKeys.all, "attendance"] as const,
    attendanceToday: () => [...employeeKeys.attendance(), "today"] as const,
    attendanceStatistics: () => [...employeeKeys.attendance(), "statistics"] as const,
    salary: () => [...employeeKeys.all, "salary"] as const,
    salaryPayments: (params?: any) => [...employeeKeys.salary(), "payments", params] as const,
    salaryIncrements: () => [...employeeKeys.salary(), "increments"] as const,
};

/**
 * Hook to get today's attendance status
 */
export const useTodayAttendance = () => {
    return useQuery<ApiResponse<EmployeeAttendance | null>, Error, EmployeeAttendance | null>({
        queryKey: employeeKeys.attendanceToday(),
        queryFn: async () => {
            const response = await employeeApi.getTodayAttendance();
            return response.data;
        },
        select: (data) => data.data,
        refetchInterval: 60000, // Refetch every minute
    });
};

/**
 * Hook to check in
 */
export const useCheckIn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await employeeApi.checkIn();
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.attendanceToday() });
            queryClient.invalidateQueries({ queryKey: employeeKeys.attendance() });
            toast.success("Checked in successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to check in");
        },
    });
};

/**
 * Hook to check out
 */
export const useCheckOut = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await employeeApi.checkOut();
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: employeeKeys.attendanceToday() });
            queryClient.invalidateQueries({ queryKey: employeeKeys.attendance() });
            toast.success("Checked out successfully!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to check out");
        },
    });
};

/**
 * Hook to get attendance statistics
 */
export const useAttendanceStatistics = () => {
    return useQuery({
        queryKey: employeeKeys.attendanceStatistics(),
        queryFn: async () => {
            const response = await employeeApi.getAttendanceStatistics();
            return response.data;
        },
    });
};
