import * as fs from "fs";
import * as path from "path";

console.log("Copying cover images to target directories...");

const copies = [
  { src: "public/projects/zed-towers/6.jpg", dest: "public/projects/zed-east/1.jpg" },
  { src: "public/projects/zayed2000.jpg", dest: "public/projects/zayed-2000/1.jpg" },
  { src: "public/projects/Village de la Capitale.jpg", dest: "public/projects/village-de-la-capitale/1.jpg" },
  { src: "public/projects/the-waterway/1.jpg", dest: "public/projects/the-waterway/1.jpg" },
  { src: "public/projects/the crown.jpg", dest: "public/projects/the-crown-extension/1.jpg" },
  { src: "public/projects/the c.jpg", dest: "public/projects/the-c/1.jpg" },
  { src: "public/projects/swanlake west.jpg", dest: "public/projects/swanlake-west/1.jpg" },
  { src: "public/projects/swan-lake el gouna.jpeg", dest: "public/projects/swanlake-el-gouna/1.jpg" },
  { src: "public/projects/the estates.jpg", dest: "public/projects/sodic-the-estates/1.jpg" },
  { src: "public/projects/sky condos.jpg", dest: "public/projects/sky-condos/1.jpg" },
  { src: "public/projects/rivers.webp", dest: "public/projects/rivers/1.jpg" },
  { src: "public/projects/PX.jpg", dest: "public/projects/px/1.jpg" },
  { src: "public/projects/palm parks.webp", dest: "public/projects/palm-parks/1.jpg" },
  { src: "public/projects/mountain-view-jirian/5.jpg", dest: "public/projects/palm-hills-jirian/1.jpg" }
];

for (const item of copies) {
  const srcPath = path.join(process.cwd(), item.src);
  const destPath = path.join(process.cwd(), item.dest);
  
  if (fs.existsSync(srcPath)) {
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
      console.log(`Created directory: ${destDir}`);
    }
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${item.src} -> ${item.dest}`);
  } else {
    console.log(`Source file does not exist: ${srcPath}`);
  }
}
