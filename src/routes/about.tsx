import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { MapPin, TrendingUp, Users, Building2, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PropTrack — Egypt Real Estate Intelligence" },
      { name: "description", content: "PropTrack is Egypt's premier real estate intelligence platform, built for professional brokers across Cairo, New Administrative Capital, Sahel, and beyond." },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { label: "Projects Listed", value: "190+", icon: Building2 },
  { label: "Active Brokers", value: "2,400+", icon: Users },
  { label: "Destinations Covered", value: "25+", icon: MapPin },
  { label: "Avg. Deal Acceleration", value: "3×", icon: TrendingUp },
];

const values = [
  {
    title: "Broker-First Design",
    desc: "Every feature is designed specifically for Egyptian real estate professionals. We understand the Sahel season, New Cairo pricing, and Mostakbal City expansion — so you don't have to juggle spreadsheets.",
    icon: "🎯",
  },
  {
    title: "Complete Market Intelligence",
    desc: "We aggregate pricing, unit availability, payment plans, and developer profiles across 190+ projects spanning North Coast, Cairo, New Capital, Red Sea, and the entire Egyptian real estate market.",
    icon: "📊",
  },
  {
    title: "Built for Speed",
    desc: "Broker tools like the CRM pipeline, WhatsApp campaigns, and installment calculator are engineered to save hours daily — letting you focus on closing deals, not finding data.",
    icon: "⚡",
  },
  {
    title: "Trusted by Top Agencies",
    desc: "PropTrack is used by individual brokers and major Egyptian real estate agencies. Our data is verified against official developer sheets, Nawy.com, and proprietary field research.",
    icon: "🏆",
  },
];

const timeline = [
  { year: "2024", title: "PropTrack Founded", desc: "Launched with 50+ North Coast projects and a basic map." },
  { year: "2025", title: "Cairo & Capital Expansion", desc: "Added New Cairo, Sheikh Zayed, and New Administrative Capital coverage." },
  { year: "2026", title: "AI & CRM Launch", desc: "Launched the AI broker assistant, full CRM pipeline, WhatsApp campaigns, and 190+ verified projects." },
];

function AboutPage() {
  return (
    <Shell>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-accent/80 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Built for Egypt's Best Brokers
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            PropTrack is the intelligence platform that gives Egyptian real estate professionals every tool they need — from verified project data to AI-powered client matching, all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90">Get started free</Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">View pricing</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 space-y-20">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
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
            Egypt's real estate market is one of the fastest-growing in the MENA region — but data has always been scattered, outdated, and hard to access. PropTrack was born to change that. We aggregate verified project data from 190+ developments, combine it with powerful broker tools, and deliver it through a single platform that real estate professionals can rely on every day.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary text-center mb-10">What We Stand For</h2>
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

        {/* Timeline */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary text-center mb-10">Our Journey</h2>
          <div className="relative border-l-2 border-accent/30 pl-8 space-y-8 max-w-xl mx-auto">
            {timeline.map((t, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[2.75rem] flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                  {t.year.slice(2)}
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
          <h2 className="font-display text-2xl font-bold text-primary mb-2">Ready to transform your brokerage?</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Join 2,400+ Egyptian brokers already using PropTrack to close faster, manage clients better, and stay ahead of the market.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button className="rounded-full">Start for free <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full">Contact us</Button>
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
