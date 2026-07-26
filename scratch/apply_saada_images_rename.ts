import * as fs from "fs";
import * as path from "path";

console.log("Renaming saada-sahel references in images databases...");

const imagesPath = path.join(process.cwd(), "src", "data", "project-images.ts");
const registryJsonPath = path.join(process.cwd(), "src", "data", "media-registry.json");

// 1. Update project-images.ts
if (fs.existsSync(imagesPath)) {
  let text = fs.readFileSync(imagesPath, "utf-8");
  
  // Replace path names
  text = text.replace(/\/projects\/saada-sahel\//g, "/projects/sa-ada-sahel/");
  
  // Add key "sa-ada-sahel"
  const newKeyBlock = `  "sa-ada-sahel": [
    "/projects/sa-ada-sahel/1.jpg",
    "/projects/sa-ada-sahel/2.jpg",
    "/projects/sa-ada-sahel/3.jpg",
    "/projects/sa-ada-sahel/4.jpg",
    "/projects/sa-ada-sahel/5.jpg",
    "/projects/sa-ada-sahel/6.jpg",
    "/projects/sa-ada-sahel/7.jpg",
    "/projects/sa-ada-sahel/8.jpg"
  ],`;
  
  text = text.replace('  "saada-sahel": [', newKeyBlock + '\n  "saada-sahel": [');
  
  fs.writeFileSync(imagesPath, text, "utf-8");
  console.log("Updated project-images.ts");
}

// 2. Update media-registry.json
if (fs.existsSync(registryJsonPath)) {
  const data = JSON.parse(fs.readFileSync(registryJsonPath, "utf-8"));
  
  if (data) {
    // Replace paths inside data values
    for (const key of Object.keys(data)) {
      if (Array.isArray(data[key])) {
        data[key] = data[key].map((item: any) => {
          if (item && typeof item === "object" && item.path) {
            item.path = item.path.replace("/projects/saada-sahel/", "/projects/sa-ada-sahel/");
          }
          return item;
        });
      }
    }
    
    // Add sa-ada-sahel key
    if (data["saada-sahel"]) {
      data["sa-ada-sahel"] = data["saada-sahel"].map((item: any) => {
        return {
          ...item,
          path: item.path.replace("/projects/saada-sahel/", "/projects/sa-ada-sahel/")
        };
      });
      console.log("Added sa-ada-sahel key in media-registry.json");
    }
  }
  
  fs.writeFileSync(registryJsonPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Updated media-registry.json");
}
