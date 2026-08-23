// Real availability data — edit via data/availability/availability.xlsx
// Run `npm run import-availability` after replacing the spreadsheet.

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface UnitListing {
  id: string;
  cluster?: string; // e.g. "NHF", "R1", "PS", "Boardwalk"
  beds: number;
  finishing: string; // Finished | Semi Finished | Core & Shell
  areaSqm: number;
  areaNote?: string; // e.g. "+ Roof Area 17m"
  view?: string; // Sea & Lagoon | Lagoon | Sea | Garden
  priceEGP: number;
  deliveryNote?: string; // "Ready to Move" | "1 Year" | "2.5 Years" | "4 Years"
  paymentPlan?: string;
  status: "Available" | "Last Unit" | string;
  [key: string]: any;
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

// ─── Asynchronous Lazy Loading ────────────────────────────────────────────────

let loadedAvailability: ProjectAvailability[] | null = null;
let loadingPromise: Promise<ProjectAvailability[]> | null = null;

export function loadAvailabilityAsync(): Promise<ProjectAvailability[]> {
  if (loadedAvailability) return Promise.resolve(loadedAvailability);
  if (loadingPromise) return loadingPromise;

  loadingPromise = import("./availability.generated").then((mod) => {
    loadedAvailability = mod.availability;
    cachedAvailability = null; // Invalidate cache
    return mod.availability;
  });
  return loadingPromise;
}

// Pre-load in background on idle time to keep navigation snappy
if (typeof window !== "undefined") {
  setTimeout(() => {
    loadAvailabilityAsync().catch(() => {});
  }, 1000);
}

// ─── Data (from spreadsheet) ──────────────────────────────────────────────────

let cachedAvailability: ProjectAvailability[] | null = null;
let lastAvailabilityRead = 0;

function getActiveAvailability(): ProjectAvailability[] {
  const now = Date.now();
  if (cachedAvailability && now - lastAvailabilityRead < 500) {
    return cachedAvailability;
  }
  const staticAvailability = loadedAvailability || [];
  let activeList = staticAvailability;
  if (typeof window !== "undefined") {
    try {
      const storeStr = localStorage.getItem("property-atlas-broker") || localStorage.getItem("proptrack-broker");
      if (storeStr) {
        const parsed = JSON.parse(storeStr);
        if (parsed?.state?.availabilityList?.length) {
          activeList = parsed.state.availabilityList;
        }
      }
    } catch (e) {
      // fallback
    }
  }
  const result = [...activeList];
  for (const sa of staticAvailability) {
    if (!result.some((a) => a.slug === sa.slug)) {
      result.push(sa);
    }
  }
  cachedAvailability = result;
  lastAvailabilityRead = now;
  return result;
}

export const availability: ProjectAvailability[] = new Proxy([], {
  get(target, prop, receiver) {
    const activeList = getActiveAvailability();
    const val = Reflect.get(activeList, prop, receiver);
    if (typeof val === "function") {
      return val.bind(activeList);
    }
    return val;
  },
  getOwnPropertyDescriptor(target, prop) {
    const activeList = getActiveAvailability();
    return Reflect.getOwnPropertyDescriptor(activeList, prop);
  },
  ownKeys(target) {
    const activeList = getActiveAvailability();
    return Reflect.ownKeys(activeList);
  },
});

export function availabilityBySlug(slug: string): ProjectAvailability | undefined {
  return availability.find((a) => a.slug === slug);
}

export function totalAvailableBySlug(slug: string): number {
  return availabilityBySlug(slug)?.totalAvailable ?? 0;
}

/** Find a project + breakdown by project slug + type slug */
export function breakdownByTypeSlug(
  projectSlug: string,
  typeSlug: string,
): { project: ProjectAvailability; breakdown: UnitBreakdown } | undefined {
  const project = availabilityBySlug(projectSlug);
  if (!project) return undefined;
  const breakdown = project.breakdown.find((b) => unitTypeSlug(b) === typeSlug);
  if (!breakdown) return undefined;
  return { project, breakdown };
}
