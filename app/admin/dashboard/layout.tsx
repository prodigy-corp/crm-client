import type { ReactNode } from "react";
import { getSession } from "@/lib/getSession";
import { redirect } from "next/navigation";

// Force dynamic rendering to ensure getSession is called on every request
export const dynamic = 'force-dynamic';

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getSession();

  if (!user) {
    return redirect("/auth/login");
  }

  const roles = user.roles || [];
  const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");

  if (!isAdmin) {
    return redirect("/admin/dashboard");
  }

  return <>{children}</>;
};

export default AdminLayout;
