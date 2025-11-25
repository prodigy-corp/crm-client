import { getSession } from "@/lib/getSession";
import Navbar from "./_components/navbar";
import { redirect } from "next/navigation";

// Force dynamic rendering to ensure getSession is called on every request
export const dynamic = 'force-dynamic';

const MainLayout = async ({ children }: LayoutProps<"/">) => {
  const user = await getSession()

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-background">
      <Navbar user={user || null} />
      {children}
    </div>
  );
};

export default MainLayout;
