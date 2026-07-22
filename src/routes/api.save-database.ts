import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";

export const Route = createFileRoute("/api/save-database")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;
          const body = await request.json();
          const { compoundsList, destinationsList, availabilityList } = body;

          if (!compoundsList || !destinationsList || !availabilityList) {
            return new Response(JSON.stringify({ error: "Missing lists in request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          // 1. Write availability.generated.ts
          const availPath = path.join(process.cwd(), "src", "data", "availability.generated.ts");
          const availContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { ProjectAvailability } from "./availability";

export const availability: ProjectAvailability[] = ${JSON.stringify(availabilityList, null, 2)};
`;
          fs.writeFileSync(availPath, availContent, "utf-8");

          // 2. Write destinations.generated.ts
          const destGenPath = path.join(process.cwd(), "src", "data", "destinations.generated.ts");
          const destContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Destination } from "./destinations";

export const destinationsGenerated: Destination[] = ${JSON.stringify(destinationsList, null, 2)};
`;
          fs.writeFileSync(destGenPath, destContent, "utf-8");

          // 3. Write compounds.generated.ts
          const compGenPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");
          const compContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compoundsList, null, 2)};
`;
          fs.writeFileSync(compGenPath, compContent, "utf-8");

          console.log("Successfully wrote save-database payload to generated data files");

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("Save database error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
