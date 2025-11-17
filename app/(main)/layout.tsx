import { getSession } from "@/lib/getSession";
import Navbar from "./_components/navbar";

const MainLayout = async ({ children }: LayoutProps<"/">) => {
  const user = await getSession()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-background">
      <Navbar user={user || null}/>
      {children}
    </div>
  );
};

export default MainLayout;
