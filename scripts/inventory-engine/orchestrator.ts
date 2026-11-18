import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { evaluateIncomingDocument, markHashProcessed, calculateFileHash } from "./gatekeeper";
import { parseExcelWorkbook } from "./parsers/excel-parser";
import { reconcileDeveloperMasterInventory, reconcileSingleProject, markProjectAsSoldOut, ReconcileResult } from "./reconciliation";
import { parseWhatsAppTextMessage } from "./chat-parser";
import { formatDiffReportMarkdown } from "./quality-guard";
import { AuditLogEntry, DiffReport } from "./types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUDIT_LOG_FILE = path.join(ROOT, "data", "availability", "audit_log.jsonl");
const PENDING_FILE = path.join(ROOT, "data", "availability", "pending_reviews.json");
const STAGED_DIR = path.join(ROOT, "data", "availability", "staged");

export interface ProcessingResponse {
  success: boolean;
  message: string;
  reports: DiffReport[];
  formattedMarkdown: string;
  isStagedForApproval?: boolean;
}

function isAutonomousMode(): boolean {
  if (!fs.existsSync(PENDING_FILE)) return false;
  try {
    const data = JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
    return data.autonomous_mode === true;
  } catch {
    return false;
  }
}

function queueForAdminApproval(updateData: any) {
  try {
    const pending = fs.existsSync(PENDING_FILE)
      ? JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"))
      : { autonomous_mode: false, pending_updates: [] };

    pending.pending_updates = pending.pending_updates || [];
    pending.pending_updates.unshift(updateData);
    fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to queue pending update:", err);
  }
}

