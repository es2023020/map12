/**
 * generate-diff-report.mjs
 * Parses all inbox XLSX files and compares against existing project JSON data.
 * Outputs a human-readable diff report without applying any changes.
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PROJECTS_DIR = path.join(ROOT, "data/availability/projects");
const INBOX_DIR = path.join(ROOT, "data/availability/inbox");

// ─── Helper: format price ────────────────────────────────────────────
function fmtPrice(p) {
  if (!p || p === 0) return "N/A";
  const m = p / 1_000_000;
  return m.toFixed(2) + "M EGP";
}

// ─── Helper: parse price from cell ──────────────────────────────────
function parsePrice(val) {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") {
    if (val < 0) return 0;
    if (val < 1000 && val > 0) return Math.round(val * 1_000_000);
    return Math.round(val);
  }
  let str = String(val).replace(/EGP|LE|جنيه/gi, "").replace(/,/g, "").trim();
  if (str.toLowerCase().includes("sold") || str.toLowerCase().includes("مباع")) return 0;
  let isMillion = false;
  if (str.toLowerCase().includes("m") || str.toLowerCase().includes("مليون")) {
    isMillion = true;
    str = str.replace(/m|مليون/gi, "");
  }
  const parts = str.split(/[-–—to]/i).map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
  if (parts.length === 0) return 0;
  let price = parts[0];
  if (isMillion || (price < 1000 && price > 0)) price *= 1_000_000;
  return Math.round(price);
}

function parseArea(val) {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") return val;
  const str = String(val).replace(/m2|sqm|m|متر|م²|\+/gi, " ").trim();
  const parts = str.split(/[-–—to\s]/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
  if (parts.length === 0) return 0;
  return parts[0];
}

// ─── Find header row ─────────────────────────────────────────────────
function findHeaderRow(rows) {
  const keywords = ["type", "unit", "bua", "area", "price", "beds", "bedroom", "cluster", "project", "code", "status", "مساحة", "سعر", "نوع", "total", "grand"];
  let maxScore = -1;
  let bestIdx = 0;
  for (let i = 0; i < Math.min(15, rows.length); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    let score = 0;
    row.forEach(cell => {
      if (cell === null || cell === undefined || cell === "") return;
      const str = String(cell).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "");
      if (keywords.some(k => str.includes(k))) score += 2;
    });
    if (score > maxScore && score >= 2) { maxScore = score; bestIdx = i; }
  }
  const headerRow = rows[bestIdx] || [];
  const headers = headerRow.map((c, i) => String(c).trim() || `Col_${i}`);
  return { headerIdx: bestIdx, headers };
}

// ─── Map columns ─────────────────────────────────────────────────────
function buildColMap(headers) {
  const colMap = {};
  headers.forEach((h, idx) => {
    const lower = h.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "");
    const isSubFee = lower.includes("finishing") || lower.includes("club") || lower.includes("maintenance") || lower.includes("deposit") || lower.includes("subfee");
    const isLand = lower.includes("land") || lower.includes("garden") || lower.includes("roof") || lower.includes("outdoor") || lower.includes("pergola") || lower.includes("garage") || lower.includes("storage");
    const isType = lower.includes("type") || lower.includes("category") || lower.includes("layout") || lower.includes("نوع");

    if (!colMap.unitId && !isType && (lower.includes("code") || lower.includes("unitcode") || lower.includes("unitno") || lower.includes("كود") || lower === "unit" || lower === "id" || lower === "#")) {
      colMap.unitId = idx;
    } else if (!colMap.type && isType) {
      colMap.type = idx;
    } else if (!colMap.price && !isSubFee && (lower.includes("grandtotal") || lower.includes("unittotal") || lower.includes("price") || lower.includes("total") || lower.includes("value") || lower.includes("cost") || lower.includes("egp") || lower.includes("سعر") || lower.includes("اجمالي"))) {
      colMap.price = idx;
    } else if (!colMap.bua && !isLand && (lower.includes("built") || lower.includes("bua") || lower.includes("area") || lower.includes("sqm") || lower.includes("مساحة"))) {
      colMap.bua = idx;
    } else if (!colMap.project && (lower.includes("project") || lower.includes("compound") || lower.includes("مشروع"))) {
      colMap.project = idx;
    } else if (!colMap.cluster && (lower.includes("cluster") || lower.includes("phase") || lower.includes("zone") || lower.includes("building") || lower.includes("مرحلة") || lower.includes("stage"))) {
      colMap.cluster = idx;
    } else if (!colMap.status && (lower.includes("status") || lower.includes("state") || lower.includes("حالة"))) {
      colMap.status = idx;
    } else if (!colMap.beds && (lower.includes("bed") || lower.includes("rooms") || lower.includes("غرف"))) {
      colMap.beds = idx;
    }
  });
  return colMap;
}

// ─── Parse a single XLSX into { projectName -> [units] } ─────────────
function parseXLSX(filePath) {
  const wb = XLSX.readFile(filePath);
  const ignored = ["overview","summary","instructions","index","breakdown","cover","pricing structure"];
  const result = {};

  for (const sheetName of wb.SheetNames) {
    if (ignored.includes(sheetName.toLowerCase().trim())) continue;
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;

    const rawMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    if (!rawMatrix || rawMatrix.length < 2) continue;

    const { headerIdx, headers } = findHeaderRow(rawMatrix);
    const colMap = buildColMap(headers);

    // Find first non-empty project column value to guess project name
    const units = [];
    let currentProject = sheetName; // default = sheet name

    for (let r = headerIdx + 1; r < rawMatrix.length; r++) {
      const row = rawMatrix[r];
      if (!row || row.length === 0) continue;

      const rawPrice = colMap.price !== undefined ? row[colMap.price] : "";
      const rawBua = colMap.bua !== undefined ? row[colMap.bua] : "";
      const rawId = colMap.unitId !== undefined ? row[colMap.unitId] : "";
      const rawType = colMap.type !== undefined ? row[colMap.type] : "";
      const rawProject = colMap.project !== undefined ? row[colMap.project] : "";
      const rawStatus = colMap.status !== undefined ? String(row[colMap.status]).trim().toLowerCase() : "";
      const rawCluster = colMap.cluster !== undefined ? row[colMap.cluster] : "";

      if (rawProject && String(rawProject).trim()) {
        currentProject = String(rawProject).trim();
      }

      const price = parsePrice(rawPrice);
      const bua = parseArea(rawBua);

      if (price <= 0 && bua <= 0) continue;

      const isSold = rawStatus.includes("sold") || rawStatus.includes("مباع") || rawStatus.includes("reserved");

      units.push({
        id: String(rawId).trim(),
        type: String(rawType).trim(),
        cluster: String(rawCluster).trim(),
        price,
        bua,
        status: isSold ? "Sold" : "Available",
        project: currentProject,
      });
    }

    if (units.length > 0) {
      // Group by project name
      for (const u of units) {
        const pKey = u.project;
        if (!result[pKey]) result[pKey] = [];
        result[pKey].push(u);
      }
    }
  }

  return result;
}

// ─── Load existing project JSON data ────────────────────────────────
function loadExistingData(devSlug) {
  const devDir = path.join(PROJECTS_DIR, devSlug);
  if (!fs.existsSync(devDir)) return {};
  const result = {};
  const files = fs.readdirSync(devDir).filter(f => f.endsWith(".json"));
  for (const f of files) {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(devDir, f), "utf8"));
      const projectSlug = f.replace(".json", "");
      result[projectSlug] = content;
    } catch {}
  }
  return result;
}

// ─── Main diff logic ─────────────────────────────────────────────────
const INBOX_FILES = [
  { file: "2026-11-19/1795074043614_Sales_Availability_19-Nov..xlsx", developer: "palm-hills-developments", label: "Palm Hills Developments" },
  { file: "2026-11-19/1795074758819_19-11-2026.xlsx", developer: "mountain-view", label: "Mountain View" },
  { file: "2026-11-19/1795074897415_19-11-2026.xlsx", developer: "mountain-view", label: "Mountain View (2nd file)" },
];

console.log("═".repeat(80));
console.log("  INVENTORY DIFF REPORT — Nov 19, 2026");
console.log("  Generated:", new Date().toLocaleString());
console.log("═".repeat(80));

let grandTotalAdded = 0;
let grandTotalUpdated = 0;
let grandTotalSoldOut = 0;
let grandTotalNewProjects = 0;

const processedDevs = new Set();

for (const entry of INBOX_FILES) {
  const filePath = path.join(INBOX_DIR, entry.file);
  if (!fs.existsSync(filePath)) {
    console.log(`\n⚠️  File not found: ${entry.file}`);
    continue;
  }

  // Skip duplicate mountain-view if already processed
  if (processedDevs.has(entry.developer)) {
    console.log(`\n⏭️  Skipping duplicate: ${entry.label} (${path.basename(entry.file)})`);
    continue;
  }
  processedDevs.add(entry.developer);

  console.log(`\n${"─".repeat(80)}`);
  console.log(`📦 DEVELOPER: ${entry.label}`);
  console.log(`   File: ${path.basename(entry.file)}`);
  console.log(`${"─".repeat(80)}`);

  const incoming = parseXLSX(filePath);
  const existing = loadExistingData(entry.developer);

  let totalAdded = 0, totalUpdated = 0, totalSoldOut = 0, newProjects = 0;

  // Build lookup of incoming by project raw name
  const projectNames = Object.keys(incoming);

  for (const rawProjectName of projectNames) {
    const incomingUnits = incoming[rawProjectName];
    const availableUnits = incomingUnits.filter(u => u.status === "Available");
    const soldUnits = incomingUnits.filter(u => u.status === "Sold");

    // Try to find matching existing project
    // We'll match on similarity of names
    const existingKeys = Object.keys(existing);
    let matchedKey = null;

    // Simple matching: normalize both and compare
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const inNorm = normalize(rawProjectName);

    for (const ek of existingKeys) {
      if (normalize(ek).includes(inNorm.substring(0, 8)) || inNorm.includes(normalize(ek).substring(0, 8))) {
        matchedKey = ek;
        break;
      }
    }

    const prevData = matchedKey ? existing[matchedKey] : null;
    const prevUnits = prevData?.units || [];
    const prevAvailable = prevUnits.filter(u => u.status === "Available");

    const added = availableUnits.length - prevAvailable.length;
    const isNewProject = !matchedKey;

    if (isNewProject) newProjects++;

    // Price range
    const prices = availableUnits.map(u => u.price).filter(p => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    const prevPrices = prevAvailable.map(u => u.priceEGP || 0).filter(p => p > 0);
    const prevMin = prevPrices.length ? Math.min(...prevPrices) : 0;
    const prevMax = prevPrices.length ? Math.max(...prevPrices) : 0;

    const statusIcon = availableUnits.length === 0 ? "🔴" : isNewProject ? "🆕" : "🔄";

    console.log(`\n  ${statusIcon} ${rawProjectName}`);
    console.log(`     Available: ${prevAvailable.length} → ${availableUnits.length} units`);
    if (prices.length > 0) {
      console.log(`     Price range: ${fmtPrice(minPrice)} – ${fmtPrice(maxPrice)}`);
      if (prevPrices.length > 0 && (Math.abs(prevMin - minPrice) > 100000 || Math.abs(prevMax - maxPrice) > 100000)) {
        console.log(`     ⚡ Price changed from: ${fmtPrice(prevMin)} – ${fmtPrice(prevMax)}`);
        totalUpdated++;
      }
    }

    if (soldUnits.length > 0) {
      console.log(`     Sold/Reserved: ${soldUnits.length} units`);
      totalSoldOut += soldUnits.length;
    }

    if (availableUnits.length === 0 && incomingUnits.length > 0) {
      console.log(`     ⚠️  ALL UNITS SOLD OUT`);
    }

    if (added > 0) totalAdded += added;
    if (added < 0) totalSoldOut += Math.abs(added);

    // Show sample units (first 3 available)
    if (availableUnits.length > 0) {
      const samples = availableUnits.slice(0, 3);
      console.log(`     Sample units:`);
      for (const u of samples) {
        console.log(`       • ${u.id || "(no id)"} | ${u.type} | ${u.bua}m² | ${fmtPrice(u.price)}`);
      }
      if (availableUnits.length > 3) {
        console.log(`       ... and ${availableUnits.length - 3} more`);
      }
    }
  }

  grandTotalAdded += totalAdded;
  grandTotalUpdated += totalUpdated;
  grandTotalSoldOut += totalSoldOut;
  grandTotalNewProjects += newProjects;

  console.log(`\n  ┌─ SUMMARY for ${entry.label} ─────────────────────────`);
  console.log(`  │  Projects processed : ${projectNames.length}`);
  console.log(`  │  New projects       : ${newProjects}`);
  console.log(`  │  Units added/changed: ${totalAdded}`);
  console.log(`  │  Units updated      : ${totalUpdated} projects with price changes`);
  console.log(`  │  Units sold/removed : ${totalSoldOut}`);
  console.log(`  └───────────────────────────────────────────────────`);
}

console.log(`\n${"═".repeat(80)}`);
console.log(`  GRAND TOTAL ACROSS ALL DEVELOPERS`);
console.log(`  New Units Added  : ${grandTotalAdded}`);
console.log(`  Projects Updated : ${grandTotalUpdated}`);
console.log(`  Units Sold Out   : ${grandTotalSoldOut}`);
console.log(`  New Projects     : ${grandTotalNewProjects}`);
console.log(`═`.repeat(80));
console.log(`\n✅ Report complete. Type 'approve' to apply all changes.\n`);
