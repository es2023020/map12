import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { developers } from "@/data/developers";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "Developers — PropTrack" },
      { name: "description", content: "All Egyptian real-estate developers tracked by PropTrack." },
      { property: "og:title", content: "Developers — PropTrack" },
      { property: "og:description", content: "All Egyptian real-estate developers tracked by PropTrack." },
    ],
  }),
  component: () => (
    <Shell>
      <div className="border-b border-border/60 bg-gradient-sand">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <h1 className="font-display text-4xl font-semibold text-primary">Developers</h1>
          <p className="mt-2 text-muted-foreground">{developers.length} developers tracked across PropTrack.</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {developers.map((d) => (
            <Link key={d.slug} to="/developers/$slug" params={{ slug: d.slug }}
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <img src={d.logo} alt={d.name} className="h-14 w-14 rounded-xl" />
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold text-primary group-hover:text-accent">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.count} {d.count === 1 ? "project" : "projects"}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  ),
});