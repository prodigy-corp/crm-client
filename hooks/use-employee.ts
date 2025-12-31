"use client";

import { ApiError } from "@/lib/api-client";
import { employeeApi } from "@/lib/api/employee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const employeeKeys = {
  all: ["employee"] as const,
  profile: () => [...employeeKeys.all, "profile"] as const,
  attendance: () => [...employeeKeys.all, "attendance"] as const,
  attendanceList: (params?: Record<string, any>) =>
    [...employeeKeys.attendance(), "list", params] as const,
  attendanceToday: () => [...employeeKeys.attendance(), "today"] as const,
  attendanceStats: () => [...employeeKeys.attendance(), "stats"] as const,
  salary: () => [...employeeKeys.all, "salary"] as const,
  salaryPayments: (params?: Record<string, any>) =>
    [...employeeKeys.salary(), "payments", params] as const,
  salaryIncrements: () => [...employeeKeys.salary(), "increments"] as const,
};

// Profile Hooks
export const useEmployeeProfile = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: employeeKeys.profile(),
    queryFn: () => employeeApi.getProfile().then((res) => res.data),
    enabled: options?.enabled !== undefined ? options.enabled : true,
  });
};

export const useUpdateEmployeeProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.profile() });
      toast.success("Profile updated successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useUploadEmployeePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.profile() });
      toast.success("Photo uploaded successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to upload photo");
    },
  });
};

// Attendance Hooks
export const useEmployeeAttendance = (params?: {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: employeeKeys.attendanceList(params),
    queryFn: () =>
      employeeApi.getAttendance(params).then((res) => res.data.data),
  });
};

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: employeeKeys.attendanceToday(),
    queryFn: () => employeeApi.getTodayAttendance().then((res) => res.data),
  });
};

export const useAttendanceStatistics = () => {
  return useQuery({
    queryKey: employeeKeys.attendanceStats(),
    queryFn: () =>
      employeeApi.getAttendanceStatistics().then((res) => res.data),
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date?: string) => employeeApi.checkIn(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.attendance() });
      toast.success("Checked in successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to check in");
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (date?: string) => employeeApi.checkOut(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.attendance() });
      toast.success("Checked out successfully");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to check out");
    },
  });
};

// Salary Hooks
export const useEmployeeSalaryPayments = (params?: {
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
}) => {
  return useQuery({
    queryKey: employeeKeys.salaryPayments(params),
    queryFn: () =>
      employeeApi.getSalaryPayments(params).then((res) => res.data),
  });
};

export const useEmployeeSalaryIncrements = () => {
  return useQuery({
    queryKey: employeeKeys.salaryIncrements(),
    queryFn: () => employeeApi.getSalaryIncrements().then((res) => res.data),
  });
};
