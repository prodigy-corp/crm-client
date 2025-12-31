import {
  adminApi,
  AdminAttendanceQueryParams,
  AdminClientQueryParams,
  AdminEmployeeQueryParams,
  ChangePasswordDto,
  ContentQueryParams,
  CreateAdminClientDto,
  CreateAdminEmployeeDto,
  CreateBannerDto,
  CreateBlogDto,
  CreateEmployeeSalaryIncrementDto,
  CreateEmployeeSalaryPaymentDto,
  CreateHeroSectionDto,
  CreateRoleDto,
  CreateTestimonialDto,
  CreateUserDto,
  EmployeeAttendanceActionDto,
  EmployeeAttendanceQueryParams,
  EmployeeSalaryPaymentQueryParams,
  ResignEmployeeDto,
  UpdateAdminClientDto,
  UpdateAdminEmployeeDto,
  UpdateBannerDto,
  UpdateBlogDto,
  UpdateHeroSectionDto,
  UpdateRoleDto,
  UpdateSEOSettingsDto,
  UpdateSiteSettingsDto,
  UpdateTestimonialDto,
  UpdateUserDto,
  uploadContentImage,
  uploadFavicon,
  uploadHeroImage,
  uploadLogo,
  uploadSeoImage,
  uploadTestimonialAvatar,
  UpsertEmployeeAttendanceDto,
  UserQueryParams,
} from "@/lib/api/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  dashboardStats: () => [...adminKeys.dashboard(), "stats"] as const,
  recentActivities: () =>
    [...adminKeys.dashboard(), "recent-activities"] as const,
  analytics: () => [...adminKeys.dashboard(), "analytics"] as const,

  users: () => [...adminKeys.all, "users"] as const,
  usersList: (params?: UserQueryParams) =>
    [...adminKeys.users(), "list", params] as const,
  user: (id: string) => [...adminKeys.users(), "detail", id] as const,
  userLoginHistory: (id: string) =>
    [...adminKeys.users(), "login-history", id] as const,

  employees: () => [...adminKeys.all, "employees"] as const,
  employeesList: (params?: AdminEmployeeQueryParams) =>
    [...adminKeys.employees(), "list", params] as const,
  employee: (id: string) => [...adminKeys.employees(), "detail", id] as const,
  employeeAttendance: (id: string, params?: EmployeeAttendanceQueryParams) =>
    [...adminKeys.employee(id), "attendance", params] as const,
  employeeSalaryPayments: (
    id: string,
    params?: EmployeeSalaryPaymentQueryParams,
  ) => [...adminKeys.employee(id), "salary-payments", params] as const,
  allSalaryPayments: (params?: EmployeeSalaryPaymentQueryParams) =>
    [...adminKeys.employees(), "salary-payments", params] as const,
  allAttendance: (params?: AdminAttendanceQueryParams) =>
    [...adminKeys.employees(), "all-attendance", params] as const,

  clients: () => [...adminKeys.all, "clients"] as const,
  clientsList: (params?: AdminClientQueryParams) =>
    [...adminKeys.clients(), "list", params] as const,
  client: (id: string) => [...adminKeys.clients(), "detail", id] as const,
  clientStatistics: () => [...adminKeys.clients(), "statistics"] as const,

  blogs: () => [...adminKeys.all, "blogs"] as const,
  blogsList: (params?: any) => [...adminKeys.blogs(), "list", params] as const,
  blog: (id: string) => [...adminKeys.blogs(), "detail", id] as const,
  blogAnalytics: () => [...adminKeys.blogs(), "analytics"] as const,

  roles: () => [...adminKeys.all, "roles"] as const,
  rolesList: () => [...adminKeys.roles(), "list"] as const,
  role: (id: string) => [...adminKeys.roles(), "detail", id] as const,
  permissions: () => [...adminKeys.roles(), "permissions"] as const,

  system: () => [...adminKeys.all, "system"] as const,
  systemHealth: () => [...adminKeys.system(), "health"] as const,
  systemLogs: () => [...adminKeys.system(), "logs"] as const,
  auditLogs: () => [...adminKeys.system(), "audit-logs"] as const,
  databaseStats: () => [...adminKeys.system(), "database-stats"] as const,

  cms: () => [...adminKeys.all, "cms"] as const,
  siteSettings: () => [...adminKeys.cms(), "site-settings"] as const,
  seoSettings: () => [...adminKeys.cms(), "seo-settings"] as const,

  heroSections: () => [...adminKeys.cms(), "hero-sections"] as const,
  heroSectionsList: (params?: ContentQueryParams) =>
    [...adminKeys.heroSections(), "list", params] as const,
  heroSection: (id: string) =>
    [...adminKeys.heroSections(), "detail", id] as const,

  banners: () => [...adminKeys.cms(), "banners"] as const,
  bannersList: (params?: ContentQueryParams) =>
    [...adminKeys.banners(), "list", params] as const,
  banner: (id: string) => [...adminKeys.banners(), "detail", id] as const,

  testimonials: () => [...adminKeys.cms(), "testimonials"] as const,
  testimonialsList: (params?: ContentQueryParams) =>
    [...adminKeys.testimonials(), "list", params] as const,
  testimonial: (id: string) =>
    [...adminKeys.testimonials(), "detail", id] as const,
};

