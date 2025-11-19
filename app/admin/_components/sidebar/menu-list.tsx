import { LuLayoutGrid, LuSettings, LuUserRound, LuShield, LuFileText } from "react-icons/lu";

export const menuList = [
  {
    id: 1,
    title: "Admin Overview",
    icon: <LuLayoutGrid className="icon" />,
    url: "/admin",
    baseUrl: "/admin",
  },
  {
    id: 2,
    title: "Management",
    icon: <LuUserRound className="icon" />,
    baseUrl: "/admin/dashboard",
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
        title: "Roles & Permissions",
        url: "/admin/dashboard/roles",
      },
    ],
  },
  {
    id: 3,
    title: "Content Studio",
    icon: <LuFileText className="icon" />,
    baseUrl: "/admin/dashboard",
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
    id: 4,
    title: "System & Settings",
    icon: <LuShield className="icon" />,
    baseUrl: "/admin/dashboard",
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
