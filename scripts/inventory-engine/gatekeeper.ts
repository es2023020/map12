import fs from "fs";
import path from "path";
import crypto from "crypto";
import { DocumentClassification } from "./types";
import { fileURLToPath } from "url";
import { compoundRegistry } from "../../src/data/compound-registry";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const HASHES_FILE = path.join(ROOT, "data", "availability", "processed_hashes.json");
const ALIASES_FILE = path.join(ROOT, "config", "project-aliases.json");

// Ensure hashes file exists
if (!fs.existsSync(HASHES_FILE)) {
  fs.mkdirSync(path.dirname(HASHES_FILE), { recursive: true });
  fs.writeFileSync(HASHES_FILE, JSON.stringify([], null, 2), "utf8");
}

let projectAliases: { compounds: Record<string, string>; developers: Record<string, string> } = {
  compounds: {},
  developers: {},
};

if (fs.existsSync(ALIASES_FILE)) {
  try {
    projectAliases = JSON.parse(fs.readFileSync(ALIASES_FILE, "utf8"));
  } catch (err) {
    console.error("Failed to parse project aliases:", err);
  }
}

/**
 * Returns canonical developer slug for a project slug
 */
export function getDeveloperSlugForProject(projectSlug?: string): string | undefined {
  if (!projectSlug) return undefined;
  const reg = compoundRegistry[projectSlug];
  if (reg && reg.developer) {
    const devLower = reg.developer.toLowerCase();
    for (const [alias, slug] of Object.entries(projectAliases.developers)) {
      if (devLower.includes(alias)) return slug;
    }
  }
  return undefined;
}

/**
 * Calculates SHA-256 hash of a file buffer or file path
 */
export function calculateFileHash(bufferOrPath: Buffer | string): string {
  const hash = crypto.createHash("sha256");
  if (typeof bufferOrPath === "string") {
    const fileBuffer = fs.readFileSync(bufferOrPath);
    hash.update(fileBuffer);
  } else {
    hash.update(bufferOrPath);
  }
  return hash.digest("hex");
}

/**
 * Checks if this exact file hash was already processed
 */
export function isHashProcessed(fileHash: string): boolean {
  try {
    const hashes: string[] = JSON.parse(fs.readFileSync(HASHES_FILE, "utf8"));
    return hashes.includes(fileHash);
  } catch {
    return false;
  }
}

/**
 * Records a file hash into processed_hashes.json
 */
export function markHashProcessed(fileHash: string): void {
  try {
    const hashes: string[] = JSON.parse(fs.readFileSync(HASHES_FILE, "utf8"));
    if (!hashes.includes(fileHash)) {
      hashes.push(fileHash);
      fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Failed to save hash:", err);
  }
}

/**
 * Matches project name or developer name from text against aliases
 */
export function matchProjectAndDeveloper(text: string): { projectSlug?: string; developerSlug?: string } {
  const lower = text.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, " ");

  let foundProject: string | undefined;
  let foundDeveloper: string | undefined;

  // Check compounds/projects
  for (const [alias, slug] of Object.entries(projectAliases.compounds)) {
    const regex = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i");
    if (regex.test(lower)) {
      foundProject = slug;
      break;
    }
  }

  // Check developers
  for (const [alias, devSlug] of Object.entries(projectAliases.developers)) {
    const regex = new RegExp(`(^|\\s)${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`, "i");
    if (regex.test(lower)) {
      foundDeveloper = devSlug;
      break;
    }
  }

  if (!foundDeveloper && foundProject) {
    foundDeveloper = getDeveloperSlugForProject(foundProject);
  }

  return { projectSlug: foundProject, developerSlug: foundDeveloper };
}

/**
 * Extracts date if present in string (e.g. 2026-11-18, 18-11-2026, 18-11, Nov 2026)
 */
export function extractDateFromText(text: string): string | undefined {
  const fullDateMatch = text.match(/\b(202[4-9][-_.](0?[1-9]|1[0-2])[-_.](0?[1-9]|[12]\d|3[01]))\b/);
  if (fullDateMatch) return fullDateMatch[1].replace(/[_.]/g, "-");

  const reverseDateMatch = text.match(/\b((0?[1-9]|[12]\d|3[01])[-_.](0?[1-9]|1[0-2])[-_.](202[4-9]))\b/);
  if (reverseDateMatch) {
    const parts = reverseDateMatch[1].split(/[-_.]/);
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }

  const monthYearMatch = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|يناير|فبراير|مارس|ابريل|مايو|يونيو|يوليو|اغسطس|سبتمبر|اكتوبر|نوفمبر|ديسمبر)[a-z]*[-_\s]*(202[4-9])\b/i);
  if (monthYearMatch) {
    return `${monthYearMatch[1]} ${monthYearMatch[2]}`;
  }

  return undefined;
}

