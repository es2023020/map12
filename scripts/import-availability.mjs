/**
 * Read data/availability/availability.xlsx and regenerate src/data/availability.generated.ts
 *
 * Sheets:
 *   Projects   — slug, developer, total_available, last_updated, note
 *   Breakdown  — slug, type, beds, available, min_sqm, max_sqm, min_price_m, max_price_m,
 *                finishing, cluster, delivery_note, payment_plan
 *   Units      — slug, type, unit_id, cluster, beds, finishing, area_sqm, area_note, view,
 *                price_egp, delivery_note, payment_plan, status
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const XLSX_PATH = path.join(ROOT, "data", "availability", "availability.xlsx");
const OUT = path.join(ROOT, "src", "data", "availability.generated.ts");

function cell(row, key) {
  const v = row[key];
  if (v === undefined || v === null || v === "") return undefined;
  return v;
}

function num(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function str(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s || undefined;
}

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function fmtVal(v, indent = "      ") {
  if (v === undefined) return undefined;
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return `"${esc(v)}"`;
  if (Array.isArray(v)) {
    if (v.length === 0) return "[]";
    const inner = v.map((item) => `${indent}  ${fmtObj(item, indent + "  ")}`).join(",\n");
    return `[\n${inner},\n${indent}]`;
  }
  if (typeof v === "object") return fmtObj(v, indent);
  return JSON.stringify(v);
}

function fmtObj(obj, indent = "      ") {
  const lines = Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (Array.isArray(v) || (typeof v === "object" && v !== null)) {
        return `${indent}${k}: ${fmtVal(v, indent + "  ")},`;
      }
      return `${indent}${k}: ${fmtVal(v, indent)},`;
    });
  return `{\n${lines.join("\n")}\n${indent.slice(2)}}`;
}

function main() {
  const rootDir = path.join(ROOT, "data", "availability");
  const projectsDir = path.join(rootDir, "projects");

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  // Recursively find all .xlsx files (skipping Excel temp files prefixed with ~$)
  const files = [];
  function scan(dir, isProjectFolder = false) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath, isProjectFolder);
      } else if (f.endsWith(".xlsx") && !f.startsWith("~$")) {
        // Compute name relative to rootDir
        const relName = path.relative(rootDir, fullPath).replace(/\\/g, "/");
        files.push({ path: fullPath, name: relName, isProjectFolder });
      }
    }
  }
  scan(projectsDir, true);

  if (files.length === 0) {
    console.error(`No spreadsheet files (.xlsx) found in ${projectsDir}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} spreadsheet file(s) to process:`);
  files.forEach((f) => console.log(` - ${f.name}`));

  const slugToBundleMap = new Map();

  for (const fileObj of files) {
    const wb = XLSX.readFile(fileObj.path);
    const projectsSheet = wb.Sheets["Projects"] ?? wb.Sheets[wb.SheetNames[0]];
    const breakdownSheet = wb.Sheets["Breakdown"];
    const unitsSheet = wb.Sheets["Units"];

    const fileProjects = projectsSheet ? XLSX.utils.sheet_to_json(projectsSheet, { defval: "" }) : [];
    const fileBreakdown = breakdownSheet ? XLSX.utils.sheet_to_json(breakdownSheet, { defval: "" }) : [];
    const fileUnits = unitsSheet ? XLSX.utils.sheet_to_json(unitsSheet, { defval: "" }) : [];

    const sourceName = fileObj.name;

    for (const row of fileProjects) {
      const slug = str(cell(row, "slug"));
      if (!slug) continue;

      const breakdownRows = fileBreakdown.filter((b) => str(cell(b, "slug")) === slug);
      const unitRows = fileUnits.filter((u) => str(cell(u, "slug")) === slug);
      const lastUpdated = str(cell(row, "last_updated")) ?? new Date().toISOString().slice(0, 10);

      const bundle = {
        slug,
        projectRow: row,
        breakdownRows,
        unitRows,
        source: sourceName,
        lastUpdated,
      };

      if (slugToBundleMap.has(slug)) {
        const existing = slugToBundleMap.get(slug);
        // Overwrite if date is newer, or if it is from the projects/ directory (which overrides root)
        const isNewer = lastUpdated > existing.lastUpdated;
        const isEqualDate = lastUpdated === existing.lastUpdated;
        const overrideFromFolder = isEqualDate && fileObj.isProjectFolder && !existing.source.startsWith("projects/");

        if (isNewer || overrideFromFolder) {
          console.log(`[Slug: ${slug}] Overriding with data from ${sourceName} (updated: ${lastUpdated})`);
          slugToBundleMap.set(slug, bundle);
        } else {
          console.log(`[Slug: ${slug}] Kept existing data from ${existing.source} (updated: ${existing.lastUpdated})`);
        }
      } else {
        slugToBundleMap.set(slug, bundle);
      }
    }
  }

  const breakdownBySlug = new Map();
  const unitsByKey = new Map();

  for (const [slug, bundle] of slugToBundleMap) {
    for (const row of bundle.breakdownRows) {
      if (!breakdownBySlug.has(slug)) breakdownBySlug.set(slug, []);
      const entry = {
        type: str(cell(row, "type")),
        available: num(cell(row, "available")) ?? 0,
        minSqm: num(cell(row, "min_sqm")) ?? 0,
        maxSqm: num(cell(row, "max_sqm")) ?? 0,
        minPriceM: num(cell(row, "min_price_m")) ?? 0,
        maxPriceM: num(cell(row, "max_price_m")) ?? 0,
      };
      const beds = num(cell(row, "beds"));
      const finishing = str(cell(row, "finishing"));
      const cluster = str(cell(row, "cluster"));
      const deliveryNote = str(cell(row, "delivery_note"));
      const paymentPlan = str(cell(row, "payment_plan"));
      if (beds != null) entry.beds = beds;
      if (finishing) entry.finishing = finishing;
      if (cluster) entry.cluster = cluster;
      if (deliveryNote) entry.deliveryNote = deliveryNote;
      if (paymentPlan) entry.paymentPlan = paymentPlan;
      breakdownBySlug.get(slug).push(entry);
    }

    for (const row of bundle.unitRows) {
      const type = str(cell(row, "type"));
      if (!type) continue;
      const key = `${slug}::${type}`;
      if (!unitsByKey.has(key)) unitsByKey.set(key, []);
      const unit = {
        id: str(cell(row, "unit_id")) ?? `${slug}-${unitsByKey.get(key).length + 1}`,
        beds: num(cell(row, "beds")) ?? 0,
        finishing: str(cell(row, "finishing")) ?? "Finished",
        areaSqm: num(cell(row, "area_sqm")) ?? 0,
        priceEGP: num(cell(row, "price_egp")) ?? 0,
        status: str(cell(row, "status")) ?? "Available",
      };
      const cluster = str(cell(row, "cluster"));
      const areaNote = str(cell(row, "area_note"));
      const view = str(cell(row, "view"));
      const deliveryNote = str(cell(row, "delivery_note"));
      const paymentPlan = str(cell(row, "payment_plan"));
      if (cluster) unit.cluster = cluster;
      if (areaNote) unit.areaNote = areaNote;
      if (view) unit.view = view;
      if (deliveryNote) unit.deliveryNote = deliveryNote;
      if (paymentPlan) unit.paymentPlan = paymentPlan;
      unitsByKey.get(key).push(unit);
    }
  }

  function getUnitTypeSlug(b) {
    const parts = [b.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")];
    if (b.beds) parts.push(`${b.beds}br`);
    if (b.cluster) parts.push(b.cluster.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    return parts.join("-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  // Clear previous availability-data folder if it exists
  const availabilityDataDir = path.join(ROOT, "public", "availability-data");
  if (fs.existsSync(availabilityDataDir)) {
    fs.rmSync(availabilityDataDir, { recursive: true, force: true });
  }

  for (const [slug, breakdown] of breakdownBySlug) {
    for (const b of breakdown) {
      const key = `${slug}::${b.type}`;
      const units = unitsByKey.get(key);
      if (units?.length) {
        // Do not add units to breakdown object to keep TS file light
        // b.units = units;
        
        // Save units to public/availability-data/[slug]/[typeSlug].json
        const dir = path.join(availabilityDataDir, slug);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const typeSlug = getUnitTypeSlug(b);
        const file = path.join(dir, `${typeSlug}.json`);
        fs.writeFileSync(file, JSON.stringify(units, null, 2), "utf8");
      }
    }
  }

  const availability = [];
  for (const [slug, bundle] of slugToBundleMap) {
    const row = bundle.projectRow;
    const entry = {
      slug,
      developer: str(cell(row, "developer")) ?? "",
      totalAvailable: num(cell(row, "total_available")) ?? 0,
      breakdown: breakdownBySlug.get(slug) ?? [],
      lastUpdated: bundle.lastUpdated,
    };
    const note = str(cell(row, "note"));
    if (note) entry.note = note;
    availability.push(entry);
  }

  const blocks = availability.map((p) => fmtObj(p, "    "));
  const out = [
    "// Auto-generated from data/availability/ and projects/ — do not edit by hand.",
    "// Run: npm run import-availability",
    'import type { ProjectAvailability } from "./availability";',
    "",
    "export const availability: ProjectAvailability[] = [",
    ...blocks.map((b) => `  ${b},`),
    "];",
    "",
  ].join("\n");

  fs.writeFileSync(OUT, out, "utf8");
  console.log(`Wrote ${availability.length} projects to ${OUT}`);
}

main();
