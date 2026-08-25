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
  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com" || (user as any)?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/30 flex items-center justify-center text-accent shadow-inner">
              <Megaphone className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Will Be Here Soon
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary pt-1">
                Developer Announcements Feed
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Direct Instagram-style broadcast feed from developers with launch alerts and flash broker commission updates.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/60 border border-border text-xs text-muted-foreground flex items-center justify-center gap-2.5">
              <Lock className="h-4 w-4 text-accent shrink-0" />
              <span>Currently restricted to Administrator preview only.</span>
            </div>

            <div className="pt-2 flex justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