function appendAuditLog(entry: AuditLogEntry) {
  try {
    fs.mkdirSync(path.dirname(AUDIT_LOG_FILE), { recursive: true });
    fs.appendFileSync(AUDIT_LOG_FILE, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    console.error("Failed to write to audit log:", err);
  }
}

/**
 * Re-generates frontend availability data via import-availability.mjs
 */
export function triggerAppAvailabilitySync(): boolean {
  try {
    console.log("Compiling availability data into Property Atlas...");
    const cmd = "node scripts/import-availability.mjs";
    execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    return true;
  } catch (err) {
    console.error("Failed to execute import-availability:", err);
    return false;
  }
}

/**
 * Handles incoming document (Excel or PDF) from WhatsApp or Inbox
 */
export async function processIncomingDocument(
  filePath: string,
  filename: string,
  caption = "",
  groupDevSlug?: string
): Promise<ProcessingResponse> {
  console.log(`\n--- Processing Incoming File: ${filename} ---`);
  
  // 1. Gatekeeper evaluation
  const classification = evaluateIncomingDocument(filename, filePath, caption, groupDevSlug);
  if (!classification.accepted) {
    console.log(`[Gatekeeper Rejection] ${classification.rejectionReason}`);
    return {
      success: false,
      message: `File rejected: ${classification.rejectionReason}`,
      reports: [],
      formattedMarkdown: `❌ **File Rejected**: ${classification.rejectionReason}`,
    };
  }

  const devSlug = classification.developerSlug || groupDevSlug || "general-developer";
  const fileHash = calculateFileHash(filePath);

  let reconcileResults: ReconcileResult[] = [];

  const ext = path.extname(filename).toLowerCase();

  const updateId = `upd_${Date.now()}`;
  const autonomous = isAutonomousMode();
  const overrideTarget = autonomous ? undefined : path.join(STAGED_DIR, updateId);

  // 2. Parse Excel
  if ([".xlsx", ".xls"].includes(ext)) {
    const parsed = parseExcelWorkbook(filePath, classification.projectSlug, devSlug);
    if (parsed.projectUnits.size === 0) {
      return {
        success: false,
        message: "No valid unit data could be parsed from workbook.",
        reports: [],
        formattedMarkdown: "⚠️ No valid units found in spreadsheet.",
      };
    }

    if (classification.documentType === "MASTER_INVENTORY") {
      reconcileResults = reconcileDeveloperMasterInventory(
        devSlug,
        parsed.projectUnits,
        `${filename} (Master Inventory)`,
        overrideTarget
      );
    } else {
      for (const [slug, units] of parsed.projectUnits.entries()) {
        const res = reconcileSingleProject(devSlug, slug, units, filename, overrideTarget);
        reconcileResults.push(res);
      }
    }
  } else if (ext === ".pdf") {
    // 3. Parse PDF via Python bridge
    const pythonScript = path.join(__dirname, "parsers", "pdf-parser.py");
    const projSlug = classification.projectSlug || "general";
    try {
      const output = execSync(`python "${pythonScript}" "${filePath}" "${projSlug}"`, {
        encoding: "utf8",
      });
      const res = JSON.parse(output);
      if (res.success && res.units && res.units.length > 0) {
        const rec = reconcileSingleProject(devSlug, projSlug, res.units, `${filename} (PDF Table)`, overrideTarget);
        reconcileResults.push(rec);
      } else {
        return {
          success: false,
          message: `PDF did not contain parsable tables: ${res.error || "No unit rows found"}`,
          reports: [],
          formattedMarkdown: `⚠️ PDF parsing yielded 0 units.`,
        };
      }
    } catch (pdfErr: any) {
      return {
        success: false,
        message: `PDF parser execution failed: ${pdfErr.message}`,
        reports: [],
        formattedMarkdown: `❌ PDF extraction error.`,
      };
    }
  }

  // 4. Mark hash processed
  markHashProcessed(fileHash);

  const reports = reconcileResults.map((r) => r.report);
  const markdownParts = reports.map((r) => formatDiffReportMarkdown(r));

  if (autonomous) {
    // 5. Trigger Frontend App Compilation
    triggerAppAvailabilitySync();

    appendAuditLog({
      timestamp: new Date().toISOString(),
      source: "WHATSAPP_DOC",
      sourceId: filename,
      developerSlug: devSlug,
      projectsAffected: reports.map((r) => r.projectSlug),
      diffs: reports,
      status: "APPLIED",
    });

    return {
      success: true,
      message: `Successfully processed and published ${reconcileResults.length} project(s).`,
      reports,
      formattedMarkdown: markdownParts.join("\n\n---\n\n"),
      isStagedForApproval: false,
    };
  } else {
    // Stage for human approval
    queueForAdminApproval({
      id: updateId,
      timestamp: new Date().toISOString(),
      source: "WHATSAPP_DOC",
      filename,
      developerSlug: devSlug,
      projectsAffected: reports.map((r) => r.projectSlug),
      diffs: reports,
      status: "PENDING_ADMIN_APPROVAL",
    });

    return {
      success: true,
      message: `Update parsed and staged in Admin Dashboard for your approval.`,
      reports,
      formattedMarkdown: `⏳ **Update Staged for Human Approval**\n\n` + markdownParts.join("\n\n---\n\n"),
      isStagedForApproval: true,
    };
  }
}

/**
 * Handles incoming WhatsApp text message (sold notices, flash releases)
 */
export async function processIncomingTextMessage(
  rawText: string,
  groupDevSlug?: string
): Promise<ProcessingResponse> {
  const action = parseWhatsAppTextMessage(rawText, groupDevSlug);
  if (action.intent === "IRRELEVANT") {
    return {
      success: false,
      message: "Message ignored: no real estate inventory action found.",
      reports: [],
      formattedMarkdown: "ℹ️ Message ignored.",
    };
  }

  const devSlug = action.developerSlug || groupDevSlug || "general-developer";
  const projSlug = action.projectSlug || "general";
  const reports: DiffReport[] = [];

  if (action.intent === "MARK_PROJECT_SOLD_OUT") {
    const res = markProjectAsSoldOut(devSlug, projSlug, `WhatsApp Text: "${rawText}"`);
    reports.push(res.report);
  } else if (action.intent === "ADD_OR_UPDATE_UNIT" && action.unitData) {
    const res = reconcileSingleProject(
      devSlug,
      projSlug,
      [action.unitData as any],
      `WhatsApp Flash Release: "${rawText.slice(0, 40)}..."`
    );
    reports.push(res.report);
  }

  if (reports.length > 0) {
    triggerAppAvailabilitySync();

    appendAuditLog({
      timestamp: new Date().toISOString(),
      source: "WHATSAPP_TEXT",
      sourceId: rawText.slice(0, 50),
      developerSlug: devSlug,
      projectsAffected: reports.map((r) => r.projectSlug),
      diffs: reports,
      status: "APPLIED",
    });
  }

  return {
    success: reports.length > 0,
    message: `Processed text action: ${action.intent}`,
    reports,
    formattedMarkdown: reports.map((r) => formatDiffReportMarkdown(r)).join("\n\n"),
  };
}
