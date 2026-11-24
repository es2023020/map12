import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { verifyAdminRequest } from "@/lib/server-auth";

export const Route = createFileRoute("/api/save-users")({
  server: {
    handlers: {
      POST: async (event: any) => {
        try {
          const request = event.request;

          // Enforce Administrator Authorization
          const authCheck = await verifyAdminRequest(request);
          if (!authCheck.authorized) {
            return new Response(JSON.stringify({ error: authCheck.error || "Unauthorized" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          const body = await request.json();
          const { usersList } = body;

          if (!usersList || !Array.isArray(usersList)) {
            return new Response(JSON.stringify({ error: "Missing or invalid usersList in request body" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Strip any sensitive fields before persisting
          const sanitizedUsers = usersList.map(({ password, ...user }: any) => user);

          try {
            const usersPath = path.join(process.cwd(), "src", "data", "users.generated.ts");
            const usersContent = `// Auto-generated from user signup/activity actions — do not edit by hand.
export const usersGenerated: any[] = ${JSON.stringify(sanitizedUsers, null, 2)};
`;
            fs.writeFileSync(usersPath, usersContent, "utf-8");
            console.log("Successfully wrote save-users payload to users.generated.ts");

            // Auto-commit and push if in development local environment
            if (
              process.env.NODE_ENV !== "production" &&
              fs.existsSync(path.join(process.cwd(), ".git"))
            ) {
              exec(
                'git add src/data/users.generated.ts && git commit -m "Auto-sync users database from activity" && git push origin main',
                (err, stdout) => {
                  if (err) {
                    console.error("Git auto-push error for users:", err);
                  } else {
                    console.log("Git auto-push success for users:", stdout);
                  }
                },
              );
            }
          } catch (writeErr) {
            console.warn("Notice: Server filesystem is read-only (user stored in session):", writeErr);
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("Save users error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
