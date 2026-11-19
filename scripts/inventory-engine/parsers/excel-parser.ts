import { createRequire } from "module";
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
import path from "path";
import { NormalizedUnit } from "../types";
import { normalizeUnitId, computeUnitFingerprint } from "../dedup";
import { matchProjectAndDeveloper } from "../gatekeeper";

export interface ParsedWorkbookResult {
  developerSlug?: string;
  projectUnits: Map<string, NormalizedUnit[]>;
  totalUnitsFound: number;
}

function cleanType(t: any, cluster = ""): string {
  const str = String(t || "").toLowerCase().trim();
  const cl = String(cluster || "").toLowerCase().trim();
  if (
    cl.includes("apartment") ||
    cl.includes("residence") ||
    str.includes("apartment") ||
    str.includes("flat") ||
    str.includes("studio") ||
    str.includes("apt")
  ) {
    return "Apartment";
  }
  if (str.includes("penthouse") || str.includes("ph")) return "Penthouse";
  if (str.includes("duplex") || str.includes("ivilla") || str.includes("i-villa")) return "Duplex";
  if (str.includes("townhouse") || str.includes("town house") || str.includes("townhome") || str.includes("town"))
    return "Townhouse";
  if (str.includes("twinhouse") || str.includes("twin house") || str.includes("twinhome") || str.includes("twin"))
    return "Twin House";
  if (str.includes("chalet") || str.includes("شاليه")) return "Chalet";
  if (str.includes("cabin") || str.includes("كابينة")) return "Cabin";
  if (
    str.includes("standalone") ||
    str.includes("stand alone") ||
    str.includes("villa") ||
    str.includes("فيلا") ||
    cl === "single family" ||
    cl === "villas"
  ) {
    return "Standalone Villa";
  }
  if (str.includes("office") || str.includes("admin") || str.includes("مكتب")) return "Office";
  if (str.includes("clinic") || str.includes("medical") || str.includes("عيادة")) return "Clinic";

  return "Apartment";
}

function parsePrice(val: any): number {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") {
    if (val < 0) return 0;
    if (val < 1000 && val > 0) return Math.round(val * 1000000); // entered as millions e.g. 15.5
    return Math.round(val);
  }

  let str = String(val).replace(/EGP|LE|جنيه/gi, "").replace(/,/g, "").trim();
  if (str.toLowerCase().includes("sold") || str.toLowerCase().includes("مباع")) return 0;

  let isMillion = false;
  if (str.toLowerCase().includes("m") || str.toLowerCase().includes("مليون")) {
    isMillion = true;
    str = str.replace(/m|مليون/gi, "");
  }

  const parts = str.split(/[-–—to]/i).map((p) => parseFloat(p.trim())).filter((p) => !isNaN(p));
  if (parts.length === 0) return 0;
  let price = parts[0];
  if (isMillion || (price < 1000 && price > 0)) {
    price *= 1000000;
  }
  return Math.round(price);
}

function parseArea(val: any): number {
  if (val === undefined || val === null || val === "") return 0;
  if (typeof val === "number") return val;
  const str = String(val).replace(/m2|sqm|m|متر|م²|\+/gi, " ").trim();
  const parts = str.split(/[-–—to\s]/).map((p) => parseFloat(p.trim())).filter((p) => !isNaN(p));
  if (parts.length === 0) return 0;
  return parts[0];
}

function parseBeds(rawBeds: any, rawType: any): number {
  if (rawBeds !== undefined && rawBeds !== null && String(rawBeds).trim() !== "") {
    const num = parseInt(String(rawBeds).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num) && num >= 0 && num <= 10) return num;
  }
  const typeStr = String(rawType || "");
  const match = typeStr.match(/(\d+)\s*(?:br|bed|bdr|bedroom|غرف)/i);
  if (match) return parseInt(match[1], 10);

  const clean = cleanType(typeStr);
  if (clean === "Standalone Villa") return 5;
  if (clean === "Townhouse" || clean === "Twin House") return 4;
  if (clean === "Chalet") return 2;
  return 2;
}

function findHeaderRow(rows: any[][]): { headerIdx: number; headers: string[] } {
  const keywords = ["type", "unit", "bua", "area", "price", "beds", "bedroom", "cluster", "project", "code", "status", "مساحة", "سعر", "نوع"];
  let maxScore = -1;
  let bestIdx = 0;

  for (let i = 0; i < Math.min(15, rows.length); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    let score = 0;
    row.forEach((cell) => {
      if (cell === null || cell === undefined || cell === "") return;
      const str = String(cell).toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "");
      if (keywords.some((k) => str.includes(k))) score += 2;
    });
    if (score > maxScore && score >= 2) {
      maxScore = score;
      bestIdx = i;
    }
  }

  const headerRow = rows[bestIdx] || [];
  const headers = headerRow.map((c, i) => String(c).trim() || `Col_${i}`);
  return { headerIdx: bestIdx, headers };
}

