import { NotificationProvider } from "@/providers/notification-provider";
import { SidebarProvider } from "@/providers/sidebar-provider";
import Header from "./_components/header";
import Notification from "./_components/notification";
import Sidebar from "./_components/sidebar";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: LayoutProps<"/admin">) => {
  const user = await getSession();
  if (!user) {
    return redirect("/auth/login");
  }
  return (
    <NotificationProvider>
      <SidebarProvider>
        <div className="fixed flex size-full">
          <Sidebar />
          <div className="flex w-full flex-col overflow-hidden">
            <Header />
            <main className="grow overflow-y-auto bg-zinc-50 p-6 dark:bg-background">
              {children}
            </main>
            <Notification />
          </div>
        </div>
      </SidebarProvider>
    </NotificationProvider>
  );
};

export default DashboardLayout;
