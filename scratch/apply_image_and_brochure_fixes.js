import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

// 1. Rename 'public/projects/azha north coast' to 'public/projects/azha-north-coast'
const oldAzhaDir = path.join(root, "public", "projects", "azha north coast");
const newAzhaDir = path.join(root, "public", "projects", "azha-north-coast");

if (fs.existsSync(oldAzhaDir)) {
  if (!fs.existsSync(newAzhaDir)) {
    fs.renameSync(oldAzhaDir, newAzhaDir);
    console.log("Renamed azha north coast directory to azha-north-coast");
  }
}

// Helper to copy single image into project folder as 1.jpg
function copySingleImage(srcName, dstFolder) {
  const srcPath = path.join(root, "public", "projects", srcName);
  const dstDir = path.join(root, "public", "projects", dstFolder);
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }
  const dstPath = path.join(dstDir, "1.jpg");
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    console.log(`Copied ${srcName} -> ${dstFolder}/1.jpg`);
  } else {
    console.log(
      `Source file ${srcName} not found, checking existing dst: ${fs.existsSync(dstPath)}`,
    );
  }
}

// 2. Salt Marina image
copySingleImage("salt marina .jpg", "salt-marina");

// 3. Perla image
copySingleImage("perla.jpg", "perla");

// 4. Vie image
copySingleImage("vie.jpg", "vie");

console.log("File system operations completed successfully.");
