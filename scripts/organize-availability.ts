import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { compounds } from "../src/data/compounds.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const AVAIL_DIR = path.join(ROOT, "data", "availability");
const PROJECTS_DIR = path.join(AVAIL_DIR, "projects");
const RAW_DIR = path.join(AVAIL_DIR, "raw_source_files");

function main() {
  console.log("Organizing availability directory...");

  // 1. Create raw_source_files directory if it doesn't exist
  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
    console.log(`Created raw source files directory at ${RAW_DIR}`);
  }

  // 2. Map of project slug to developer slug
  const slugToDevSlug = new Map<string, string>();
  for (const c of compounds) {
    slugToDevSlug.set(c.slug, c.developerSlug);
  }

  // 3. Move files in projects/ into developer-specific subfolders
  if (fs.existsSync(PROJECTS_DIR)) {
    const files = fs.readdirSync(PROJECTS_DIR);
    let movedProjectsCount = 0;

    for (const file of files) {
      const filePath = path.join(PROJECTS_DIR, file);
      const stat = fs.statSync(filePath);

      // We only care about files in the root of projects/
      if (stat.isFile() && file.endsWith(".xlsx")) {
        const projectSlug = path.basename(file, ".xlsx");
        const devSlug = slugToDevSlug.get(projectSlug);

        if (devSlug) {
          const devDir = path.join(PROJECTS_DIR, devSlug);
          if (!fs.existsSync(devDir)) {
            fs.mkdirSync(devDir, { recursive: true });
          }
          const newFilePath = path.join(devDir, file);
          fs.renameSync(filePath, newFilePath);
          movedProjectsCount++;
        } else {
          console.warn(`Could not find developer mapping for project slug: ${projectSlug}`);
        }
      }
    }
    console.log(`Organized ${movedProjectsCount} project spreadsheets by developer folder inside 'projects/'.`);
  }

  // 4. Move raw files and developer directories from data/availability/ to raw_source_files/
  if (fs.existsSync(AVAIL_DIR)) {
    const items = fs.readdirSync(AVAIL_DIR);
    let movedRawCount = 0;

    for (const item of items) {
      // Skip projects folder and raw_source_files folder
      if (item === "projects" || item === "raw_source_files") continue;

      const itemPath = path.join(AVAIL_DIR, item);
      const targetPath = path.join(RAW_DIR, item);

      try {
        fs.renameSync(itemPath, targetPath);
        movedRawCount++;
      } catch (err) {
        console.error(`Failed to move ${item} to raw_source_files:`, err);
      }
    }
    console.log(`Moved ${movedRawCount} raw developer documents/folders to 'raw_source_files/'.`);
  }

  // 5. Create a descriptive README.md inside data/availability/
  const readmeContent = `# Availability Data Directory

This directory contains the property availability spreadsheets and raw source files.

## Directory Structure

* **\`projects/\`**: Contains standard project-level Excel sheets structured for the PropTrack database.
  * These spreadsheets are organized in subdirectories by developer slug (e.g. \`projects/al-marasem/fifth-square.xlsx\`).
  * If you add a new project, simply place its \`.xlsx\` file inside the corresponding developer folder (or in the root of \`projects/\`) and run \`npm run import-availability\`.
* **\`raw_source_files/\`**: Contains raw, non-standard Excel sheets, brochures, PDFs, and images provided directly by developers. Kept for reference.

## Adding New Projects or Updating Availability

1. **Update existing project**: Edit the spreadsheet for that project under \`projects/<developer-slug>/<project-slug>.xlsx\` and run:
   \`\`\`bash
   npm run import-availability
   \`\`\`
2. **Add a new project**:
   - Create a spreadsheet with the sheets \`Projects\`, \`Breakdown\`, and \`Units\`.
   - Name the file \`<project-slug>.xlsx\` (the slug must match the compound slug in \`src/data/compounds.ts\`).
   - Place the file inside \`projects/<developer-slug>/\`.
   - Run \`npm run import-availability\`.
`;

  fs.writeFileSync(path.join(AVAIL_DIR, "README.md"), readmeContent, "utf8");
  console.log("Created README.md file in data/availability/");
  console.log("Availability directory organization completed successfully!");
}

main();
