import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PROJECTS_BASE = path.join(ROOT, "data", "availability", "projects");
const INBOX_BASE = path.join(ROOT, "data", "availability", "inbox");
const GROUPS_FILE = path.join(ROOT, "config", "whatsapp-groups.json");

interface ProjectAudit {
  developerSlug: string;
  projectSlug: string;
  totalAvailable: number;
  totalUnitsInFile: number;
  unitsWithPrice: number;
  minPriceM: number;
  maxPriceM: number;
  lastUpdated: string;
  note: string;
  status: "ACTIVE_PRICED" | "NO_PRICES" | "SOLD_OUT" | "EMPTY";
}

interface DeveloperAudit {
  developerSlug: string;
  developerName: string;
  projectCount: number;
  totalAvailableUnits: number;
  hasPricedUnits: boolean;
  projects: ProjectAudit[];
  hasWhatsAppGroup: boolean;
  groupName?: string;
  needsUpdate: boolean;
  reason?: string;
}

function auditAllDevelopers() {
  const groupsConfig = fs.existsSync(GROUPS_FILE)
    ? JSON.parse(fs.readFileSync(GROUPS_FILE, "utf8"))
    : { groups: {} };

  const devGroupMap = new Map<string, string>();
  for (const [jid, g] of Object.entries<any>(groupsConfig.groups || {})) {
    if (g.developer_slug && g.developer_slug !== "general-developer") {
      devGroupMap.set(g.developer_slug, g.name || g.developer_name);
    }
  }

  const devFolders = fs.readdirSync(PROJECTS_BASE).filter((d) => {
    return fs.statSync(path.join(PROJECTS_BASE, d)).isDirectory();
  });

  const devAudits: DeveloperAudit[] = [];

  for (const devSlug of devFolders) {
    const devPath = path.join(PROJECTS_BASE, devSlug);
    const files = fs.readdirSync(devPath).filter((f) => f.endsWith(".xlsx"));

    const devAudit: DeveloperAudit = {
      developerSlug: devSlug,
      developerName: devSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      projectCount: files.length,
      totalAvailableUnits: 0,
      hasPricedUnits: false,
      projects: [],
      hasWhatsAppGroup: devGroupMap.has(devSlug),
      groupName: devGroupMap.get(devSlug),
      needsUpdate: false,
    };

    for (const f of files) {
      const projSlug = path.basename(f, ".xlsx");
      const filePath = path.join(devPath, f);

      try {
        const wb = XLSX.readFile(filePath);
        let totalAvail = 0;
        let lastUpdated = "";
        let note = "";

        if (wb.SheetNames.includes("Projects")) {
          const pData: any[] = XLSX.utils.sheet_to_json(wb.Sheets["Projects"]);
          if (pData.length > 0) {
            totalAvail = parseInt(pData[0].total_available || pData[0].totalAvailable || 0, 10);
            lastUpdated = pData[0].last_updated || "";
            note = pData[0].note || "";
          }
        }

        let totalUnitsInFile = 0;
        let unitsWithPrice = 0;
        const prices: number[] = [];

        // Check Units sheet or first sheet
        const unitSheetName = wb.SheetNames.includes("Units") ? "Units" : wb.SheetNames[0];
        const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[unitSheetName]);
        totalUnitsInFile = rows.length;

        for (const r of rows) {
          const price = parseFloat(r.price_egp || r.priceEGP || r.price || r.total_price || 0);
          if (price > 0) {
            unitsWithPrice++;
            prices.push(price);
          }
        }

        const minPriceM = prices.length ? Math.min(...prices) / 1000000 : 0;
        const maxPriceM = prices.length ? Math.max(...prices) / 1000000 : 0;

        let status: ProjectAudit["status"] = "EMPTY";
        if (totalAvail === 0) {
          status = "SOLD_OUT";
        } else if (unitsWithPrice > 0) {
          status = "ACTIVE_PRICED";
        } else {
          status = "NO_PRICES";
        }

        const projAudit: ProjectAudit = {
          developerSlug: devSlug,
          projectSlug: projSlug,
          totalAvailable: totalAvail,
          totalUnitsInFile,
          unitsWithPrice,
          minPriceM,
          maxPriceM,
          lastUpdated,
          note,
          status,
        };

        devAudit.projects.push(projAudit);
        devAudit.totalAvailableUnits += totalAvail;
        if (unitsWithPrice > 0) devAudit.hasPricedUnits = true;
      } catch (err: any) {
        devAudit.projects.push({
          developerSlug: devSlug,
          projectSlug: projSlug,
          totalAvailable: 0,
          totalUnitsInFile: 0,
          unitsWithPrice: 0,
          minPriceM: 0,
          maxPriceM: 0,
          lastUpdated: "",
          note: `Error reading: ${err.message}`,
          status: "EMPTY",
        });
      }
    }

    // Determine if needs update
    if (devAudit.projectCount === 0) {
      devAudit.needsUpdate = true;
      devAudit.reason = "No project spreadsheets found";
    } else if (devAudit.totalAvailableUnits === 0) {
      devAudit.needsUpdate = true;
      devAudit.reason = "All projects currently marked Sold Out (0 units available)";
    } else if (!devAudit.hasPricedUnits) {
      devAudit.needsUpdate = true;
      devAudit.reason = "Has units but missing price data (0 EGP)";
    }

    devAudits.push(devAudit);
  }

  // Summary categories
  const healthy = devAudits.filter((d) => !d.needsUpdate);
  const soldOut = devAudits.filter((d) => d.projectCount > 0 && d.totalAvailableUnits === 0);
  const unpriced = devAudits.filter((d) => d.totalAvailableUnits > 0 && !d.hasPricedUnits);

  console.log("================================================================================");
  console.log("                        DEVELOPER INVENTORY AUDIT REPORT                        ");
  console.log("================================================================================");
  console.log(`Total Developers on file       : ${devAudits.length}`);
  console.log(`🟢 Active & Priced             : ${healthy.length}`);
  console.log(`🟡 Has units but Price=0       : ${unpriced.length}`);
  console.log(`🔴 Sold Out (0 available)      : ${soldOut.length}`);
  console.log(`📱 Mapped to WhatsApp Group    : ${devAudits.filter((d) => d.hasWhatsAppGroup).length}`);
  console.log("================================================================================");

  console.log("\n--- 🟢 TOP ACTIVE DEVELOPERS WITH PRICED INVENTORIES ---");
  healthy
    .sort((a, b) => b.totalAvailableUnits - a.totalAvailableUnits)
    .slice(0, 15)
    .forEach((d) => {
      console.log(
        `• ${d.developerName.padEnd(28)} | ${String(d.projectCount).padStart(2)} projects | ${String(
          d.totalAvailableUnits
        ).padStart(4)} units | WA: ${d.hasWhatsAppGroup ? "✅ " + d.groupName : "❌"}`
      );
    });

  if (unpriced.length > 0) {
    console.log("\n--- 🟡 DEVELOPERS WITH UNITS BUT MISSING/0 PRICES (NEEDS NEW SHEET) ---");
    unpriced.forEach((d) => {
      console.log(
        `• ${d.developerName.padEnd(28)} | ${d.projectCount} projects | ${d.totalAvailableUnits} units (price=0) | WA: ${
          d.hasWhatsAppGroup ? "✅ " + d.groupName : "❌"
        }`
      );
    });
  }

  console.log("\n--- 🔴 DEVELOPERS MARKED 100% SOLD OUT (NEEDS NEW INVENTORY RELEASE) ---");
  soldOut.slice(0, 15).forEach((d) => {
    console.log(
      `• ${d.developerName.padEnd(28)} | ${d.projectCount} projects (0 units) | WA: ${
        d.hasWhatsAppGroup ? "✅ " + d.groupName : "❌"
      }`
    );
  });

  // Save detailed JSON
  fs.writeFileSync(
    path.join(ROOT, "data", "availability", "inventory_audit_summary.json"),
    JSON.stringify(devAudits, null, 2),
    "utf8"
  );
  console.log("\nDetailed audit report saved to data/availability/inventory_audit_summary.json");
}

auditAllDevelopers();