// Dashboard Hooks
export const useDashboardStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.dashboardStats(),
    queryFn: () => adminApi.getDashboardStats(),
    select: (data) => data.data,
    enabled,
  });
};

export const useRecentActivities = (enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.recentActivities(),
    queryFn: () => adminApi.getRecentActivities(),
    select: (data) => data.data,
    enabled,
  });
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminApi.getAnalytics(),
    select: (data) => data.data,
  });
};

// Users Hooks
export const useUsers = (params?: UserQueryParams) => {
  return useQuery({
    queryKey: adminKeys.usersList(params),
    queryFn: () => adminApi.getUsers(params),
    select: (data) => data.data,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => adminApi.getUserById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Employees Hooks
export const useEmployees = (
  params?: AdminEmployeeQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.employeesList(params),
    queryFn: () => adminApi.getEmployees(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useEmployee = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.employee(id),
    queryFn: () => adminApi.getEmployeeById(id),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminEmployeeDto) => adminApi.createEmployee(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      toast.success(data.message || "Employee created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create employee");
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminEmployeeDto }) =>
      adminApi.updateEmployee(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Employee updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update employee");
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteEmployee(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      toast.success(data.message || "Employee deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete employee");
    },
  });
};

export const useResignEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResignEmployeeDto }) =>
      adminApi.resignEmployee(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Employee marked as resigned");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark employee as resigned");
    },
  });
};

export const useUploadEmployeePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      adminApi.uploadEmployeePhoto(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.employees() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Employee photo updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload employee photo");
    },
  });
};

export const useEmployeeAttendance = (
  id: string,
  params?: EmployeeAttendanceQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.employeeAttendance(id, params),
    queryFn: () => adminApi.getEmployeeAttendance(id, params),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useEmployeeCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data?: EmployeeAttendanceActionDto;
    }) => adminApi.employeeCheckIn(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Employee checked in successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to check in employee");
    },
  });
};

export const useEmployeeCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data?: EmployeeAttendanceActionDto;
    }) => adminApi.employeeCheckOut(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Employee checked out successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to check out employee");
    },
  });
};

export const useUpsertEmployeeAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpsertEmployeeAttendanceDto;
    }) => adminApi.upsertEmployeeAttendance(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Attendance updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update attendance");
    },
  });
};

export const useEmployeeSalaryPayments = (
  id: string,
  params?: EmployeeSalaryPaymentQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.employeeSalaryPayments(id, params),
    queryFn: () => adminApi.getEmployeeSalaryPayments(id, params),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useAllSalaryPayments = (
  params?: EmployeeSalaryPaymentQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.allSalaryPayments(params),
    queryFn: () => adminApi.getAllSalaryPayments(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useAllAttendance = (
  params?: AdminAttendanceQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.allAttendance(params),
    queryFn: () => adminApi.getAllAttendance(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useCreateEmployeeSalaryIncrement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CreateEmployeeSalaryIncrementDto;
    }) => adminApi.createEmployeeSalaryIncrement(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Salary increment created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create salary increment");
    },
  });
};

export const useCreateEmployeeSalaryPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CreateEmployeeSalaryPaymentDto;
    }) => adminApi.createEmployeeSalaryPayment(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.employeeSalaryPayments(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.id),
      });
      toast.success(data.message || "Salary payment created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create salary payment");
    },
  });
};

export const useUpdateEmployeeSalaryPaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      paymentId,
      status,
    }: {
      employeeId: string;
      paymentId: string;
      status: "PENDING" | "PAID" | "CANCELLED";
    }) =>
      adminApi.updateEmployeeSalaryPaymentStatus(employeeId, paymentId, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminKeys.employeeSalaryPayments(variables.employeeId),
      });
      queryClient.invalidateQueries({
        queryKey: adminKeys.employee(variables.employeeId),
      });
      toast.success(
        data.message || "Salary payment status updated successfully",
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update salary payment status");
    },
  });
};

// ==================== Clients Hooks ====================
export const useClients = (
  params?: AdminClientQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.clientsList(params),
    queryFn: () => adminApi.getClients(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useClient = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.client(id),
    queryFn: () => adminApi.getClientById(id),
    select: (data) => data.data,
    enabled: !!id && enabled,
  });
};

export const useClientStatistics = () => {
  return useQuery({
    queryKey: adminKeys.clientStatistics(),
    queryFn: () => adminApi.getClientStatistics(),
    select: (data) => data.data,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminClientDto) => adminApi.createClient(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: adminKeys.clientStatistics() });
      toast.success(data.message || "Client created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create client");
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminClientDto }) =>
      adminApi.updateClient(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.client(variables.id),
      });
      toast.success(data.message || "Client updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update client");
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteClient(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: adminKeys.clientStatistics() });
      toast.success(data.message || "Client deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete client");
    },
  });
};

export const useSuspendClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.suspendClient(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: adminKeys.client(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.clientStatistics() });
      toast.success(data.message || "Client suspended successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to suspend client");
    },
  });
};

export const useActivateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.activateClient(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: adminKeys.client(id) });
      queryClient.invalidateQueries({ queryKey: adminKeys.clientStatistics() });
      toast.success(data.message || "Client activated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to activate client");
    },
  });
};

export const useLinkClientUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      adminApi.linkClientUser(id, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.client(variables.id),
      });
      toast.success(data.message || "User account linked successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to link user account");
    },
  });
};

export const useUnlinkClientUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.unlinkClientUser(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.clients() });
      queryClient.invalidateQueries({ queryKey: adminKeys.client(id) });
      toast.success(data.message || "User account unlinked successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to unlink user account");
    },
  });
};

export const useUserLoginHistory = (id: string) => {
  return useQuery({
    queryKey: adminKeys.userLoginHistory(id),
    queryFn: () => adminApi.getUserLoginHistory(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => adminApi.createUser(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStats() });
      toast.success(data.message || "User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      adminApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.id) });
      toast.success(data.message || "User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStats() });
      toast.success(data.message || "User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.blockUser(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      toast.success(data.message || "User blocked successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to block user");
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.unblockUser(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      toast.success(data.message || "User unblocked successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to unblock user");
    },
  });
};

export const useVerifyUserEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.verifyUserEmail(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(id) });
      toast.success(data.message || "User email verified successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify user email");
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangePasswordDto }) =>
      adminApi.changePassword(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.id) });
      toast.success(data.message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to change password");
    },
  });
};

