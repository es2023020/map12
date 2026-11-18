import { NormalizedUnit, AnomalyWarning, DiffReport } from "./types";

export interface SanityCheckResult {
  passed: boolean;
  warnings: AnomalyWarning[];
  validUnits: NormalizedUnit[];
  quarantinedUnits: NormalizedUnit[];
}

/**
 * Validates units against strict real estate business rules
 */
export function validateUnitsSanity(units: NormalizedUnit[], projectSlug: string): SanityCheckResult {
  const warnings: AnomalyWarning[] = [];
  const validUnits: NormalizedUnit[] = [];
  const quarantinedUnits: NormalizedUnit[] = [];

  for (const u of units) {
    let isQuarantined = false;

    // 1. Area check
    if (u.areaSqm <= 0 || u.areaSqm > 3000) {
      warnings.push({
        level: "CRITICAL",
        field: "areaSqm",
        unitId: u.id,
        value: u.areaSqm,
        message: `Unrealistic area size (${u.areaSqm} sqm) for unit ${u.id || "unnamed"} in ${projectSlug}`,
      });
      isQuarantined = true;
    }

    // 2. Price check
    if (u.priceEGP <= 0) {
      warnings.push({
        level: "CRITICAL",
        field: "priceEGP",
        unitId: u.id,
        value: u.priceEGP,
        message: `Missing or zero price for unit ${u.id || "unnamed"} in ${projectSlug}`,
      });
      isQuarantined = true;
    } else if (u.priceEGP < 500000) {
      warnings.push({
        level: "CRITICAL",
        field: "priceEGP",
        unitId: u.id,
        value: u.priceEGP,
        message: `Suspiciously low price (${u.priceEGP.toLocaleString()} EGP) - possible missing zeros or formatting error`,
      });
      isQuarantined = true;
    }

    // 3. Price per sqm check
    if (u.areaSqm > 0 && u.priceEGP > 0) {
      const pricePerSqm = u.priceEGP / u.areaSqm;
      if (pricePerSqm < 15000) {
        warnings.push({
          level: "WARNING",
          field: "pricePerSqm",
          unitId: u.id,
          value: pricePerSqm,
          message: `Suspiciously low price/sqm (${Math.round(pricePerSqm).toLocaleString()} EGP/sqm) for ${u.type} in ${projectSlug}`,
        });
      } else if (pricePerSqm > 600000) {
        warnings.push({
          level: "WARNING",
          field: "pricePerSqm",
          unitId: u.id,
          value: pricePerSqm,
          message: `Unusually high price/sqm (${Math.round(pricePerSqm).toLocaleString()} EGP/sqm) for ${u.type} in ${projectSlug}`,
        });
      }
    }

    // 4. Bedrooms check
    if (u.beds < 0 || u.beds > 12) {
      warnings.push({
        level: "WARNING",
        field: "beds",
        unitId: u.id,
        value: u.beds,
        message: `Unusual bedroom count (${u.beds}) for unit ${u.id}`,
      });
      u.beds = Math.max(1, Math.min(10, u.beds));
    }

    if (isQuarantined) {
      quarantinedUnits.push(u);
    } else {
      validUnits.push(u);
    }
  }

  const criticalCount = warnings.filter((w) => w.level === "CRITICAL").length;
  return {
    passed: criticalCount === 0,
    warnings,
    validUnits,
    quarantinedUnits,
  };
}

/**
 * Checks for sudden catastrophic inventory drop (Drop Protection Guard)
 */
export function checkInventoryDropRisk(
  previousAvailable: number,
  newAvailable: number,
  projectSlug: string
): { isDangerousDrop: boolean; dropPercent: number; message?: string } {
  if (previousAvailable >= 5 && newAvailable === 0) {
    return {
      isDangerousDrop: true,
      dropPercent: 100,
      message: `ALERT: Project '${projectSlug}' went from ${previousAvailable} available units to 0 (Sold Out). Verify if sheet was truncated.`,
    };
  }

  if (previousAvailable > 10) {
    const drop = previousAvailable - newAvailable;
    const dropPercent = (drop / previousAvailable) * 100;
    if (dropPercent >= 70) {
      return {
        isDangerousDrop: true,
        dropPercent,
        message: `High inventory drop detected: '${projectSlug}' dropped by ${dropPercent.toFixed(1)}% (${previousAvailable} → ${newAvailable}).`,
      };
    }
  }

  return { isDangerousDrop: false, dropPercent: 0 };
}

/**
 * Generates human-readable Markdown diff report for admin notification
 */
export function formatDiffReportMarkdown(report: DiffReport): string {
  const lines: string[] = [];
  lines.push(`### 📊 Inventory Diff Report: \`${report.projectSlug}\``);
  lines.push(`- **Developer**: ${report.developerSlug}`);
  lines.push(`- **Source**: ${report.sourceFileOrMsg}`);
  lines.push(`- **Timestamp**: ${report.timestamp}`);
  lines.push(`- **Available Units**: ${report.totalPreviouslyAvailable} → **${report.totalCurrentlyAvailable}**`);
  lines.push(`- **New Units Added**: +${report.unitsAdded}`);
  lines.push(`- **Units Updated**: ${report.unitsUpdated}`);
  lines.push(`- **Units Marked Sold**: -${report.unitsMarkedSold}`);

  if (report.isProjectSoldOut) {
    lines.push(`\n> [!CAUTION]\n> **Project marked as 100% SOLD OUT**`);
  }

  if (report.anomalies.length > 0) {
    lines.push(`\n**⚠️ Anomalies & Warnings (${report.anomalies.length}):**`);
    for (const a of report.anomalies) {
      lines.push(`- [${a.level}] ${a.message}`);
    }
  }

  lines.push(`\n**Sanity Status**: ${report.passedSanityCheck ? "✅ PASSED" : "❌ QUARANTINED (Needs Review)"}`);
  return lines.join("\n");
}
