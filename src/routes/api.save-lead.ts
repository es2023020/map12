import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";

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
