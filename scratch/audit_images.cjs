const fs = require("fs");
const path = require("path");

// Read project-locations
const locationsFile = fs.readFileSync("src/data/project-locations.ts", "utf8");
const slugMatches = Array.from(locationsFile.matchAll(/"([a-z0-9-]+)":\s*\{\s*name:\s*"([^"]+)"/g));

// Read compounds.generated.ts
let compoundHeroMap = {};
let compoundGalleryMap = {};

if (fs.existsSync("src/data/compounds.generated.ts")) {
  const cContent = fs.readFileSync("src/data/compounds.generated.ts", "utf8");
  const blocks = cContent.split(/\{\s*"id":/);
  for (const block of blocks) {
    const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
    const heroMatch = block.match(/"hero":\s*"([^"]+)"/);
    const galleryMatch = block.match(/"gallery":\s*\[([^\]]+)\]/);
    if (slugMatch) {
      const slug = slugMatch[1];
      if (heroMatch && heroMatch[1]) compoundHeroMap[slug] = heroMatch[1];
      if (galleryMatch && galleryMatch[1]) {
        const paths = Array.from(galleryMatch[1].matchAll(/"([^"]+)"/g)).map((m) => m[1]);
        compoundGalleryMap[slug] = paths;
      }
    }
  }
}

// Read compounds.ts fallback
if (fs.existsSync("src/data/compounds.ts")) {
  const cContent = fs.readFileSync("src/data/compounds.ts", "utf8");
  const blocks = cContent.split(/\{\s*slug:/);
  for (const block of blocks) {
    const slugMatch = block.match(/^\s*"([^"]+)"/);
    const heroMatch = block.match(/hero:\s*"([^"]+)"/);
    if (slugMatch) {
      const slug = slugMatch[1];
      if (heroMatch && heroMatch[1] && !compoundHeroMap[slug]) {
        compoundHeroMap[slug] = heroMatch[1];
      }
    }
  }
}

const missingHero = [];
const missingFolderOrFiles = [];
const placeholderImages = [];
const fullyMissingImages = [];

for (const m of slugMatches) {
  const slug = m[1];
  const name = m[2];

  const heroPath = compoundHeroMap[slug];

  let hasValidImage = false;

  if (heroPath) {
    // strip leading slash
    const relativePath = heroPath.startsWith("/") ? heroPath.substring(1) : heroPath;
    const fullLocalPath = path.join("public", relativePath);

    if (fs.existsSync(fullLocalPath)) {
      hasValidImage = true;
    } else {
      // Check if project folder in public/projects/ exists and has any image
      const folderPath = path.join("public", "projects", slug);
      if (fs.existsSync(folderPath)) {
        const files = fs
          .readdirSync(folderPath)
          .filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
        if (files.length > 0) {
          hasValidImage = true;
        }
      }
    }
  } else {
    // Check if project folder in public/projects/ exists and has any image
    const folderPath = path.join("public", "projects", slug);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath).filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
      if (files.length > 0) {
        hasValidImage = true;
      }
    }
  }

  // Check if hero image is Unsplash / generic placeholder
  const isPlaceholder =
    !heroPath || heroPath.includes("unsplash.com") || heroPath.includes("placeholder");

  if (!hasValidImage && isPlaceholder) {
    fullyMissingImages.push({ slug, name, heroPath: heroPath || "None" });
  } else if (!hasValidImage) {
    missingFolderOrFiles.push({ slug, name, heroPath });
  } else if (isPlaceholder) {
    placeholderImages.push({ slug, name, heroPath });
  }
}

console.log(`TOTAL PROJECTS AUDITED: ${slugMatches.length}`);
console.log(`FULLY MISSING IMAGES (No local file & no valid hero): ${fullyMissingImages.length}`);
console.log(`MISSING LOCAL FILE (Points to missing path): ${missingFolderOrFiles.length}`);
console.log(`USING UNSPLASH / PLACEHOLDER: ${placeholderImages.length}`);

const totalMissing = [...fullyMissingImages, ...missingFolderOrFiles];
console.log(`TOTAL PROJECTS NEEDING IMAGES: ${totalMissing.length}`);

fs.mkdirSync("scratch", { recursive: true });
fs.writeFileSync(
  "scratch/image_audit_results.json",
  JSON.stringify(
    { fullyMissingImages, missingFolderOrFiles, placeholderImages, totalMissing },
    null,
    2,
  ),
);
