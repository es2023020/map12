import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";

export const Route = createFileRoute("/api/save-data")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;
          const body = await request.json();
          const { type, data } = body;
          
          if (!type || !data) {
            return new Response(JSON.stringify({ error: "Missing fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          let targetFile = "";
          if (type === "projects") {
            targetFile = "D:\\map12\\src\\data\\persisted-compounds.json";
          } else if (type === "availability") {
            targetFile = "D:\\map12\\src\\data\\persisted-availability.json";
          } else if (type === "destinations") {
            targetFile = "D:\\map12\\src\\data\\persisted-destinations.json";
          } else {
            return new Response(JSON.stringify({ error: "Invalid type" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          // Ensure directory exists
          const dir = path.dirname(targetFile);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          // Write JSON file to local disk
          fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), "utf-8");
          console.log(`Saved persisted data to ${targetFile}`);

          return new Response(JSON.stringify({ success: true, path: targetFile }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("Save data error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
