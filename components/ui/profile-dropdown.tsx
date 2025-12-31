"use client";

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
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { useTransition } from "react";
import {
  LuChevronDown,
  LuLayoutGrid,
  LuLogOut,
  LuUserRound,
} from "react-icons/lu";

interface ProfileDropdownProps {
  user?: any | null;
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
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-auto gap-2 p-0 outline-none hover:bg-transparent focus:outline-none",
        )}
      >
        <Avatar className="size-8">
          <AvatarImage src={user.avatar || user.image || ""} alt={user.name} />
          <AvatarFallback className="bg-primary/10 font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-40 truncate text-sm font-medium md:block">
          {user.name}
        </span>
        <LuChevronDown className="size-4 opacity-70" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 border-zinc-200 p-2 shadow-lg dark:border-zinc-800"
      >
        <div className="mb-2 flex items-center gap-3 p-2">
          <Avatar className="size-10 border border-zinc-100 dark:border-zinc-800">
            <AvatarImage
              src={user.avatar || user.image || ""}
              alt={user.name}
            />
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm leading-none font-semibold">{user.name}</p>
            <p className="max-w-[150px] truncate text-[10px] leading-tight text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator className="mx- -2" />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={"/dashboard" as Route}
            className="flex items-center gap-2"
          >
            <LuLayoutGrid className="size-4 opacity-70" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={"/dashboard/profile" as Route}
            className="flex items-center gap-2"
          >
            <LuUserRound className="size-4 opacity-70" aria-hidden="true" />
            <span>Profile Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="mx- -2" />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="cursor-pointer text-rose-600 focus:text-rose-600"
        >
          <LuLogOut className="size-4 opacity-70" aria-hidden="true" />
          <span>{isPending ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
