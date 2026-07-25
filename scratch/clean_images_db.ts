import * as fs from "fs";
import * as path from "path";

console.log("Cleaning project images and media registry databases...");

const imagesPath = path.join(process.cwd(), "src", "data", "project-images.ts");
const registryJsonPath = path.join(process.cwd(), "src", "data", "media-registry.json");

const deleteKeys = new Set([
  "palm-hills-october",
  "sky-north",
  "summer",
  "cleo-mostakbal",
  "palm-hills-sheikh-zayed"
]);

// 1. Clean project-images.ts
if (fs.existsSync(imagesPath)) {
  let text = fs.readFileSync(imagesPath, "utf-8");
  
  // project-images.ts exports a record projectImages: Record<string, string[]> = { ... }
  // We can parse it by matching each key: [ ... ] and deleting the key block
  for (const key of deleteKeys) {
    const regex = new RegExp(`\\s*"${key}":\\s*\\[[\\s\\S]*?\\],?`, "g");
    text = text.replace(regex, "");
  }
  
  fs.writeFileSync(imagesPath, text, "utf-8");
  console.log("Cleaned project-images.ts");
}

// 2. Clean media-registry.json
if (fs.existsSync(registryJsonPath)) {
  const data = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"));
  
  // Clean first dictionary
  if (data) {
    for (const key of deleteKeys) {
      if (data[key]) {
        delete data[key];
        console.log(`Deleted media registry key: ${key}`);
      }
    }
  }
  
  fs.writeFileSync(registryJsonPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Cleaned media-registry.json");
}
