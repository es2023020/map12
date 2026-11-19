import { NormalizedUnit } from "./types";

/**
 * Normalizes unit IDs into clean, standard strings across developer formats.
 * e.g. "Villa 104", "V-104", "V104", "v 104" -> "V-104"
 *      "Building 3 Apt 12", "B3-12", "B03/12" -> "B3-12"
 */
export function normalizeUnitId(raw?: string | number): string {
  if (raw === undefined || raw === null) return "";
  let str = String(raw).trim();
  if (!str) return "";

  // Replace common Arabic prefixes
  str = str
    .replace(/^فيلا\s*/i, "V-")
    .replace(/^شاليه\s*/i, "CH-")
    .replace(/^شقة\s*/i, "APT-")
    .replace(/^تاون\s*/i, "TH-")
    .replace(/^توين\s*/i, "TW-")
    .replace(/^دوبلكس\s*/i, "DP-")
    .replace(/^بنتهاوس\s*/i, "PH-");

  // Replace English prefixes
  str = str
    .replace(/^villa\s*[-#]?\s*/i, "V-")
    .replace(/^chalet\s*[-#]?\s*/i, "CH-")
    .replace(/^apartment\s*[-#]?\s*/i, "APT-")
    .replace(/^apt\s*[-#]?\s*/i, "APT-")
    .replace(/^penthouse\s*[-#]?\s*/i, "PH-")
    .replace(/^duplex\s*[-#]?\s*/i, "DP-")
    .replace(/^townhouse\s*[-#]?\s*/i, "TH-")
    .replace(/^town\s*[-#]?\s*/i, "TH-")
    .replace(/^twinhouse\s*[-#]?\s*/i, "TW-")
    .replace(/^twin\s*[-#]?\s*/i, "TW-")
    .replace(/^stand\s*alone\s*[-#]?\s*/i, "SA-")
    .replace(/^standalone\s*[-#]?\s*/i, "SA-")
    .replace(/^unit\s*[-#]?\s*/i, "U-");

  // Normalize separators: remove spaces around hyphens/slashes
  str = str.replace(/\s*([-/_.])\s*/g, "$1");
  // Replace slashes with hyphens
  str = str.replace(/\//g, "-");
  // Strip duplicate hyphens
  str = str.replace(/-+/g, "-");
  // Remove leading/trailing non-alphanumeric except hyphen
  str = str.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");

  return str.toUpperCase();
}

/**
 * Computes a deterministic deduplication fingerprint for a unit.
 * If unit has an ID: combines (projectSlug, canonicalId).
 * If unit has no ID: combines (projectSlug, type, beds, rounded area, cluster, price rounded to 100K).
 */
export function computeUnitFingerprint(projectSlug: string, unit: Partial<NormalizedUnit>): string {
  const safeProj = (projectSlug || "general").toLowerCase();
  const normId = normalizeUnitId(unit.rawUnitId || unit.id);
  if (normId && normId.length > 1) {
    return `${safeProj}::ID::${normId}`;
  }

  const typeSlug = (unit.type || "Apartment").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const beds = unit.beds ?? 0;
  const area = Math.round(unit.areaSqm || 0);
  const cluster = (unit.cluster || "GEN").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const price100k = Math.round((unit.priceEGP || 0) / 100000);

  return `${safeProj}::SYN::${typeSlug}::${beds}BR::${area}SQM::${cluster}::${price100k}`;
}

/**
 * Deduplicates a list of units, keeping the richest record for each fingerprint.
 */
export function deduplicateUnits(units: NormalizedUnit[]): NormalizedUnit[] {
  const map = new Map<string, NormalizedUnit>();

  for (const u of units) {
    const fp = u.fingerprint || computeUnitFingerprint(u.projectSlug, u);
    u.fingerprint = fp;

    if (!map.has(fp)) {
      map.set(fp, u);
    } else {
      const existing = map.get(fp)!;
      // Merge records by preferring non-empty values
      const merged: NormalizedUnit = {
        ...existing,
        ...u,
        id: existing.id || u.id,
        areaNote: existing.areaNote || u.areaNote,
        view: existing.view || u.view,
        deliveryNote: existing.deliveryNote || u.deliveryNote,
        paymentPlan: existing.paymentPlan || u.paymentPlan,
        finishing: (existing.finishing !== "Core & Shell" && existing.finishing) ? existing.finishing : (u.finishing || existing.finishing),
        priceEGP: u.priceEGP > 0 ? u.priceEGP : existing.priceEGP,
        areaSqm: u.areaSqm > 0 ? u.areaSqm : existing.areaSqm,
        status: u.status || existing.status,
      };
      map.set(fp, merged);
    }
  }

  return Array.from(map.values());
}
