import axios, { AxiosError, AxiosResponse } from "axios";

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Transform backend response to match frontend expectations
    if (response.data && typeof response.data === "object") {
      // If backend returns { status: true, data: ... }, extract the data
      if (response.data.status === true && response.data.data) {
        return {
          ...response,
          data: {
            data: response.data.data,
            success: true,
            message: response.data.message,
          },
        };
      }
      // If backend returns direct response (like login), wrap it
      if (response.data.status !== undefined) {
        return {
          ...response,
          data: {
            data: response.data,
            success: response.data.status || true,
            message: response.data.message,
          },
        };
      }
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      // if (typeof window !== "undefined") {
      //   localStorage.removeItem("token");
      //   window.location.href = "/auth/login";
      // }
    }

    // Return a consistent error format
    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };

    return Promise.reject(apiError);
  },
);

export default apiClient;
