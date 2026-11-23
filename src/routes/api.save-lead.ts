import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { getSupabaseClient } from "@/lib/supabase";

// @ts-ignore
export const Route = createFileRoute("/api/save-lead")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;
          const lead = await request.json();

          if (!lead || !lead.name || !lead.phone) {
            return new Response(JSON.stringify({ error: "Invalid lead payload. Name and phone required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const leadRecord = {
            id: lead.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: lead.name,
            phone: lead.phone,
            email: lead.email || "",
            projectSlug: lead.projectSlug || lead.project || "",
            projectName: lead.projectName || lead.project || "",
            developerSlug: lead.developerSlug || "",
            destination: lead.destination || "",
            budget: lead.budget || "",
            notes: lead.notes || lead.message || "",
            timestamp: lead.timestamp || new Date().toISOString(),
            status: lead.status || "new",
          };

          // 1. Persist to Supabase if configured
          const supabase = getSupabaseClient();
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
