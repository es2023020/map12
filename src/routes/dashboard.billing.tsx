import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Check,
  Building2,
  CheckCircle2,
  Upload,
  Receipt,
  Clock,
  Copy,
  Users,
  Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

const brokerPlans = [
  {
    name: "Free",
    price: "EGP 0",
    period: "forever",
    description: "Ideal for individual starting brokers",
    features: [
      "Up to 10 CRM Client Leads",
      "Live Interactive map (17 areas)",
      "Daily Brief (Standard)",
      "Payment plan calculator (10 runs/mo)",
      "Commission calculator (10 runs/mo)",
      "Compound comparison tool (3 comps, 5/mo)",
    ],
    tier: "Starter" as const,
  },
  {
    name: "Power Broker",
    price: "EGP 299",
    period: "per month",
    description: "For active real estate professionals",
    features: [
      "Up to 200 CRM Client Leads",
      "Live Interactive map (17 areas)",
      "Daily Brief (Personalized)",
      "Unlimited calculators (Payment & Commission)",
      "Unlimited compound comparison",
      "WhatsApp Campaign Sender Engine",
      "Client-share pages (5 active links)",
    ],
    tier: "Pro" as const,
  },
  {
    name: "Power Broker+",
    price: "EGP 599",
    period: "per month",
    description: "For elite agents and team leaders",
    features: [
      "Unlimited CRM Client Leads",
      "Google Calendar & Meet connectors",
      "WhatsApp integration (Priority response)",
      "AI compound / client matching engine",
      "Client-share pages (Unlimited links)",
      "Up to 5 seats / team members",
    ],
    tier: "Agency" as const,
  },
];

const agencyPlans = [
  {
    name: "Agency Pilot",
    price: "EGP 0",
    period: "30 days trial",
    description: "Multi-seat sandbox trial for brokerages",
    features: [
      "Up to 3 broker seats / team members",
      "Shared CRM lead pool & pipeline board",
      "Standard interactive map features",
      "Shared client-share documents folder",
      "Basic admin dashboard & team reports",
    ],
    tier: "Starter" as const,
  },
  {
    name: "Agency Standard",
    price: "EGP 100",
    period: "per agent / month",
    description: "Power tools for growing brokerages",
    features: [
      "EGP 100 per month for every active seat",
      "Unlimited CRM Client Leads",
      "Custom agency branding on share links",
      "Bulk lead assignment & ownership routing",
      "Google Calendar & Meet connectors for all",
      "Priority brokerage support line",
    ],
    tier: "Pro" as const,
  },
  {
    name: "Agency Enterprise",
    price: "EGP 80",
    period: "per agent / month (100+ seats)",
    description: "PropTrack API & full customization suite",
    features: [
      "EGP 80-90 per seat for major broker groups",
      "Dedicated account manager & support SLA",
      "Custom API integration & lead webhooks",
      "White-label client-facing comparison page",
      "Advanced brokerage activity audits",
    ],
    tier: "Agency" as const,
  },
];

const developerPlans = [
  {
    name: "Standard Project Slot",
    price: "EGP 35,000",
    period: "per day",
    description: "Exclusivity spot for showcasing project",
    features: [
      "Standard interactive map placement pin",
      "Showcase project brochure & documents",
      "Basic page traffic & link-click statistics",
    ],
    tier: "Pro" as const,
  },
  {
    name: "Premium Project Slot",
    price: "EGP 45,000",
    period: "per day",
    description: "Top-tier prominence on PropTrack map",
    features: [
      "Animated featured pin style on 17 areas map",
      "Include project video brochures & gallery assets",
      "Direct broker recommendation highlight",
      "Detailed lead feedback reports",
    ],
    tier: "Agency" as const,
  },
  {
    name: "Multi-day Package",
    price: "EGP 90,000",
    period: "for 3 consecutive days",
    description: "High-impact launch week package",
    features: [
      "3-day featured placement at a discount",
      "Broker push notification broadcast to 10K+ users",
      "Dedicated listing review in AI Assistant",
      "Co-marketing email feature to active broker list",
    ],
    tier: "Agency" as const,
  },
];

