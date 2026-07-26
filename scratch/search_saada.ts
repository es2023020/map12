import * as fs from "fs";
import * as path from "path";

console.log("Searching for saada-related files...");

const searchDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (file.toLowerCase().includes("saada") || file.toLowerCase().includes("sa-ada")) {
      console.log(`Match: ${fullPath} (${fs.statSync(fullPath).isDirectory() ? "DIR" : "FILE"})`);
    }
  }
};

searchDir("public/projects");
searchDir("public/brochures");
searchDir("public");
