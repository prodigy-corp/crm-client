"use client";

import ProfileDropdown from "@/components/ui/profile-dropdown";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { useAuth } from "@/hooks/use-auth";
import NotificationToggle from "./notification-toggle";
import SidebarToggle from "./sidebar-toggle";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-2">
        <SidebarToggle />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <NotificationToggle />
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
