/**
 * Read data/availability/ and data/availability/projects/ spreadsheets
 * and regenerate src/data/availability.generated.ts & public/availability-data/
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src", "data", "availability.generated.ts");

function findHeaderRow(rows) {
  const keywords = [
    "type",
    "category",
    "unit",
    "bua",
    "area",
    "sqm",
    "price",
    "cost",
    "value",
    "egp",
    "beds",
    "bedroom",
    "project",
    "compound",
    "cluster",
    "view",
    "delivery",
    "status",
    "#",
  ];
  let maxScore = -1;
  let bestIdx = 0;

  for (let i = 0; i < Math.min(15, rows.length); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    let score = 0;
    row.forEach((cell) => {
      if (cell === null || cell === undefined || cell === "") return;
      const str = String(cell)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
      if (keywords.some((k) => str.includes(k))) score += 2;
      else if (str.length > 0) score += 0.2;
    });
    if (score > maxScore && score >= 2) {
      maxScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function parsePriceRange(val) {
  if (val === undefined || val === null || val === "") return { min: 0, max: 0 };
  if (typeof val === "number") return { min: val, max: val };
  let str = String(val).replace(/EGP/gi, "").replace(/,/g, "").trim();
  if (str.toLowerCase().includes("sold")) return { min: 0, max: 0 };

  let isMillion = false;
  if (str.toLowerCase().includes("m")) {
    isMillion = true;
    str = str.replace(/m/gi, "");
  }

  const parts = str
    .split(/[-–—up to to]/i)
    .map((p) => parseFloat(p.trim()))
    .filter((p) => !isNaN(p));
  if (parts.length === 0) return { min: 0, max: 0 };
  let min = parts[0];
  let max = parts.length > 1 ? parts[1] : parts[0];

  if (isMillion || (min < 1000 && min > 0)) {
    min *= 1000000;
    max *= 1000000;
  }
  return { min, max };
}

function parseAreaRange(val) {
  if (val === undefined || val === null || val === "") return { min: 0, max: 0 };
  if (typeof val === "number") return { min: val, max: val };
  const str = String(val)
    .replace(/m2|sqm|m/gi, "")
    .trim();
  const parts = str
    .split(/[-–—to]/i)
    .map((p) => parseFloat(p.trim()))
    .filter((p) => !isNaN(p));
  if (parts.length === 0) return { min: 0, max: 0 };
  if (parts.length === 1) return { min: parts[0], max: parts[0] };
  return { min: Math.min(...parts), max: Math.max(...parts) };
}

function parseBedsFromType(typeStr) {
  if (!typeStr) return undefined;
  const match =
    String(typeStr).match(/(\d+)\s*(br|bed|bds|bdr|bedroom)/i) || String(typeStr).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

function unitTypeSlug(b) {
  const parts = [b.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")];
  if (b.beds) parts.push(`${b.beds}br`);
  if (b.cluster) parts.push(b.cluster.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  return parts.join("-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
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
    .filter(([, v]) => v !== undefined && v !== "units")
    .map(([k, v]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k);
      if (Array.isArray(v) || (typeof v === "object" && v !== null)) {
        return `${indent}${safeKey}: ${fmtVal(v, indent + "  ")},`;
      }
      return `${indent}${safeKey}: ${fmtVal(v, indent)},`;
    });
  return `{\n${lines.join("\n")}\n${indent.slice(2)}}`;
}

function parseUniversalWorkbook(filePath, defaultSlug, defaultDev) {
  if (!fs.existsSync(filePath)) return null;
  const wb = XLSX.readFile(filePath);

  if (wb.Sheets["Projects"]) {
    const pMatrix = XLSX.utils.sheet_to_json(wb.Sheets["Projects"], { header: 1, defval: "" });
    if (pMatrix && pMatrix.length > 1 && pMatrix[1][1]) {
      defaultDev = String(pMatrix[1][1]).trim();
    }
  }

  let targetSheets = wb.SheetNames;
  if (wb.SheetNames.includes("Units")) {
    targetSheets = ["Units"];
  } else if (wb.SheetNames.length > 1) {
    const nonOverview = wb.SheetNames.filter(
      (sn) => !["overview", "summary", "index", "instructions", "projects", "breakdown"].includes(sn.toLowerCase().trim()),
    );
    if (nonOverview.length > 0) targetSheets = nonOverview;
  }

  const breakdownMap = {};

  targetSheets.forEach((sheetName) => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;
    const rawMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    if (!rawMatrix || rawMatrix.length === 0) return;

    const headerIdx = findHeaderRow(rawMatrix);
    const headerRow = rawMatrix[headerIdx] || [];
    const headers = headerRow.map((c, i) => String(c).trim() || `Column_${i + 1}`);

    const findHeaderKey = (options) => {
      for (const opt of options) {
        const idx = headers.findIndex(
          (h) =>
            h.toLowerCase().replace(/[^a-z0-9]+/g, "") ===
            opt.toLowerCase().replace(/[^a-z0-9]+/g, ""),
        );
        if (idx >= 0) return headers[idx];
      }
      return null;
    };

    const typeKey =
      findHeaderKey(["type", "layout", "layouttype", "unittype", "category"]) || headers[0];
    const priceKey = findHeaderKey([
      "price",
      "priceegp",
      "unitprice",
      "egp",
      "cost",
      "value",
      "startingpriceegp",
      "pricefromegp",
      "pricesegp",
      "avgprice",
      "grandtotalpricingstructure",
      "unittotalwithfinishingprice",
    ]);
    const bedsKey = findHeaderKey(["beds", "bedrooms", "bedcount", "roomcount"]);
    const areaKey = findHeaderKey([
      "area",
      "size",
      "sqm",
      "areasqm",
      "bua",
      "unitarea",
      "aream2",
      "builtarea",
    ]);
    const unitNoKey = findHeaderKey(["unitno", "unitnumber", "unit", "no", "unitcode", "#"]);
    const viewKey = findHeaderKey(["view", "aspect", "unitview"]);
    const statusKey = findHeaderKey(["status", "availability", "unitstatus"]);

    const knownKeys = new Set(
      [typeKey, priceKey, bedsKey, areaKey, unitNoKey, viewKey, statusKey].filter(Boolean),
    );
    const dataMatrix = rawMatrix.slice(headerIdx + 1);

    dataMatrix.forEach((rowArray, rIdx) => {
      const nonEmpties = rowArray.filter((c) => c !== "");
      if (nonEmpties.length === 0) return;

      const firstVal = String(rowArray[0] || "").toLowerCase();
      if (
        firstVal.startsWith("payment") ||
        firstVal.startsWith("note") ||
        firstVal.startsWith("contact") ||
        firstVal.startsWith("total")
      ) {
        return;
      }

      const rowObj = {};
      headers.forEach((h, cIdx) => {
        const v = rowArray[cIdx];
        if (v !== undefined && v !== null && v !== "") rowObj[h] = v;
      });

      const rawType =
        typeKey && rowObj[typeKey]
          ? String(rowObj[typeKey]).trim()
          : sheetName !== "Availability"
            ? sheetName
            : "Chalet";
      const priceRange = priceKey
        ? parsePriceRange(rowObj[priceKey])
        : { min: 5000000, max: 5000000 };
      const areaRange = areaKey ? parseAreaRange(rowObj[areaKey]) : { min: 120, max: 120 };
      const beds =
        bedsKey && rowObj[bedsKey]
          ? parseInt(String(rowObj[bedsKey]))
          : parseBedsFromType(rawType) || 2;
      const unitNo =
        unitNoKey && rowObj[unitNoKey] ? String(rowObj[unitNoKey]).trim() : `U-${rIdx + 1}`;
      const view = viewKey && rowObj[viewKey] ? String(rowObj[viewKey]).trim() : "Scenic View";
      const status =
        statusKey && rowObj[statusKey] ? String(rowObj[statusKey]).trim() : "Available";

      const extraFields = {};
      Object.keys(rowObj).forEach((k) => {
        if (!knownKeys.has(k) && rowObj[k] !== undefined && rowObj[k] !== "") {
          extraFields[k] = rowObj[k];
        }
      });

      const key = `${rawType}-${beds}`;
      if (!breakdownMap[key]) {
        breakdownMap[key] = {
          type: rawType,
          beds,
          available: 0,
          minSqm: areaRange.min || 120,
          maxSqm: areaRange.max || 120,
          minPriceM: (priceRange.min || 5000000) / 1000000,
          maxPriceM: (priceRange.max || 5000000) / 1000000,
          units: [],
        };
      }

      const bd = breakdownMap[key];
      const isSold = status.toLowerCase().includes("sold");
      bd.available += isSold ? 0 : 1;
      if (areaRange.min > 0 && areaRange.min < bd.minSqm) bd.minSqm = areaRange.min;
      if (areaRange.max > bd.maxSqm) bd.maxSqm = areaRange.max;
      if (priceRange.min > 0 && priceRange.min / 1000000 < bd.minPriceM)
        bd.minPriceM = priceRange.min / 1000000;
      if (priceRange.max / 1000000 > bd.maxPriceM) bd.maxPriceM = priceRange.max / 1000000;

      bd.units.push({
        id: `${defaultSlug}-${rIdx + 1}`,
        unitNo,
        beds,
        finishing: "Finished",
        areaSqm: areaRange.min || 120,
        view,
        priceEGP: priceRange.min || 5000000,
        status: isSold ? "Sold" : "Available",
        ...extraFields,
      });
    });
  });

  const breakdown = Object.values(breakdownMap);
  const totalAvailable = breakdown.reduce((acc, curr) => acc + curr.available, 0);

  return {
    slug: defaultSlug,
    developer: defaultDev,
    totalAvailable,
    breakdown,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

function main() {
  const rootDir = path.join(ROOT, "data", "availability");
  const projectsDir = path.join(rootDir, "projects");

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }

  const files = [];
  function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    for (const f of list) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (
        (f.endsWith(".xlsx") || f.endsWith(".xls") || f.endsWith(".csv")) &&
        !f.startsWith("~$")
      ) {
        files.push(fullPath);
      }
    }
  }
  scan(rootDir);
  if (fs.existsSync("D:/new availability")) {
    scan("D:/new availability");
  }

  console.log(`Found ${files.length} spreadsheet file(s) in data/availability/`);

  // Clear previous public/availability-data folder to completely delete old units
  const availabilityDataDir = path.join(ROOT, "public", "availability-data");
  if (fs.existsSync(availabilityDataDir)) {
    fs.rmSync(availabilityDataDir, { recursive: true, force: true });
  }
  fs.mkdirSync(availabilityDataDir, { recursive: true });

  const projectMap = new Map();

  files.forEach((filePath) => {
    const fileName = path.basename(filePath, path.extname(filePath));
    const slug = fileName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const parentFolder = path.basename(path.dirname(filePath)).toLowerCase();
    let dev = "Developer";
    if (parentFolder === "sodic") dev = "SODIC";
    else if (parentFolder === "emaar-misr") dev = "Emaar Misr";
    else if (parentFolder === "palm-hills-developments") dev = "Palm Hills Developments";
    else if (parentFolder === "orascom-development") dev = "Orascom Development";
    else if (parentFolder === "madinet-masr") dev = "Madinet Masr";

    const pObj = parseUniversalWorkbook(filePath, slug, dev);
    if (pObj) {
      projectMap.set(slug, pObj);
    }
  });

  const projectsList = Array.from(projectMap.values());

  let unitFilesCount = 0;
  projectsList.forEach((p) => {
    (p.breakdown || []).forEach((b) => {
      if (b.units && b.units.length > 0) {
        const dir = path.join(availabilityDataDir, p.slug);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const tSlug = unitTypeSlug(b);
        const filePath = path.join(dir, `${tSlug}.json`);
        fs.writeFileSync(filePath, JSON.stringify(b.units, null, 2), "utf8");
        unitFilesCount++;
      }
    });
  });

  const blocks = projectsList.map((p) => fmtObj(p, "    "));
  const outContent = [
    "// Auto-generated from data/availability/ — do not edit by hand.",
    "// Run: npm run import-availability",
    'import type { ProjectAvailability } from "./availability";',
    "",
    "export const availability: ProjectAvailability[] = [",
    ...blocks.map((b) => `  ${b},`),
    "];",
    "",
  ].join("\n");

  fs.writeFileSync(OUT, outContent, "utf8");
  console.log(
    `Wrote ${projectsList.length} projects & ${unitFilesCount} unit JSON files. Wiped old availability data.`,
  );
}

main();
