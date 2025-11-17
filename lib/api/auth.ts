import apiClient, { ApiResponse } from "../api-client";

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  redirect?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: string;
  isEmailVerified: boolean;
  isSellerVerified: boolean;
  stripeOnboardingComplete: boolean;
  isTwoFactorEnabled: boolean;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// Auth API Services
export const authApi = {
  // Authentication
  login: (data: LoginDto): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post("/auth/sign-in", data).then((res) => res.data),

  register: (data: RegisterDto): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post("/auth/register", data).then((res) => res.data),

  logout: (): Promise<ApiResponse<void>> =>
    apiClient.post("/auth/logout").then((res) => res.data),

  refreshToken: (data: RefreshTokenDto): Promise<ApiResponse<AuthResponse>> =>
    apiClient.post("/auth/refresh", data).then((res) => res.data),

  // Profile
  getProfile: (): Promise<ApiResponse<UserProfile>> =>
    apiClient.get("/auth/me").then((res) => res.data),

  updateProfile: (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> =>
    apiClient.put("/auth/profile", data).then((res) => res.data),

  // Password
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> =>
    apiClient.put("/auth/change-password", data).then((res) => res.data),

  forgotPassword: (data: { email: string }): Promise<ApiResponse<void>> =>
    apiClient.post("/auth/forgot-password", data).then((res) => res.data),

  resetPassword: (data: { token: string; password: string }): Promise<ApiResponse<void>> =>
    apiClient.post("/auth/reset-password", data).then((res) => res.data),

  // Email Verification
  sendVerificationEmail: (): Promise<ApiResponse<void>> =>
    apiClient.post("/auth/send-verification").then((res) => res.data),

  verifyEmail: (data: { token: string }): Promise<ApiResponse<void>> =>
    apiClient.post("/auth/verify-email", data).then((res) => res.data),
};
