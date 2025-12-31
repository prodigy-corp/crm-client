"use client";

import type { NavItem } from "@/config/dashboard-navigation";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isValidElement, memo } from "react";

const MenuItem = ({ icon: Icon, title, href }: NavItem) => {
  const pathName = usePathname();
  const url = href || "#";

  const active =
    url === "/dashboard"
      ? pathName === url
      : pathName === url || pathName.startsWith(`${url}/`);

  return (
    <Link
      href={url as Route}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
        {
          "bg-primary font-medium text-primary-foreground shadow-sm shadow-primary/20":
            active,
          "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100":
            !active,
        },
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
          active ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-800",
        )}
      >
        {Icon &&
          (isValidElement(Icon) ? (
            Icon
          ) : (
            // @ts-ignore
            <Icon className="h-4 w-4" />
          ))}
      </div>
      <span className="truncate">{title}</span>
    </Link>
  );
};

export default memo(MenuItem);
