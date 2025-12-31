"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/sidebar-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { LuLogOut, LuX } from "react-icons/lu";
import SidebarMenu from "./menu";

const Sidebar = () => {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const { user } = useAuth();
  const path = usePathname();

  // Hide sidebar on mobile when route changes
  useLayoutEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [path, isMobile, setOpenMobile]);

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent">
          CRM Dashboard
        </span>
      </div>

      <SidebarMenu />

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
            {userInitials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {user?.name}
            </p>
            <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
              {user?.email}
            </p>
          </div>
        </div>
        <Link
          href="/auth/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 w-full justify-start gap-2 text-xs",
          )}
        >
          <LuLogOut className="h-3.5 w-3.5" />
          Logout
        </Link>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent className="h-[96%]">
          <DrawerHeader className="border-b px-6">
            <div className="flex w-full items-center justify-between">
              <DrawerTitle className="text-xl font-bold">Menu</DrawerTitle>
              <DrawerClose
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                <LuX />
              </DrawerClose>
            </div>
            <DrawerDescription className="sr-only">
              Mobile sidebar navigation
            </DrawerDescription>
          </DrawerHeader>
          <SidebarMenu />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <aside
      className={cn(
        "hidden w-72 shrink-0 flex-col border-r bg-card transition-[margin] duration-300 md:flex",
        {
          "-ml-72": state === "collapsed",
        },
      )}
    >
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
