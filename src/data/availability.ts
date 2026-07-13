// Real availability data — edit via data/availability/availability.xlsx
// Run `npm run import-availability` after replacing the spreadsheet.

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface UnitListing {
  id: string;
  cluster?: string;       // e.g. "NHF", "R1", "PS", "Boardwalk"
  beds: number;
  finishing: string;      // Finished | Semi Finished | Core & Shell
  areaSqm: number;
  areaNote?: string;      // e.g. "+ Roof Area 17m"
  view?: string;          // Sea & Lagoon | Lagoon | Sea | Garden
  priceEGP: number;
  deliveryNote?: string;  // "Ready to Move" | "1 Year" | "2.5 Years" | "4 Years"
  paymentPlan?: string;
  status: "Available" | "Last Unit";
}

export interface UnitBreakdown {
  type: string;
  beds?: number;
  available: number;
  minSqm: number;
  maxSqm: number;
  minPriceM: number;
  maxPriceM: number;
  finishing?: string;
  cluster?: string;
  deliveryNote?: string;
  paymentPlan?: string;
  units?: UnitListing[];
}

export interface ProjectAvailability {
  slug: string;
  developer: string;
  totalAvailable: number;
  breakdown: UnitBreakdown[];
  lastUpdated: string;
  note?: string;
}

/** Generate a stable URL slug for a unit-type breakdown row */
export function unitTypeSlug(b: UnitBreakdown): string {
  const parts: string[] = [b.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")];
  if (b.beds) parts.push(`${b.beds}br`);
  if (b.cluster) parts.push(b.cluster.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  return parts.join("-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ─── Data (from spreadsheet) ──────────────────────────────────────────────────

import { availability as _availability } from "./availability.generated";

export const availability = _availability;


export function availabilityBySlug(slug: string): ProjectAvailability | undefined {
  return availability.find((a) => a.slug === slug);
}

export function totalAvailableBySlug(slug: string): number {
  return availabilityBySlug(slug)?.totalAvailable ?? 0;
}

/** Find a project + breakdown by project slug + type slug */
export function breakdownByTypeSlug(
  projectSlug: string,
  typeSlug: string
): { project: ProjectAvailability; breakdown: UnitBreakdown } | undefined {
  const project = availabilityBySlug(projectSlug);
  if (!project) return undefined;
  const breakdown = project.breakdown.find((b) => unitTypeSlug(b) === typeSlug);
  if (!breakdown) return undefined;
  return { project, breakdown };
}
