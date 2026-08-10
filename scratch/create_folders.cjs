const fs = require("fs");
const path = require("path");

// Read project-locations
const locationsFile = fs.readFileSync("src/data/project-locations.ts", "utf8");
const slugMatches = Array.from(locationsFile.matchAll(/"([a-z0-9-]+)":\s*\{\s*name:\s*"([^"]+)"/g));

const projectsDir = path.join("public", "projects");
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true });
}

let createdCount = 0;
let existingCount = 0;
const createdFolders = [];

for (const m of slugMatches) {
  const slug = m[1];
  const folderPath = path.join(projectsDir, slug);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    createdCount++;
    createdFolders.push(slug);
  } else {
    existingCount++;
  }
}

console.log(`TOTAL PROJECTS: ${slugMatches.length}`);
console.log(`ALREADY HAD FOLDERS: ${existingCount}`);
console.log(`NEW FOLDERS CREATED: ${createdCount}`);

fs.mkdirSync("scratch", { recursive: true });
fs.writeFileSync(
  "scratch/created_folders.json",
  JSON.stringify({ createdCount, existingCount, createdFolders }, null, 2),
);