// Blogs Hooks
export const useBlogs = (params?: any, enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.blogsList(params),
    queryFn: () => adminApi.getBlogs(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useBlog = (id: string) => {
  return useQuery({
    queryKey: adminKeys.blog(id),
    queryFn: () => adminApi.getBlogById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useBlogAnalytics = (enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.blogAnalytics(),
    queryFn: () => adminApi.getBlogAnalytics(),
    select: (data) => data.data,
    enabled,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogDto) => adminApi.createBlog(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.blogs() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStats() });
      toast.success(data.message || "Blog created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create blog");
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlogDto }) =>
      adminApi.updateBlog(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.blogs() });
      queryClient.invalidateQueries({ queryKey: adminKeys.blog(variables.id) });
      toast.success(data.message || "Blog updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update blog");
    },
  });
};

export const useUpdateBlogStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateBlogStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.blogs() });
      queryClient.invalidateQueries({ queryKey: adminKeys.blog(variables.id) });
      toast.success(data.message || "Blog status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update blog status");
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBlog(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.blogs() });
      queryClient.invalidateQueries({ queryKey: adminKeys.dashboardStats() });
      toast.success(data.message || "Blog deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete blog");
    },
  });
};

// Roles Hooks
export const useRoles = () => {
  return useQuery({
    queryKey: adminKeys.rolesList(),
    queryFn: () => adminApi.getRoles(),
    select: (data) => data.data,
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: adminKeys.role(id),
    queryFn: () => adminApi.getRoleById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: adminKeys.permissions(),
    queryFn: () => adminApi.getAllPermissions(),
    select: (data) => data.data,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => adminApi.createRole(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      toast.success(data.message || "Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create role");
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleDto }) =>
      adminApi.updateRole(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      queryClient.invalidateQueries({ queryKey: adminKeys.role(variables.id) });
      toast.success(data.message || "Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update role");
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteRole(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.roles() });
      toast.success(data.message || "Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete role");
    },
  });
};

// System Hooks
export const useSystemHealth = () => {
  return useQuery({
    queryKey: adminKeys.systemHealth(),
    queryFn: () => adminApi.getSystemHealth(),
    select: (data) => data.data,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useSystemLogs = () => {
  return useQuery({
    queryKey: adminKeys.systemLogs(),
    queryFn: () => adminApi.getSystemLogs(),
    select: (data) => data.data,
  });
};

export const useAuditLogs = () => {
  return useQuery({
    queryKey: adminKeys.auditLogs(),
    queryFn: () => adminApi.getAuditLogs(),
    select: (data) => data.data,
  });
};

export const useDatabaseStats = () => {
  return useQuery({
    queryKey: adminKeys.databaseStats(),
    queryFn: () => adminApi.getDatabaseStats(),
    select: (data) => data.data,
  });
};

export const useClearCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminApi.clearCache(),
    onSuccess: (data) => {
      toast.success(data.message || "Cache cleared successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to clear cache");
    },
  });
};

// CMS - Site Settings Hooks
export const useSiteSettings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: adminKeys.siteSettings(),
    queryFn: () => adminApi.getSiteSettings(),
    select: (data) => data.data,
    enabled,
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSiteSettingsDto) =>
      adminApi.updateSiteSettings(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.siteSettings() });
      toast.success(data.message || "Site settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update site settings");
    },
  });
};

// CMS - SEO Settings Hooks
export const useSEOSettings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["seo-settings"],
    queryFn: () => adminApi.getSEOSettings(),
    enabled,
  });
};

export const useUpdateSEOSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSEOSettingsDto) =>
      adminApi.updateSEOSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-settings"] });
      toast.success("SEO settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update SEO settings");
    },
  });
};

// CMS - File Upload Hooks
export const useUploadLogo = () => {
  return useMutation({
    mutationFn: (file: File) => uploadLogo(file),
    onSuccess: () => {
      toast.success("Logo uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload logo");
    },
  });
};

export const useUploadFavicon = () => {
  return useMutation({
    mutationFn: (file: File) => uploadFavicon(file),
    onSuccess: () => {
      toast.success("Favicon uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload favicon");
    },
  });
};

export const useUploadSeoImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadSeoImage(file),
    onSuccess: () => {
      toast.success("SEO image uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload SEO image");
    },
  });
};

export const useUploadHeroImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadHeroImage(file),
    onSuccess: () => {
      toast.success("Hero image uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload hero image");
    },
  });
};

