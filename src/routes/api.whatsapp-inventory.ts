import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { processIncomingTextMessage } from "../../scripts/inventory-engine/orchestrator";

const ROOT = process.cwd();
const PENDING_FILE = path.join(ROOT, "data", "availability", "pending_reviews.json");
const MATRIX_FILE = path.join(ROOT, "config", "developers-matrix.json");
const AUDIT_FILE = path.join(ROOT, "data", "availability", "audit_log.jsonl");
const STAGED_DIR = path.join(ROOT, "data", "availability", "staged");
const PROJECTS_DIR = path.join(ROOT, "data", "availability", "projects");

function loadPending() {
  if (!fs.existsSync(PENDING_FILE)) {
    return { autonomous_mode: false, pending_updates: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
  } catch {
    return { autonomous_mode: false, pending_updates: [] };
  }
}

function savePending(data: any) {
  fs.mkdirSync(path.dirname(PENDING_FILE), { recursive: true });
  fs.writeFileSync(PENDING_FILE, JSON.stringify(data, null, 2), "utf8");
}

function loadMatrix() {
  if (!fs.existsSync(MATRIX_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(MATRIX_FILE, "utf8"));
  } catch {
    return [];
  }
}

function loadRecentAudit() {
  if (!fs.existsSync(AUDIT_FILE)) return [];
  try {
    const lines = fs.readFileSync(AUDIT_FILE, "utf8").trim().split("\n").filter(Boolean);
    return lines.slice(-25).map((l) => JSON.parse(l)).reverse();
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/api/whatsapp-inventory")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const pending = loadPending();
          const matrix = loadMatrix();
          const audit = loadRecentAudit();

          return new Response(
            JSON.stringify({
              autonomous_mode: pending.autonomous_mode ?? false,
              pending_updates: pending.pending_updates ?? [],
              developers_matrix: matrix,
              recent_audit: audit,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },

      POST: async (event: any) => {
        try {
          const request = event.request;
          const body = await request.json();
          const { action, updateId, text, developerSlug } = body;

          const pendingData = loadPending();

          if (action === "toggle-autonomous") {
            pendingData.autonomous_mode = !pendingData.autonomous_mode;
            savePending(pendingData);
            return new Response(
              JSON.stringify({ success: true, autonomous_mode: pendingData.autonomous_mode }),
              { headers: { "Content-Type": "application/json" } }
            );
          }

          if (action === "approve") {
            const updateIndex = pendingData.pending_updates.findIndex((u: any) => u.id === updateId);
            if (updateIndex === -1) {
              return new Response(JSON.stringify({ error: "Update not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              });
            }

            const update = pendingData.pending_updates[updateIndex];

            // If staged files exist, copy them to active projects
            const stagedUpdateDir = path.join(STAGED_DIR, updateId);
            if (fs.existsSync(stagedUpdateDir)) {
              const files = fs.readdirSync(stagedUpdateDir);
              for (const f of files) {
                const srcPath = path.join(stagedUpdateDir, f);
                const destDir = path.join(PROJECTS_DIR, update.developerSlug);
                fs.mkdirSync(destDir, { recursive: true });
                const destPath = path.join(destDir, f);
                fs.copyFileSync(srcPath, destPath);
              }
              fs.rmSync(stagedUpdateDir, { recursive: true, force: true });
            }

            // Run import-availability
            execSync("node scripts/import-availability.mjs", { cwd: ROOT, stdio: "inherit" });

            // Remove from pending
            pendingData.pending_updates.splice(updateIndex, 1);
            savePending(pendingData);

            // Append to audit
            const auditEntry = {
              timestamp: new Date().toISOString(),
              source: update.source || "WHATSAPP_DOC",
              sourceId: update.filename || update.sourceId,
              developerSlug: update.developerSlug,
              projectsAffected: update.projectsAffected || [],
              diffs: update.diffs || [],
              status: "APPLIED",
              approvedBy: "admin",
            };
            fs.appendFileSync(AUDIT_FILE, JSON.stringify(auditEntry) + "\n", "utf8");

            return new Response(JSON.stringify({ success: true, message: "Update approved and deployed." }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "reject") {
            const updateIndex = pendingData.pending_updates.findIndex((u: any) => u.id === updateId);
            if (updateIndex !== -1) {
              const update = pendingData.pending_updates[updateIndex];
              const stagedUpdateDir = path.join(STAGED_DIR, updateId);
              if (fs.existsSync(stagedUpdateDir)) {
                fs.rmSync(stagedUpdateDir, { recursive: true, force: true });
              }
              pendingData.pending_updates.splice(updateIndex, 1);
              savePending(pendingData);

              const auditEntry = {
                timestamp: new Date().toISOString(),
                source: update.source || "WHATSAPP_DOC",
                sourceId: update.filename || update.sourceId,
                developerSlug: update.developerSlug,
                projectsAffected: update.projectsAffected || [],
                diffs: update.diffs || [],
                status: "REJECTED",
                rejectedBy: "admin",
              };
              fs.appendFileSync(AUDIT_FILE, JSON.stringify(auditEntry) + "\n", "utf8");
            }
            return new Response(JSON.stringify({ success: true, message: "Update rejected." }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          if (action === "test-text") {
            if (!text) {
              return new Response(JSON.stringify({ error: "No text provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
              });
            }
            const res = await processIncomingTextMessage(text, developerSlug);
            return new Response(JSON.stringify(res), {
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ error: "Invalid action" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("API error in whatsapp-inventory:", err);
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
