import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Building2, TrendingUp, Users, MapPin, Check, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/developer-partnership")({
  head: () => ({
    meta: [
      { title: "Developer Partnership — PropTrack" },
      { name: "description", content: "List your Egyptian real estate project on PropTrack and reach 2,400+ active brokers looking to close deals across Cairo, Sahel, and beyond." },
    ],
  }),
  component: DeveloperPartnershipPage,
});

const benefits = [
  { icon: Users, title: "Reach 2,400+ Active Brokers", desc: "Your project is visible to every PropTrack broker searching for listings in your location, price range, and unit type." },
  { icon: MapPin, title: "Verified Map Pin", desc: "Your development appears with a precise, verified pin on our interactive real estate map used by brokers daily." },
  { icon: TrendingUp, title: "Lead Reports & Analytics", desc: "Get weekly reports showing broker views, favorites, comparisons, and inquiry trends for your project." },
  { icon: Building2, title: "Full Profile Showcase", desc: "A dedicated developer profile page with your company story, completed projects, and portfolio." },
];

const listingTiers = [
  {
    name: "Developer Listing",
    price: "EGP 2,500",
    period: "/ project / month",
    features: [
      "Project page with full details & photos",
      "Verified map pin placement",
      "Unit type & pricing display",
      "Standard search visibility",
      "Monthly broker view report",
    ],
  },
  {
    name: "Developer Partner",
    price: "EGP 5,000",
    period: "/ month",
    highlight: true,
    features: [
      "Everything in Developer Listing",
      "Featured placement in search results",
      "Priority new launch announcements",
      "WhatsApp broadcast to broker network",
      "Detailed broker engagement analytics",
      "Dedicated PropTrack account manager",
    ],
  },
  {
    name: "Developer Enterprise",
    price: "Custom",
    period: "pricing",
    features: [
      "Everything in Developer Partner",
      "White-label broker tool suite",
      "API integration with your CRM",
      "Co-branded marketing materials",
      "Exclusive category sponsorship",
      "Full dedicated team support",
    ],
  },
];

const developers = [
  { name: "SODIC", logo: "🏗️" },
  { name: "Emaar Misr", logo: "🏙️" },
  { name: "Palm Hills", logo: "🌴" },
  { name: "Hyde Park", logo: "🌿" },
  { name: "Tatweer Misr", logo: "🌊" },
  { name: "Mountain View", logo: "⛰️" },
];

function DeveloperPartnershipPage() {
  return (
    <Shell>
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-primary to-accent/90 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm mb-5">
            <Building2 className="h-3.5 w-3.5" /> For Property Developers
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Put your project in front of every top Egyptian broker
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            PropTrack connects your development with 2,400+ active real estate brokers searching daily across Cairo, North Coast, New Capital, and all of Egypt.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
                Start listing your project <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 space-y-20">

        {/* Benefits */}
        <section>
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">Why list on PropTrack?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <b.icon className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Listing Tiers */}
        <section>
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-3">Listing Packages</h2>
          <p className="text-center text-muted-foreground mb-10">Choose the visibility level that matches your project goals.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {listingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl border p-7 flex flex-col shadow-sm ${
                  tier.highlight
                    ? "border-emerald-500/50 bg-emerald-500/5 ring-2 ring-emerald-500/30 scale-[1.01]"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <div className="inline-block rounded-full bg-emerald-500 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-3 self-start">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-primary">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-primary">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-5 space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link to="/contact">
                    <Button
                      className={`w-full rounded-full ${tier.highlight ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-secondary text-primary hover:bg-secondary/80"}`}
                    >
                      Get started
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trusted Developers */}
        <section className="rounded-3xl border border-border bg-card p-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground mb-6">
            <Star className="h-3 w-3 text-accent" /> Trusted by Leading Developers
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {developers.map((d) => (
              <div key={d.name} className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-secondary/30 px-6 py-4 min-w-[100px]">
                <span className="text-2xl">{d.logo}</span>
                <span className="text-xs font-semibold text-foreground/70">{d.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-emerald-900 via-primary to-accent/80 p-10 text-center text-primary-foreground">
          <h2 className="font-display text-2xl font-bold mb-2">Ready to reach Egypt's top brokers?</h2>
          <p className="text-primary-foreground/80 text-sm mb-6 max-w-md mx-auto">
            Contact our developer partnerships team to get your project listed and start generating broker interest today.
          </p>
          <Link to="/contact">
            <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
              Contact partnerships team <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
