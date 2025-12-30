import apiClient, { ApiResponse, PaginatedResponse } from "../api-client";

// Types based on backend DTOs
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  username?: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
  role?: string;
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  isSellerVerified: boolean;
  isTwoFactorEnabled: boolean;
  blockedUntil?: string;
  emailVerifiedAt?: string;
  stripeCustomerId?: string;
  stripeOnboardingComplete?: boolean;
  roles?: Array<{
    role: {
      name: string;
      description?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  accounts?: Accounts[]
}

export interface Accounts {
  id: string,
  provider: string,
  type: string,
  createdAt: string,
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  username?: string;
  password: string;
  status: string;
  roles: string[];
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  username?: string;
  roles?: string[];
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
}

export interface ChangePasswordDto {
  password: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    recent: number;
  };
  blogs: {
    total: number;
    published: number;
    draft: number;
  };
  comments: {
    total: number;
    pending: number;
    approved: number;
  };
  analytics: {
    totalViews: number;
  };
}

export interface RecentActivities {
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentBlogs: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    author: {
      name: string;
    };
  }>;
  recentComments: Array<{
    id: string;
    content: string;
    status: string;
    createdAt: string;
    blog: {
      title: string;
    };
  }>;
}

export interface AnalyticsData {
  userGrowth: Array<{
    createdAt: Date;
    _count: number;
  }>;
  blogGrowth: Array<{
    createdAt: Date;
    _count: number;
  }>;
  viewsGrowth: Array<{
    createdAt: Date;
    _count: number;
  }>;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;

  // SEO Fields
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];

  // Publishing
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  publishedAt?: string;
  scheduledFor?: string;

  // Author
  authorId: string;
  author?: {
    name: string;
    email: string;
  };

  // Category
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };

  // Tags
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;

  // Analytics
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  readingTime?: number;
  wordCount?: number;

  // Features
  isFeatured: boolean;
  allowComments: boolean;
  isIndexable: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateBlogDto {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  imageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  keywords?: string[];
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  publishedAt?: string;
  scheduledFor?: string;
  categoryId?: string;
  tags?: string[];
  isFeatured?: boolean;
  allowComments?: boolean;
  isIndexable?: boolean;
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> { }

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";
  categoryId?: string;
  authorId?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  database: {
    status: "connected" | "disconnected";
    responseTime: number;
  };
  redis: {
    status: "connected" | "disconnected";
    responseTime: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  uptime: number;
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  userId: string;
  userName: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details?: any;
}

// CMS - Site Settings
export interface SiteSettings {
  id: string;
  siteName: string;
  siteUrl: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  businessHours?: string;
  timezone?: string;
  language?: string;
  currency?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface UpdateSiteSettingsDto {
  siteName?: string;
  siteUrl?: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
  };
  businessHours?: string;
  timezone?: string;
  language?: string;
  currency?: string;
}

// CMS - SEO Settings
export interface SEOSettings {
  id: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robotsDirectives?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
  };
  structuredData?: any;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  facebookAppId?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface UpdateSEOSettingsDto {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  robotsDirectives?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
  };
  structuredData?: any;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  facebookPixelId?: string;
  facebookAppId?: string;
}

// CMS - Content Management
export interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  textAlignment?: "left" | "center" | "right";
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface CreateHeroSectionDto {
  title: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  textAlignment?: "left" | "center" | "right";
  isActive?: boolean;
  displayOrder?: number;
}

export interface UpdateHeroSectionDto {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  textAlignment?: "left" | "center" | "right";
  isActive?: boolean;
  displayOrder?: number;
}

