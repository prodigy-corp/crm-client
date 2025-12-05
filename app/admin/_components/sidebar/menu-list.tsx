import {
  LuBriefcase,
  LuFileText,
  LuLayoutGrid,
  LuMessageCircle,
  LuShield,
  LuUserRound,
} from "react-icons/lu";

export const menuList = [
  {
    id: 1,
    title: "Admin Overview",
    icon: <LuLayoutGrid className="icon" />,
    url: "/admin/dashboard",
    baseUrl: "/admin/dashboard",
  },
  {
    id: 2,
    title: "Management",
    icon: <LuUserRound className="icon" />,
    baseUrl: "/admin/management",
    submenu: [
      {
        id: 1,
        title: "Users Management",
        url: "/admin/dashboard/users",
      },
      {
        id: 2,
        title: "Employees Management",
        url: "/admin/dashboard/employees",
        requiredPermission: "admin.employees.view",
      },
      {
        id: 3,
        title: "Clients Management",
        url: "/admin/dashboard/clients",
        requiredPermission: "admin.clients.view",
      },
      {
        id: 4,
        title: "Roles & Permissions",
        url: "/admin/dashboard/roles",
      },
    ],
  },
  {
    id: 3,
    title: "Organization",
    icon: <LuBriefcase className="icon" />,
    baseUrl: "/admin/organization",
    submenu: [
      {
        id: 1,
        title: "Departments",
        url: "/admin/dashboard/departments",
        requiredPermission: "admin.departments.view",
      },
      {
        id: 2,
        title: "Shifts",
        url: "/admin/dashboard/shifts",
        requiredPermission: "admin.shifts.view",
      },
      {
        id: 3,
        title: "Attendance",
        url: "/admin/dashboard/attendance",
        requiredPermission: "admin.attendance.view",
      },
    ],
  },
  {
    id: 4,
    title: "Content Studio",
    icon: <LuFileText className="icon" />,
    baseUrl: "/admin/content",
    submenu: [
      {
        id: 1,
        title: "Blogs Management",
        url: "/admin/dashboard/blogs",
      },
      {
        id: 2,
        title: "Hero Sections",
        url: "/admin/dashboard/cms/hero-sections",
      },
      {
        id: 3,
        title: "Banners",
        url: "/admin/dashboard/cms/banners",
      },
      {
        id: 4,
        title: "Testimonials",
        url: "/admin/dashboard/cms/testimonials",
      },
    ],
  },
  {
    id: 5,
    title: "Messages",
    icon: <LuMessageCircle className="icon" />,
    url: "/admin/dashboard/messages",
    baseUrl: "/admin/dashboard/messages",
    requiredPermission: "message.read",
  },
  {
    id: 6,
    title: "System & Settings",
    icon: <LuShield className="icon" />,
    baseUrl: "/admin/settings",
    submenu: [
      {
        id: 1,
        title: "System Health",
        url: "/admin/dashboard/system",
      },
      {
        id: 2,
        title: "Site Settings",
        url: "/admin/dashboard/cms/site-settings",
      },
      {
        id: 3,
        title: "SEO Settings",
        url: "/admin/dashboard/cms/seo-settings",
      },
    ],
  },
];
