import apiClient, { ApiResponse, PaginatedResponse } from "../api-client";

// Types based on backend DTOs
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
  role?: string;
  emailVerified?: boolean;
  isEmailVerified?: boolean;
  roles?: Array<{
    role: {
      name: string;
      description?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  username?: string;
  password: string;
  role: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  username?: string;
  role?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | "PENDING";
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

export interface UpdateBlogDto extends Partial<CreateBlogDto> {}

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

  getUserLoginHistory: (id: string): Promise<ApiResponse<any[]>> =>
    apiClient.get(`/admin/users/${id}/login-history`).then((res) => res.data),

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