function cleanCluster(raw: any, sheetName?: string): string | undefined {
  if (!raw) return undefined;
  const str = String(raw).trim();
  // Strip GUIDs (e.g. {364867a2-4a0f-4889-b1d6-88fe0b9d7990})
  if (/^\{?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}?$/.test(str)) {
    return undefined;
  }
  if (str.toLowerCase() === "sheet1" || (sheetName && str.toLowerCase() === sheetName.toLowerCase())) {
    return undefined;
  }
  return str || undefined;
}

function cleanFinishing(raw: any): string {
  if (!raw) return "Core & Shell";
  const str = String(raw).trim();
  // If it's a numeric value or serial (like 1478400), return default
  if (!isNaN(Number(str)) && Number(str) > 0) return "Core & Shell";
  return str || "Core & Shell";
}

function cleanDeliveryNote(raw: any): string {
  if (!raw) return "Ready to Move / 3-4 Years";
  const num = typeof raw === "number" ? raw : Number(String(raw).trim());
  if (!isNaN(num) && num >= 40000 && num <= 65000) {
    const jsDate = new Date((num - 25569) * 86400 * 1000);
    const year = jsDate.getFullYear();
    const month = jsDate.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
  }
  const str = String(raw).trim();
  if (/^\d{5}$/.test(str)) {
    const n = parseInt(str, 10);
    if (n >= 40000 && n <= 65000) {
      const jsDate = new Date((n - 25569) * 86400 * 1000);
      const year = jsDate.getFullYear();
      const quarter = Math.ceil((jsDate.getMonth() + 1) / 3);
      return `Q${quarter} ${year}`;
    }
  }
  return str || "Ready to Move / 3-4 Years";
}

/**
 * Parses an Excel Workbook into normalized unit maps grouped by project slug
 */
