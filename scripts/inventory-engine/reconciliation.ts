import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { fileURLToPath } from "url";
import { NormalizedUnit, DiffReport, AnomalyWarning } from "./types";
import { deduplicateUnits, computeUnitFingerprint } from "./dedup";
import { validateUnitsSanity, checkInventoryDropRisk } from "./quality-guard";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const PROJECTS_BASE = path.join(ROOT, "data", "availability", "projects");

export interface ReconcileResult {
  developerSlug: string;
  projectSlug: string;
  report: DiffReport;
  savedFilePath: string;
}

/**
 * Loads existing units from a project spreadsheet if it exists
 */
export function loadExistingProjectWorkbook(
  developerSlug: string,
  projectSlug: string
): { existingUnits: NormalizedUnit[]; previousAvailable: number; meta: any } {
  const filePath = path.join(PROJECTS_BASE, developerSlug, `${projectSlug}.xlsx`);
  if (!fs.existsSync(filePath)) {
    return { existingUnits: [], previousAvailable: 0, meta: null };
  }

  try {
    const wb = XLSX.readFile(filePath);
    let previousAvailable = 0;
    let meta: any = null;

    if (wb.SheetNames.includes("Projects")) {
      const projRows: any[] = XLSX.utils.sheet_to_json(wb.Sheets["Projects"]);
      if (projRows.length > 0) {
        meta = projRows[0];
        previousAvailable = parseInt(meta.total_available || meta.totalAvailable || 0, 10);
      }
    }

    const units: NormalizedUnit[] = [];
    if (wb.SheetNames.includes("Units")) {
      const unitRows: any[] = XLSX.utils.sheet_to_json(wb.Sheets["Units"]);
      for (const r of unitRows) {
        units.push({
          id: String(r.unit_id || r.id || ""),
          projectSlug: String(r.slug || projectSlug),
          developerSlug,
          cluster: r.cluster ? String(r.cluster) : undefined,
          type: String(r.type || "Apartment"),
          beds: parseInt(r.beds || 2, 10),
          finishing: String(r.finishing || "Core & Shell"),
          areaSqm: parseFloat(r.area_sqm || r.areaSqm || 0),
          areaNote: r.area_note || r.areaNote || "",
          view: r.view || "Landscape",
          priceEGP: parseFloat(r.price_egp || r.priceEGP || 0),
          deliveryNote: r.delivery_note || r.deliveryNote || "",
          paymentPlan: r.payment_plan || r.paymentPlan || "",
          status: (r.status as any) || "Available",
          fingerprint: "",
        });
      }
    }

    return { existingUnits: units, previousAvailable, meta };
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return { existingUnits: [], previousAvailable: 0, meta: null };
  }
}

/**
 * Reconciles incoming units for a single project with existing state
 */
