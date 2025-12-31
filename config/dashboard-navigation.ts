/**
 * Dashboard Navigation Configuration
 * Defines navigation items with role/permission-based visibility
 */

import { LucideBarChart } from "lucide-react";
import type { IconType } from "react-icons";
import {
  LuActivity,
  LuBriefcase,
  LuClock,
  LuDollarSign,
  LuFileText,
  LuLayoutDashboard,
  LuMegaphone,
  LuMessageCircle,
  LuSettings,
  LuShield,
  LuTrophy,
  LuUser,
  LuUserCheck,
  LuUserPlus,
  LuUsers,
} from "react-icons/lu";

export interface NavItem {
  id: string | number;
  title: string;
  href?: string;
  icon?: IconType | React.ReactNode;
  description?: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  badge?: string;
  disabled?: boolean;
  submenu?: NavItem[];
  baseUrl?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Main dashboard navigation items grouping
 */
export const dashboardNavigation: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        href: "/dashboard",
        icon: LuLayoutDashboard,
        description: "Overview and stats",
      },
      {
        id: "profile",
        title: "Profile",
        href: "/dashboard/profile",
        icon: LuUser,
        description: "Your personal information",
      },
      {
        id: "messages",
        title: "Messages",
        href: "/dashboard/messages",
        icon: LuMessageCircle,
        description: "Chat with others",
      },
    ],
  },
  {
    title: "Work",
    items: [
      {
        id: "attendance",
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: LuClock,
        description: "View your attendance records",
        requiredRoles: ["EMPLOYEE"],
        requiredPermissions: ["employee.attendance.read"],
      },
      {
        id: "salary",
        title: "Salary",
        href: "/dashboard/salary",
        icon: LuDollarSign,
        description: "View salary and payments",
        requiredRoles: ["EMPLOYEE"],
        requiredPermissions: ["employee.salary.read"],
      },
      {
        id: "projects",
        title: "Projects",
        href: "/dashboard/projects",
        icon: LuBriefcase,
        description: "View your projects",
        requiredRoles: ["CLIENT"],
        requiredPermissions: ["client.projects.read"],
      },
      {
        id: "invoices",
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: LuFileText,
        description: "View and manage invoices",
        requiredRoles: ["CLIENT"],
        requiredPermissions: ["client.invoices.read"],
      },
      {
        id: "tasks",
        title: "Tasks",
        href: "/dashboard/tasks",
        icon: LuClock,
        description: "Manage and track tasks",
        requiredPermissions: ["tasks.read"],
      },
      {
        id: "productivity",
        title: "Productivity",
        href: "/dashboard/productivity",
        icon: LucideBarChart,
        description: "Employee productivity overview",
        requiredPermissions: ["admin.dashboard.view"],
      },
      {
        id: "performance",
        title: "Performance",
        href: "/dashboard/performance",
        icon: LuTrophy,
        description: "KPIs, Goals & Reviews",
        requiredPermissions: ["performance.read"],
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        id: "admin-users",
        title: "Users Management",
        href: "/dashboard/admin/users",
        icon: LuUsers,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.users.view"],
      },
      {
        id: "admin-employees",
        title: "Employees Management",
        href: "/dashboard/admin/employees",
        icon: LuUserCheck,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.employees.view"],
      },
      {
        id: "admin-clients",
        title: "Clients Management",
        href: "/dashboard/admin/clients",
        icon: LuUserPlus,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.clients.view"],
      },
      {
        id: "admin-roles",
        title: "Roles & Permissions",
        href: "/dashboard/admin/roles",
        icon: LuShield,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.roles.view"],
      },
    ],
  },
  {
    title: "Organization",
    items: [
      {
        id: "admin-departments",
        title: "Departments",
        href: "/dashboard/admin/departments",
        icon: LuBriefcase,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.departments.view"],
      },
      {
        id: "admin-shifts",
        title: "Shifts",
        href: "/dashboard/admin/shifts",
        icon: LuClock,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.shifts.view"],
      },
      {
        id: "admin-attendance",
        title: "Attendance Control",
        href: "/dashboard/admin/attendance",
        icon: LuClock,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.attendance.view"],
      },
      {
        id: "admin-payroll",
        title: "Payroll Management",
        href: "/dashboard/admin/payroll",
        icon: LuDollarSign,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.employees.manage"],
      },
    ],
  },
  {
    title: "Content Studio",
    items: [
      {
        id: "admin-blogs",
        title: "Blogs Management",
        href: "/dashboard/admin/blogs",
        icon: LuFileText,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.blog.view"],
      },
      {
        id: "admin-cms",
        title: "CMS Settings",
        icon: LuSettings,
        baseUrl: "/dashboard/admin/cms",
        submenu: [
          {
            id: "hero",
            title: "Hero Sections",
            href: "/dashboard/admin/cms/hero-sections",
          },
          {
            id: "banners",
            title: "Banners",
            href: "/dashboard/admin/cms/banners",
          },
          {
            id: "testimonials",
            title: "Testimonials",
            href: "/dashboard/admin/cms/testimonials",
          },
        ],
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["admin.cms.settings.view"],
      },
      {
        id: "admin-announcements",
        title: "Announcements",
        href: "/dashboard/admin/announcements",
        icon: LuMegaphone,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["announcement.read"],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        id: "admin-assets",
        title: "Assets Inventory",
        href: "/dashboard/admin/assets",
        icon: LuBriefcase,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["asset.read"],
      },
      {
        id: "admin-messages",
        title: "Admin Messages",
        href: "/dashboard/admin/messages",
        icon: LuMessageCircle,
        requiredRoles: ["ADMIN", "SUPER_ADMIN"],
        requiredPermissions: ["message.read"],
      },
      {
        id: "admin-system",
        title: "System Health",
        href: "/dashboard/admin/system",
        icon: LuActivity,
        requiredRoles: ["SUPER_ADMIN"],
        requiredPermissions: ["system.health"],
      },
      {
        id: "admin-site-settings",
        title: "Site Settings",
        href: "/dashboard/admin/cms/site-settings",
        icon: LuSettings,
        requiredRoles: ["SUPER_ADMIN"],
        requiredPermissions: ["admin.cms.settings.view"],
      },
      {
        id: "admin-seo",
        title: "SEO Settings",
        href: "/dashboard/admin/cms/seo-settings",
        icon: LuSettings,
        requiredRoles: ["SUPER_ADMIN"],
        requiredPermissions: ["admin.cms.settings.view"],
      },
    ],
  },
];
