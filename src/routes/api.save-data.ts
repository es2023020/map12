import { createAPIFileRoute } from "@tanstack/react-start/api";
import * as fs from "fs";
import * as path from "path";

export const Route = createAPIFileRoute("/api/save-data")({
  POST: async ({ request }) => {
    try {
      const body = await request.json();
      const { type, data } = body;

      if (!type || !data) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const fileMap: Record<string, string> = {
        projects: "persisted-compounds.json",
        availability: "persisted-availability.json",
        destinations: "persisted-destinations.json",
      };

      const fileName = fileMap[type];
      if (!fileName) {
        return new Response(JSON.stringify({ error: "Invalid type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const targetFile = path.resolve(process.cwd(), "src", "data", fileName);

      // Ensure directory exists
      const dir = path.dirname(targetFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write JSON file to local disk
      fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), "utf-8");
      console.log(`[save-data] Persisted ${type} → ${targetFile}`);

      return new Response(JSON.stringify({ success: true, path: targetFile }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Save data error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
