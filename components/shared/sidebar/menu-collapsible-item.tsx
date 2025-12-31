"use client";

import type { NavItem } from "@/config/dashboard-navigation";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuCollapsibleItem = ({ title, href }: NavItem) => {
  const pathName = usePathname();
  const url = href || "#";
  const active = pathName === url || pathName.startsWith(`${url}/`);

  return (
    <Link
      href={url as Route}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all",
        {
          "bg-zinc-100 font-medium text-primary dark:bg-zinc-800": active,
          "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100":
            !active,
        },
      )}
    >
      <span className="truncate">{title}</span>
    </Link>
  );
};

export default MenuCollapsibleItem;
