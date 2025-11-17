"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  LuChevronDown,
  LuLayoutGrid,
  LuLogOut,
  LuSettings,
  LuUserRound,
} from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { logout } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/getSession";
import { cn } from "@/lib/utils";
import { Route } from "next";

interface ProfileDropdownProps {
  user?: SessionUser | null;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  // If no user, show login button
  if (!user) {
    return (
      <Link
        href={"/auth/login" as Route}
        className={cn(buttonVariants({ variant: "default", size: "sm" }))}
      >
        Login
      </Link>
    );
  }

  // Get user initials for avatar fallback
  const initials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const isAdmin = user.roles?.includes("ADMIN");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-auto gap-2 p-0 hover:bg-transparent",
        )}
      >
        <Avatar className="size-8">
          <AvatarImage src={user.avatar || ""} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="max-w-40 truncate text-sm font-medium">
          {user.name}
        </span>
        <LuChevronDown className="size-4 opacity-70" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="size-10">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href={"/dashboard" as Route}>
              <LuLayoutGrid className="size-4 opacity-70" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}` as Route}>
            <LuUserRound className="size-4 opacity-70" aria-hidden="true" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/dashboard/settings" as Route}>
            <LuSettings className="size-4 opacity-70" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          <LuLogOut className="size-4 opacity-70" aria-hidden="true" />
          <span>{isPending ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
