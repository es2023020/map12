import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Check, X, Zap, Building2, Users, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Plans — PropTrack" },
      { name: "description", content: "PropTrack broker subscription plans for individual agents, power brokers, and agencies operating in Egypt real estate." },
    ],
  }),
  component: PricingPage,
});

type TierKey = "Free" | "Power Broker" | "Power Broker+";

const brokerPlans: Array<{
  name: TierKey;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  description: string;
  cta: string;
  ctaVariant?: "default" | "secondary";
}> = [
  {
    name: "Free",
    price: "EGP 0",
    period: "forever",
    description: "For brokers just getting started exploring the Egyptian market.",
    cta: "Get started free",
    ctaVariant: "secondary",
  },
  {
    name: "Power Broker",
    price: "EGP 299",
    period: "/month",
    highlight: true,
    badge: "Most Popular",
    description: "For active real estate professionals closing deals consistently.",
    cta: "Start Power Broker",
  },
  {
    name: "Power Broker+",
    price: "EGP 599",
    period: "/month",
    badge: "Best Value",
    description: "For elite brokers who want every tool and AI-powered edge.",
    cta: "Go Power Broker+",
    ctaVariant: "default",
  },
];


type FeatureRow = {
  label: string;
  free: string | boolean;
  power: string | boolean;
  powerPlus: string | boolean;
  category?: string;
};

const features: FeatureRow[] = [
  { label: "Compound / unit searches", free: "50 / month", power: "Unlimited", powerPlus: "Unlimited", category: "Search & Map" },
  { label: "Live interactive map (17 areas)", free: "Full access", power: "Full access", powerPlus: "Full access" },
  { label: "Daily Brief", free: "Standard", power: "Personalized by saved areas & clients", powerPlus: "Personalized + earliest delivery" },
  { label: "CRM Client Leads (CRM)", free: "Up to 10 clients", power: "Up to 200 clients", powerPlus: "Unlimited clients", category: "CRM & Lead Management" },
  { label: "Pipeline Kanban Board", free: true, power: true, powerPlus: true },
  { label: "Lead Activity Timeline", free: false, power: true, powerPlus: true },
  { label: "Google Calendar & Meet Connector", free: false, power: false, powerPlus: true },
  { label: "WhatsApp integration", free: false, power: "Standard queries", powerPlus: "Priority response" },
  { label: "WhatsApp Campaign Sender", free: false, power: true, powerPlus: true },
  { label: "Client-share pages", free: false, power: "5 active links", powerPlus: "Unlimited active links" },
  { label: "Price / launch alerts", free: "1 area, area-level only", power: "5 saved areas + unit filters", powerPlus: "Unlimited saved searches", category: "Alerts & AI" },
  { label: "AI compound / client matching", free: false, power: false, powerPlus: "Included" },
  { label: "Payment plan calculator", free: "10 runs / month", power: "Unlimited", powerPlus: "Unlimited", category: "Tools & Analytics" },
  { label: "Commission calculator", free: "10 runs / month", power: "Unlimited", powerPlus: "Unlimited" },
  { label: "Compound comparison tool", free: "3 compounds, 5 / month", power: "Unlimited, up to 6-way", powerPlus: "Unlimited" },
  { label: "Target Tracker (Sales Goals)", free: false, power: true, powerPlus: true },
  { label: "Activity analytics", free: false, power: "Basic (searches, saves)", powerPlus: "Full (funnel, follow-up timing)" },
  { label: "Seats / team members", free: "1", power: "1", powerPlus: "Up to 5" },
];


function FeatureValue({ val }: { val: string | boolean }) {
  if (val === true) return <Check className="mx-auto h-4 w-4 text-accent" />;
  if (val === false) return <X className="mx-auto h-4 w-4 text-muted-foreground/30" />;
  return <span className="text-xs font-medium text-foreground/80">{val}</span>;
}

const agencyTiers = [
  { name: "Agency Starter", seats: "Up to 3 brokers", price: "EGP 1,299/mo", desc: "Shared lead pool, team dashboard, 3 broker seats." },
  { name: "Agency Pro", seats: "Up to 10 brokers", price: "EGP 2,999/mo", desc: "Priority listing, shared documents, full analytics.", highlight: true },
  { name: "Agency Enterprise", seats: "Unlimited brokers", price: "Custom pricing", desc: "API access, dedicated manager, white-label options." },
];

