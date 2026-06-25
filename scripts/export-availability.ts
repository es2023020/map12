/**
 * Export src/data/availability.generated.ts → data/availability/availability.xlsx
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import { availability } from "../src/data/availability.generated.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "data", "availability");
const OUT_FILE = path.join(OUT_DIR, "availability.xlsx");

const projects = availability.map((p) => ({
  slug: p.slug,
  developer: p.developer,
  total_available: p.totalAvailable,
  last_updated: p.lastUpdated,
  note: p.note ?? "",
}));

const breakdown: Record<string, string | number>[] = [];
const units: Record<string, string | number>[] = [];

for (const p of availability) {
  for (const b of p.breakdown) {
    breakdown.push({
      slug: p.slug,
      type: b.type,
      beds: b.beds ?? "",
      available: b.available,
      min_sqm: b.minSqm,
      max_sqm: b.maxSqm,
      min_price_m: b.minPriceM,
      max_price_m: b.maxPriceM,
      finishing: b.finishing ?? "",
      cluster: b.cluster ?? "",
      delivery_note: b.deliveryNote ?? "",
      payment_plan: b.paymentPlan ?? "",
    });
    for (const u of b.units ?? []) {
      units.push({
        slug: p.slug,
        type: b.type,
        unit_id: u.id,
        cluster: u.cluster ?? "",
        beds: u.beds,
        finishing: u.finishing,
        area_sqm: u.areaSqm,
        area_note: u.areaNote ?? "",
        view: u.view ?? "",
        price_egp: u.priceEGP,
        delivery_note: u.deliveryNote ?? "",
        payment_plan: u.paymentPlan ?? "",
        status: u.status,
      });
    }
  }
}

const readme = [
  {
    topic: "How to update",
    instruction:
      "Edit Projects, Breakdown, and Units sheets. Save this file. Run: npm run import-availability",
  },
  {
    topic: "Replace file",
    instruction:
      "To swap in a new sheet from your team, delete availability.xlsx and paste the new file here (same name).",
  },
  {
    topic: "slug",
    instruction: "Must match compound slug in src/data/compounds.ts (e.g. marassi, beit-al-bahr)",
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(readme), "README");
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(projects), "Projects");
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(breakdown), "Breakdown");
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(units), "Units");
XLSX.writeFile(wb, OUT_FILE);

console.log(`Exported ${projects.length} projects → ${OUT_FILE}`);
