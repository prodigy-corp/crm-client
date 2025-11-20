"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

// Auth Hooks
export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      // Cookies are automatically set by the backend
      // Invalidate profile query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });

      toast.success(response.data.message || "Login successful!");

      // Handle redirect from backend (for 2FA or email verification)
      if (response.data.redirect) {
        router.push(response.data.redirect as Route);
      } else {
        // Get user data to determine redirect
        const userData = response.data.user || (response.data as any);
        const roles = userData.roles || [];

        // Redirect based on role
        // Admins go to admin dashboard, all others go to unified dashboard
        if (roles.includes('SUPER_ADMIN') || roles.includes('ADMIN')) {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard" as Route);
        }
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      // Cookies are automatically set by the backend
      // Invalidate profile query to refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });

      toast.success(response.data.message || "Registration successful!");

      // Handle redirect from backend
      if (response.data.redirect) {
        router.push(response.data.redirect as Route);
      } else {
        router.push("/admin/dashboard");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Cookies are automatically cleared by the backend
      // Clear query cache
      queryClient.clear();

      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: () => {
      // Even if API call fails, clear local data
      queryClient.clear();
      router.push("/auth/login");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => authApi.getProfile().then(res => res.data),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(["auth", "profile"], response.data);
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to change password");
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      router.push("/auth/login");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
};

// Utility hook to check if user is authenticated
export const useAuth = () => {
  const { data: user, isLoading, error } = useProfile();

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isError: !!error,
  };
};
