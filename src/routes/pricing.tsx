import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Check, X, Zap, Users, ChevronRight, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_CONFIG } from "@/data/pricing-config";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing Plans — PropTrack" },
      {
        name: "description",
        content:
          "PropTrack broker subscription plans for individual agents and brokerage teams operating in Egypt's primary property market.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const plans = [
    {
      name: "Explorer",
      badge: "Free Starter",
      price: `EGP 0`,
      period: "forever",
      description: "Ideal for solo agents exploring the Egyptian primary market.",
      features: [
        "CRM limited to 15 contacts",
        "WhatsApp sharing (10 sends/month)",
        "Up to 10 favorite projects",
        "Basic market insights (no export)",
        "No Google Calendar / Meet integration",
        "No Agenda / Notion workspace",
      ],
      cta: "Get Started Free",
      href: "/auth?tier=Explorer",
      highlight: false,
    },
    {
      name: "Starter",
      badge: "Best for Growing Agents",
      price: `EGP ${PRICING_CONFIG.starterPrice}`,
      period: "/month",
      description: "Unlock core workflow automation and digital tools.",
      features: [
        "CRM up to 150 contacts",
        "WhatsApp sharing (100 sends/month)",
        "Unlimited favorite projects",
        "Full market insights (no export)",
        "Google Calendar & Meet integration",
        "Agenda & Notion workspace",
      ],
      cta: "Start 7-Day Free Trial",
      href: "/auth?tier=Starter",
      highlight: true,
    },
    {
      name: "Pro",
      badge: "Power Broker Elite",
      price: `EGP ${PRICING_CONFIG.proPrice}`,
      period: "/month",
      description: "Unlimited power tools for elite high-volume brokers.",
      features: [
        "Unlimited CRM contacts",
        "Unlimited WhatsApp sends",
        "Unlimited favorite projects",
        "Full market insights WITH Excel export",
        "Google Calendar & Meet integration",
        "Agenda & Notion workspace",
        "Priority dedicated support",
      ],
      cta: "Go Pro Now",
      href: "/auth?tier=Pro",
      highlight: false,
    },
    {
      name: "Brokerage Team",
      badge: "Minimum 5 Seats",
      price: `EGP ${PRICING_CONFIG.brokerageSeatPrice}`,
      period: "/seat/month",
      description: "For team leads wanting centralized control and analytics.",
      features: [
        `EGP ${PRICING_CONFIG.brokerageSeatPrice} per seat/mo (min. ${PRICING_CONFIG.minBrokerageSeats} seats)`,
        "All features in Pro for each seat member",
        "Brokerage Owner central dashboard",
        "Team analytics & aggregate response times",
        "Central brochure controls",
        "Seat allocation management",
        "Itemized monthly team invoices",
      ],
      cta: "Create Team Workspace",
      href: "/auth?tier=BrokerageAdmin",
      highlight: false,
      isBrokerage: true,
    },
  ];

  return (
    <Shell>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1524] via-[#111e35] to-[#1a365d] text-white py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-5xl px-4 text-center lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md mb-5 text-indigo-300">
            <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" /> Transparent Egypt
            Primary Market Subscriptions
          </div>
          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl text-white">
            Plans built for top-tier agents
          </h1>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Gain an unfair analytical advantage in New Cairo, New Capital, Sheikh Zayed, and North
            Coast. Pay monthly with zero hidden fees.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 space-y-20">
        {/* Tier Cards Grid */}
        <section>
          <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border flex flex-col p-6 transition-all duration-300 ${
                  plan.highlight
                    ? "border-amber-500 bg-slate-900 text-white ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/10 scale-[1.03]"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 hover:shadow-md"
                }`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                      plan.highlight ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div className="mt-4">
                  <h3
                    className={`font-display text-xl font-bold ${plan.highlight ? "text-amber-400" : "text-slate-900 dark:text-white"}`}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span
                      className={`font-display text-3xl font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                <hr
                  className={`my-5 border-dashed ${plan.highlight ? "border-slate-800" : "border-slate-200 dark:border-slate-800"}`}
                />

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs">
                      <Check
                        className={`h-4 w-4 shrink-0 ${plan.highlight ? "text-amber-400" : "text-emerald-500"}`}
                      />
                      <span
                        className={
                          plan.highlight ? "text-slate-300" : "text-slate-600 dark:text-slate-300"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link to={plan.href}>
                    <Button
                      className={`w-full rounded-full font-semibold transition-all ${
                        plan.highlight
                          ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                          : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700"
                      }`}
                    >
                      {plan.cta} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment info */}
        <section className="rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 p-8 text-center shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
            💳 ADIB Bank Transfer Payments
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Payments are billed monthly. Upgrade or downgrade online instantly. Mid-cycle upgrades
            are charged on a prorated basis; downgrades are queued to take effect on your next
            billing date.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button className="rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                Register Account
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Contact Sales Support
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}