export interface Banner {
  id: string;
  title: string;
  message?: string;
  type: "info" | "warning" | "success" | "error" | "promotion";
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  icon?: string;
  isActive: boolean;
  isDismissible: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface CreateBannerDto {
  title: string;
  message?: string;
  type: "info" | "warning" | "success" | "error" | "promotion";
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  icon?: string;
  isActive?: boolean;
  isDismissible?: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
}

export interface UpdateBannerDto {
  title?: string;
  message?: string;
  type?: "info" | "warning" | "success" | "error" | "promotion";
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  icon?: string;
  isActive?: boolean;
  isDismissible?: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface CreateTestimonialDto {
  name: string;
  position?: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface UpdateTestimonialDto {
  name?: string;
  position?: string;
  company?: string;
  content?: string;
  rating?: number;
  avatar?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
}

export interface ContentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Employees Management Types
export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "RESIGNED";

export interface AdminEmployee {
  id: string;
  employeeCode?: string;
  name: string;
  designation?: string;
  mobileNumber?: string;
  emailAddress?: string;
  joiningDate: string;
  resignDate?: string | null;
  status: EmployeeStatus;
  baseSalary: number;
  photoUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  // User link (for role-based employee management)
  user?: EmployeeUserSummary | null;
  departmentId?: string | null;
  shiftId?: string | null;
  department?: {
    id: string;
    name: string;
  } | null;
  shift?: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  } | null;
}

export interface EmployeeUserSummary {
  id: string;
  name: string;
  email: string;
}

export type EmployeeAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "ON_LEAVE";

export interface EmployeeAttendance {
  id: string;
  employeeId: string;
  date: string;
  checkInAt?: string | null;
  checkOutAt?: string | null;
  workingHours?: number | null;
  status: EmployeeAttendanceStatus;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    employeeCode?: string;
    designation?: string;
  };
}

export interface AdminAttendanceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  status?: EmployeeAttendanceStatus;
}

export type EmployeeSalaryPaymentStatus = "PENDING" | "PAID" | "CANCELLED";

export interface EmployeeSalaryPayment {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  grossSalary: number;
  totalDeduction: number;
  netPayable: number;
  paymentDate?: string | null;
  status: EmployeeSalaryPaymentStatus;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    employeeCode?: string;
    designation?: string;
  };
}

export interface EmployeeSalaryIncrement {
  id: string;
  employeeId: string;
  previousSalary: number;
  newSalary: number;
  incrementAmount: number;
  effectiveFrom: string;
  reason?: string;
  approvedById?: string;
  createdAt: string;
}

export interface AdminEmployeeDetail extends AdminEmployee {
  user?: EmployeeUserSummary | null;
  attendanceRecords?: EmployeeAttendance[];
  salaryIncrements?: EmployeeSalaryIncrement[];
  salaryPayments?: EmployeeSalaryPayment[];
}

export interface AdminEmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmployeeStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface EmployeeAttendanceQueryParams {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  status?: EmployeeAttendanceStatus;
}

export interface EmployeeSalaryPaymentQueryParams {
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
  status?: EmployeeSalaryPaymentStatus;
}

// Employees DTOs
export interface CreateAdminEmployeeDto {
  // Basic
  employeeCode?: string;
  name: string;
  designation?: string;

  // Personal
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  nationalId?: string;
  bloodGroup?: string;

  // Job
  joiningDate: string;
  baseSalary: number;

  // Contact
  mobileNumber?: string;
  alternativeContactNumber?: string;
  corporateContactNumber?: string;
  emailAddress?: string;
  facebookProfileLink?: string;

  // Bank
  bankAccountNumber?: string;
  branchName?: string;
  bankName?: string;

  // Family / Emergency
  fatherContactNumber?: string;
  motherContactNumber?: string;
  emergencyContactNumber?: string;

  // Education – SSC
  sscRoll?: string;
  sscRegistrationNumber?: string;
  sscPassingYear?: number;
  sscBoard?: string;
  sscResult?: string;

  // Education – HSC
  hscRoll?: string;
  hscRegistrationNumber?: string;
  hscPassingYear?: number;
  hscBoard?: string;
  hscResult?: string;

  // Education – Honors/Diploma
  honorsRoll?: string;
  honorsRegistrationNumber?: string;
  honorsPassingYear?: number;
  honorsInstitutionName?: string;
  honorsSubject?: string;
  honorsResult?: string;

