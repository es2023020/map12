import { paymentPlansGenerated } from "./payment-plans.generated";

export type PaymentPlanKind = "developer" | "resale" | "cash" | "launch" | "legacy";

export type PaymentPlan = {
  id: string;
  label: string;
  kind: PaymentPlanKind;
  type?: string; // equal_installments, cash, ...
  downPaymentPct: number;
  years: number;
  month3Pct?: number; // lump sum due 3 months after contract, % of price
  month6Pct?: number;
  deliveryPct?: number; // lump sum due on delivery, % of price
  maintenancePct?: number;
  cashDiscountPct?: number;
  installmentType?: string;
  source: string;
  approximate?: boolean; // percentages rounded from per-unit Nawy data
  nawyUnits?: number; // number of Nawy sample units behind this plan
};

export type ProjectPaymentPlans = {
  nawyId: number | string;
  nawyUrl: string;
  verifiedAt: string;
  plans: PaymentPlan[];
  text?: string; // replacement display text for the compound's paymentPlan
};

export const paymentPlansBySlug = paymentPlansGenerated as Record<string, ProjectPaymentPlans>;

/** Parse a free-text plan ("10% down · 8 years") into a single indicative plan. */
export function parseLegacyPlan(text?: string): PaymentPlan {
  let dp = 10;
  let years = 8;
  if (text) {
    const d = text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:down|dp|downpayment)/i) || text.match(/(\d+(?:\.\d+)?)\s*%/);
    if (d) dp = parseFloat(d[1]);
    const y = text.match(/(\d+)\s*(?:-)?\s*(?:years?|yrs?|y\b)/i);
    if (y) years = parseInt(y[1]);
  }
  return {
    id: "legacy",
    label: text || `${dp}% down · ${years} years`,
    kind: "legacy",
    downPaymentPct: dp,
    years,
    source: "Property Atlas (not verified against the developer)",
  };
}

/** All plans for a project: Nawy plans when we have them, otherwise one indicative plan from the text. */
export function getPaymentPlans(c: { slug: string; paymentPlan?: string; paymentPlans?: PaymentPlan[] }): PaymentPlan[] {
  if (c.paymentPlans && c.paymentPlans.length) return c.paymentPlans;
  const g = paymentPlansBySlug[c.slug];
  if (g && g.plans.length) return g.plans;
  return [parseLegacyPlan(c.paymentPlan)];
}

/**
 * Default plan the calculator opens with: first developer plan (the list is sorted by
 * lowest down payment, then longest term), then launch, then any non-cash plan, then anything.
 */
export function defaultPlan(plans: PaymentPlan[]): PaymentPlan {
  const order: PaymentPlanKind[] = ["developer", "launch", "legacy", "resale", "cash"];
  for (const k of order) {
    const p = plans.find((x) => x.kind === k);
    if (p) return p;
  }
  return plans[0];
}

export function isVerified(p: PaymentPlan): boolean {
  return p.kind !== "legacy";
}
