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
  LuMessageCircle,
  LuSettings,
  LuShield,
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
    title: "Users",
    href: "/admin/users",
    icon: LuUsers,
    description: "Manage users",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.users.view"],
  },
  {
    title: "Employees",
    href: "/admin/employees",
    icon: LuUserCheck,
    description: "Manage employees",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.employees.view"],
  },
  {
    title: "Clients",
    href: "/admin/clients",
    icon: LuUserPlus,
    description: "Manage clients",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.clients.view"],
  },
  {
    title: "Attendance",
    href: "/admin/attendance",
    icon: LuClock,
    description: "View and manage all attendance",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.attendance.view"],
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: LuFileText,
    description: "Manage blog posts",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.blog.view"],
  },
  {
    title: "CMS",
    href: "/admin/cms",
    icon: LuSettings,
    description: "Manage CMS and site settings",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.cms.settings.view"],
  },
  {
    title: "Roles",
    href: "/admin/roles",
    icon: LuShield,
    description: "Manage roles and permissions",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.roles.view"],
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: LucideBarChart,
    description: "View analytics and reports",
    requiredRoles: ["ADMIN", "SUPER_ADMIN"],
    requiredPermissions: ["admin.dashboard.analytics"],
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

  // Settings
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: LuSettings,
    description: "Account settings",
  },
];