export const useUploadTestimonialAvatar = () => {
  return useMutation({
    mutationFn: (file: File) => uploadTestimonialAvatar(file),
    onSuccess: () => {
      toast.success("Avatar uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload avatar");
    },
  });
};

export const useUploadContentImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadContentImage(file),
    onSuccess: () => {
      toast.success("Image uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to upload image");
    },
  });
};

// CMS - Hero Sections Hooks
export const useHeroSections = (
  params?: ContentQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.heroSectionsList(params),
    queryFn: () => adminApi.getHeroSections(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useHeroSection = (id: string) => {
  return useQuery({
    queryKey: adminKeys.heroSection(id),
    queryFn: () => adminApi.getHeroSectionById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHeroSectionDto) =>
      adminApi.createHeroSection(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.heroSections() });
      toast.success(data.message || "Hero section created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create hero section");
    },
  });
};

export const useUpdateHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHeroSectionDto }) =>
      adminApi.updateHeroSection(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.heroSections() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.heroSection(variables.id),
      });
      toast.success(data.message || "Hero section updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update hero section");
    },
  });
};

export const useDeleteHeroSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteHeroSection(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.heroSections() });
      toast.success(data.message || "Hero section deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete hero section");
    },
  });
};

export const useReorderHeroSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminApi.reorderHeroSections(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.heroSections() });
      toast.success(data.message || "Hero sections reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder hero sections");
    },
  });
};

// CMS - Banners Hooks
export const useBanners = (
  params?: ContentQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.bannersList(params),
    queryFn: () => adminApi.getBanners(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useBanner = (id: string) => {
  return useQuery({
    queryKey: adminKeys.banner(id),
    queryFn: () => adminApi.getBannerById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerDto) => adminApi.createBanner(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      toast.success(data.message || "Banner created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create banner");
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerDto }) =>
      adminApi.updateBanner(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.banner(variables.id),
      });
      toast.success(data.message || "Banner updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update banner");
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteBanner(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      toast.success(data.message || "Banner deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete banner");
    },
  });
};

export const useReorderBanners = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminApi.reorderBanners(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.banners() });
      toast.success(data.message || "Banners reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder banners");
    },
  });
};

// CMS - Testimonials Hooks
export const useTestimonials = (
  params?: ContentQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: adminKeys.testimonialsList(params),
    queryFn: () => adminApi.getTestimonials(params),
    select: (data) => data.data,
    enabled,
  });
};

export const useTestimonial = (id: string) => {
  return useQuery({
    queryKey: adminKeys.testimonial(id),
    queryFn: () => adminApi.getTestimonialById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTestimonialDto) =>
      adminApi.createTestimonial(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.testimonials() });
      toast.success(data.message || "Testimonial created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create testimonial");
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTestimonialDto }) =>
      adminApi.updateTestimonial(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.testimonials() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.testimonial(variables.id),
      });
      toast.success(data.message || "Testimonial updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update testimonial");
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteTestimonial(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.testimonials() });
      toast.success(data.message || "Testimonial deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete testimonial");
    },
  });
};

export const useReorderTestimonials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => adminApi.reorderTestimonials(ids),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.testimonials() });
      toast.success(data.message || "Testimonials reordered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder testimonials");
    },
  });
};

// Public Content Hooks (for frontend)
export const useActiveHeroSections = () => {
  return useQuery({
    queryKey: ["public", "hero-sections", "active"],
    queryFn: () => adminApi.getActiveHeroSections(),
    select: (data) => data.data,
  });
};

export const useActiveBanners = () => {
  return useQuery({
    queryKey: ["public", "banners", "active"],
    queryFn: () => adminApi.getActiveBanners(),
    select: (data) => data.data,
  });
};

export const useActiveTestimonials = (params?: {
  limit?: number;
  featured?: boolean;
}) => {
  return useQuery({
    queryKey: ["public", "testimonials", "active", params],
    queryFn: () => adminApi.getActiveTestimonials(params),
    select: (data) => data.data,
  });
};