export function parseExcelWorkbook(
  filePath: string,
  defaultProjectSlug?: string,
  defaultDevSlug?: string
): ParsedWorkbookResult {
  const wb = XLSX.readFile(filePath);
  const projectUnits = new Map<string, NormalizedUnit[]>();
  let totalUnitsFound = 0;

  let effectiveDevSlug = defaultDevSlug;

  // Filter sheets
  const ignoredSheetNames = ["overview", "summary", "instructions", "index", "breakdown", "cover"];
  const sheetsToProcess = wb.SheetNames.filter(
    (sn: string) => !ignoredSheetNames.includes(sn.toLowerCase().trim())
  );

  for (const sheetName of sheetsToProcess) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;

    const rawMatrix: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    if (!rawMatrix || rawMatrix.length < 2) continue;

    const { headerIdx, headers } = findHeaderRow(rawMatrix);
    const colMap: Record<string, number> = {};

    headers.forEach((h, idx) => {
      const lower = h.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "");
      const isType = lower.includes("type") || lower.includes("category") || lower.includes("layout") || lower.includes("نوع");
      const isSubFee = lower.includes("finishing") || lower.includes("club") || lower.includes("maintenance") || lower.includes("deposit");
      const isLand = lower.includes("land") || lower.includes("garden") || lower.includes("roof") || lower.includes("outdoor") || lower.includes("pergola") || lower.includes("garage") || lower.includes("storage");

      if (!colMap.unitId && !isType && (lower.includes("code") || lower.includes("unitcode") || lower.includes("unitno") || lower.includes("كود") || lower === "unit" || lower === "id" || lower === "#")) {
        colMap.unitId = idx;
      } else if (!colMap.type && isType) {
        colMap.type = idx;
      } else if (!colMap.price && !isSubFee && (lower.includes("unittotal") || lower.includes("grandtotal") || lower.includes("price") || lower.includes("total") || lower.includes("value") || lower.includes("cost") || lower.includes("egp") || lower.includes("سعر") || lower.includes("اجمالي"))) {
        colMap.price = idx;
      } else if (!colMap.bua && !isLand && (lower.includes("built") || lower.includes("bua") || lower.includes("area") || lower.includes("sqm") || lower.includes("مساحة"))) {
        colMap.bua = idx;
      } else if (!colMap.beds && (lower.includes("bed") || lower.includes("rooms") || lower.includes("غرف"))) {
        colMap.beds = idx;
      } else if (!colMap.cluster && (lower.includes("cluster") || lower.includes("phase") || lower.includes("zone") || lower.includes("building") || lower.includes("مرحلة"))) {
        colMap.cluster = idx;
      } else if (!colMap.project && (lower.includes("project") || lower.includes("compound") || lower.includes("مشروع"))) {
        colMap.project = idx;
      } else if (!colMap.delivery && (lower.includes("delivery") || lower.includes("deliv") || lower.includes("استلام"))) {
        colMap.delivery = idx;
      } else if (!colMap.payment && (lower.includes("payment") || lower.includes("plan") || lower.includes("installments") || lower.includes("تقسيط"))) {
        colMap.payment = idx;
      } else if (!colMap.finishing && (lower.includes("finish") || lower.includes("تشطيب"))) {
        colMap.finishing = idx;
      } else if (!colMap.view && (lower.includes("view") || lower.includes("فيو"))) {
        colMap.view = idx;
      } else if (!colMap.status && (lower.includes("status") || lower.includes("state") || lower.includes("حالة"))) {
        colMap.status = idx;
      }
    });

    // Determine target project slug from sheet name if applicable
    const sheetProjectMatch = matchProjectAndDeveloper(sheetName);
    const targetProjectFromSheet = sheetProjectMatch.projectSlug;

    for (let r = headerIdx + 1; r < rawMatrix.length; r++) {
      const row = rawMatrix[r];
      if (!row || row.length === 0) continue;

      const rawType = colMap.type !== undefined ? row[colMap.type] : "";
      const rawPrice = colMap.price !== undefined ? row[colMap.price] : "";
      const rawBua = colMap.bua !== undefined ? row[colMap.bua] : "";
      const rawId = colMap.unitId !== undefined ? row[colMap.unitId] : "";
      const rawCluster = colMap.cluster !== undefined ? row[colMap.cluster] : sheetName;
      const rawProject = colMap.project !== undefined ? row[colMap.project] : "";
      const rawStatus = colMap.status !== undefined ? String(row[colMap.status]).trim().toLowerCase() : "";

      const price = parsePrice(rawPrice);
      const bua = parseArea(rawBua);

      // Skip non-unit rows (e.g. empty rows, totals)
      if (price <= 0 && bua <= 0) continue;

      // Check if unit marked as sold in sheet status
      const isSold = rawStatus.includes("sold") || rawStatus.includes("مباع") || rawStatus.includes("reserved");

      // Resolve project slug
      let rowProjectSlug = defaultProjectSlug;
      if (rawProject) {
        const match = matchProjectAndDeveloper(String(rawProject));
        if (match.projectSlug) rowProjectSlug = match.projectSlug;
        if (match.developerSlug && !effectiveDevSlug) effectiveDevSlug = match.developerSlug;
      }
      if (!rowProjectSlug && targetProjectFromSheet) {
        rowProjectSlug = targetProjectFromSheet;
      }
      if (!rowProjectSlug) {
        rowProjectSlug = defaultProjectSlug || "unassigned-project";
      }

      const propType = cleanType(rawType, String(rawCluster));
      const beds = parseBeds(colMap.beds !== undefined ? row[colMap.beds] : null, rawType);
      const cleanId = normalizeUnitId(rawId);

      const unit: NormalizedUnit = {
        id: cleanId,
        projectSlug: rowProjectSlug,
        developerSlug: effectiveDevSlug,
        cluster: cleanCluster(rawCluster, sheetName),
        type: propType,
        beds,
        finishing: colMap.finishing !== undefined ? cleanFinishing(row[colMap.finishing]) : "Core & Shell",
        areaSqm: bua,
        view: colMap.view !== undefined && row[colMap.view] ? String(row[colMap.view]).trim() : "Landscape",
        priceEGP: price,
        deliveryNote: colMap.delivery !== undefined ? cleanDeliveryNote(row[colMap.delivery]) : "Ready to Move / 3-4 Years",
        paymentPlan: colMap.payment !== undefined && row[colMap.payment] ? String(row[colMap.payment]).trim() : "10% DP · 8 years",
        status: isSold ? "Sold" : "Available",
        rawUnitId: String(rawId),
        fingerprint: "",
      };

      unit.fingerprint = computeUnitFingerprint(rowProjectSlug, unit);

      if (!projectUnits.has(rowProjectSlug)) {
        projectUnits.set(rowProjectSlug, []);
      }
      projectUnits.get(rowProjectSlug)!.push(unit);
      totalUnitsFound++;
    }
  }

  return {
    developerSlug: effectiveDevSlug,
    projectUnits,
    totalUnitsFound,
  };
}
