"use client";

import { AnnouncementBanner } from "@/components/shared/announcement-banner";
import Header from "@/components/shared/header";
import Notification from "@/components/shared/notification";
import Sidebar from "@/components/shared/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { NotificationProvider } from "@/providers/notification-provider";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Initializing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="fixed flex size-full bg-zinc-50 dark:bg-zinc-950">
          <Sidebar />
          <div className="flex w-full flex-col overflow-hidden">
            <Header />
            <main className="grow overflow-y-auto p-4 md:p-6 lg:p-8">
              <div className="mx-auto max-w-(--breakpoint-2xl) space-y-6">
                <AnnouncementBanner />
                {children}
              </div>
            </main>
            <Notification />
          </div>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
}
