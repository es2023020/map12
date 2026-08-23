import { Link } from "@tanstack/react-router";
import { developers } from "@/data/developers";
import { Building2, ArrowRight, CheckCircle2 } from "lucide-react";

export function TopDevelopersSection() {
  // Sort developers by project count descending and pick top 8
  const topDevs = [...developers]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent mb-2.5">
            <Building2 className="h-3.5 w-3.5" /> Market Leaders
          </div>
          <h2 className="font-display text-2.5xl sm:text-4xl font-bold tracking-tight text-primary">
            Leading Developers
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-xl">
            Explore tier-one real estate developers shaping Egypt's skyline across Sahel, New Cairo, and West Cairo.
          </p>
        </div>
        <Link
          to="/developers"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent hover:text-accent/80 transition-colors group shrink-0"
        >
          <span>View all {developers.length} developers</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {topDevs.map((dev) => (
          <Link
            key={dev.slug}
            to="/developers/$slug"
            params={{ slug: dev.slug }}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-xl hover:border-accent/40 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-background border border-border/60 flex items-center justify-center p-2 shadow-inner group-hover:border-accent/40 transition-colors">
                <span className="font-display font-extrabold text-lg text-primary group-hover:text-accent transition-colors">
                  {dev.name.charAt(0)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-bold text-accent">
                {dev.count} {dev.count === 1 ? "Project" : "Projects"}
              </span>
            </div>

            <h3 className="font-display text-base font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">
              {dev.name}
            </h3>

            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {dev.blurb || "Leading developer in the Egyptian real-estate market."}
            </p>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Tier
              </span>
              <span className="group-hover:translate-x-1 transition-transform text-accent font-bold">
                View Portfolio →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