/**
 * Gatekeeper evaluation: filters out non-inventory documents and accepts valid inventory/fact sheets
 */
export function evaluateIncomingDocument(
  filename: string,
  bufferOrPath: Buffer | string,
  caption = "",
  groupDevSlug?: string
): DocumentClassification {
  const ext = path.extname(filename).toLowerCase();
  if (![".xlsx", ".xls", ".pdf", ".csv"].includes(ext)) {
    return {
      accepted: false,
      documentType: "REJECTED",
      confidence: 0,
      rejectionReason: `Unsupported file extension (${ext}). Only .xlsx, .xls, .pdf supported.`,
    };
  }

  // Deduplication by hash
  const fileHash = calculateFileHash(bufferOrPath);
  if (isHashProcessed(fileHash)) {
    return {
      accepted: false,
      documentType: "REJECTED",
      confidence: 1,
      rejectionReason: "Duplicate file: SHA-256 hash was already processed previously.",
    };
  }

  const combinedText = `${filename} ${caption}`.toLowerCase();
  const normalizedText = combinedText.replace(/[-_.]/g, " ");

  // 1. REJECT if marketing/brochure/corporate
  const rejectWords = [
    "brochure",
    "masterplan",
    "profile",
    "presentation",
    "flyer",
    "contract",
    "eoi",
    "receipt",
    "registration",
    "بروشور",
    "ملف الشركة",
    "استمارة",
    "عقد",
    "كتالوج",
    "ماستر بلان",
  ];

  for (const rw of rejectWords) {
    if (normalizedText.includes(rw)) {
      return {
        accepted: false,
        documentType: "REJECTED",
        confidence: 0.95,
        rejectionReason: `Rejected marketing/non-inventory file (matched '${rw}')`,
      };
    }
  }

  // 2. ACCEPTANCE SIGNALS
  const inventoryKeywords = [
    "inventory",
    "availability",
    "available",
    "avail",
    "stock",
    "units",
    "units list",
    "price list",
    "pricelist",
    "fact sheet",
    "factsheet",
    "متاح",
    "شيت متاح",
    "المتاح",
    "أسعار",
    "اسعار",
    "فكت شيت",
    "تقرير الوحدات",
    "جدول الوحدات",
  ];

  const hasInventorySignal = inventoryKeywords.some((kw) => normalizedText.includes(kw));
  const detectedDate = extractDateFromText(combinedText);
  const { projectSlug, developerSlug } = matchProjectAndDeveloper(normalizedText);

  const effectiveDevSlug = developerSlug || groupDevSlug;

  // Is it explicitly a Master Sheet?
  const isMaster =
    normalizedText.includes("master") ||
    normalizedText.includes("all projects") ||
    normalizedText.includes("شيت كامل") ||
    normalizedText.includes("full stock") ||
    (!projectSlug && hasInventorySignal);

  // Criteria:
  // Must have an inventory keyword OR fact sheet
  // AND must either have a date OR match a specific project or developer
  if (hasInventorySignal && (detectedDate || projectSlug || effectiveDevSlug)) {
    return {
      accepted: true,
      documentType: isMaster ? "MASTER_INVENTORY" : (normalizedText.includes("fact sheet") ? "FACT_SHEET" : "PROJECT_INVENTORY"),
      developerSlug: effectiveDevSlug,
      projectSlug,
      detectedDate,
      confidence: 0.95,
    };
  }

  // Even if no inventory keyword, if it's an Excel sheet sent in a developer group with a date and project name, accept it
  if ([".xlsx", ".xls"].includes(ext) && (projectSlug || effectiveDevSlug) && detectedDate) {
    return {
      accepted: true,
      documentType: projectSlug ? "PROJECT_INVENTORY" : "MASTER_INVENTORY",
      developerSlug: effectiveDevSlug,
      projectSlug,
      detectedDate,
      confidence: 0.85,
    };
  }

  return {
    accepted: false,
    documentType: "REJECTED",
    confidence: 0.8,
    rejectionReason: "Does not contain required inventory/availability/factsheet markers or valid date/project reference.",
  };
}
