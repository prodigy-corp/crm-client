import { LuMegaphone } from "react-icons/lu";
import { AnnouncementList } from "./_components/announcement-list";

export const metadata = {
  title: "Announcements | Admin Dashboard",
  description: "Manage system-wide broadcast messages",
};

export default function AnnouncementsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Manage and broadcast messages to all users in the system.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Quick Stats or Info Cards could go here */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <LuMegaphone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <h3 className="text-2xl font-bold text-green-600">Active</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnnouncementList />
      </div>
    </div>
  );
}
