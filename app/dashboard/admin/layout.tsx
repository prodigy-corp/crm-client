"use client";

import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { isAdmin, isSuperAdmin } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
        return;
      }

      if (!isAdmin(user) && !isSuperAdmin(user)) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAuthenticated || (!isAdmin(user) && !isSuperAdmin(user))) {
    return null;
  }

  return <>{children}</>;
}
