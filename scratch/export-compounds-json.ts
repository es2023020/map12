import { compounds } from "../src/data/compounds";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

async function main() {
  const simplified = compounds.map(c => ({
    slug: c.slug,
    name: c.name,
    destination: c.destination,
    developer: c.developer,
    priceFrom: c.priceFrom,
    status: c.status
  }));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputPath = path.join(__dirname, "compounds_dump.json");
  fs.writeFileSync(outputPath, JSON.stringify(simplified, null, 2), "utf8");
  console.log(`Successfully exported ${simplified.length} compounds to ${outputPath}`);
}

main().catch(console.error);
