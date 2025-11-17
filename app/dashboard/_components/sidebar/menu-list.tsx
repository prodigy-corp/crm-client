import { LuLayoutGrid, LuSettings, LuUserRound, LuShield, LuFileText, LuActivity, LuGlobe } from "react-icons/lu";

export const menuList = [
  {
    id: 1,
    title: "Dashboard",
    icon: <LuLayoutGrid className="icon" />,
    url: "/dashboard",
  },
  {
    id: 2,
    title: "Admin Panel",
    icon: <LuShield className="icon" />,
    baseUrl: "/dashboard/admin",
    submenu: [
      {
        id: 1,
        title: "Overview",
        url: "/dashboard/admin",
      },
      {
        id: 2,
        title: "Users Management",
        url: "/dashboard/admin/users",
      },
      {
        id: 3,
        title: "Blogs Management",
        url: "/dashboard/admin/blogs",
      },
      {
        id: 4,
        title: "Roles & Permissions",
        url: "/dashboard/admin/roles",
      },
      {
        id: 5,
        title: "System Health",
        url: "/dashboard/admin/system",
      },
      {
        id: 6,
        title: "Site Settings",
        url: "/dashboard/admin/cms/site-settings",
      },
      {
        id: 7,
        title: "SEO Settings",
        url: "/dashboard/admin/cms/seo-settings",
      },
      {
        id: 8,
        title: "Hero Sections",
        url: "/dashboard/admin/cms/hero-sections",
      },
      {
        id: 9,
        title: "Banners",
        url: "/dashboard/admin/cms/banners",
      },
      {
        id: 10,
        title: "Testimonials",
        url: "/dashboard/admin/cms/testimonials",
      },
    ],
  },
  {
    id: 3,
    title: "Users & Access",
    icon: <LuUserRound className="icon" />,
    baseUrl: "/dashboard/users",
    submenu: [
      {
        id: 1,
        title: "Users",
        url: "/dashboard/users",
      },
      {
        id: 2,
        title: "Roles & Permissions",
        url: "/dashboard/users/roles",
      },
    ],
  },
  {
    id: 4,
    title: "Settings",
    icon: <LuSettings className="icon" />,
    url: "/dashboard/settings",
  },
];