const mockInvoices = [
  {
    ref: "ADIB-2026-0601",
    plan: "Power Broker",
    amount: "EGP 299",
    date: "Jun 1, 2026",
    status: "Paid",
  },
  {
    ref: "ADIB-2026-0501",
    plan: "Power Broker",
    amount: "EGP 299",
    date: "May 1, 2026",
    status: "Paid",
  },
  { ref: "ADIB-2026-0401", plan: "Free", amount: "EGP 0", date: "Apr 1, 2026", status: "Active" },
];

function BillingPage() {
  const user = useStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<"broker" | "agency" | "developer">("broker");
  const [selectedPlan, setSelectedPlan] = useState<any>(brokerPlans[1]);
  const [transactionRef, setTransactionRef] = useState("");
  const [remarks, setRemarks] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef) return;

    // Simulate updating user tier in the store if broker plan is upgraded
    if (user && activeTab === "broker") {
      useStore.setState({
        user: { ...user, tier: selectedPlan.tier },
      });
    }

    setSuccess(true);
  };

  const currentPlans =
    activeTab === "broker" ? brokerPlans : activeTab === "agency" ? agencyPlans : developerPlans;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="border-b border-border/40 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-accent" /> Premium Upgrades &amp; Billing
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your plan, retrieve ADIB bank details, and submit transfer verification slips.
          </p>
        </div>

        {/* Billing Plan Category Tabs */}
        <div className="flex gap-1 rounded-xl bg-secondary/50 p-1 text-xs">
          {[
            { id: "broker", label: "Broker plans", icon: Briefcase },
            { id: "agency", label: "Agency subscriptions", icon: Users },
            { id: "developer", label: "Developer listing", icon: Building2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "broker") setSelectedPlan(brokerPlans[1]);
                else if (tab.id === "agency") setSelectedPlan(agencyPlans[1]);
                else setSelectedPlan(developerPlans[0]);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {currentPlans.map((plan) => {
          const isCurrent = activeTab === "broker" && user?.tier === plan.tier;
          const isSelected = selectedPlan.name === plan.name;

          return (
            <div
              key={plan.name}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                isCurrent
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : isSelected
                    ? "border-primary bg-card/80 scale-[1.01] shadow"
                    : "border-border/80 bg-card hover:border-border"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </span>
                  {isCurrent && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-[9px] font-bold text-accent-foreground uppercase tracking-wider">
                      Current Plan
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-primary">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {plan.period}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{plan.description}</p>

                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40">
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full rounded-xl py-2 text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-accent/10 text-accent cursor-default"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-primary hover:bg-secondary/80"
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Active Plan" : isSelected ? "Selected Option" : "Select Plan"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADIB Bank details & Upload transfer verification slip */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bank transfer info card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-primary flex items-center gap-2">
            <Building2 className="h-5 w-5 text-accent" /> Abu Dhabi Islamic Bank (ADIB) Transfer
            Details
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please execute your monthly subscription payment using the official bank details below.
            Submit the reference number on the right for instant credit approval.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">Beneficiary Name</span>
              <span className="font-bold text-primary">PropTrack Gated Solutions</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">Bank Name</span>
              <span className="font-bold text-primary">Abu Dhabi Islamic Bank (ADIB)</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">Account Number</span>
              <span className="font-bold text-primary">100 2382 1202 001</span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">IBAN Number</span>
              <span className="font-bold text-primary font-mono text-[11px]">
                EG49 0004 0100 2382 1202 0010 021
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-border/40 pb-2">
              <span className="text-muted-foreground font-semibold">Swift BIC Code</span>
              <span className="font-bold text-primary">ADIBEGCX</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">Currency</span>
              <span className="font-bold text-primary">Egyptian Pound (EGP)</span>
            </div>
          </div>
        </div>

        {/* Upload form card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-display font-bold text-primary flex items-center gap-2">
            <Upload className="h-5 w-5 text-accent" /> Submit Payment Reference
          </h3>

          {success ? (
            <div className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center space-y-3">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <div>
                <h4 className="font-bold text-primary text-sm">Receipt Upload Successful</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Our bank reconciliation system approved transaction ref #{transactionRef}.
                </p>
                <div className="mt-3 font-semibold text-accent text-xs">
                  Unlocked: {selectedPlan.name} tier features!
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerifyPayment} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Selected Upgrade Plan
                </label>
                <div className="mt-1 font-bold text-primary text-sm bg-secondary/30 p-2.5 rounded-xl border border-border/60">
                  {selectedPlan.name} Plan ({selectedPlan.price} / {selectedPlan.period})
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Transaction Ref / Reference Number
                </label>
                <Input
                  placeholder="e.g. ADIB-9823-10292"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  File Upload (Receipt / Slip)
                </label>
                <label
                  htmlFor="receipt-upload"
                  className="mt-1.5 border border-dashed border-border/80 rounded-xl p-4 text-center cursor-pointer hover:bg-secondary/20 transition-all flex flex-col items-center block"
                >
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  {uploadedFile ? (
                    <>
                      <span className="text-xs font-bold text-accent">{uploadedFile.name}</span>
                      <span className="text-[9px] text-muted-foreground/60 mt-0.5">
                        {(uploadedFile.size / 1024).toFixed(0)} KB — ready to submit
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-muted-foreground font-semibold">
                        Click to select bank transfer screenshot
                      </span>
                      <span className="text-[9px] text-muted-foreground/60 mt-0.5">
                        PNG, JPG, PDF up to 5MB
                      </span>
                    </>
                  )}
                </label>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  className="sr-only"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Additional Notes / Remarks
                </label>
                <textarea
                  placeholder="Any details to help us verify your transfer faster..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-border bg-transparent p-3 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none resize-none leading-relaxed h-16"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 font-bold"
              >
                Verify Payment Transfer
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* ADIB Bank Details — Copy Buttons */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-primary flex items-center gap-2">
          <Copy className="h-5 w-5 text-accent" /> Quick Copy — ADIB Account Details
        </h3>
        <p className="text-xs text-muted-foreground">
          Click any field to copy it to your clipboard for your banking app.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: "Beneficiary Name", val: "PropTrack Gated Solutions" },
            { label: "Bank", val: "Abu Dhabi Islamic Bank (ADIB)" },
            { label: "Account Number", val: "100 2382 1202 001" },
            { label: "IBAN", val: "EG49 0004 0100 2382 1202 0010 021" },
            { label: "Swift / BIC", val: "ADIBEGCX" },
            { label: "Currency", val: "Egyptian Pound (EGP)" },
          ].map(({ label, val }) => (
            <button
              key={label}
              onClick={() => copyToClipboard(val, label)}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/20 p-3 hover:border-accent/50 hover:bg-accent/5 transition-all text-left group"
            >
              <div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase">{label}</div>
                <div className="text-xs font-bold text-primary font-mono mt-0.5">{val}</div>
              </div>
              <div
                className={`shrink-0 ml-2 rounded-lg p-1.5 transition-all ${
                  copied === label
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground group-hover:text-accent"
                }`}
              >
                {copied === label ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Billing / Invoice History */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-primary flex items-center gap-2">
          <Receipt className="h-5 w-5 text-accent" /> Billing History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Transaction Ref
                </th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Plan
                </th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="text-left p-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((inv, i) => (
                <tr
                  key={i}
                  className="border-b border-border/20 hover:bg-secondary/10 transition-colors"
                >
                  <td className="p-3 font-mono text-primary font-semibold">{inv.ref}</td>
                  <td className="p-3 text-primary">{inv.plan}</td>
                  <td className="p-3 font-bold text-accent">{inv.amount}</td>
                  <td className="p-3 text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {inv.date}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                        inv.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground text-center italic">
          Invoice history displays your last 12 months of subscription payments via ADIB bank
          transfer.
        </p>
      </div>
    </div>
  );
}
