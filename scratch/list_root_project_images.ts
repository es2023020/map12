import * as fs from "fs";
import * as path from "path";

const rootDir = path.join(process.cwd(), "public", "projects");
const files = fs.readdirSync(rootDir);

console.log("=== ROOT LEVEL FILES IN PUBLIC/PROJECTS ===");
for (const file of files) {
  const fullPath = path.join(rootDir, file);
  if (!fs.statSync(fullPath).isDirectory()) {
    console.log(`File: ${file} (${fs.statSync(fullPath).size} bytes)`);
  }
}