const developerTiers = [
  { name: "Developer Listing", desc: "Feature your project on the PropTrack map & listings.", price: "EGP 2,500/project/mo" },
  { name: "Developer Partner", desc: "Premium placement, analytics dashboard, lead reports.", price: "EGP 5,000/mo" },
  { name: "Developer Enterprise", desc: "Full partnership, co-marketing, API integrations.", price: "Contact sales" },
];

function PricingPage() {
  return (
    <Shell>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-primary/95 to-accent/80 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm mb-5">
            <Zap className="h-3.5 w-3.5" /> Egypt's #1 Broker Intelligence Platform
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            From free access to full AI-powered brokerage tools — scale up as your business grows. Pay monthly, cancel anytime via ADIB bank transfer.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 space-y-20">

        {/* Broker Plan Cards */}
        <section>
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-2">Individual Broker Plans</h2>
          <p className="text-center text-muted-foreground mb-10">For solo agents and power brokers operating across Egypt.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {brokerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-7 flex flex-col shadow-sm transition-all ${
                  plan.highlight
                    ? "border-accent bg-card ring-2 ring-accent/40 shadow-accent/20 shadow-lg scale-[1.01]"
                    : "border-border bg-card hover:border-border/80"
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow ${
                    plan.highlight ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-3">
                  {plan.highlight && <Star className="h-4 w-4 text-accent fill-accent" />}
                  <h3 className="font-display text-xl font-bold text-primary">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-4xl font-extrabold text-primary">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <div className="mt-auto">
                  <Link to="/auth">
                    <Button
                      className={`w-full rounded-full font-semibold ${
                        plan.ctaVariant === "secondary"
                          ? "bg-secondary text-primary hover:bg-secondary/80"
                          : ""
                      }`}
                    >
                      {plan.cta} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="mt-3 text-center text-[10px] text-muted-foreground">
                    Monthly via ADIB bank transfer · Cancel anytime
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Full Feature Comparison Table */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary mb-8 text-center">Compare All Features</h2>
          <div className="overflow-x-auto rounded-2xl border border-border shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="p-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/2">Feature</th>
                  <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Free</th>
                  <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-accent bg-accent/5">Power Broker</th>
                  <th className="p-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Power Broker+</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <>
                    {f.category && (
                      <tr key={`cat-${i}`} className="bg-secondary/20">
                        <td colSpan={4} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                          {f.category}
                        </td>
                      </tr>
                    )}
                    <tr key={f.label} className="border-b border-border/40 last:border-b-0 hover:bg-secondary/10 transition-colors">
                      <td className="p-4 font-medium text-foreground/80">{f.label}</td>
                      <td className="p-4 text-center"><FeatureValue val={f.free} /></td>
                      <td className="p-4 text-center bg-accent/5"><FeatureValue val={f.power} /></td>
                      <td className="p-4 text-center"><FeatureValue val={f.powerPlus} /></td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Agency Plans */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Agency Plans</h2>
              <p className="text-sm text-muted-foreground">Multi-seat plans for brokerages and team managers.</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {agencyTiers.map((t) => (
              <div key={t.name} className={`rounded-2xl border p-6 ${t.highlight ? "border-blue-500/50 bg-blue-500/5 ring-1 ring-blue-500/30" : "border-border bg-card"}`}>
                <h3 className="font-display font-bold text-primary">{t.name}</h3>
                <p className="mt-1 text-sm font-semibold text-accent">{t.price}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                <p className="mt-1 text-xs text-blue-500 font-medium">{t.seats}</p>
                <Button variant="outline" size="sm" className="mt-4 w-full rounded-xl">
                  <Link to="/agency-partnership">Learn more</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Plans */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Building2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">Developer Listings</h2>
              <p className="text-sm text-muted-foreground">For property developers wanting to reach top Egyptian brokers.</p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {developerTiers.map((t) => (
              <div key={t.name} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display font-bold text-primary">{t.name}</h3>
                <p className="mt-1 text-sm font-semibold text-emerald-500">{t.price}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
                <Button variant="outline" size="sm" className="mt-4 w-full rounded-xl">
                  <Link to="/developer-partnership">Learn more</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Payment info */}
        <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h2 className="font-display text-xl font-bold text-primary mb-2">💳 How Payment Works</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            All subscriptions are paid monthly via <strong className="text-primary">ADIB bank transfer</strong>. After transferring, submit your transaction reference in the Billing section of your dashboard for instant activation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button className="rounded-full">Get started free</Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="rounded-full">Contact sales</Button>
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
