import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const GROUPS_FILE = path.join(ROOT, "config", "whatsapp-groups.json");
const PROJECTS_BASE = path.join(ROOT, "data", "availability", "projects");

const groupsData = JSON.parse(fs.readFileSync(GROUPS_FILE, "utf8"));
const existingDevs = new Set(fs.readdirSync(PROJECTS_BASE));

const groups = groupsData.groups || {};
const groupList = Object.entries(groups).map(([jid, g]: [string, any]) => ({
  jid,
  name: g.name || g.developer_name,
  devSlug: g.developer_slug,
  isMaster: g.is_master_group,
}));

console.log(`Total Groups in config: ${groupList.length}`);

// Groups with mapped developers that do NOT have files in data/availability/projects/
const missingDevsInProjects = new Map<string, string[]>();
for (const g of groupList) {
  if (g.devSlug && g.devSlug !== "general-developer") {
    if (!existingDevs.has(g.devSlug)) {
      if (!missingDevsInProjects.has(g.devSlug)) {
        missingDevsInProjects.set(g.devSlug, []);
      }
      missingDevsInProjects.get(g.devSlug)!.push(g.name);
    }
  }
}

console.log(`\n--- DEVELOPERS IN WHATSAPP GROUPS BUT NO INVENTORY FILE YET (${missingDevsInProjects.size} developers) ---`);
for (const [slug, groupNames] of missingDevsInProjects.entries()) {
  console.log(`• ${slug.padEnd(25)}: Groups -> [${groupNames.join(", ")}]`);
}

// Check how many groups are general or unmapped
const unmappedGroups = groupList.filter((g) => g.devSlug === "general-developer");
console.log(`\nUnmapped or General Groups: ${unmappedGroups.length}`);
unmappedGroups.slice(0, 15).forEach((g) => console.log(`  - ${g.name}`));
