import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { getSupabaseClient, getSupabaseAdminClient } from "@/lib/supabase";
import { compounds } from "@/data/compounds";

function sanitizeString(val: any, maxLength = 255): string {
  if (typeof val !== "string") return "";
  return val
    .trim()
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, "") // Strip control characters
    .slice(0, maxLength);
}

// @ts-ignore
export const Route = createFileRoute("/api/save-lead")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;
          const lead = await request.json();

          // 1. Bot Honeypot Defense: Silent drop if bot filled honeypot fields
          if (lead?.website_hp || lead?.fax_hp || lead?.company_hp) {
            console.warn("Spam bot submission caught by honeypot field. Dropped silently.");
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          if (!lead || !lead.name || !lead.phone) {
            return new Response(JSON.stringify({ error: "Invalid lead payload. Name and phone required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const cleanName = sanitizeString(lead.name, 100);
          const cleanPhone = sanitizeString(lead.phone, 35);
          const cleanEmail = sanitizeString(lead.email, 120);
          const cleanNotes = sanitizeString(lead.notes || lead.message, 1000);
          const cleanBudget = sanitizeString(lead.budget, 60);

          if (cleanName.length < 2 || cleanPhone.length < 6) {
            return new Response(JSON.stringify({ error: "Please provide a valid name and phone number." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const projectSlug = sanitizeString(lead.projectSlug || lead.project, 100);
          let developerSlug = sanitizeString(lead.developerSlug, 100);
          let destination = sanitizeString(lead.destination, 100);
          let projectName = sanitizeString(lead.projectName || lead.project, 120);

          // Infer developer and destination from project database if not explicitly provided
          if (projectSlug && (!developerSlug || !destination || !projectName)) {
            const matchedCompound = compounds.find(
              (c) =>
                c.slug === projectSlug ||
                c.name.toLowerCase() === projectSlug.toLowerCase(),
            );
            if (matchedCompound) {
              if (!developerSlug && matchedCompound.developerSlug) {
                developerSlug = matchedCompound.developerSlug;
              }
              if (!destination && matchedCompound.destination) {
                destination = matchedCompound.destination;
              }
              if (!projectName && matchedCompound.name) {
                projectName = matchedCompound.name;
              }
            }
          }

          const leadRecord = {
            id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: cleanName,
            phone: cleanPhone,
            email: cleanEmail,
            projectSlug,
            projectName,
            developerSlug,
            destination,
            budget: cleanBudget,
            notes: cleanNotes,
            timestamp: lead.timestamp || new Date().toISOString(),
            status: lead.status || "new",
          };

          // 1. Persist to Supabase if configured (prefer admin client for server-side persistence)
          const supabase = getSupabaseAdminClient() || getSupabaseClient();
          if (supabase) {
            try {
              const { error: sbErr } = await supabase.from("leads").insert([
                {
                  id: leadRecord.id,
                  name: leadRecord.name,
                  phone: leadRecord.phone,
                  email: leadRecord.email,
                  project_slug: leadRecord.projectSlug,
                  project_name: leadRecord.projectName,
                  developer_slug: leadRecord.developerSlug,
                  destination: leadRecord.destination,
                  budget: leadRecord.budget,
                  notes: leadRecord.notes,
                  status: leadRecord.status,
                  created_at: leadRecord.timestamp,
                },
              ]);
              if (sbErr) {
                console.warn("Supabase lead insertion notice:", sbErr.message);
              }
            } catch (err) {
              console.warn("Error inserting lead to Supabase:", err);
            }
          }

          // Persist to local filesystem when writable (development or stateful servers)
          try {
            const jsonPath = path.join(process.cwd(), "public", "captured-leads.json");
            let existingLeads: any[] = [];
            if (fs.existsSync(jsonPath)) {
              try {
                existingLeads = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
              } catch (e) {
                existingLeads = [];
              }
            }
            existingLeads.unshift(leadRecord);
            fs.writeFileSync(jsonPath, JSON.stringify(existingLeads, null, 2), "utf-8");

            const tsPath = path.join(process.cwd(), "src", "data", "leads.generated.ts");
            const tsContent = `// Auto-generated lead-capture store database — do not edit by hand.
export const capturedLeadsGenerated = ${JSON.stringify(existingLeads, null, 2)};
`;
            fs.writeFileSync(tsPath, tsContent, "utf-8");
          } catch (writeErr) {
            // Serverless environments (like Vercel) have read-only filesystems
            console.warn("Notice: Lead captured in memory (server filesystem is read-only):", writeErr);
          }

          return new Response(JSON.stringify({ success: true, lead: leadRecord }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Error saving lead:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
