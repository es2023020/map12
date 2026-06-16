// Real availability data (June 2026)
// Sources: Palm Hills (11-Jun), Mountain View (14-Jun), Madinet Masr (Jun),
//          SODIC (14-Jun), Maven/Cali Coast (14-Jun), Ahly Sabbour (Jun),
//          Marakez Properties (Jun), PRE Developments (Jun), Tatweer Misr (Jun)

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

// ─── Data ─────────────────────────────────────────────────────────────────────

export const availability: ProjectAvailability[] = [

  // ══════════════════════════════════════════
  // MAVEN DEVELOPMENTS — CALI COAST
  // Source: Maven availability sheet Jun 2026
  // ══════════════════════════════════════════
  {
    slug: "cali-coast-ras-el-hekma",
    developer: "Maven Developments",
    totalAvailable: 28,
    lastUpdated: "2026-06-14",
    note: "Boardwalk Condos: boutique sea-facing release starting EGP 6.4M. One ready-to-move twin house available.",
    breakdown: [
      {
        type: "Boardwalk Apartment", beds: 1, available: 3,
        minSqm: 45, maxSqm: 55, minPriceM: 6.4, maxPriceM: 7.5,
        finishing: "Finished", deliveryNote: "2 Years",
        paymentPlan: "5% DP over 9 years equal installments",
        units: [
          { id: "cc-bw-1a", beds: 1, finishing: "Finished", areaSqm: 48, view: "Sea", priceEGP: 6_400_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
          { id: "cc-bw-1b", beds: 1, finishing: "Finished", areaSqm: 52, view: "Sea", priceEGP: 6_900_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
          { id: "cc-bw-1c", beds: 1, finishing: "Finished", areaSqm: 55, view: "Sea & Lagoon", priceEGP: 7_500_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
        ],
      },
      {
        type: "Boardwalk Apartment", beds: 2, available: 3,
        minSqm: 60, maxSqm: 75, minPriceM: 8.2, maxPriceM: 9.5,
        finishing: "Finished", deliveryNote: "2 Years",
        paymentPlan: "5% DP over 9 years equal installments",
        units: [
          { id: "cc-bw-2a", beds: 2, finishing: "Finished", areaSqm: 62, view: "Sea", priceEGP: 8_200_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
          { id: "cc-bw-2b", beds: 2, finishing: "Finished", areaSqm: 68, view: "Sea & Lagoon", priceEGP: 8_900_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
          { id: "cc-bw-2c", beds: 2, finishing: "Finished", areaSqm: 75, view: "Sea & Lagoon", priceEGP: 9_500_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
        ],
      },
      {
        type: "Boardwalk Apartment", beds: 3, available: 2,
        minSqm: 85, maxSqm: 95, minPriceM: 10.2, maxPriceM: 11.5,
        finishing: "Finished", deliveryNote: "2 Years",
        paymentPlan: "5% DP over 9 years equal installments",
        units: [
          { id: "cc-bw-3a", beds: 3, finishing: "Finished", areaSqm: 88, view: "Sea & Lagoon", priceEGP: 10_200_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
          { id: "cc-bw-3b", beds: 3, finishing: "Finished", areaSqm: 95, view: "Sea & Lagoon", priceEGP: 11_500_000, deliveryNote: "2 Years", paymentPlan: "5% DP, 9 years", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 2, available: 5,
        minSqm: 86, maxSqm: 103, minPriceM: 9.985, maxPriceM: 12.196,
        finishing: "Finished",
        paymentPlan: "5%+5% over 8 yrs (1-yr) / 5% DP over 10 yrs (4-yr)",
        units: [
          { id: "cc-ch2-a", beds: 2, finishing: "Finished", areaSqm: 103, view: "Lagoon", priceEGP: 11_355_000, deliveryNote: "1 Year", paymentPlan: "5% DP + 5% after 3 months, 8 years", status: "Available" },
          { id: "cc-ch2-b", beds: 2, finishing: "Finished", areaSqm: 101, areaNote: "+ 16m Terrace", view: "Lagoon", priceEGP: 11_546_000, deliveryNote: "1 Year", paymentPlan: "5% DP + 5% after 3 months, 8 years", status: "Available" },
          { id: "cc-ch2-c", beds: 2, finishing: "Finished", areaSqm: 86, view: "Lagoon", priceEGP: 9_985_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-ch2-d", beds: 2, finishing: "Finished", areaSqm: 86, areaNote: "+ Roof Area 46m", view: "Lagoon", priceEGP: 10_380_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-ch2-e", beds: 2, finishing: "Finished", areaSqm: 86, areaNote: "+ Garden Area 50m", view: "Lagoon", priceEGP: 12_196_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 3, available: 8,
        minSqm: 110, maxSqm: 150, minPriceM: 11.75, maxPriceM: 17.712,
        finishing: "Finished",
        paymentPlan: "5%+5% 8yr (1yr delivery) / 3.5%+3.5% 9yr (2.5yr) / 5% 10yr (4yr)",
        units: [
          { id: "cc-ch3-a", beds: 3, finishing: "Finished", areaSqm: 126, areaNote: "+ Roof Area 17m", view: "Sea & Lagoon", priceEGP: 15_830_000, deliveryNote: "1 Year", paymentPlan: "5% DP + 5% after 3 months, 8 years", status: "Available" },
          { id: "cc-ch3-b", beds: 3, finishing: "Finished", areaSqm: 135, areaNote: "+ Roof Area 18m", view: "Sea & Lagoon", priceEGP: 15_940_000, deliveryNote: "1 Year", paymentPlan: "5% DP + 5% after 3 months, 8 years", status: "Available" },
          { id: "cc-ch3-c", beds: 3, finishing: "Finished", areaSqm: 123, view: "Lagoon", priceEGP: 13_164_000, deliveryNote: "2.5 Years", paymentPlan: "3.5% DP + 3.5% after 3 months, 9 years", status: "Available" },
          { id: "cc-ch3-d", beds: 3, finishing: "Finished", areaSqm: 135, view: "Lagoon", priceEGP: 13_376_000, deliveryNote: "2.5 Years", paymentPlan: "3.5% DP + 3.5% after 3 months, 9 years", status: "Available" },
          { id: "cc-ch3-e", beds: 3, finishing: "Finished", areaSqm: 150, view: "Lagoon", priceEGP: 15_177_000, deliveryNote: "2.5 Years", paymentPlan: "3.5% DP + 3.5% after 3 months, 9 years", status: "Available" },
          { id: "cc-ch3-f", beds: 3, finishing: "Finished", areaSqm: 114, view: "Lagoon", priceEGP: 11_750_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-ch3-g", beds: 3, finishing: "Finished", areaSqm: 114, areaNote: "+ Roof Area 46m", view: "Lagoon", priceEGP: 12_349_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-ch3-h", beds: 3, finishing: "Finished", areaSqm: 110, areaNote: "+ Garden Area 188m", view: "Lagoon", priceEGP: 17_712_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Duplex", beds: 2, available: 4,
        minSqm: 108, maxSqm: 137, minPriceM: 13.502, maxPriceM: 17.017,
        finishing: "Finished",
        paymentPlan: "3.5%+3.5% 9yr or 5% 10yr",
        units: [
          { id: "cc-dp2-a", beds: 2, finishing: "Finished", areaSqm: 122, areaNote: "+ Roof Area 20m", view: "Lagoon", priceEGP: 14_168_000, deliveryNote: "2.5 Years", paymentPlan: "3.5% DP + 3.5% after 3 months, 9 years", status: "Available" },
          { id: "cc-dp2-b", beds: 2, finishing: "Finished", areaSqm: 108, areaNote: "+ Roof Area 17m", view: "Lagoon", priceEGP: 13_502_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-dp2-c", beds: 2, finishing: "Finished", areaSqm: 122, areaNote: "+ Roof Area 20m", view: "Sea & Lagoon", priceEGP: 17_017_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-dp2-d", beds: 2, finishing: "Finished", areaSqm: 137, areaNote: "+ Garden Area 51m", view: "Lagoon", priceEGP: 14_169_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Duplex", beds: 3, available: 3,
        minSqm: 158, maxSqm: 177, minPriceM: 19.292, maxPriceM: 23.337,
        finishing: "Finished",
        paymentPlan: "3.5%+3.5% 9yr or 5% 10yr",
        units: [
          { id: "cc-dp3-a", beds: 3, finishing: "Finished", areaSqm: 165, areaNote: "+ Garden Area 39m", view: "Lagoon", priceEGP: 21_187_000, deliveryNote: "2.5 Years", paymentPlan: "3.5% DP + 3.5% after 3 months, 9 years", status: "Available" },
          { id: "cc-dp3-b", beds: 3, finishing: "Finished", areaSqm: 158, areaNote: "+ Garden Area 45m", view: "Lagoon", priceEGP: 19_292_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-dp3-c", beds: 3, finishing: "Finished", areaSqm: 177, areaNote: "+ Garden Area 200m", view: "Lagoon", priceEGP: 23_337_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Duplex", beds: 4, available: 2,
        minSqm: 184, maxSqm: 184, minPriceM: 21.802, maxPriceM: 23.607,
        finishing: "Finished", deliveryNote: "4 Years",
        paymentPlan: "5% DP over 10 years equal installments",
        units: [
          { id: "cc-dp4-a", beds: 4, finishing: "Finished", areaSqm: 184, areaNote: "+ Roof Area 41m", view: "Lagoon", priceEGP: 21_802_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "cc-dp4-b", beds: 4, finishing: "Finished", areaSqm: 184, areaNote: "+ Roof Area 41m", view: "Sea & Lagoon", priceEGP: 23_607_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Town House", beds: 4, available: 1,
        minSqm: 185, maxSqm: 185, minPriceM: 26.793, maxPriceM: 26.793,
        finishing: "Finished", deliveryNote: "4 Years",
        paymentPlan: "5% DP over 8 years equal installments",
        units: [
          { id: "cc-th-a", beds: 4, finishing: "Finished", areaSqm: 185, view: "Sea", priceEGP: 26_793_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 8 years equal installments", status: "Last Unit" },
        ],
      },
      {
        type: "Twin House", beds: 4, available: 1,
        minSqm: 210, maxSqm: 210, minPriceM: 36.7, maxPriceM: 36.7,
        finishing: "Finished", deliveryNote: "Ready to Move",
        paymentPlan: "20% DP over 5 years",
        units: [
          { id: "cc-tw-a", beds: 4, finishing: "Finished", areaSqm: 210, areaNote: "+ Land 242m", view: "Sea & Lagoon", priceEGP: 36_700_000, deliveryNote: "Ready to Move", paymentPlan: "20% DP, 5 years equal installments", status: "Last Unit" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // AHLY SABBOUR — YOUD
  // Source: Ahly Sabbour fact sheet Jun 2026
  // ══════════════════════════════════════════
  {
    slug: "youd",
    developer: "Al Ahly Sabbour",
    totalAvailable: 42,
    lastUpdated: "2026-06-15",
    note: "Serviced apartments launching soon: 1BR avg 12M, 2BR avg 15M. Multiple payment plan discounts available.",
    breakdown: [
      {
        type: "Apartment", beds: 2, available: 8,
        minSqm: 85, maxSqm: 105, minPriceM: 8.5, maxPriceM: 9.9,
        finishing: "Finished",
        paymentPlan: "5%+5% over 8 yrs (no discount) or up to 22.5%+22.5% for 45% discount",
        units: [
          { id: "youd-apt2-a", beds: 2, finishing: "Finished", areaSqm: 85, priceEGP: 8_500_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "youd-apt2-b", beds: 2, finishing: "Finished", areaSqm: 85, priceEGP: 8_500_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 7.65M", status: "Available" },
          { id: "youd-apt2-c", beds: 2, finishing: "Finished", areaSqm: 85, priceEGP: 8_500_000, paymentPlan: "20% DP 8yr (40% disc) → EGP 5.1M", status: "Available" },
          { id: "youd-apt2-d", beds: 2, finishing: "Finished", areaSqm: 105, priceEGP: 9_900_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "youd-apt2-e", beds: 2, finishing: "Finished", areaSqm: 105, priceEGP: 9_900_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 8.91M", status: "Available" },
          { id: "youd-apt2-f", beds: 2, finishing: "Finished", areaSqm: 105, priceEGP: 9_900_000, paymentPlan: "15%+15% 8yr (30% disc) → EGP 6.93M", status: "Available" },
          { id: "youd-apt2-g", beds: 2, finishing: "Finished", areaSqm: 105, priceEGP: 9_900_000, paymentPlan: "20% DP 8yr (40% disc) → EGP 5.94M", status: "Available" },
          { id: "youd-apt2-h", beds: 2, finishing: "Finished", areaSqm: 105, priceEGP: 9_900_000, paymentPlan: "Cash 50% disc → EGP 4.95M", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 3, available: 6,
        minSqm: 120, maxSqm: 145, minPriceM: 13.5, maxPriceM: 16.5,
        finishing: "Finished",
        paymentPlan: "5%+5% over 8 yrs or multiple discount plans",
        units: [
          { id: "youd-apt3-a", beds: 3, finishing: "Finished", areaSqm: 120, priceEGP: 13_500_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "youd-apt3-b", beds: 3, finishing: "Finished", areaSqm: 120, priceEGP: 13_500_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 12.15M", status: "Available" },
          { id: "youd-apt3-c", beds: 3, finishing: "Finished", areaSqm: 120, priceEGP: 13_500_000, paymentPlan: "20% DP 8yr (40% disc) → EGP 8.1M", status: "Available" },
          { id: "youd-apt3-d", beds: 3, finishing: "Finished", areaSqm: 145, priceEGP: 16_500_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "youd-apt3-e", beds: 3, finishing: "Finished", areaSqm: 145, priceEGP: 16_500_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 14.85M", status: "Available" },
          { id: "youd-apt3-f", beds: 3, finishing: "Finished", areaSqm: 145, priceEGP: 16_500_000, paymentPlan: "20%+20% 8yr (40% disc) → EGP 9.9M", status: "Available" },
        ],
      },
      {
        type: "Twin Villa", beds: 4, available: 4,
        minSqm: 220, maxSqm: 220, minPriceM: 44, maxPriceM: 44,
        finishing: "Finished",
        paymentPlan: "5%+5% over 8 yrs (no discount) or discount plans",
        units: [
          { id: "youd-tw-a", beds: 4, finishing: "Finished", areaSqm: 220, view: "Sea", priceEGP: 44_000_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "youd-tw-b", beds: 4, finishing: "Finished", areaSqm: 220, view: "Sea", priceEGP: 44_000_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 39.6M", status: "Available" },
          { id: "youd-tw-c", beds: 4, finishing: "Finished", areaSqm: 220, view: "Sea", priceEGP: 44_000_000, paymentPlan: "20%+20% 8yr (40% disc) → EGP 26.4M", status: "Available" },
          { id: "youd-tw-d", beds: 4, finishing: "Finished", areaSqm: 220, view: "Sea", priceEGP: 44_000_000, paymentPlan: "Cash 50% disc → EGP 22M", status: "Available" },
        ],
      },
      {
        type: "Standalone Villa", beds: 5, available: 2,
        minSqm: 220, maxSqm: 220, minPriceM: 60, maxPriceM: 60,
        finishing: "Finished",
        paymentPlan: "5%+5% over 8 yrs or discount plans",
        units: [
          { id: "youd-sa-a", beds: 5, finishing: "Finished", areaSqm: 220, view: "Sea", priceEGP: 60_000_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "youd-sa-b", beds: 5, finishing: "Finished", areaSqm: 220, view: "Sea", priceEGP: 60_000_000, paymentPlan: "20%+20% 8yr (40% disc) → EGP 36M", status: "Last Unit" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // AHLY SABBOUR — AT EAST (MOSTAKBAL CITY)
  // ══════════════════════════════════════════
  {
    slug: "at-east",
    developer: "Al Ahly Sabbour",
    totalAvailable: 87,
    lastUpdated: "2026-06-15",
    note: "Core & Shell finish. 4-year delivery. Maintenance 10%. Multiple discount plans available.",
    breakdown: [
      {
        type: "Town House", beds: 3, available: 12,
        minSqm: 165, maxSqm: 165, minPriceM: 16.7, maxPriceM: 16.7,
        finishing: "Core & Shell", paymentPlan: "5%+5% over 8 yrs or discount plans",
        units: [
          { id: "ate-th-a", beds: 3, finishing: "Core & Shell", areaSqm: 165, priceEGP: 16_700_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-th-b", beds: 3, finishing: "Core & Shell", areaSqm: 165, priceEGP: 16_700_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 15.03M", status: "Available" },
          { id: "ate-th-c", beds: 3, finishing: "Core & Shell", areaSqm: 165, priceEGP: 16_700_000, paymentPlan: "20%+20% 8yr (40% disc) → EGP 10.02M", status: "Available" },
        ],
      },
      {
        type: "Twin Villa", beds: 4, available: 15,
        minSqm: 162, maxSqm: 162, minPriceM: 21.8, maxPriceM: 21.8,
        finishing: "Core & Shell", paymentPlan: "5%+5% over 8 yrs or discount plans",
        units: [
          { id: "ate-tvl-a", beds: 4, finishing: "Core & Shell", areaSqm: 162, priceEGP: 21_800_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-tvl-b", beds: 4, finishing: "Core & Shell", areaSqm: 162, priceEGP: 21_800_000, paymentPlan: "10% DP 8yr → EGP 19.62M", status: "Available" },
          { id: "ate-tvl-c", beds: 4, finishing: "Core & Shell", areaSqm: 162, priceEGP: 21_800_000, paymentPlan: "20%+20% 8yr → EGP 13.08M", status: "Available" },
        ],
      },
      {
        type: "Standalone Villa", beds: 4, available: 8,
        minSqm: 210, maxSqm: 250, minPriceM: 24.2, maxPriceM: 31,
        finishing: "Core & Shell", paymentPlan: "5%+5% over 8 yrs",
        units: [
          { id: "ate-sa4-a", beds: 4, finishing: "Core & Shell", areaSqm: 210, priceEGP: 24_200_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-sa4-b", beds: 4, finishing: "Core & Shell", areaSqm: 250, priceEGP: 31_000_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Standalone Villa", beds: 6, available: 4,
        minSqm: 370, maxSqm: 370, minPriceM: 42.75, maxPriceM: 42.75,
        finishing: "Core & Shell", paymentPlan: "5%+5% over 8 yrs",
        units: [
          { id: "ate-sa6-a", beds: 6, finishing: "Core & Shell", areaSqm: 370, priceEGP: 42_750_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 1, available: 8,
        minSqm: 65, maxSqm: 65, minPriceM: 5, maxPriceM: 5.55,
        finishing: "Core & Shell",
        paymentPlan: "5%+5% over 8 yrs (Roofscape — 4th floor only)",
        units: [
          { id: "ate-apt1-a", beds: 1, finishing: "Core & Shell", areaSqm: 65, priceEGP: 5_000_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-apt1-b", beds: 1, finishing: "Core & Shell", areaSqm: 65, priceEGP: 5_550_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 4.995M", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 2, available: 20,
        minSqm: 85, maxSqm: 85, minPriceM: 5.4, maxPriceM: 7,
        finishing: "Core & Shell",
        paymentPlan: "5%+5% over 8 yrs (Roofscape)",
        units: [
          { id: "ate-apt2-a", beds: 2, finishing: "Core & Shell", areaSqm: 85, priceEGP: 5_400_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-apt2-b", beds: 2, finishing: "Core & Shell", areaSqm: 85, priceEGP: 7_000_000, paymentPlan: "10% DP 8yr → EGP 6.3M", status: "Available" },
        ],
      },
      {
        type: "Penthouse", beds: 3, available: 12,
        minSqm: 130, maxSqm: 130, minPriceM: 10.35, maxPriceM: 12,
        finishing: "Core & Shell",
        paymentPlan: "5%+5% over 8 yrs (4th + Roof)",
        units: [
          { id: "ate-ph-a", beds: 3, finishing: "Core & Shell", areaSqm: 130, priceEGP: 10_350_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-ph-b", beds: 3, finishing: "Core & Shell", areaSqm: 130, priceEGP: 12_000_000, paymentPlan: "10% DP 8yr (10% disc) → EGP 10.8M", status: "Available" },
        ],
      },
      {
        type: "Sky Villa", beds: 4, available: 8,
        minSqm: 160, maxSqm: 160, minPriceM: 12.815, maxPriceM: 13.32,
        finishing: "Core & Shell",
        paymentPlan: "5%+5% over 8 yrs (3rd+4th+Roof)",
        units: [
          { id: "ate-sv-a", beds: 4, finishing: "Core & Shell", areaSqm: 160, priceEGP: 12_815_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "ate-sv-b", beds: 4, finishing: "Core & Shell", areaSqm: 160, priceEGP: 13_320_000, paymentPlan: "10% DP 8yr → EGP 11.988M", status: "Available" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // AHLY SABBOUR — THE MORNINGS (NEW CAIRO)
  // ══════════════════════════════════════════
  {
    slug: "the-mornings",
    developer: "Al Ahly Sabbour",
    totalAvailable: 68,
    lastUpdated: "2026-06-15",
    note: "Core & shell + option to finish at 20,000+ EGP/m². 25% cash discount. Admin offices & clinics also available.",
    breakdown: [
      {
        type: "Apartment", beds: 1, available: 12,
        minSqm: 50, maxSqm: 74, minPriceM: 4.3, maxPriceM: 6.5,
        finishing: "Core & Shell",
        paymentPlan: "5% DP + 5% after 3 months, 8 years",
        units: [
          { id: "tm-apt1-a", beds: 1, finishing: "Core & Shell", areaSqm: 50, priceEGP: 4_300_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-apt1-b", beds: 1, finishing: "Core & Shell", areaSqm: 60, priceEGP: 5_200_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-apt1-c", beds: 1, finishing: "Core & Shell", areaSqm: 74, priceEGP: 6_500_000, paymentPlan: "5%+5% over 8 years or 25% cash discount", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 2, available: 28,
        minSqm: 83, maxSqm: 110, minPriceM: 7, maxPriceM: 10.5,
        finishing: "Core & Shell",
        paymentPlan: "5% DP + 5% after 3 months, 8 years",
        units: [
          { id: "tm-apt2-a", beds: 2, finishing: "Core & Shell", areaSqm: 83, priceEGP: 7_000_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-apt2-b", beds: 2, finishing: "Core & Shell", areaSqm: 95, priceEGP: 8_500_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-apt2-c", beds: 2, finishing: "Core & Shell", areaSqm: 110, priceEGP: 10_500_000, paymentPlan: "5%+5% over 8 years or 25% cash discount", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 3, available: 18,
        minSqm: 150, maxSqm: 160, minPriceM: 11.8, maxPriceM: 13.4,
        finishing: "Core & Shell",
        paymentPlan: "5% DP + 5% after 3 months, 8 years",
        units: [
          { id: "tm-apt3-a", beds: 3, finishing: "Core & Shell", areaSqm: 150, priceEGP: 11_800_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-apt3-b", beds: 3, finishing: "Core & Shell", areaSqm: 155, priceEGP: 12_500_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-apt3-c", beds: 3, finishing: "Core & Shell", areaSqm: 160, priceEGP: 13_400_000, paymentPlan: "5%+5% over 8 years or 25% cash discount", status: "Available" },
        ],
      },
      {
        type: "Admin Office", beds: 0, available: 6,
        minSqm: 55, maxSqm: 55, minPriceM: 8.516, maxPriceM: 8.516,
        finishing: "Core & Shell",
        paymentPlan: "5%+5% over 8 years",
        units: [
          { id: "tm-off-a", beds: 0, finishing: "Core & Shell", areaSqm: 55, priceEGP: 8_516_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Medical Clinic", beds: 0, available: 4,
        minSqm: 43, maxSqm: 77, minPriceM: 7.725, maxPriceM: 13.5,
        finishing: "Core & Shell",
        paymentPlan: "5%+5% over 8 years",
        units: [
          { id: "tm-cli-a", beds: 0, finishing: "Core & Shell", areaSqm: 43, priceEGP: 7_725_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "tm-cli-b", beds: 0, finishing: "Core & Shell", areaSqm: 77, priceEGP: 13_500_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // MARAKEZ PROPERTIES — DISTRICT 5
  // Source: Marakez inventory summary Jun 2026
  // ══════════════════════════════════════════
  {
    slug: "district-5",
    developer: "Marakez Properties",
    totalAvailable: 46,
    lastUpdated: "2026-06-14",
    note: "NHF: 10% DP over 7 years. NHN: 5% DP + 5% first installment over 8 years. Only 2 NHN fully finished units (with A/Cs).",
    breakdown: [
      {
        type: "Apartment", beds: 1, cluster: "NHF", available: 6,
        minSqm: 95, maxSqm: 110, minPriceM: 11.29, maxPriceM: 12.39,
        finishing: "Semi Finished", paymentPlan: "10% DP over 7 years",
        units: [
          { id: "d5-nhf-apt1-a", cluster: "NHF", beds: 1, finishing: "Semi Finished", areaSqm: 95, priceEGP: 11_290_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-apt1-b", cluster: "NHF", beds: 1, finishing: "Semi Finished", areaSqm: 102, priceEGP: 11_850_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-apt1-c", cluster: "NHF", beds: 1, finishing: "Semi Finished", areaSqm: 110, priceEGP: 12_390_000, paymentPlan: "10% DP over 7 years", status: "Available" },
        ],
      },
      {
        type: "Garden Apartment", beds: 2, cluster: "NHF", available: 2,
        minSqm: 140, maxSqm: 140, minPriceM: 17.6, maxPriceM: 17.6,
        finishing: "Semi Finished", paymentPlan: "10% DP over 7 years",
        units: [
          { id: "d5-nhf-grd2-a", cluster: "NHF", beds: 2, finishing: "Semi Finished", areaSqm: 140, view: "Garden", priceEGP: 17_600_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-grd2-b", cluster: "NHF", beds: 2, finishing: "Semi Finished", areaSqm: 140, view: "Garden", priceEGP: 17_600_000, paymentPlan: "10% DP over 7 years", status: "Last Unit" },
        ],
      },
      {
        type: "Apartment", beds: 2, cluster: "NHF", available: 8,
        minSqm: 115, maxSqm: 170, minPriceM: 14.22, maxPriceM: 20.61,
        finishing: "Semi Finished", paymentPlan: "10% DP over 7 years",
        units: [
          { id: "d5-nhf-apt2-a", cluster: "NHF", beds: 2, finishing: "Semi Finished", areaSqm: 115, priceEGP: 14_220_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-apt2-b", cluster: "NHF", beds: 2, finishing: "Semi Finished", areaSqm: 140, priceEGP: 17_100_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-apt2-c", cluster: "NHF", beds: 2, finishing: "Semi Finished", areaSqm: 170, priceEGP: 20_610_000, paymentPlan: "10% DP over 7 years", status: "Available" },
        ],
      },
      {
        type: "Duplex", beds: 3, cluster: "NHF", available: 2,
        minSqm: 190, maxSqm: 190, minPriceM: 24.05, maxPriceM: 24.05,
        finishing: "Semi Finished", paymentPlan: "10% DP over 7 years",
        units: [
          { id: "d5-nhf-dup3-a", cluster: "NHF", beds: 3, finishing: "Semi Finished", areaSqm: 190, priceEGP: 24_050_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-dup3-b", cluster: "NHF", beds: 3, finishing: "Semi Finished", areaSqm: 190, priceEGP: 24_050_000, paymentPlan: "10% DP over 7 years", status: "Last Unit" },
        ],
      },
      {
        type: "Apartment", beds: 3, cluster: "NHF", available: 6,
        minSqm: 190, maxSqm: 210, minPriceM: 24.18, maxPriceM: 26.12,
        finishing: "Semi Finished", paymentPlan: "10% DP over 7 years",
        units: [
          { id: "d5-nhf-apt3-a", cluster: "NHF", beds: 3, finishing: "Semi Finished", areaSqm: 190, priceEGP: 24_180_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-apt3-b", cluster: "NHF", beds: 3, finishing: "Semi Finished", areaSqm: 205, priceEGP: 25_200_000, paymentPlan: "10% DP over 7 years", status: "Available" },
          { id: "d5-nhf-apt3-c", cluster: "NHF", beds: 3, finishing: "Semi Finished", areaSqm: 210, priceEGP: 26_120_000, paymentPlan: "10% DP over 7 years", status: "Available" },
        ],
      },
      {
        type: "Typical Loft", beds: 3, cluster: "NHF", available: 1,
        minSqm: 195, maxSqm: 195, minPriceM: 24.89, maxPriceM: 24.89,
        finishing: "Semi Finished", paymentPlan: "10% DP over 7 years",
        units: [
          { id: "d5-nhf-loft-a", cluster: "NHF", beds: 3, finishing: "Semi Finished", areaSqm: 195, priceEGP: 24_890_000, paymentPlan: "10% DP over 7 years", status: "Last Unit" },
        ],
      },
      {
        type: "Garden Apartment", beds: 2, cluster: "NHN", available: 2,
        minSqm: 150, maxSqm: 150, minPriceM: 18.98, maxPriceM: 18.98,
        finishing: "Semi Finished", paymentPlan: "5% DP + 5% first installment over 8 years",
        units: [
          { id: "d5-nhn-grd2-a", cluster: "NHN", beds: 2, finishing: "Semi Finished", areaSqm: 150, view: "Garden", priceEGP: 18_980_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "d5-nhn-grd2-b", cluster: "NHN", beds: 2, finishing: "Semi Finished", areaSqm: 150, view: "Garden", priceEGP: 18_980_000, paymentPlan: "5%+5% over 8 years", status: "Last Unit" },
        ],
      },
      {
        type: "Apartment", beds: 2, cluster: "NHN", available: 10,
        minSqm: 125, maxSqm: 155, minPriceM: 15.88, maxPriceM: 19.96,
        finishing: "Semi Finished (+ 2 Fully Finished)", paymentPlan: "5% DP + 5% first installment over 8 years",
        units: [
          { id: "d5-nhn-apt2-a", cluster: "NHN", beds: 2, finishing: "Semi Finished", areaSqm: 125, priceEGP: 15_880_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "d5-nhn-apt2-b", cluster: "NHN", beds: 2, finishing: "Semi Finished", areaSqm: 145, priceEGP: 17_400_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "d5-nhn-apt2-c", cluster: "NHN", beds: 2, finishing: "Semi Finished", areaSqm: 155, priceEGP: 18_610_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "d5-nhn-apt2-d", cluster: "NHN", beds: 2, finishing: "Finished (with A/Cs)", areaSqm: 155, priceEGP: 19_960_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 3, cluster: "NHN", available: 9,
        minSqm: 200, maxSqm: 210, minPriceM: 25.81, maxPriceM: 26.12,
        finishing: "Semi Finished", paymentPlan: "5% DP + 5% first installment over 8 years",
        units: [
          { id: "d5-nhn-apt3-a", cluster: "NHN", beds: 3, finishing: "Semi Finished", areaSqm: 200, priceEGP: 25_810_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
          { id: "d5-nhn-apt3-b", cluster: "NHN", beds: 3, finishing: "Semi Finished", areaSqm: 210, priceEGP: 26_120_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // MARAKEZ PROPERTIES — CRESCENT WALK
  // ══════════════════════════════════════════
  {
    slug: "crescent-walk",
    developer: "Marakez Properties",
    totalAvailable: 74,
    lastUpdated: "2026-06-14",
    note: "Apartments fully finished without A/Cs. Single-family (Villas, Townhomes, Twinhomes) semi-finished. 8% DP + 4% + rest over 8 years.",
    breakdown: [
      {
        type: "Apartment", beds: 1, cluster: "PS", available: 5,
        minSqm: 75, maxSqm: 90, minPriceM: 8.46, maxPriceM: 9.83,
        finishing: "Finished", paymentPlan: "8% DP + 4% first installment + rest over 8 years",
        units: [
          { id: "cw-ps-apt1-a", cluster: "PS", beds: 1, finishing: "Finished", areaSqm: 75, priceEGP: 8_460_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-ps-apt1-b", cluster: "PS", beds: 1, finishing: "Finished", areaSqm: 82, priceEGP: 9_100_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-ps-apt1-c", cluster: "PS", beds: 1, finishing: "Finished", areaSqm: 90, priceEGP: 9_830_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Garden Apartment", beds: 1, cluster: "PS", available: 1,
        minSqm: 90, maxSqm: 90, minPriceM: 9.49, maxPriceM: 9.49,
        finishing: "Finished", paymentPlan: "8% DP + 4% first installment + rest over 8 years",
        units: [
          { id: "cw-ps-grd1-a", cluster: "PS", beds: 1, finishing: "Finished", areaSqm: 90, view: "Garden", priceEGP: 9_490_000, paymentPlan: "8%+4% over 8 years", status: "Last Unit" },
        ],
      },
      {
        type: "Apartment", beds: 2, cluster: "PS", available: 8,
        minSqm: 100, maxSqm: 140, minPriceM: 12.51, maxPriceM: 16.55,
        finishing: "Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-ps-apt2-a", cluster: "PS", beds: 2, finishing: "Finished", areaSqm: 100, priceEGP: 12_510_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-ps-apt2-b", cluster: "PS", beds: 2, finishing: "Finished", areaSqm: 120, priceEGP: 14_300_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-ps-apt2-c", cluster: "PS", beds: 2, finishing: "Finished", areaSqm: 140, priceEGP: 16_550_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 3, cluster: "PS", available: 6,
        minSqm: 135, maxSqm: 175, minPriceM: 16.24, maxPriceM: 22.03,
        finishing: "Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-ps-apt3-a", cluster: "PS", beds: 3, finishing: "Finished", areaSqm: 135, priceEGP: 16_240_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-ps-apt3-b", cluster: "PS", beds: 3, finishing: "Finished", areaSqm: 155, priceEGP: 18_900_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-ps-apt3-c", cluster: "PS", beds: 3, finishing: "Finished", areaSqm: 175, priceEGP: 22_030_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Apartment", beds: 3, cluster: "PC", available: 4,
        minSqm: 150, maxSqm: 200, minPriceM: 18.29, maxPriceM: 24.98,
        finishing: "Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-pc-apt3-a", cluster: "PC", beds: 3, finishing: "Finished", areaSqm: 150, priceEGP: 18_290_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pc-apt3-b", cluster: "PC", beds: 3, finishing: "Finished", areaSqm: 175, priceEGP: 21_500_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pc-apt3-c", cluster: "PC", beds: 3, finishing: "Finished", areaSqm: 200, priceEGP: 24_980_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Townhome", beds: 3, cluster: "PC", available: 4,
        minSqm: 240, maxSqm: 250, minPriceM: 30.18, maxPriceM: 30.81,
        finishing: "Semi Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-pc-th3-a", cluster: "PC", beds: 3, finishing: "Semi Finished", areaSqm: 240, priceEGP: 30_180_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pc-th3-b", cluster: "PC", beds: 3, finishing: "Semi Finished", areaSqm: 250, priceEGP: 30_810_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Villa", beds: 5, cluster: "PC", available: 6,
        minSqm: 400, maxSqm: 480, minPriceM: 50.58, maxPriceM: 54.65,
        finishing: "Semi Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-pc-vl5-a", cluster: "PC", beds: 5, finishing: "Semi Finished", areaSqm: 400, priceEGP: 50_580_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pc-vl5-b", cluster: "PC", beds: 5, finishing: "Semi Finished", areaSqm: 480, priceEGP: 54_650_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Townhome", beds: 3, cluster: "PE", available: 5,
        minSqm: 220, maxSqm: 240, minPriceM: 27.03, maxPriceM: 29.5,
        finishing: "Semi Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-pe-mth-a", cluster: "PE", beds: 3, finishing: "Semi Finished", areaSqm: 220, priceEGP: 27_030_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pe-mth-b", cluster: "PE", beds: 3, finishing: "Semi Finished", areaSqm: 235, priceEGP: 28_200_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pe-mth-c", cluster: "PE", beds: 3, finishing: "Semi Finished", areaSqm: 240, priceEGP: 29_500_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
      {
        type: "Villa", beds: 5, cluster: "PE", available: 4,
        minSqm: 360, maxSqm: 400, minPriceM: 45.95, maxPriceM: 55.68,
        finishing: "Semi Finished", paymentPlan: "8% DP + 4% + rest over 8 years",
        units: [
          { id: "cw-pe-vl5-a", cluster: "PE", beds: 5, finishing: "Semi Finished", areaSqm: 360, priceEGP: 45_950_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
          { id: "cw-pe-vl5-b", cluster: "PE", beds: 5, finishing: "Semi Finished", areaSqm: 400, priceEGP: 55_680_000, paymentPlan: "8%+4% over 8 years", status: "Available" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // MARAKEZ PROPERTIES — RAMLA (NORTH COAST)
  // ══════════════════════════════════════════
  {
    slug: "ramla-resort",
    developer: "Marakez Properties",
    totalAvailable: 62,
    lastUpdated: "2026-06-14",
    note: "All units fully finished including A/Cs and water heaters. R1 ready-to-move or early delivery. R3 approx. 2 years. Payment plans vary by cluster.",
    breakdown: [
      {
        type: "Chalet", beds: 3, cluster: "R1", available: 1,
        minSqm: 180, maxSqm: 180, minPriceM: 43.61, maxPriceM: 43.61,
        finishing: "Finished", deliveryNote: "Ready to Move",
        paymentPlan: "15% DP + rest over 4 years",
        units: [
          { id: "rm-r1-ch3-a", cluster: "R1", beds: 3, finishing: "Finished", areaSqm: 180, priceEGP: 43_610_000, deliveryNote: "Ready to Move", paymentPlan: "15% DP + rest over 4 years", status: "Last Unit" },
        ],
      },
      {
        type: "Twinhome", beds: 3, cluster: "R1", available: 2,
        minSqm: 280, maxSqm: 320, minPriceM: 54.62, maxPriceM: 59.47,
        finishing: "Finished", deliveryNote: "Ready to Move",
        paymentPlan: "15% DP + rest over 4 years",
        units: [
          { id: "rm-r1-tw3-a", cluster: "R1", beds: 3, finishing: "Finished", areaSqm: 280, priceEGP: 54_620_000, deliveryNote: "Ready to Move", paymentPlan: "15% DP + rest over 4 years", status: "Available" },
          { id: "rm-r1-tw3-b", cluster: "R1", beds: 3, finishing: "Finished", areaSqm: 320, priceEGP: 59_470_000, deliveryNote: "Ready to Move", paymentPlan: "15% DP + rest over 4 years", status: "Available" },
        ],
      },
      {
        type: "Villa", beds: 4, cluster: "R1", available: 3,
        minSqm: 420, maxSqm: 500, minPriceM: 80.46, maxPriceM: 96.76,
        finishing: "Finished", deliveryNote: "Ready to Move",
        paymentPlan: "15% DP + rest over 4 years",
        units: [
          { id: "rm-r1-vl4-a", cluster: "R1", beds: 4, finishing: "Finished", areaSqm: 420, priceEGP: 80_460_000, deliveryNote: "Ready to Move", paymentPlan: "15% DP + rest over 4 years", status: "Available" },
          { id: "rm-r1-vl4-b", cluster: "R1", beds: 4, finishing: "Finished", areaSqm: 480, priceEGP: 90_000_000, deliveryNote: "Ready to Move", paymentPlan: "15% DP + rest over 4 years", status: "Available" },
          { id: "rm-r1-vl4-c", cluster: "R1", beds: 4, finishing: "Finished", areaSqm: 500, priceEGP: 96_760_000, deliveryNote: "Ready to Move", paymentPlan: "15% DP + rest over 4 years", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 2, cluster: "R2", available: 8,
        minSqm: 120, maxSqm: 160, minPriceM: 24.56, maxPriceM: 33.14,
        finishing: "Finished",
        paymentPlan: "5%+5% over 7yr / 5%+5% over 8yr / 10%+rest over 8yr",
        units: [
          { id: "rm-r2-ch2-a", cluster: "R2", beds: 2, finishing: "Finished", areaSqm: 120, priceEGP: 24_560_000, paymentPlan: "5%+5% over 7 years (Option 1)", status: "Available" },
          { id: "rm-r2-ch2-b", cluster: "R2", beds: 2, finishing: "Finished", areaSqm: 135, priceEGP: 27_910_000, paymentPlan: "5%+5% over 7 years (Option 1)", status: "Available" },
          { id: "rm-r2-ch2-c", cluster: "R2", beds: 2, finishing: "Finished", areaSqm: 148, priceEGP: 28_890_000, paymentPlan: "5%+5% over 8 years front-loaded (Option 2)", status: "Available" },
          { id: "rm-r2-ch2-d", cluster: "R2", beds: 2, finishing: "Finished", areaSqm: 160, priceEGP: 33_140_000, paymentPlan: "10% DP + rest over 8yr + 10% on delivery (Option 3)", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 3, cluster: "R2", available: 6,
        minSqm: 165, maxSqm: 210, minPriceM: 31.03, maxPriceM: 41.65,
        finishing: "Finished",
        paymentPlan: "5%+5% 7yr / 5%+5% 8yr / 10%+8yr",
        units: [
          { id: "rm-r2-ch3-a", cluster: "R2", beds: 3, finishing: "Finished", areaSqm: 165, priceEGP: 31_030_000, paymentPlan: "5%+5% over 7 years", status: "Available" },
          { id: "rm-r2-ch3-b", cluster: "R2", beds: 3, finishing: "Finished", areaSqm: 190, priceEGP: 35_400_000, paymentPlan: "5%+5% over 7 years", status: "Available" },
          { id: "rm-r2-ch3-c", cluster: "R2", beds: 3, finishing: "Finished", areaSqm: 210, priceEGP: 41_650_000, paymentPlan: "10% DP + rest 8yr + 10% delivery", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 2, cluster: "R3", available: 4,
        minSqm: 120, maxSqm: 130, minPriceM: 22.72, maxPriceM: 23.86,
        finishing: "Finished", deliveryNote: "~2 Years",
        paymentPlan: "10% DP + rest over 5 years",
        units: [
          { id: "rm-r3-ch2-a", cluster: "R3", beds: 2, finishing: "Finished", areaSqm: 120, priceEGP: 22_720_000, deliveryNote: "~2 Years", paymentPlan: "10% DP + rest over 5 years", status: "Available" },
          { id: "rm-r3-ch2-b", cluster: "R3", beds: 2, finishing: "Finished", areaSqm: 130, priceEGP: 23_860_000, deliveryNote: "~2 Years", paymentPlan: "10% DP + rest over 5 years", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 3, cluster: "R3", available: 6,
        minSqm: 165, maxSqm: 175, minPriceM: 31.97, maxPriceM: 32.49,
        finishing: "Finished", deliveryNote: "~2 Years",
        paymentPlan: "10% DP + rest over 5 years",
        units: [
          { id: "rm-r3-ch3-a", cluster: "R3", beds: 3, finishing: "Finished", areaSqm: 165, priceEGP: 31_970_000, deliveryNote: "~2 Years", paymentPlan: "10% DP + rest over 5 years", status: "Available" },
          { id: "rm-r3-ch3-b", cluster: "R3", beds: 3, finishing: "Finished", areaSqm: 175, priceEGP: 32_490_000, deliveryNote: "~2 Years", paymentPlan: "10% DP + rest over 5 years", status: "Available" },
        ],
      },
      {
        type: "Chalet", beds: 3, cluster: "R6", available: 5,
        minSqm: 155, maxSqm: 170, minPriceM: 25.18, maxPriceM: 27.36,
        finishing: "Finished",
        paymentPlan: "5%+5% 7yr / 5%+5% 8yr / 10%+8yr",
        units: [
          { id: "rm-r6-ch3-a", cluster: "R6", beds: 3, finishing: "Finished", areaSqm: 155, priceEGP: 25_180_000, paymentPlan: "5%+5% over 7 years", status: "Available" },
          { id: "rm-r6-ch3-b", cluster: "R6", beds: 3, finishing: "Finished", areaSqm: 170, priceEGP: 27_360_000, paymentPlan: "5%+5% over 8 years", status: "Available" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // MARAKEZ — AEON (NORTH TOWER)
  // ══════════════════════════════════════════
  {
    slug: "aeon",
    developer: "Marakez Properties",
    totalAvailable: 4,
    lastUpdated: "2026-06-14",
    note: "Premium North Tower. Warm-finish specification. Very limited availability.",
    breakdown: [
      {
        type: "Apartment", beds: 3, available: 4,
        minSqm: 220, maxSqm: 240, minPriceM: 36, maxPriceM: 36,
        finishing: "Finished (Warm Finish)",
        paymentPlan: "Contact Marakez for current plan",
        units: [
          { id: "aeon-apt3-a", beds: 3, finishing: "Finished (Warm Finish)", areaSqm: 220, priceEGP: 36_000_000, paymentPlan: "Contact PropTrack advisor for plan details", status: "Available" },
          { id: "aeon-apt3-b", beds: 3, finishing: "Finished (Warm Finish)", areaSqm: 230, priceEGP: 36_000_000, paymentPlan: "Contact PropTrack advisor for plan details", status: "Available" },
          { id: "aeon-apt3-c", beds: 3, finishing: "Finished (Warm Finish)", areaSqm: 235, priceEGP: 36_000_000, paymentPlan: "Contact PropTrack advisor for plan details", status: "Available" },
          { id: "aeon-apt3-d", beds: 3, finishing: "Finished (Warm Finish)", areaSqm: 240, priceEGP: 36_000_000, paymentPlan: "Contact PropTrack advisor for plan details", status: "Last Unit" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // PRE DEVELOPMENTS — TELAL SOUL
  // ══════════════════════════════════════════
  {
    slug: "telal-soul",
    developer: "PRE Developments",
    totalAvailable: 38,
    lastUpdated: "2026-06-14",
    note: "All units fully finished. 1,300m beachfront. Reserve with 100K EGP (fully refundable). Delivery 4 years.",
    breakdown: [
      {
        type: "Chalet", beds: 3, available: 18,
        minSqm: 135, maxSqm: 135, minPriceM: 12.4, maxPriceM: 16.2,
        finishing: "Finished",
        paymentPlan: "5% DP 8yr / 5% DP 10yr",
        units: [
          { id: "ts-ch3-typ-a", beds: 3, finishing: "Finished", areaSqm: 135, priceEGP: 12_400_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 8 years equal installments", status: "Available" },
          { id: "ts-ch3-typ-b", beds: 3, finishing: "Finished", areaSqm: 135, priceEGP: 12_400_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "ts-ch3-grd-a", beds: 3, finishing: "Finished", areaSqm: 135, areaNote: "+ Garden Area", view: "Lagoon", priceEGP: 16_200_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 8 years equal installments", status: "Available" },
          { id: "ts-ch3-grd-b", beds: 3, finishing: "Finished", areaSqm: 135, areaNote: "+ Garden Area", view: "Lagoon", priceEGP: 16_200_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Twin House", beds: 4, available: 12,
        minSqm: 225, maxSqm: 250, minPriceM: 41.25, maxPriceM: 46,
        finishing: "Finished",
        paymentPlan: "5% DP 8yr / 5% DP 10yr",
        units: [
          { id: "ts-tw-a", beds: 4, finishing: "Finished", areaSqm: 225, priceEGP: 41_250_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 8 years equal installments", status: "Available" },
          { id: "ts-tw-b", beds: 4, finishing: "Finished", areaSqm: 238, priceEGP: 43_500_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 8 years equal installments", status: "Available" },
          { id: "ts-tw-c", beds: 4, finishing: "Finished", areaSqm: 250, priceEGP: 46_000_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
      {
        type: "Standalone Villa", beds: 5, available: 8,
        minSqm: 315, maxSqm: 315, minPriceM: 52.1, maxPriceM: 55,
        finishing: "Finished",
        paymentPlan: "5% DP 8yr / 5% DP 10yr",
        units: [
          { id: "ts-sa-a", beds: 5, finishing: "Finished", areaSqm: 315, view: "Lagoon", priceEGP: 52_100_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 8 years equal installments", status: "Available" },
          { id: "ts-sa-b", beds: 5, finishing: "Finished", areaSqm: 315, view: "Lagoon", priceEGP: 52_100_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
          { id: "ts-sa-c", beds: 5, finishing: "Finished", areaSqm: 315, view: "Sea & Lagoon", priceEGP: 55_000_000, deliveryNote: "4 Years", paymentPlan: "5% DP, 10 years equal installments", status: "Available" },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════
  // TATWEER MISR — FOUKA BAY
  // ══════════════════════════════════════════
  {
    slug: "fouka-bay",
    developer: "Tatweer Misr",
    totalAvailable: 45,
    lastUpdated: "2026-06-14",
    note: "KM 185 North Coast. 294 acres, 850m beach. 90% sea & water views. All units Tatweer Misr fully-finished standard.",
    breakdown: [
      {
        type: "Chalet", beds: 2, available: 12,
        minSqm: 80, maxSqm: 110, minPriceM: 9, maxPriceM: 13,
        finishing: "Finished", paymentPlan: "Contact for current plan",
      },
      {
        type: "Chalet", beds: 3, available: 15,
        minSqm: 120, maxSqm: 150, minPriceM: 14, maxPriceM: 19,
        finishing: "Finished", paymentPlan: "Contact for current plan",
      },
      {
        type: "Twin House", beds: 4, available: 10,
        minSqm: 200, maxSqm: 250, minPriceM: 25, maxPriceM: 35,
        finishing: "Finished", paymentPlan: "Contact for current plan",
      },
      {
        type: "Villa", beds: 5, available: 8,
        minSqm: 300, maxSqm: 400, minPriceM: 40, maxPriceM: 65,
        finishing: "Finished", paymentPlan: "Contact for current plan",
      },
    ],
  },

  // ══════════════════════════════════════════
  // TATWEER MISR — IL MONTE GALALA
  // ══════════════════════════════════════════
  {
    slug: "il-monte-galala",
    developer: "Tatweer Misr",
    totalAvailable: 28,
    lastUpdated: "2026-06-14",
    note: "Ain Sokhna's mountain-sea masterpiece. All units fully finished by Mona Hussein Design House. 11 clubhouses.",
    breakdown: [
      {
        type: "Chalet", beds: 2, available: 6,
        minSqm: 80, maxSqm: 110, minPriceM: 8, maxPriceM: 12,
        finishing: "Finished", paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Chalet", beds: 3, available: 8,
        minSqm: 120, maxSqm: 160, minPriceM: 13, maxPriceM: 19,
        finishing: "Finished", paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Twin House", beds: 4, available: 8,
        minSqm: 200, maxSqm: 280, minPriceM: 22, maxPriceM: 35,
        finishing: "Finished", paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Villa", beds: 5, available: 6,
        minSqm: 320, maxSqm: 450, minPriceM: 42, maxPriceM: 70,
        finishing: "Finished", paymentPlan: "Contact advisor for current plan",
      },
    ],
  },

  // ══════════════════════════════════════════
  // TATWEER MISR — BLOOMFIELDS
  // ══════════════════════════════════════════
  {
    slug: "bloomfields",
    developer: "Tatweer Misr",
    totalAvailable: 82,
    lastUpdated: "2026-06-14",
    note: "Mostakbal City. Choose finishing: fully finished (Mona Hussein), semi-finished, or core & shell. Regus-operated serviced offices.",
    breakdown: [
      {
        type: "Apartment", beds: 1, available: 18,
        minSqm: 70, maxSqm: 90, minPriceM: 6, maxPriceM: 9,
        finishing: "Fully / Semi / Core & Shell",
        paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Apartment", beds: 2, available: 22,
        minSqm: 100, maxSqm: 140, minPriceM: 9, maxPriceM: 15,
        finishing: "Fully / Semi / Core & Shell",
        paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Town House", beds: 3, available: 20,
        minSqm: 190, maxSqm: 240, minPriceM: 18, maxPriceM: 28,
        finishing: "Fully / Semi / Core & Shell",
        paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Villa", beds: 4, available: 14,
        minSqm: 260, maxSqm: 360, minPriceM: 32, maxPriceM: 55,
        finishing: "Fully / Semi / Core & Shell",
        paymentPlan: "Contact advisor for current plan",
      },
      {
        type: "Serviced Office", beds: 0, available: 8,
        minSqm: 65, maxSqm: 115, minPriceM: 8.5, maxPriceM: 15,
        finishing: "Fitted", paymentPlan: "7 years — operated by Regus",
      },
    ],
  },

  // ══════════════════════════════════════════
  // TATWEER MISR — SALT
  // ══════════════════════════════════════════
  {
    slug: "salt",
    developer: "Tatweer Misr",
    totalAvailable: 35,
    lastUpdated: "2026-06-14",
    note: "KM 185 North Coast. 25 acres Crystal Lagoon. 25 acres lagoons. 90% sea view.",
    breakdown: [
      {
        type: "Chalet", beds: 2, available: 10,
        minSqm: 75, maxSqm: 105, minPriceM: 8, maxPriceM: 12,
        finishing: "Finished", paymentPlan: "Contact advisor",
      },
      {
        type: "Chalet", beds: 3, available: 14,
        minSqm: 120, maxSqm: 155, minPriceM: 12, maxPriceM: 18,
        finishing: "Finished", paymentPlan: "Contact advisor",
      },
      {
        type: "Villa", beds: 4, available: 11,
        minSqm: 250, maxSqm: 350, minPriceM: 30, maxPriceM: 52,
        finishing: "Finished", paymentPlan: "Contact advisor",
      },
    ],
  },

  // ══════════════════════════════════════════
  // PALM HILLS DEVELOPMENTS
  // Source: Palm Hills availability 11-Jun-2026
  // ══════════════════════════════════════════
  {
    slug: "palm-parks",
    developer: "Palm Hills Developments",
    totalAvailable: 10,
    breakdown: [
      { type: "Apartment", available: 10, minSqm: 132, maxSqm: 170, minPriceM: 16.9, maxPriceM: 20.7 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-bay",
    developer: "Palm Hills Developments",
    totalAvailable: 1,
    breakdown: [
      { type: "Villa", available: 1, minSqm: 358, maxSqm: 358, minPriceM: 141.3, maxPriceM: 141.3 },
    ],
    lastUpdated: "2026-06-11",
    note: "Very limited — final release",
  },
  {
    slug: "97-hills",
    developer: "Palm Hills Developments",
    totalAvailable: 53,
    breakdown: [
      { type: "Apartment", available: 32, minSqm: 183, maxSqm: 193, minPriceM: 26.8, maxPriceM: 27.6 },
      { type: "Town House", available: 7, minSqm: 224, maxSqm: 226, minPriceM: 32.6, maxPriceM: 35.9 },
      { type: "Twin House", available: 2, minSqm: 226, maxSqm: 226, minPriceM: 38.1, maxPriceM: 39.6 },
      { type: "Villa", available: 12, minSqm: 206, maxSqm: 417, minPriceM: 38.5, maxPriceM: 62.0 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "palm-hills-alexandria",
    developer: "Palm Hills Developments",
    totalAvailable: 40,
    breakdown: [
      { type: "Apartment", available: 13, minSqm: 90, maxSqm: 179, minPriceM: 10.4, maxPriceM: 20.3 },
      { type: "Town House", available: 21, minSqm: 194, maxSqm: 197, minPriceM: 29.8, maxPriceM: 32.1 },
      { type: "Villa", available: 6, minSqm: 283, maxSqm: 384, minPriceM: 58.1, maxPriceM: 78.1 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "bamboo-iii",
    developer: "Palm Hills Developments",
    totalAvailable: 43,
    breakdown: [
      { type: "Apartment", available: 21, minSqm: 191, maxSqm: 192, minPriceM: 27.3, maxPriceM: 29.2 },
      { type: "Town House", available: 22, minSqm: 221, maxSqm: 222, minPriceM: 32.6, maxPriceM: 34.4 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "the-crown-extension",
    developer: "Palm Hills Developments",
    totalAvailable: 52,
    breakdown: [
      { type: "Apartment", available: 52, minSqm: 217, maxSqm: 223, minPriceM: 29.0, maxPriceM: 31.5 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "badya",
    developer: "Palm Hills Developments",
    totalAvailable: 443,
    breakdown: [
      { type: "Apartment", available: 343, minSqm: 60, maxSqm: 253, minPriceM: 5.4, maxPriceM: 21.4 },
      { type: "Villa", available: 53, minSqm: 180, maxSqm: 504, minPriceM: 23.6, maxPriceM: 58.1 },
      { type: "Town House", available: 47, minSqm: 191, maxSqm: 194, minPriceM: 20.2, maxPriceM: 23.1 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-blue",
    developer: "Palm Hills Developments",
    totalAvailable: 22,
    breakdown: [
      { type: "Chalet", available: 20, minSqm: 115, maxSqm: 164, minPriceM: 23.3, maxPriceM: 30.1 },
      { type: "Villa", available: 2, minSqm: 278, maxSqm: 278, minPriceM: 69.6, maxPriceM: 69.6 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-heneish",
    developer: "Palm Hills Developments",
    totalAvailable: 3,
    breakdown: [
      { type: "Chalet", available: 1, minSqm: 156, maxSqm: 156, minPriceM: 27.8, maxPriceM: 27.8 },
      { type: "Town House", available: 2, minSqm: 196, maxSqm: 199, minPriceM: 37.5, maxPriceM: 43.8 },
    ],
    lastUpdated: "2026-06-11",
    note: "Very limited — final units",
  },
  {
    slug: "hacienda-waters",
    developer: "Palm Hills Developments",
    totalAvailable: 223,
    breakdown: [
      { type: "Chalet", available: 144, minSqm: 65, maxSqm: 151, minPriceM: 13.5, maxPriceM: 23.7 },
      { type: "Cabin", available: 74, minSqm: 42, maxSqm: 46, minPriceM: 18.7, maxPriceM: 22.8 },
      { type: "Villa", available: 5, minSqm: 278, maxSqm: 374, minPriceM: 72.2, maxPriceM: 110.1 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "palm-hills-jirian",
    developer: "Palm Hills Developments",
    totalAvailable: 465,
    breakdown: [
      { type: "Apartment", available: 422, minSqm: 62, maxSqm: 220, minPriceM: 7.9, maxPriceM: 26.5 },
      { type: "Villa", available: 32, minSqm: 196, maxSqm: 405, minPriceM: 33.6, maxPriceM: 95.0 },
      { type: "Town House", available: 11, minSqm: 174, maxSqm: 176, minPriceM: 22.8, maxPriceM: 24.6 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "palm-hills-one",
    developer: "Palm Hills Developments",
    totalAvailable: 59,
    breakdown: [
      { type: "Town House", available: 17, minSqm: 358, maxSqm: 358, minPriceM: 47.5, maxPriceM: 48.0 },
      { type: "Twin House", available: 15, minSqm: 340, maxSqm: 358, minPriceM: 58.0, maxPriceM: 71.8 },
      { type: "Villa", available: 27, minSqm: 195, maxSqm: 673, minPriceM: 86.1, maxPriceM: 340.4 },
    ],
    lastUpdated: "2026-06-11",
    note: "Ultra-premium collection",
  },
  {
    slug: "palm-hills-new-cairo",
    developer: "Palm Hills Developments",
    totalAvailable: 81,
    breakdown: [
      { type: "Apartment", available: 81, minSqm: 114, maxSqm: 200, minPriceM: 14.6, maxPriceM: 28.2 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "px",
    developer: "Palm Hills Developments",
    totalAvailable: 296,
    breakdown: [
      { type: "Apartment", available: 224, minSqm: 78, maxSqm: 172, minPriceM: 14.0, maxPriceM: 30.5 },
      { type: "Town House", available: 72, minSqm: 201, maxSqm: 214, minPriceM: 27.1, maxPriceM: 31.6 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "village-de-la-capitale",
    developer: "Palm Hills Developments",
    totalAvailable: 209,
    breakdown: [
      { type: "Apartment", available: 155, minSqm: 146, maxSqm: 150, minPriceM: 13.6, maxPriceM: 14.1 },
      { type: "Villa", available: 54, minSqm: 185, maxSqm: 262, minPriceM: 29.2, maxPriceM: 41.7 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-west",
    developer: "Palm Hills Developments",
    totalAvailable: 16,
    breakdown: [
      { type: "Chalet", available: 7, minSqm: 111, maxSqm: 205, minPriceM: 17.2, maxPriceM: 27.1 },
      { type: "Cabin", available: 8, minSqm: 112, maxSqm: 179, minPriceM: 32.2, maxPriceM: 75.0 },
      { type: "Villa", available: 1, minSqm: 340, maxSqm: 340, minPriceM: 118.9, maxPriceM: 118.9 },
    ],
    lastUpdated: "2026-06-11",
    note: "Final units — last phase",
  },

  // ══════════════════════════════════════════
  // MOUNTAIN VIEW
  // Source: Mountain View availability 14-Jun-2026
  // ══════════════════════════════════════════
  {
    slug: "lvls",
    developer: "Mountain View",
    totalAvailable: 4,
    breakdown: [
      { type: "Beach House", available: 2, minSqm: 145, maxSqm: 145, minPriceM: 21.5, maxPriceM: 21.5 },
      { type: "Town House", available: 2, minSqm: 185, maxSqm: 185, minPriceM: 36.0, maxPriceM: 38.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Very limited — almost sold out",
  },
  {
    slug: "mountain-view-aliva",
    developer: "Mountain View",
    totalAvailable: 236,
    breakdown: [
      { type: "Millennial Apartment", available: 78, minSqm: 115, maxSqm: 130, minPriceM: 12.0, maxPriceM: 18.5 },
      { type: "Garden Millennial", available: 85, minSqm: 115, maxSqm: 135, minPriceM: 14.8, maxPriceM: 20.5 },
      { type: "I-Villa", available: 42, minSqm: 220, maxSqm: 300, minPriceM: 28.0, maxPriceM: 48.0 },
      { type: "Villa", available: 18, minSqm: 280, maxSqm: 350, minPriceM: 42.0, maxPriceM: 59.0 },
      { type: "Town House", available: 13, minSqm: 230, maxSqm: 270, minPriceM: 35.0, maxPriceM: 45.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-icity-new-cairo",
    developer: "Mountain View",
    totalAvailable: 25,
    breakdown: [
      { type: "Garden Apartment", available: 12, minSqm: 110, maxSqm: 155, minPriceM: 14.0, maxPriceM: 22.0 },
      { type: "Lake House", available: 5, minSqm: 250, maxSqm: 320, minPriceM: 45.0, maxPriceM: 68.0 },
      { type: "Palace", available: 3, minSqm: 420, maxSqm: 565, minPriceM: 72.0, maxPriceM: 88.0 },
      { type: "Villa", available: 5, minSqm: 280, maxSqm: 380, minPriceM: 38.0, maxPriceM: 58.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-jirian",
    developer: "Mountain View",
    totalAvailable: 188,
    breakdown: [
      { type: "Apartment", available: 48, minSqm: 60, maxSqm: 145, minPriceM: 8.0, maxPriceM: 18.5 },
      { type: "Garden Apartment", available: 32, minSqm: 90, maxSqm: 150, minPriceM: 10.0, maxPriceM: 20.0 },
      { type: "Town House", available: 38, minSqm: 170, maxSqm: 240, minPriceM: 18.5, maxPriceM: 28.0 },
      { type: "Twin House", available: 28, minSqm: 180, maxSqm: 260, minPriceM: 22.0, maxPriceM: 35.0 },
      { type: "Villa", available: 22, minSqm: 220, maxSqm: 320, minPriceM: 32.0, maxPriceM: 52.0 },
      { type: "One Storey", available: 20, minSqm: 220, maxSqm: 280, minPriceM: 38.0, maxPriceM: 48.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-icity-october",
    developer: "Mountain View",
    totalAvailable: 224,
    breakdown: [
      { type: "I-Apartment", available: 82, minSqm: 110, maxSqm: 200, minPriceM: 9.0, maxPriceM: 22.0 },
      { type: "Garden Apartment", available: 64, minSqm: 110, maxSqm: 165, minPriceM: 10.0, maxPriceM: 20.0 },
      { type: "I-Villa", available: 35, minSqm: 220, maxSqm: 310, minPriceM: 28.0, maxPriceM: 50.0 },
      { type: "Park Villa", available: 18, minSqm: 280, maxSqm: 385, minPriceM: 42.0, maxPriceM: 64.0 },
      { type: "Sky Loft", available: 14, minSqm: 200, maxSqm: 280, minPriceM: 22.0, maxPriceM: 38.0 },
      { type: "Millennial", available: 11, minSqm: 130, maxSqm: 175, minPriceM: 14.0, maxPriceM: 22.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-ras-el-hekma",
    developer: "Mountain View",
    totalAvailable: 18,
    breakdown: [
      { type: "Twin House", available: 6, minSqm: 154, maxSqm: 170, minPriceM: 25.0, maxPriceM: 35.0 },
      { type: "Town House", available: 7, minSqm: 165, maxSqm: 180, minPriceM: 24.0, maxPriceM: 33.0 },
      { type: "Villa", available: 5, minSqm: 200, maxSqm: 225, minPriceM: 48.0, maxPriceM: 62.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Phase 2 — limited release",
  },
  {
    slug: "mountain-view-kingsway",
    developer: "Mountain View",
    totalAvailable: 2,
    breakdown: [
      { type: "Town House", available: 2, minSqm: 185, maxSqm: 185, minPriceM: 16.7, maxPriceM: 17.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Almost sold out",
  },
  {
    slug: "mountain-view-grand-valley",
    developer: "Mountain View",
    totalAvailable: 62,
    breakdown: [
      { type: "Grand View Villa", available: 62, minSqm: 250, maxSqm: 250, minPriceM: 30.0, maxPriceM: 38.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-chillout",
    developer: "Mountain View",
    totalAvailable: 4,
    breakdown: [
      { type: "Town House", available: 4, minSqm: 210, maxSqm: 220, minPriceM: 22.0, maxPriceM: 25.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Very limited",
  },
  {
    slug: "mountain-view-crystal",
    developer: "Mountain View",
    totalAvailable: 276,
    breakdown: [
      { type: "Chalet", available: 110, minSqm: 50, maxSqm: 110, minPriceM: 10.0, maxPriceM: 22.0 },
      { type: "Town House", available: 65, minSqm: 155, maxSqm: 210, minPriceM: 22.0, maxPriceM: 42.0 },
      { type: "Beach House", available: 48, minSqm: 120, maxSqm: 190, minPriceM: 28.0, maxPriceM: 55.0 },
      { type: "Cabana", available: 30, minSqm: 50, maxSqm: 70, minPriceM: 14.0, maxPriceM: 22.0 },
      { type: "One Storey", available: 23, minSqm: 220, maxSqm: 285, minPriceM: 65.0, maxPriceM: 122.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-mv4",
    developer: "Mountain View",
    totalAvailable: 22,
    breakdown: [
      { type: "Town House", available: 15, minSqm: 210, maxSqm: 230, minPriceM: 23.0, maxPriceM: 30.0 },
      { type: "Villa", available: 7, minSqm: 240, maxSqm: 245, minPriceM: 30.0, maxPriceM: 37.0 },
    ],
    lastUpdated: "2026-06-14",
  },

  // ══════════════════════════════════════════
  // MADINET MASR
  // ══════════════════════════════════════════
  {
    slug: "esse-residence",
    developer: "Madinet Masr",
    totalAvailable: 174,
    breakdown: [
      { type: "Apartment", available: 120, minSqm: 50, maxSqm: 160, minPriceM: 4.0, maxPriceM: 15.0 },
      { type: "Villa", available: 54, minSqm: 180, maxSqm: 239, minPriceM: 18.0, maxPriceM: 27.2 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "rai-valleys",
    developer: "Madinet Masr",
    totalAvailable: 37,
    breakdown: [
      { type: "Villa", available: 37, minSqm: 175, maxSqm: 212, minPriceM: 17.0, maxPriceM: 28.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "the-butterfly",
    developer: "Madinet Masr",
    totalAvailable: 367,
    breakdown: [
      { type: "Apartment", available: 280, minSqm: 74, maxSqm: 175, minPriceM: 6.0, maxPriceM: 20.0 },
      { type: "Villa", available: 87, minSqm: 180, maxSqm: 259, minPriceM: 22.0, maxPriceM: 35.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "club-views",
    developer: "Madinet Masr",
    totalAvailable: 212,
    breakdown: [
      { type: "Apartment", available: 165, minSqm: 63, maxSqm: 155, minPriceM: 5.0, maxPriceM: 15.0 },
      { type: "Villa", available: 47, minSqm: 165, maxSqm: 239, minPriceM: 18.0, maxPriceM: 25.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "talala",
    developer: "Madinet Masr",
    totalAvailable: 1040,
    breakdown: [
      { type: "Apartment", available: 820, minSqm: 48, maxSqm: 180, minPriceM: 4.0, maxPriceM: 22.0 },
      { type: "Villa", available: 220, minSqm: 160, maxSqm: 288, minPriceM: 20.0, maxPriceM: 46.0 },
    ],
    lastUpdated: "2026-06",
    note: "Largest community by Madinet Masr",
  },
  {
    slug: "sheya-residence",
    developer: "Madinet Masr",
    totalAvailable: 26,
    breakdown: [
      { type: "Apartment", available: 26, minSqm: 81, maxSqm: 220, minPriceM: 6.0, maxPriceM: 20.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "elm-tree-park",
    developer: "Madinet Masr",
    totalAvailable: 521,
    breakdown: [
      { type: "Apartment", available: 380, minSqm: 50, maxSqm: 155, minPriceM: 4.0, maxPriceM: 17.0 },
      { type: "Villa", available: 141, minSqm: 165, maxSqm: 239, minPriceM: 18.0, maxPriceM: 30.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "origami",
    developer: "Madinet Masr",
    totalAvailable: 23,
    breakdown: [
      { type: "Apartment", available: 23, minSqm: 115, maxSqm: 131, minPriceM: 10.0, maxPriceM: 12.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "origami-golf",
    developer: "Madinet Masr",
    totalAvailable: 8,
    breakdown: [
      { type: "Apartment", available: 8, minSqm: 81, maxSqm: 129, minPriceM: 7.0, maxPriceM: 12.0 },
    ],
    lastUpdated: "2026-06",
    note: "Golf course views",
  },

  // ══════════════════════════════════════════
  // SODIC
  // Source: SODIC availability 14-Jun-2026
  // ══════════════════════════════════════════
  {
    slug: "o-west",
    developer: "SODIC",
    totalAvailable: 197,
    breakdown: [
      { type: "Chalet", available: 45, minSqm: 150, maxSqm: 190, minPriceM: 23.0, maxPriceM: 38.0 },
      { type: "Town House", available: 52, minSqm: 200, maxSqm: 280, minPriceM: 35.0, maxPriceM: 68.0 },
      { type: "Twin House", available: 40, minSqm: 250, maxSqm: 320, minPriceM: 55.0, maxPriceM: 95.0 },
      { type: "Villa", available: 60, minSqm: 285, maxSqm: 394, minPriceM: 80.0, maxPriceM: 246.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Premium masterplan — 6th October",
  },
  {
    slug: "botanica",
    developer: "SODIC",
    totalAvailable: 156,
    breakdown: [
      { type: "Chalet", available: 156, minSqm: 123, maxSqm: 144, minPriceM: 17.0, maxPriceM: 20.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "karmell",
    developer: "SODIC",
    totalAvailable: 260,
    breakdown: [
      { type: "Apartment", available: 120, minSqm: 82, maxSqm: 160, minPriceM: 11.0, maxPriceM: 28.0 },
      { type: "Duplex", available: 48, minSqm: 170, maxSqm: 240, minPriceM: 28.0, maxPriceM: 55.0 },
      { type: "Villa", available: 52, minSqm: 280, maxSqm: 384, minPriceM: 55.0, maxPriceM: 83.0 },
      { type: "Town House", available: 40, minSqm: 200, maxSqm: 270, minPriceM: 35.0, maxPriceM: 60.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "vye-sodic",
    developer: "SODIC",
    totalAvailable: 76,
    breakdown: [
      { type: "Apartment", available: 28, minSqm: 108, maxSqm: 160, minPriceM: 16.0, maxPriceM: 28.0 },
      { type: "Town House", available: 24, minSqm: 175, maxSqm: 215, minPriceM: 28.0, maxPriceM: 40.0 },
      { type: "Twin House", available: 24, minSqm: 200, maxSqm: 239, minPriceM: 35.0, maxPriceM: 47.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "sodic-east",
    developer: "SODIC",
    totalAvailable: 183,
    breakdown: [
      { type: "Apartment", available: 85, minSqm: 125, maxSqm: 220, minPriceM: 13.0, maxPriceM: 35.0 },
      { type: "Town House", available: 50, minSqm: 200, maxSqm: 280, minPriceM: 30.0, maxPriceM: 55.0 },
      { type: "Villa", available: 48, minSqm: 310, maxSqm: 427, minPriceM: 55.0, maxPriceM: 75.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "villette",
    developer: "SODIC",
    totalAvailable: 13,
    breakdown: [
      { type: "Apartment", available: 8, minSqm: 109, maxSqm: 175, minPriceM: 23.0, maxPriceM: 38.0 },
      { type: "Duplex", available: 5, minSqm: 195, maxSqm: 239, minPriceM: 42.0, maxPriceM: 57.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Limited final phase",
  },
  {
    slug: "the-estates-sodic",
    developer: "SODIC",
    totalAvailable: 7,
    breakdown: [
      { type: "Apartment", available: 4, minSqm: 159, maxSqm: 220, minPriceM: 29.0, maxPriceM: 42.0 },
      { type: "Duplex", available: 3, minSqm: 280, maxSqm: 318, minPriceM: 45.0, maxPriceM: 55.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Ultra-exclusive",
  },
  {
    slug: "june",
    developer: "SODIC",
    totalAvailable: 82,
    breakdown: [
      { type: "Chalet", available: 45, minSqm: 177, maxSqm: 230, minPriceM: 27.0, maxPriceM: 65.0 },
      { type: "Villa", available: 37, minSqm: 260, maxSqm: 347, minPriceM: 80.0, maxPriceM: 240.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "North Coast flagship — Ras El Hekma",
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

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