  // Status
  status?: EmployeeStatus;

  // User Link (optional, for linking to existing user account)
  userId?: string;
  departmentId?: string;
  shiftId?: string;
}

export interface UpdateAdminEmployeeDto extends Partial<CreateAdminEmployeeDto> {
  resignDate?: string;
  userId?: string;
  departmentId?: string;
  shiftId?: string;
}

export interface ResignEmployeeDto {
  resignDate?: string;
}

export interface EmployeeAttendanceActionDto {
  date?: string;
}

export interface UpsertEmployeeAttendanceDto {
  date: string;
  status: EmployeeAttendanceStatus;
  checkInAt?: string;
  checkOutAt?: string;
  workingHours?: number;
}

export interface CreateEmployeeSalaryIncrementDto {
  newSalary: number;
  effectiveFrom: string;
  reason?: string;
}

export interface CreateEmployeeSalaryPaymentDto {
  month: number;
  year: number;
  basicSalary: number;
  grossSalary: number;
  totalDeduction: number;
  netPayable: number;
  paymentDate?: string;
  status?: EmployeeSalaryPaymentStatus;
}

// ==================== Client Management Types ====================
export type ClientStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ClientType = "INDIVIDUAL" | "BUSINESS" | "ENTERPRISE";

export interface AdminClient {
  id: string;
  userId?: string | null;
  clientCode?: string;
  name: string;
  companyName?: string | null;
  clientType: ClientType;

  // Contact Information
  mobileNumber?: string | null;
  alternativeContactNumber?: string | null;
  emailAddress?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;

  // Business Information
  industry?: string | null;
  website?: string | null;
  taxId?: string | null;
  registrationNumber?: string | null;

  // Contract & Business
  contractStartDate?: string | null;
  contractEndDate?: string | null;
  creditLimit: number;
  outstandingBalance: number;
  notes?: string | null;

  // Status
  status: ClientStatus;
  photoUrl?: string | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // User link (for client portal access)
  user?: ClientUserSummary | null;
}

export interface ClientUserSummary {
  id: string;
  name: string;
  email: string;
}

export interface AdminClientDetail extends AdminClient {
  user?: ClientUserSummary | null;
}

export interface AdminClientQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ClientStatus;
  clientType?: ClientType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Client DTOs
export interface CreateAdminClientDto {
  clientCode?: string;
  name: string;
  companyName?: string;
  clientType?: ClientType;

  // Contact Information
  mobileNumber?: string;
  alternativeContactNumber?: string;
  emailAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Business Information
  industry?: string;
  website?: string;
  taxId?: string;
  registrationNumber?: string;

  // Contract & Business
  contractStartDate?: string;
  contractEndDate?: string;
  creditLimit?: number;
  outstandingBalance?: number;
  notes?: string;

  // Status
  status?: ClientStatus;

  // User Link (optional, for linking to existing user account)
  userId?: string;
}

export interface UpdateAdminClientDto extends Partial<CreateAdminClientDto> {
  userId?: string;
}

export interface ClientStatistics {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  suspendedClients: number;
  individualClients: number;
  businessClients: number;
  enterpriseClients: number;
  totalOutstandingBalance: number;
}

