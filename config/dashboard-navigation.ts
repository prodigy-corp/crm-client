/**
 * Dashboard Navigation Configuration
 * Defines navigation items with role/permission-based visibility
 */

import { LuLayoutDashboard, LuUser, LuClock, LuDollarSign, LuBriefcase, LuFileText, LuSettings } from "react-icons/lu";
import type { IconType } from "react-icons";

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
    // Employee-specific navigation
    {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: LuClock,
        description: "View your attendance records",
        requiredRoles: ['EMPLOYEE'],
        requiredPermissions: ['employee.attendance.read'],
    },
    {
        title: "Salary",
        href: "/dashboard/salary",
        icon: LuDollarSign,
        description: "View salary and payments",
        requiredRoles: ['EMPLOYEE'],
        requiredPermissions: ['employee.salary.read'],
    },
    // Client-specific navigation
    {
        title: "Projects",
        href: "/dashboard/projects",
        icon: LuBriefcase,
        description: "View your projects",
        requiredRoles: ['CLIENT'],
        requiredPermissions: ['client.projects.read'],
    },
    {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: LuFileText,
        description: "View and manage invoices",
        requiredRoles: ['CLIENT'],
        requiredPermissions: ['client.invoices.read'],
    },
    // Common settings (all users)
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: LuSettings,
        description: "Account settings",
    },
];

/**
 * Grouped dashboard navigation (alternative layout)
 */
export const dashboardNavigationGrouped: NavGroup[] = [
    {
        title: "General",
        items: [
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
        ],
    },
    {
        title: "Employee",
        items: [
            {
                title: "Attendance",
                href: "/dashboard/attendance",
                icon: LuClock,
                description: "View your attendance records",
                requiredRoles: ['EMPLOYEE'],
            },
            {
                title: "Salary",
                href: "/dashboard/salary",
                icon: LuDollarSign,
                description: "View salary and payments",
                requiredRoles: ['EMPLOYEE'],
            },
        ],
    },
    {
        title: "Client",
        items: [
            {
                title: "Projects",
                href: "/dashboard/projects",
                icon: LuBriefcase,
                description: "View your projects",
                requiredRoles: ['CLIENT'],
            },
            {
                title: "Invoices",
                href: "/dashboard/invoices",
                icon: LuFileText,
                description: "View and manage invoices",
                requiredRoles: ['CLIENT'],
            },
        ],
    },
    {
        title: "Settings",
        items: [
            {
                title: "Settings",
                href: "/dashboard/settings",
                icon: LuSettings,
                description: "Account settings",
            },
        ],
    },
];
