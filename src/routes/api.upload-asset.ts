import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

export const Route = createFileRoute("/api/upload-asset")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;
          const url = new URL(request.url);
          let fileName = url.searchParams.get("fileName");
          let type = url.searchParams.get("type");
          let buffer: Buffer;

          const contentType = request.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            const body = await request.json();
            fileName = body.fileName;
            type = body.type;
            const fileContent = body.fileContent;
            
            if (!fileName || !fileContent || !type) {
              return new Response(JSON.stringify({ error: "Missing fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }

            const base64Data = fileContent.replace(/^data:[^;]+;base64,/, "").replace(/^data:application\/pdf;base64,/, "");
            buffer = Buffer.from(base64Data, "base64");
          } else {
            if (!fileName || !type) {
              return new Response(JSON.stringify({ error: "Missing query params for binary upload" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
              });
            }
            const arrayBuffer = await request.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
          }

          let targetPath = "";
          if (type === "brochure") {
            targetPath = path.join("D:\\map12\\data\\Prochures", fileName);
          } else if (type === "profile") {
            targetPath = path.join("D:\\map12\\public\\profiles", fileName);
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