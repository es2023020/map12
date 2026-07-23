import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

export const Route = createFileRoute("/api/save-users")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;
          const body = await request.json();
          const { usersList } = body;

          if (!usersList) {
            return new Response(JSON.stringify({ error: "Missing usersList in request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }

          const usersPath = path.join(process.cwd(), "src", "data", "users.generated.ts");
          const usersContent = `// Auto-generated from user signup/activity actions — do not edit by hand.
export const usersGenerated: any[] = ${JSON.stringify(usersList, null, 2)};
`;
          fs.writeFileSync(usersPath, usersContent, "utf-8");
          console.log("Successfully wrote save-users payload to users.generated.ts");

          // Auto-commit and push if in development local environment
          if (process.env.NODE_ENV !== "production" && fs.existsSync(path.join(process.cwd(), ".git"))) {
            exec('git add src/data/users.generated.ts && git commit -m "Auto-sync users database from activity" && git push origin main', (err, stdout, stderr) => {
              if (err) {
                console.error("Git auto-push error for users:", err);
              } else {
                console.log("Git auto-push success for users:", stdout);
              }
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (error: any) {
          console.error("Save users error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
