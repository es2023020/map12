import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseExcelWorkbook } from "./parsers/excel-parser";
import { reconcileDeveloperMasterInventory, reconcileSingleProject } from "./reconciliation";
import { triggerAppAvailabilitySync } from "./orchestrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const INBOX_DIR = path.join(ROOT, "data", "availability", "inbox");
const PROJECTS_BASE = path.join(ROOT, "data", "availability", "projects");
const PENDING_FILE = path.join(ROOT, "data", "availability", "pending_reviews.json");

async function main() {
  console.log("==================================================================");
  console.log("  APPLYING ALL APPROVED INVENTORY UPDATES (Palm Hills, MV, M-Squared)");
  console.log("==================================================================");

  // 1. Palm Hills Developments
  console.log("\n1️⃣ Processing Palm Hills Developments...");
  const phFile = path.join(INBOX_DIR, "2026-11-19", "1795074043614_Sales_Availability_19-Nov..xlsx");
  const phDir = path.join(PROJECTS_BASE, "palm-hills-developments");
  if (fs.existsSync(phDir)) {
    console.log("   Cleaning prior Palm Hills files...");
    fs.rmSync(phDir, { recursive: true, force: true });
  }
  fs.mkdirSync(phDir, { recursive: true });

  const phParsed = parseExcelWorkbook(phFile, undefined, "palm-hills-developments");
  console.log(`   Parsed ${phParsed.projectUnits.size} projects, ${phParsed.totalUnitsFound} units.`);
  const phResults = reconcileDeveloperMasterInventory(
    "palm-hills-developments",
    phParsed.projectUnits,
    "1795074043614_Sales_Availability_19-Nov..xlsx"
  );
  console.log(`   Written ${phResults.length} project workbooks for Palm Hills.`);

  // 2. Mountain View
  console.log("\n2️⃣ Processing Mountain View...");
  const mvFile = path.join(INBOX_DIR, "2026-11-19", "1795074758819_19-11-2026.xlsx");
  const mvDir = path.join(PROJECTS_BASE, "mountain-view");
  if (fs.existsSync(mvDir)) {
    console.log("   Cleaning prior Mountain View files...");
    fs.rmSync(mvDir, { recursive: true, force: true });
  }
  fs.mkdirSync(mvDir, { recursive: true });

  const mvParsed = parseExcelWorkbook(mvFile, undefined, "mountain-view");
  console.log(`   Parsed ${mvParsed.projectUnits.size} projects, ${mvParsed.totalUnitsFound} units.`);
  const mvResults = reconcileDeveloperMasterInventory(
    "mountain-view",
    mvParsed.projectUnits,
    "1795074758819_19-11-2026.xlsx"
  );
  console.log(`   Written ${mvResults.length} project workbooks for Mountain View.`);

  // 3. M-Squared
  console.log("\n3️⃣ Processing M-Squared...");
  const m2File = path.join(INBOX_DIR, "2026-11-19", "1795076403207_M2._Nov._19th._Projects_Availability__2_.xlsx");
  const m2Dir = path.join(PROJECTS_BASE, "m-squared");
  fs.mkdirSync(m2Dir, { recursive: true });

  const m2Parsed = parseExcelWorkbook(m2File, undefined, "m-squared");
  console.log(`   Parsed ${m2Parsed.projectUnits.size} projects, ${m2Parsed.totalUnitsFound} units.`);
  const m2Results = reconcileDeveloperMasterInventory(
    "m-squared",
    m2Parsed.projectUnits,
    "1795076403207_M2._Nov._19th._Projects_Availability__2_.xlsx"
  );
  console.log(`   Written ${m2Results.length} project workbooks for M-Squared.`);

  // 4. Update pending_reviews.json
  console.log("\n4️⃣ Updating pending_reviews.json to autonomous mode...");
  let existingPending: any = { autonomous_mode: true, pending_updates: [], discovered_projects: [] };
  if (fs.existsSync(PENDING_FILE)) {
    try {
      existingPending = JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
    } catch {}
  }
  existingPending.autonomous_mode = true;
  existingPending.pending_updates = [];
  existingPending.discovered_projects = existingPending.discovered_projects || [];
  fs.writeFileSync(PENDING_FILE, JSON.stringify(existingPending, null, 2), "utf8");

  // 5. Trigger Property Atlas Availability Sync
  console.log("\n5️⃣ Compiling availability data into Property Atlas...");
  triggerAppAvailabilitySync();

  console.log("\n✅ ALL APPROVED UPDATES SUCCESSFULLY APPLIED!");
}

main().catch((err) => {
  console.error("Failed to apply updates:", err);
  process.exit(1);
});
