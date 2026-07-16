import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Users, BarChart2, Shield, Zap, Check, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/agency-partnership")({
  loader: () => {
    throw notFound();
  },
  component: () => null,
});

const agencyBenefits = [
  { icon: Users, title: "Multi-Seat Team Access", desc: "Give every broker in your agency their own PropTrack account under a single agency subscription, with shared lead pools and documents." },
  { icon: BarChart2, title: "Shared Analytics Dashboard", desc: "See your entire team's performance — deals closed, leads in pipeline, WhatsApp campaigns sent, and conversion rates in one place." },
  { icon: Shield, title: "Centralized Lead Management", desc: "Assign leads to specific brokers, transfer ownership, and track every touchpoint from first contact to deal closed." },
  { icon: Zap, title: "Bulk WhatsApp Campaigns", desc: "Run coordinated WhatsApp marketing campaigns from your agency account with templates, scheduling, and delivery tracking." },
  { icon: Building2, title: "Developer Priority Access", desc: "Agency accounts get early access to new developer launches before they're visible to individual brokers." },
  { icon: BarChart2, title: "Commission Tracking", desc: "Track team deals, expected commissions, and closed transactions across all your brokers in real time." },
];

const agencyTiers = [
  {
    name: "Agency Starter",
    price: "EGP 1,299",
    period: "/month",
    seats: "Up to 3 broker seats",
    features: [
      "3 broker seat licenses",
      "Shared lead pool",
      "Team analytics dashboard",
      "Shared document library",
      "Agency admin panel",
      "Email support",
    ],
  },
  {
    name: "Agency Pro",
    price: "EGP 2,999",
    period: "/month",
    seats: "Up to 10 broker seats",
    highlight: true,
    features: [
      "10 broker seat licenses",
      "Priority developer listings",
      "Bulk WhatsApp campaign engine",
      "Lead assignment & transfer tools",
      "Full commission tracker",
      "Dedicated account manager",
      "Priority support",
    ],
  },
  {
    name: "Agency Enterprise",
    price: "Custom",
    period: "pricing",
    seats: "Unlimited broker seats",
    features: [
      "Unlimited broker licenses",
      "White-label option available",
      "API integration with your CRM",
      "Custom analytics & reporting",
      "Co-branded marketing materials",
      "Onboarding & training sessions",
      "SLA & dedicated success team",
    ],
  },
];

const howItWorks = [
  { step: "01", title: "Register your agency", desc: "Create your agency admin account and invite your broker team members via email." },
  { step: "02", title: "Assign seats & roles", desc: "Each broker gets their own login. As admin, you control permissions, lead assignments, and team visibility." },
  { step: "03", title: "Track performance", desc: "Monitor your entire team's pipeline, campaign results, and deal flow from the agency analytics dashboard." },
  { step: "04", title: "Scale as you grow", desc: "Add or remove seats at any time. Upgrade your plan as your team grows — no long-term lock-in." },
];

function AgencyPartnershipPage() {
  return (
    <Shell>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-primary to-accent/90 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm mb-5">
            <Users className="h-3.5 w-3.5" /> For Real Estate Agencies
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight">
            One platform for your entire brokerage team
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            PropTrack Agency gives your whole team shared access to Egypt's best real estate intelligence tools — with centralized lead management, analytics, and WhatsApp campaigns.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
                Get agency pricing <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
                View all plans
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 space-y-20">

        {/* Benefits */}
        <section>
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">Everything your agency needs</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agencyBenefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 mb-4">
                  <b.icon className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-primary">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Agency Tiers */}
        <section>
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-3">Agency Plans</h2>
          <p className="text-center text-muted-foreground mb-10">Multi-seat pricing for agencies of all sizes.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {agencyTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl border p-7 flex flex-col shadow-sm ${
                  tier.highlight
                    ? "border-blue-500/50 bg-blue-500/5 ring-2 ring-blue-500/30 scale-[1.01]"
                    : "border-border bg-card"
                }`}
              >
                {tier.highlight && (
                  <div className="inline-block rounded-full bg-blue-500 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider mb-3 self-start">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-primary">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-primary">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <p className="mt-1 text-xs font-semibold text-blue-500">{tier.seats}</p>
                <ul className="mt-5 space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link to="/contact">
                    <Button
                      className={`w-full rounded-full ${
                        tier.highlight
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-secondary text-primary hover:bg-secondary/80"
                      }`}
                    >
                      {tier.price === "Custom" ? "Contact sales" : "Get started"}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-display text-2xl font-bold text-primary text-center mb-10">How Agency Accounts Work</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 font-bold text-lg">{s.step}</div>
                <h3 className="font-semibold text-primary mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-blue-900 via-primary to-accent/80 p-10 text-center text-primary-foreground">
          <h2 className="font-display text-2xl font-bold mb-2">Ready to power your whole agency?</h2>
          <p className="text-primary-foreground/80 text-sm mb-6 max-w-md mx-auto">
            Contact our agency team to discuss seats, pricing, and onboarding your entire brokerage onto PropTrack.
          </p>
          <Link to="/contact">
            <Button className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold">
              Talk to agency sales <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
