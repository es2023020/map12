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

