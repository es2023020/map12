import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Megaphone, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/announcements")({
  head: () => ({
    meta: [
      { title: "Developer Announcements Feed — Dashboard" },
      {
        name: "description",
        content: "Developer broadcast feed for broker announcements and commission updates.",
      },
    ],
  }),
  component: DashboardAnnouncementsPage,
});

export default function DashboardAnnouncementsPage() {
  return (
    <div className="min-h-screen space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 text-accent border border-accent/30 shadow-md">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">
              Developer Announcements Feed
            </h1>
            <p className="text-sm text-muted-foreground">
              Official updates, inventory releases, &amp; broker incentives.
            </p>
          </div>
        </div>

        <Link
          to="/developer-announcements"
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
        >
          View Full Feed Page
        </Link>
      </div>
    </div>
  );
}
