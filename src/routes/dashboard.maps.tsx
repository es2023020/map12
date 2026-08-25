import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Map, Maximize2, Minimize2, ExternalLink, X, Globe, Lock, Sparkles, ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/maps")({
  head: () => ({
    meta: [
      { title: "Field Atlas — Property Atlas" },
      {
        name: "description",
        content: "Interactive field atlas and compound maps library for Property Atlas agents.",
      },
    ],
  }),
  component: MapsPage,
});

export default function MapsPage() {
  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com" || (user as any)?.role === "admin";
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 border border-accent/30 flex items-center justify-center text-accent shadow-inner">
              <Map className="h-10 w-10 animate-pulse" />
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Will Be Here Soon
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary pt-1">
                Interactive Map Coming Soon
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Our interactive field atlas map showing compound coordinates and spatial zones will be available here soon.
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
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">
              Interactive Field Atlas
            </h1>
            <p className="text-sm text-muted-foreground">
              Dynamic maps showing perfect compound coordinates, zones, and kilometer locations
              across the North Coast and Greater Cairo.
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div
        className={`relative rounded-2xl border border-border overflow-hidden shadow-xl bg-card transition-all ${
          isFullscreen ? "fixed inset-4 z-50" : ""
        }`}
        style={{ height: isFullscreen ? "calc(100vh - 2rem)" : "78vh" }}
      >
        {/* Atlas toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground">
              Live Field Atlas — Greater Cairo &amp; North Coast (Satellite Hybrid Layer)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/public/maps.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Full Page
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-primary transition-all"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="rounded-xl border border-border bg-secondary/40 p-1.5 text-muted-foreground hover:text-destructive transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <iframe
          src="/maps.html"
          className="h-full w-full border-0"
          title="Field Atlas — Greater Cairo & North Coast"
          style={{ height: "calc(100% - 44px)" }}
        />
      </div>
    </div>
  );
}
