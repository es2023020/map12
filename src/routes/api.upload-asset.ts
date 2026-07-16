import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

export const Route = createFileRoute("/api/upload-asset")({
  server: {
    handlers: {
      GET: async (event: any) => {
        try {
          const { compounds } = require("../data/compounds");
          const brochuresDir = "D:\\map12\\public\\brochures";
          const waitingDir = path.join(brochuresDir, "_waiting_to_be_uploaded");

          if (!fs.existsSync(waitingDir)) {
            fs.mkdirSync(waitingDir, { recursive: true });
          }

          const created: string[] = [];

          compounds.forEach((c: any) => {
            const brochureName = `${c.slug}.pdf`;
            const mainFile = path.join(brochuresDir, brochureName);
            const waitingFile = path.join(waitingDir, brochureName);

            if (!fs.existsSync(mainFile) && !fs.existsSync(waitingFile)) {
              fs.writeFileSync(waitingFile, Buffer.alloc(0));
              created.push(brochureName);
            }
          });

          exec("python D:\\map12\\scripts\\sync-media.py", (err, stdout, stderr) => {
            if (err) {
              console.error("Failed to run sync-media script in GET:", err);
            }
          });

          return new Response(JSON.stringify({ success: true, created }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("GET brochures scan error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      },
      POST: async (event: any) => {
        try {
          const request = event.request;
          const formData = await request.formData();
          const file = formData.get("file");
          const type = formData.get("type");
          const fileName = formData.get("fileName");
          
          if (!file || !type || !fileName) {
            return new Response(JSON.stringify({ error: "Missing fields" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          const arrayBuffer = await (file as any).arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          let targetPath = "";
          if (type === "brochure") {
            targetPath = path.join("D:\\map12\\public\\brochures", String(fileName));
          } else if (type === "profile") {
            targetPath = path.join("D:\\map12\\public\\profiles", String(fileName));
          } else {
            return new Response(JSON.stringify({ error: "Invalid type" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          // Ensure directory exists
          const dir = path.dirname(targetPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          // If it was in the waiting folder, let's delete it there to clean up
          const brochureName = String(fileName);
          const waitingFile = path.join("D:\\map12\\public\\brochures\\_waiting_to_be_uploaded", brochureName);
          if (fs.existsSync(waitingFile)) {
            try {
              fs.unlinkSync(waitingFile);
              console.log(`Cleaned up waiting file placeholder: ${waitingFile}`);
            } catch (unlinkErr) {
              console.error(`Failed to clean up placeholder: ${unlinkErr}`);
            }
          }

          // Write file to local disk
          fs.writeFileSync(targetPath, buffer);
          console.log(`Saved file to ${targetPath}`);

          // Trigger sync-media script to rebuild registry and copy files
          exec("python D:\\map12\\scripts\\sync-media.py", (err, stdout, stderr) => {
            if (err) {
              console.error("Failed to run sync-media script:", err);
            } else {
              console.log("sync-media output:", stdout);
            }
          });

          return new Response(JSON.stringify({ success: true, path: targetPath }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("Upload error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});