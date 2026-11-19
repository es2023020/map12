import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { approveAndAddDiscoveredProject } from "./compounds-sync";
import { DiscoveredProject } from "./types";
import { triggerAppAvailabilitySync } from "./orchestrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const PENDING_FILE = path.join(ROOT, "data", "availability", "pending_reviews.json");

async function main() {
  if (!fs.existsSync(PENDING_FILE)) {
    console.log("No pending_reviews.json found.");
    return;
  }

  const pending = JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"));
  const discovered: DiscoveredProject[] = pending.discovered_projects || [];

  if (discovered.length === 0) {
    console.log("No discovered projects pending review.");
    return;
  }

  console.log(`Approving ${discovered.length} staged projects...`);

  for (const proj of discovered) {
    // Clean emojis from name/slug
    proj.suggestedName = (proj.suggestedName || proj.suggestedSlug || "Project")
      .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();
    proj.suggestedSlug = (proj.suggestedSlug || proj.suggestedName)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // If suggestedName is Rosail City or Special Villa Offer under Khaled Sabry
    if (proj.suggestedSlug.includes("special-villa-offer") && proj.rawText.includes("ROSAIL CITY")) {
      proj.suggestedName = "Rosail City";
      proj.suggestedSlug = "rosail-city";
    }

    console.log(`\nApproving '${proj.suggestedName}' (${proj.developerName})...`);
    const res = approveAndAddDiscoveredProject(proj, true);
    console.log(`   -> ${res.message}`);
  }

  // Clear approved items from pending
  pending.discovered_projects = [];
  fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2), "utf8");
  console.log("\nAll discovered projects approved and cleared from pending queue!");

  // Compile app availability
  triggerAppAvailabilitySync();
}

main().catch((err) => {
  console.error("Approval error:", err);
  process.exit(1);
});
