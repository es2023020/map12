import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { MapPin, Calendar, Building, Building2, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PropTrack — Egypt Real Estate Intelligence" },
      {
        name: "description",
        content:
          "PropTrack is Egypt's real estate intelligence platform, mapping 328+ compounds across 26 prime destinations for real estate professionals.",
      },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { label: "Compounds Mapped", value: "328+", icon: Building2 },
  { label: "Real Estate Developers", value: "136+", icon: Building },
  { label: "Prime Destinations", value: "26", icon: MapPin },
  { label: "Built In", value: "2026", icon: Calendar },
];

const values = [
  {
    title: "Broker-First Intelligence",
    desc: "Every feature is engineered specifically for Egyptian real estate professionals. We map North Coast, New Cairo, Sheikh Zayed, and Mostakbal City developments — eliminating static spreadsheets.",
    icon: "🎯",
  },
  {
    title: "Complete Market Coverage",
    desc: "We catalog pricing, unit availability, payment terms, and developer portfolios across 328+ compounds spanning the entire Egyptian real estate market.",
    icon: "📊",
  },
  {
    title: "Real-Time Installment Calculations",
    desc: "Built-in broker tools like multi-region search, interactive master plans, and custom payment plan calculators save hours daily.",
    icon: "⚡",
  },
  {
    title: "Direct Market Insights",
    desc: "PropTrack provides direct visibility into active compound inventories, launch price points, delivery timelines, and unit breakdowns.",
    icon: "🏆",
  },
];

const timeline = [
  {
    year: "2026",
    title: "PropTrack Platform Launch",
    desc: "Built in 2026 to map Egypt's real estate market — cataloging 328+ compounds across 26 prime destinations.",
  },
  {
    year: "2026",
    title: "Developer Availability & Multi-Region Expansion",
    desc: "Integrated live developer inventory imports, multi-region filtering, and dynamic lowest unit price calculation.",
  },
];

function AboutPage() {
  return (
    <Shell>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-accent/80 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Built for Egypt's Real Estate Market
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            PropTrack is the real-estate intelligence platform mapping 328+ compounds across 26 prime Egyptian destinations — giving professionals instant access to project data, availability, and pricing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/map" search={{ destination: "", dev: "", q: "" }}>
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-bold">
                Explore the Map
              </Button>
            </Link>
            <Link to="/projects" search={{ destination: "", dev: "", q: "" }}>
              <Button
                variant="outline"
                className="rounded-full border-white/30 text-white hover:bg-white/10"
              >
                Browse Compounds
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 space-y-20">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <s.icon className="mx-auto h-6 w-6 text-accent mb-3" />
              <div className="font-display text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-foreground/70 leading-relaxed text-base">
            Egypt's real estate market is one of the fastest-growing in the region — yet project information has traditionally been fragmented across offline spreadsheets and launch PDFs. PropTrack was built in 2026 to solve this by creating a single, unified map and intelligence platform for 328+ compounds.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-7 shadow-sm">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-display font-bold text-primary text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Roadmap */}
        <section className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent font-bold text-xl">
              🚀
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-accent">
                Coming Soon
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">Product Roadmap</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-secondary/30 p-6 space-y-2">
              <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold text-accent">
                Planned Q4 2026
              </span>
              <h3 className="font-display font-bold text-primary text-base">
                AI Broker Co-pilot & Client Matching
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An intelligent client-matching engine designed to analyze client budget constraints and area preferences, automatically scoring matching compound inventories.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-secondary/30 p-6 space-y-2">
              <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold text-accent">
                Planned Q4 2026
              </span>
              <h3 className="font-display font-bold text-primary text-base">
                Automated Developer Feed Sync
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct developer API integrations for real-time live availability feeds, price sheet updates, and launch reservation alerts.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary text-center mb-10">
            Our Journey
          </h2>
          <div className="relative border-l-2 border-accent/30 pl-8 space-y-8 max-w-xl mx-auto">
            {timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.75rem] flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                  26
                </div>
                <div className="text-xs text-accent font-bold mb-0.5">{t.year}</div>
                <h3 className="font-display font-bold text-primary">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-border bg-gradient-to-br from-accent/10 to-primary/5 p-10 text-center">
          <Star className="mx-auto h-8 w-8 text-accent mb-4" />
          <h2 className="font-display text-2xl font-bold text-primary mb-2">
            Explore Egypt's Property Intelligence Map
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Discover 328+ compounds across Sahel, New Cairo, Sheikh Zayed, and Red Sea with live availability and installment calculators.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/map" search={{ destination: "", dev: "", q: "" }}>
              <Button className="rounded-full font-bold">
                Explore the Map <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/projects" search={{ destination: "", dev: "", q: "" }}>
              <Button variant="outline" className="rounded-full">
                View All Compounds
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
