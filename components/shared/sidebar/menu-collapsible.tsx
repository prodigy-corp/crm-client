"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { NavItem } from "@/config/dashboard-navigation";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

type MenuCollapsibleProps = NavItem & {
  children: React.ReactNode;
};

const MenuCollapsible = ({
  icon: Icon,
  title,
  submenu = [],
  children,
}: MenuCollapsibleProps) => {
  const pathName = usePathname();
  const matchesSubmenu = submenu.some(
    (item) =>
      item.href &&
      (pathName === item.href || pathName.startsWith(`${item.href}/`)),
  );

  const active = matchesSubmenu;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
            {
              "bg-primary font-medium text-primary-foreground shadow-sm shadow-primary/20":
                active && !open,
              "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100":
                !active || open,
            },
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
                active ? "bg-primary/20" : "bg-zinc-100 dark:bg-zinc-800",
              )}
            >
              {typeof Icon === "function" ? <Icon className="h-4 w-4" /> : Icon}
            </div>
            <span className="truncate">{title}</span>
          </div>
          <LuChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 ml-7 space-y-1 border-l border-zinc-200 py-1 pl-4 dark:border-zinc-800">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MenuCollapsible;
