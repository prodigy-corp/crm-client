/**
 * Dashboard Navigation Configuration
 * Defines navigation items with role/permission-based visibility
 */

import { LucideBarChart } from "lucide-react";
import type { IconType } from "react-icons";
import {
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
  title: string;
  href: string;
  icon: IconType;
  description?: string;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  badge?: string;
  disabled?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/**
 * Main dashboard navigation items
 * Items will be filtered based on user roles and permissions
 */
export const dashboardNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LuLayoutDashboard,
    description: "Overview and stats",
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: LuUser,
    description: "Your personal information",
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: LuMessageCircle,
    description: "Chat with others",
  },

  // ==================== EMPLOYEE NAVIGATION ====================
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: LuClock,
    description: "View your attendance records",
    requiredRoles: ["EMPLOYEE"],
    requiredPermissions: ["employee.attendance.read"],
  },
  {
    title: "Salary",
    href: "/dashboard/salary",
    icon: LuDollarSign,
    description: "View salary and payments",
    requiredRoles: ["EMPLOYEE"],
    requiredPermissions: ["employee.salary.read"],
  },

  // ==================== CLIENT NAVIGATION ====================
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: LuBriefcase,
    description: "View your projects",
    requiredRoles: ["CLIENT"],
    requiredPermissions: ["client.projects.read"],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: LuFileText,
    description: "View and manage invoices",
    requiredRoles: ["CLIENT"],
    requiredPermissions: ["client.invoices.read"],
  },

  // ==================== ADMIN NAVIGATION ====================
  {
    title: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: LuLayoutDashboard,
    description: "Admin overview",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.dashboard.view"],
  },
  {
    title: "Users",
    href: "/admin/dashboard/users",
    icon: LuUsers,
    description: "Manage users",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.users.view"],
  },
  {
    title: "Employees",
    href: "/admin/dashboard/employees",
    icon: LuUserCheck,
    description: "Manage employees",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.employees.view"],
  },
  {
    title: "Clients",
    href: "/admin/dashboard/clients",
    icon: LuUserPlus,
    description: "Manage clients",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.clients.view"],
  },
  {
    title: "Departments",
    href: "/admin/dashboard/departments",
    icon: LuBriefcase,
    description: "Manage departments",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.departments.view"],
  },
  {
    title: "Shifts",
    href: "/admin/dashboard/shifts",
    icon: LuClock,
    description: "Manage work shifts",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.shifts.view"],
  },
  {
    title: "Attendance",
    href: "/admin/dashboard/attendance",
    icon: LuClock,
    description: "View and manage all attendance",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.attendance.view"],
  },
  {
    title: "Payroll",
    href: "/admin/dashboard/salary",
    icon: LuDollarSign,
    description: "Manage employee payroll",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.employees.manage"],
  },
  {
    title: "Blogs",
    href: "/admin/dashboard/blogs",
    icon: LuFileText,
    description: "Manage blog posts",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.blog.view"],
  },
  {
    title: "Assets",
    href: "/admin/dashboard/assets",
    icon: LuBriefcase,
    description: "Company asset inventory",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["asset.read"],
  },
  {
    title: "Announcements",
    href: "/admin/dashboard/announcements",
    icon: LuMegaphone,
    description: "Broadcast messages to users",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["announcement.read"],
  },
  {
    title: "CMS",
    href: "/admin/dashboard/cms/site-settings",
    icon: LuSettings,
    description: "Manage site settings",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.cms.settings.view"],
  },
  {
    title: "Roles",
    href: "/admin/dashboard/roles",
    icon: LuShield,
    description: "Manage roles and permissions",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.roles.view"],
  },
  {
    title: "System",
    href: "/admin/dashboard/system",
    icon: LuSettings,
    description: "System health and logs",
    requiredRoles: ["SUPER_ADMIN"],
    requiredPermissions: ["system.health"],
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: LuClock,
    description: "Manage and track tasks",
    requiredPermissions: ["tasks.read"],
  },
  {
    title: "Productivity",
    href: "/dashboard/productivity",
    icon: LucideBarChart,
    description: "Employee productivity overview",
    requiredPermissions: ["admin.dashboard.view"],
  },
  {
    title: "Performance",
    href: "/dashboard/performance",
    icon: LuTrophy,
    description: "KPIs, Goals & Reviews",
    requiredPermissions: ["performance.read"],
  },

  // No items here for now
];