// Admin API Services
export const adminApi = {
  // Dashboard
  getDashboardStats: (): Promise<ApiResponse<DashboardStats>> =>
    apiClient.get("/admin/dashboard/stats").then((res) => res.data),

  getRecentActivities: (): Promise<ApiResponse<RecentActivities>> =>
    apiClient.get("/admin/dashboard/recent-activities").then((res) => res.data),

  getAnalytics: (): Promise<ApiResponse<any>> =>
    apiClient.get("/admin/dashboard/analytics").then((res) => res.data),

  // Users Management
  getUsers: (params?: UserQueryParams): Promise<ApiResponse<PaginatedResponse<AdminUser>>> =>
    apiClient.get("/admin/users", { params }).then((res) => res.data),

  getUserById: (id: string): Promise<ApiResponse<AdminUser>> =>
    apiClient.get(`/admin/users/${id}`).then((res) => res.data),

  createUser: (data: CreateUserDto): Promise<ApiResponse<AdminUser>> =>
    apiClient.post("/admin/users", data).then((res) => res.data),

  updateUser: (id: string, data: UpdateUserDto): Promise<ApiResponse<AdminUser>> =>
    apiClient.put(`/admin/users/${id}`, data).then((res) => res.data),

  deleteUser: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/users/${id}`).then((res) => res.data),

  blockUser: (id: string): Promise<ApiResponse<AdminUser>> =>
    apiClient.put(`/admin/users/${id}/block`).then((res) => res.data),

  unblockUser: (id: string): Promise<ApiResponse<AdminUser>> =>
    apiClient.put(`/admin/users/${id}/unblock`).then((res) => res.data),

  verifyUserEmail: (id: string): Promise<ApiResponse<AdminUser>> =>
    apiClient.put(`/admin/users/${id}/verify-email`).then((res) => res.data),

  changePassword: (id: string, data: ChangePasswordDto): Promise<ApiResponse<any>> =>
    apiClient.put(`/admin/users/${id}/change-password`, data).then((res) => res.data),

  getUserLoginHistory: (id: string): Promise<ApiResponse<any[]>> =>
    apiClient.get(`/admin/users/${id}/login-history`).then((res) => res.data),

  // Employees Management
  getEmployees: (params?: AdminEmployeeQueryParams): Promise<ApiResponse<PaginatedResponse<AdminEmployee>>> =>
    apiClient.get("/admin/employees", { params }).then((res) => res.data),

  getEmployeeById: (id: string): Promise<ApiResponse<AdminEmployeeDetail>> =>
    apiClient.get(`/admin/employees/${id}`).then((res) => res.data),

  createEmployee: (data: CreateAdminEmployeeDto): Promise<ApiResponse<AdminEmployee>> =>
    apiClient.post("/admin/employees", data).then((res) => res.data),

  updateEmployee: (id: string, data: UpdateAdminEmployeeDto): Promise<ApiResponse<AdminEmployee>> =>
    apiClient.put(`/admin/employees/${id}`, data).then((res) => res.data),

  deleteEmployee: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/employees/${id}`).then((res) => res.data),

  resignEmployee: (id: string, data: ResignEmployeeDto): Promise<ApiResponse<AdminEmployee>> =>
    apiClient.put(`/admin/employees/${id}/resign`, data).then((res) => res.data),

  uploadEmployeePhoto: (
    id: string,
    file: File,
  ): Promise<ApiResponse<{ id: string; photoUrl: string; key: string }>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient
      .post<ApiResponse<{ id: string; photoUrl: string; key: string }>>(
        `/admin/employees/${id}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => res.data);
  },

  getEmployeeAttendance: (
    id: string,
    params?: EmployeeAttendanceQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<EmployeeAttendance>>> =>
    apiClient
      .get(`/admin/employees/${id}/attendance`, { params })
      .then((res) => res.data),

  employeeCheckIn: (
    id: string,
    data?: EmployeeAttendanceActionDto,
  ): Promise<ApiResponse<EmployeeAttendance>> =>
    apiClient
      .post(`/admin/employees/${id}/attendance/check-in`, data)
      .then((res) => res.data),

  employeeCheckOut: (
    id: string,
    data?: EmployeeAttendanceActionDto,
  ): Promise<ApiResponse<EmployeeAttendance>> =>
    apiClient
      .post(`/admin/employees/${id}/attendance/check-out`, data)
      .then((res) => res.data),

  upsertEmployeeAttendance: (
    id: string,
    data: UpsertEmployeeAttendanceDto,
  ): Promise<ApiResponse<EmployeeAttendance>> =>
    apiClient
      .put(`/admin/employees/${id}/attendance`, data)
      .then((res) => res.data),

  getAllAttendance: (
    params?: AdminAttendanceQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<EmployeeAttendance>>> =>
    apiClient.get("/admin/attendance", { params }).then((res) => res.data),

  getAllSalaryPayments: (
    params?: EmployeeSalaryPaymentQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<EmployeeSalaryPayment>>> =>
    apiClient
      .get('/admin/employees/salary/payments', { params })
      .then((res) => res.data),

  getEmployeeSalaryPayments: (
    id: string,
    params?: EmployeeSalaryPaymentQueryParams,
  ): Promise<ApiResponse<PaginatedResponse<EmployeeSalaryPayment>>> =>
    apiClient
      .get(`/admin/employees/${id}/salary/payments`, { params })
      .then((res) => res.data),

  createEmployeeSalaryIncrement: (
    id: string,
    data: CreateEmployeeSalaryIncrementDto,
  ): Promise<ApiResponse<EmployeeSalaryIncrement>> =>
    apiClient
      .post(`/admin/employees/${id}/salary/increments`, data)
      .then((res) => res.data),

  createEmployeeSalaryPayment: (
    id: string,
    data: CreateEmployeeSalaryPaymentDto,
  ): Promise<ApiResponse<EmployeeSalaryPayment>> =>
    apiClient
      .post(`/admin/employees/${id}/salary/payments`, data)
      .then((res) => res.data),

  updateEmployeeSalaryPaymentStatus: (
    employeeId: string,
    paymentId: string,
    status: EmployeeSalaryPaymentStatus,
  ): Promise<ApiResponse<EmployeeSalaryPayment>> =>
    apiClient
      .patch(`/admin/employees/${employeeId}/salary/payments/${paymentId}/status`, { status })
      .then((res) => res.data),

  // Clients Management
  getClients: (params?: AdminClientQueryParams): Promise<ApiResponse<PaginatedResponse<AdminClient>>> =>
    apiClient.get("/admin/clients", { params }).then((res) => res.data),

  getClientById: (id: string): Promise<ApiResponse<AdminClientDetail>> =>
    apiClient.get(`/admin/clients/${id}`).then((res) => res.data),

  createClient: (data: CreateAdminClientDto): Promise<ApiResponse<AdminClient>> =>
    apiClient.post("/admin/clients", data).then((res) => res.data),

  updateClient: (id: string, data: UpdateAdminClientDto): Promise<ApiResponse<AdminClient>> =>
    apiClient.patch(`/admin/clients/${id}`, data).then((res) => res.data),

  deleteClient: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/clients/${id}`).then((res) => res.data),

  suspendClient: (id: string): Promise<ApiResponse<AdminClient>> =>
    apiClient.post(`/admin/clients/${id}/suspend`).then((res) => res.data),

  activateClient: (id: string): Promise<ApiResponse<AdminClient>> =>
    apiClient.post(`/admin/clients/${id}/activate`).then((res) => res.data),

  linkClientUser: (id: string, userId: string): Promise<ApiResponse<AdminClient>> =>
    apiClient.post(`/admin/clients/${id}/link-user`, { userId }).then((res) => res.data),

  unlinkClientUser: (id: string): Promise<ApiResponse<AdminClient>> =>
    apiClient.post(`/admin/clients/${id}/unlink-user`).then((res) => res.data),

  getClientStatistics: (): Promise<ApiResponse<ClientStatistics>> =>
    apiClient.get("/admin/clients/statistics").then((res) => res.data),

  // Blogs Management
  getBlogs: (params?: any): Promise<ApiResponse<PaginatedResponse<BlogPost>>> =>
    apiClient.get("/admin/blogs", { params }).then((res) => res.data),

  getBlogById: (id: string): Promise<ApiResponse<BlogPost>> =>
    apiClient.get(`/blog/admin/${id}`).then((res) => res.data),

  createBlog: (data: CreateBlogDto): Promise<ApiResponse<BlogPost>> =>
    apiClient.post("/blog", data).then((res) => res.data),

  updateBlog: (id: string, data: UpdateBlogDto): Promise<ApiResponse<BlogPost>> =>
    apiClient.put(`/blog/${id}`, data).then((res) => res.data),

  updateBlogStatus: (id: string, status: string): Promise<ApiResponse<BlogPost>> =>
    apiClient.put(`/admin/blogs/${id}/status`, { status }).then((res) => res.data),

  deleteBlog: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/blogs/${id}`).then((res) => res.data),

  getBlogAnalytics: (): Promise<ApiResponse<any>> =>
    apiClient.get("/admin/blogs/analytics/overview").then((res) => res.data),

  // Roles Management
  getRoles: (): Promise<ApiResponse<Role[]>> =>
    apiClient.get("/admin/roles").then((res) => res.data),

  getRoleById: (id: string): Promise<ApiResponse<Role>> =>
    apiClient.get(`/admin/roles/${id}`).then((res) => res.data),

  createRole: (data: CreateRoleDto): Promise<ApiResponse<Role>> =>
    apiClient.post("/admin/roles", data).then((res) => res.data),

  updateRole: (id: string, data: UpdateRoleDto): Promise<ApiResponse<Role>> =>
    apiClient.put(`/admin/roles/${id}`, data).then((res) => res.data),

  deleteRole: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/roles/${id}`).then((res) => res.data),

  getAllPermissions: (): Promise<ApiResponse<string[]>> =>
    apiClient.get("/admin/roles/permissions/all").then((res) => res.data),

  // System Management
  getSystemHealth: (): Promise<ApiResponse<SystemHealth>> =>
    apiClient.get("/admin/system/health").then((res) => res.data),

  getSystemLogs: (): Promise<ApiResponse<any[]>> =>
    apiClient.get("/admin/system/logs").then((res) => res.data),

  getAuditLogs: (): Promise<ApiResponse<AuditLog[]>> =>
    apiClient.get("/admin/system/audit-logs").then((res) => res.data),

  clearCache: (): Promise<ApiResponse<void>> =>
    apiClient.post("/admin/system/cache/clear").then((res) => res.data),

  getDatabaseStats: (): Promise<ApiResponse<any>> =>
    apiClient.get("/admin/system/database/stats").then((res) => res.data),

  // CMS - Site Settings
  getSiteSettings: (): Promise<ApiResponse<SiteSettings>> =>
    apiClient.get("/admin/cms/site-settings").then((res) => res.data),

  updateSiteSettings: (data: UpdateSiteSettingsDto): Promise<ApiResponse<SiteSettings>> =>
    apiClient.put("/admin/cms/site-settings", data).then((res) => res.data),

  // CMS - SEO Settings
  getSEOSettings: (): Promise<ApiResponse<SEOSettings>> =>
    apiClient.get("/admin/cms/seo-settings").then((res) => res.data),

  updateSEOSettings: (data: UpdateSEOSettingsDto): Promise<ApiResponse<SEOSettings>> =>
    apiClient.put("/admin/cms/seo-settings", data).then((res) => res.data),

  // CMS - Hero Sections
  getHeroSections: (params?: ContentQueryParams): Promise<ApiResponse<PaginatedResponse<HeroSection>>> =>
    apiClient.get("/admin/cms/hero-sections", { params }).then((res) => res.data),

  getHeroSectionById: (id: string): Promise<ApiResponse<HeroSection>> =>
    apiClient.get(`/admin/cms/hero-sections/${id}`).then((res) => res.data),

  createHeroSection: (data: CreateHeroSectionDto): Promise<ApiResponse<HeroSection>> =>
    apiClient.post("/admin/cms/hero-sections", data).then((res) => res.data),

  updateHeroSection: (id: string, data: UpdateHeroSectionDto): Promise<ApiResponse<HeroSection>> =>
    apiClient.put(`/admin/cms/hero-sections/${id}`, data).then((res) => res.data),

  deleteHeroSection: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/cms/hero-sections/${id}`).then((res) => res.data),

  reorderHeroSections: (ids: string[]): Promise<ApiResponse<void>> =>
    apiClient.put("/admin/cms/hero-sections/reorder", { ids }).then((res) => res.data),

  // CMS - Banners
  getBanners: (params?: ContentQueryParams): Promise<ApiResponse<PaginatedResponse<Banner>>> =>
    apiClient.get("/admin/cms/banners", { params }).then((res) => res.data),

  getBannerById: (id: string): Promise<ApiResponse<Banner>> =>
    apiClient.get(`/admin/cms/banners/${id}`).then((res) => res.data),

  createBanner: (data: CreateBannerDto): Promise<ApiResponse<Banner>> =>
    apiClient.post("/admin/cms/banners", data).then((res) => res.data),

  updateBanner: (id: string, data: UpdateBannerDto): Promise<ApiResponse<Banner>> =>
    apiClient.put(`/admin/cms/banners/${id}`, data).then((res) => res.data),

  deleteBanner: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/cms/banners/${id}`).then((res) => res.data),

  reorderBanners: (ids: string[]): Promise<ApiResponse<void>> =>
    apiClient.put("/admin/cms/banners/reorder", { ids }).then((res) => res.data),

  // CMS - Testimonials
  getTestimonials: (params?: ContentQueryParams): Promise<ApiResponse<PaginatedResponse<Testimonial>>> =>
    apiClient.get("/admin/cms/testimonials", { params }).then((res) => res.data),

  getTestimonialById: (id: string): Promise<ApiResponse<Testimonial>> =>
    apiClient.get(`/admin/cms/testimonials/${id}`).then((res) => res.data),

  createTestimonial: (data: CreateTestimonialDto): Promise<ApiResponse<Testimonial>> =>
    apiClient.post("/admin/cms/testimonials", data).then((res) => res.data),

  updateTestimonial: (id: string, data: UpdateTestimonialDto): Promise<ApiResponse<Testimonial>> =>
    apiClient.put(`/admin/cms/testimonials/${id}`, data).then((res) => res.data),

  deleteTestimonial: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`/admin/cms/testimonials/${id}`).then((res) => res.data),

  reorderTestimonials: (ids: string[]): Promise<ApiResponse<void>> =>
    apiClient.put("/admin/cms/testimonials/reorder", { ids }).then((res) => res.data),

  // Public Content APIs (for frontend)
  getActiveHeroSections: (): Promise<ApiResponse<HeroSection[]>> =>
    apiClient.get("/cms/hero-sections/active").then((res) => res.data),

  getActiveBanners: (): Promise<ApiResponse<Banner[]>> =>
    apiClient.get("/cms/banners/active").then((res) => res.data),

  getActiveTestimonials: (params?: { limit?: number; featured?: boolean }): Promise<ApiResponse<Testimonial[]>> =>
    apiClient.get("/cms/testimonials/active", { params }).then((res) => res.data),
};

// Upload logo
export const uploadLogo = async (file: File): Promise<ApiResponse<{ url: string; key: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<{ url: string; key: string }>>(
    "/admin/cms/upload/logo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Upload favicon
export const uploadFavicon = async (file: File): Promise<ApiResponse<{ url: string; key: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<{ url: string; key: string }>>(
    "/admin/cms/upload/favicon",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Upload SEO image (OG/Twitter)
export const uploadSeoImage = async (file: File): Promise<ApiResponse<{ url: string; key: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<{ url: string; key: string }>>(
    "/admin/cms/upload/seo-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Upload hero background image
export const uploadHeroImage = async (file: File): Promise<ApiResponse<{ url: string; key: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<{ url: string; key: string }>>(
    "/admin/cms/upload/hero-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Upload testimonial avatar
export const uploadTestimonialAvatar = async (file: File): Promise<ApiResponse<{ url: string; key: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<{ url: string; key: string }>>(
    "/admin/cms/upload/testimonial-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// Upload general content image
export const uploadContentImage = async (file: File): Promise<ApiResponse<{ url: string; key: string }>> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<ApiResponse<{ url: string; key: string }>>(
    "/admin/cms/upload/content-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