export function reconcileSingleProject(
  developerSlug: string,
  projectSlug: string,
  incomingUnits: NormalizedUnit[],
  sourceDesc: string,
  overrideTargetDir?: string
): ReconcileResult {
  const { existingUnits, previousAvailable } = loadExistingProjectWorkbook(developerSlug, projectSlug);

  // Validate incoming units sanity
  const sanity = validateUnitsSanity(incomingUnits, projectSlug);
  const cleanIncoming = deduplicateUnits(sanity.validUnits);

  const existingMap = new Map<string, NormalizedUnit>();
  for (const u of existingUnits) {
    const fp = u.fingerprint || computeUnitFingerprint(projectSlug, u);
    existingMap.set(fp, u);
  }

  const incomingMap = new Map<string, NormalizedUnit>();
  for (const u of cleanIncoming) {
    const fp = u.fingerprint || computeUnitFingerprint(projectSlug, u);
    incomingMap.set(fp, u);
  }

  const finalUnits: NormalizedUnit[] = [];
  let addedCount = 0;
  let updatedCount = 0;
  let soldCount = 0;

  // Process existing units: if missing from cleanIncoming -> mark Sold
  for (const [fp, exUnit] of existingMap.entries()) {
    if (incomingMap.has(fp)) {
      const inc = incomingMap.get(fp)!;
      finalUnits.push({
        ...exUnit,
        ...inc,
        status: inc.status === "Sold" ? "Sold" : "Available",
      });
      updatedCount++;
      incomingMap.delete(fp);
    } else {
      // Unit was in previous inventory, missing now -> MARK SOLD
      finalUnits.push({
        ...exUnit,
        status: "Sold",
      });
      soldCount++;
    }
  }

  // Any remaining incoming units are brand new additions
  for (const newUnit of incomingMap.values()) {
    finalUnits.push({
      ...newUnit,
      status: "Available",
    });
    addedCount++;
  }

  const currentlyAvailable = finalUnits.filter((u) => u.status === "Available" || u.status === "Last Unit").length;
  const isSoldOut = currentlyAvailable === 0;

  // Check drop risk
  const dropRisk = checkInventoryDropRisk(previousAvailable, currentlyAvailable, projectSlug);
  if (dropRisk.isDangerousDrop && dropRisk.message) {
    sanity.warnings.push({
      level: "WARNING",
      field: "inventoryDrop",
      message: dropRisk.message,
    });
  }

  const report: DiffReport = {
    developerSlug,
    projectSlug,
    sourceFileOrMsg: sourceDesc,
    timestamp: new Date().toISOString(),
    totalPreviouslyAvailable: previousAvailable,
    totalCurrentlyAvailable: currentlyAvailable,
    unitsAdded: addedCount,
    unitsUpdated: updatedCount,
    unitsMarkedSold: soldCount,
    isProjectSoldOut: isSoldOut,
    anomalies: sanity.warnings,
    passedSanityCheck: sanity.passed,
  };

  // Write updated workbook
  const targetDir = overrideTargetDir || path.join(PROJECTS_BASE, developerSlug);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, `${projectSlug}.xlsx`);

  writeStandardProjectWorkbook(targetFile, developerSlug, projectSlug, finalUnits, currentlyAvailable);

  return {
    developerSlug,
    projectSlug,
    report,
    savedFilePath: targetFile,
  };
}

/**
 * Handles master developer sheet:
 * Any project under this developer not present in the master sheet is marked as SOLD OUT.
 */
export function reconcileDeveloperMasterInventory(
  developerSlug: string,
  parsedProjectUnits: Map<string, NormalizedUnit[]>,
  sourceDesc: string,
  overrideTargetDir?: string
): ReconcileResult[] {
  const results: ReconcileResult[] = [];
  const targetDir = path.join(PROJECTS_BASE, developerSlug);

  // Discover all existing projects for this developer on disk
  const existingProjectSlugs: string[] = [];
  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir).filter((f) => f.endsWith(".xlsx"));
    for (const f of files) {
      existingProjectSlugs.push(path.basename(f, ".xlsx"));
    }
  }

  const presentSlugs = new Set(parsedProjectUnits.keys());

  // 1. Reconcile projects present in this master sheet
  for (const [projSlug, units] of parsedProjectUnits.entries()) {
    const res = reconcileSingleProject(developerSlug, projSlug, units, sourceDesc, overrideTargetDir);
    results.push(res);
  }

  // 2. Mark absent projects as SOLD OUT (Per user requirement: "if a project is not in the inventory then it is sold out")
  for (const existingSlug of existingProjectSlugs) {
    if (!presentSlugs.has(existingSlug)) {
      const res = markProjectAsSoldOut(developerSlug, existingSlug, `Absent from Developer Master Inventory (${sourceDesc})`, overrideTargetDir);
      results.push(res);
    }
  }

  return results;
}

/**
 * Marks a project and all its units as Sold Out
 */
