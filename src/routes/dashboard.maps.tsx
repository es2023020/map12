import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Map,
  Maximize2,
  Minimize2,
  ExternalLink,
  X,
  Globe,
} from "lucide-react";

import { useStore } from "@/lib/store";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dashboard/maps")({
  head: () => ({
    meta: [
      { title: "Field Atlas — PropTrack" },
      {
        name: "description",
        content:
          "Interactive field atlas and compound maps library for PropTrack agents.",
      },
    ],
  }),
  component: MapsPage,
});

export default function MapsPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com";

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center select-none bg-card rounded-2xl border border-border/80 shadow-soft relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-600/5 blur-[80px] pointer-events-none" />
        
        <div className="max-w-md w-full space-y-6 relative z-10">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="h-full w-full rounded-[14px] bg-slate-900 flex items-center justify-center">
              <Lock className="h-5 w-5 text-violet-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-wider text-violet-500 bg-violet-500/10 uppercase">
              <Sparkles className="h-3 w-3 animate-pulse" /> Launching Soon
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-primary tracking-tight">
              Maps Library Under Construction
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Our interactive compound atlas and neighborhood maps are currently undergoing structural layout updates. Check back soon!
            </p>
          </div>

          <div className="pt-3">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/60 text-muted-foreground font-semibold text-xs px-4 py-2 hover:bg-secondary hover:text-primary transition-all shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Workspace
            </a>
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
            <h1 className="text-2xl font-display font-bold text-primary">Interactive Field Atlas</h1>
            <p className="text-sm text-muted-foreground">
              Dynamic maps showing perfect compound coordinates, zones, and kilometer locations across the North Coast and Greater Cairo.
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
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
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

