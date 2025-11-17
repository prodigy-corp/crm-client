"use client";

import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = "/login",
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo as any);
        return;
      }

      if (
        allowedRoles.length > 0 &&
        user &&
        !allowedRoles.some(role => user.roles.includes(role))
      ) {
        router.push("/unauthorized" as any);
        return;
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireAuth,
    allowedRoles,
    router,
    redirectTo,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Spinner className="mx-auto mb-4 h-8 w-8" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.some(role => user.roles.includes(role))) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