export function markProjectAsSoldOut(
  developerSlug: string,
  projectSlug: string,
  reason: string,
  overrideTargetDir?: string
): ReconcileResult {
  const { existingUnits, previousAvailable } = loadExistingProjectWorkbook(developerSlug, projectSlug);

  const updatedUnits = existingUnits.map((u) => ({
    ...u,
    status: "Sold" as const,
  }));

  const targetDir = overrideTargetDir || path.join(PROJECTS_BASE, developerSlug);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, `${projectSlug}.xlsx`);

  writeStandardProjectWorkbook(targetFile, developerSlug, projectSlug, updatedUnits, 0, `Sold Out: ${reason}`);

  const report: DiffReport = {
    developerSlug,
    projectSlug,
    sourceFileOrMsg: reason,
    timestamp: new Date().toISOString(),
    totalPreviouslyAvailable: previousAvailable,
    totalCurrentlyAvailable: 0,
    unitsAdded: 0,
    unitsUpdated: 0,
    unitsMarkedSold: existingUnits.filter((u) => u.status === "Available").length,
    isProjectSoldOut: true,
    anomalies: [],
    passedSanityCheck: true,
  };

  return {
    developerSlug,
    projectSlug,
    report,
    savedFilePath: targetFile,
  };
}

/**
 * Writes the standardized 3-sheet Excel file matching import-availability requirements
 */
function writeStandardProjectWorkbook(
  filePath: string,
  developerSlug: string,
  projectSlug: string,
  units: NormalizedUnit[],
  totalAvailable: number,
  note = ""
) {
  const wb = XLSX.utils.book_new();

  // 1. Projects Sheet
  const projectsData = [
    {
      slug: projectSlug,
      developer: developerSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      total_available: totalAvailable,
      last_updated: new Date().toISOString().slice(0, 10),
      note: note || `Updated inventory for ${projectSlug}`,
      delivery_note: units.find((u) => u.deliveryNote)?.deliveryNote || "Ready to Move / 3-4 Years",
    },
  ];
  const wsProjects = XLSX.utils.json_to_sheet(projectsData);
  XLSX.utils.book_append_sheet(wb, wsProjects, "Projects");

  // 2. Breakdown Sheet (Aggregated by type + beds)
  const breakdownGroups = new Map<string, NormalizedUnit[]>();
  for (const u of units.filter((u) => u.status === "Available" || u.status === "Last Unit")) {
    const key = `${u.type}_${u.beds}_${u.cluster || ""}`;
    if (!breakdownGroups.has(key)) breakdownGroups.set(key, []);
    breakdownGroups.get(key)!.push(u);
  }

  const breakdownData: any[] = [];
  for (const [key, groupUnits] of breakdownGroups.entries()) {
    const prices = groupUnits.map((u) => u.priceEGP).filter((p) => p > 0);
    const sqms = groupUnits.map((u) => u.areaSqm).filter((s) => s > 0);
    const sample = groupUnits[0];

    breakdownData.push({
      slug: projectSlug,
      type: sample.type,
      beds: sample.beds,
      available: groupUnits.length,
      min_sqm: sqms.length > 0 ? Math.min(...sqms) : 0,
      max_sqm: sqms.length > 0 ? Math.max(...sqms) : 0,
      min_price_m: prices.length > 0 ? parseFloat((Math.min(...prices) / 1000000).toFixed(2)) : 0,
      max_price_m: prices.length > 0 ? parseFloat((Math.max(...prices) / 1000000).toFixed(2)) : 0,
      finishing: sample.finishing,
      cluster: sample.cluster || "",
      delivery_note: sample.deliveryNote || "",
      payment_plan: sample.paymentPlan || "",
    });
  }

  const wsBreakdown = XLSX.utils.json_to_sheet(breakdownData);
  XLSX.utils.book_append_sheet(wb, wsBreakdown, "Breakdown");

  // 3. Units Sheet
  const unitsData = units.map((u) => ({
    slug: projectSlug,
    type: u.type,
    unit_id: u.id,
    cluster: u.cluster || "",
    beds: u.beds,
    finishing: u.finishing,
    area_sqm: u.areaSqm,
    area_note: u.areaNote || "",
    view: u.view || "Landscape",
    price_egp: u.priceEGP,
    delivery_note: u.deliveryNote || "",
    payment_plan: u.paymentPlan || "",
    status: u.status,
  }));

  const wsUnits = XLSX.utils.json_to_sheet(unitsData);
  XLSX.utils.book_append_sheet(wb, wsUnits, "Units");

  XLSX.writeFile(wb, filePath);
}
