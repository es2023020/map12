import * as fs from "fs";
import * as path from "path";
import { compoundsGenerated } from "../src/data/compounds.generated";

console.log(`Loaded ${compoundsGenerated.length} compounds from compounds.generated.ts`);

const removeSlugs = new Set(["playa-seashell", "palm-hills-sheikh-zayed"]);

const finalCompounds = compoundsGenerated
  .filter((c) => !removeSlugs.has(c.slug))
  .map((c) => {
    const newC = { ...c };

    // Set all project heros to 1.jpg
    newC.hero = `/projects/${c.slug}/1.jpg`;

    // 1. Destination Overrides
    if (c.slug === "sodic-the-estates") {
      newC.destination = "new-zayed";
      newC.city = "New Zayed City, West Cairo, Egypt";
    }
    if (c.slug === "solana") {
      newC.destination = "new-zayed";
      newC.city = "New Zayed City, West Cairo, Egypt";
    }
    if (c.slug === "dejoya-residence") {
      newC.destination = "new-zayed";
      newC.city = "New Zayed City, West Cairo, Egypt";
    }
    if (c.slug === "v-levels") {
      newC.destination = "6th-october";
      newC.city = "6th of October City, Giza, Egypt";
    }
    if (c.slug === "one33") {
      newC.destination = "northern-expansion";
      newC.city = "Northern Expansion, West Cairo, Egypt";
    }
    if (c.slug === "vye-sodic") {
      newC.destination = "new-zayed";
      newC.city = "New Zayed City, West Cairo, Egypt";
    }
    if (c.slug === "palm-hills-jirian") {
      newC.destination = "new-zayed";
      newC.city = "New Zayed City, West Cairo, Egypt";
    }

    // 2. Specific Project Overrides & Detail Specifications
    if (c.slug === "azzar-islands") {
      newC.destination = "ras-el-hekma";
      newC.km = 182;
      newC.lat = 31.11;
      newC.lng = 27.91;
      newC.priceFrom = 12.9;
      newC.deliveryYear = 2027;
      newC.developer = "Reedy Group";
      newC.areaSize = "400 feddan";
      newC.amenities = [
        "Private beach",
        "Crystal lagoons",
        "Beach club",
        "Aqua park",
        "Commercial mall",
        "Health club",
        "Open-air theatre",
        "Equestrian paths",
        "24/7 security",
      ];
    }

    if (c.slug === "mountain-view-crystal") {
      newC.destination = "sidi-abdelrahman";
      newC.km = 120;
      newC.lat = 31.045;
      newC.lng = 28.875;
      newC.priceFrom = 9.4;
      newC.deliveryYear = 2027;
      newC.developer = "Mountain View";
      newC.areaSize = "470 feddan";
      newC.amenities = [
        "Private beachfront",
        "Crystal lagoons",
        "Boutique hotels",
        "Commercial hubs",
        "Clubhouses",
        "Jogging tracks",
      ];
    }

    if (c.slug === "sodic-east") {
      newC.destination = "eastern-expansion";
      newC.lat = 30.125;
      newC.lng = 31.625;
      newC.priceFrom = 13.528;
      newC.deliveryYear = 2027;
      newC.developer = "SODIC";
      newC.areaSize = "655 feddan";
      newC.amenities = [
        "SODIC Sports Club",
        "Green Spine",
        "Ravine park",
        "International school",
        "Commercial district",
      ];
    }

    if (c.slug === "district-5") {
      newC.destination = "new-cairo";
      newC.lat = 29.985;
      newC.lng = 31.425;
      newC.priceFrom = 9.5;
      newC.deliveryYear = 2027;
      newC.developer = "Marakez";
      newC.areaSize = "200 feddan";
      newC.amenities = [
        "Commercial D5M",
        "Central parks",
        "Sports club",
        "Co-working spaces",
        "Walking tracks",
      ];
    }

    if (c.slug === "keeva") {
      newC.destination = "6th-october";
      newC.lat = 30.015;
      newC.lng = 31.005;
      newC.priceFrom = 5.7;
      newC.deliveryYear = 2027;
      newC.developer = "Al Ahly Sabbour";
      newC.areaSize = "144 feddan";
      newC.amenities = [
        "Central clubhouse",
        "Commercial retail",
        "Swimming pools",
        "Health club",
        "Walking tracks",
      ];
    }

    if (c.slug === "el-patio-vera") {
      newC.destination = "sheikh-zayed";
      newC.lat = 30.065;
      newC.lng = 30.985;
      newC.priceFrom = 15.0;
      newC.deliveryYear = 2027;
      newC.developer = "La Vista Developments";
      newC.areaSize = "40 feddan";
      newC.amenities = [
        "Green lawns",
        "Artificial lakes",
        "Clubhouses",
        "Fitness gym",
        "Commercial strip",
      ];
    }

    if (c.slug === "elm-tree-park") {
      newC.destination = "new-cairo";
      newC.lat = 30.12;
      newC.lng = 31.61;
      newC.priceFrom = 3.3;
      newC.deliveryYear = 2028;
      newC.developer = "Madinet Masr";
      newC.areaSize = "113 feddan";
      newC.amenities = ["Crystal lagoons", "Green parks", "Sports club", "Commercial area"];
    }

    if (c.slug === "lvls") {
      newC.destination = "ras-el-hekma";
      newC.km = 179;
      newC.lat = 31.115;
      newC.lng = 28.085;
      newC.priceFrom = 8.2;
      newC.deliveryYear = 2027;
      newC.developer = "Mountain View";
      newC.areaSize = "201 feddan";
      newC.amenities = [
        "Private beach",
        "Crystal lagoons",
        "Horizon pools",
        "Promenades",
        "Restaurants",
      ];
    }

    if (c.slug === "the-mornings") {
      newC.destination = "new-cairo";
      newC.lat = 30.035;
      newC.lng = 31.435;
      newC.priceFrom = 5.3;
      newC.deliveryYear = 2028;
      newC.developer = "Al Ahly Sabbour";
      newC.areaSize = "15 feddan";
      newC.amenities = [
        "Green spaces",
        "Swimming pools",
        "Health club",
        "Commercial zone",
        "Jogging tracks",
      ];
    }

    if (c.slug === "crescent-walk") {
      newC.destination = "6th-settlement";
      newC.lat = 30.01;
      newC.lng = 31.52;
      newC.priceFrom = 8.1;
      newC.deliveryYear = 2029;
      newC.developer = "Marakez";
      newC.areaSize = "118 feddan";
      newC.amenities = [
        "Central crystal lagoon",
        "Clubhouse",
        "Sports club",
        "Commercial retail strip",
        "Pedestrian lanes",
      ];
    }

    if (c.slug === "shamasi") {
      newC.destination = "sidi-abdelrahman";
      newC.km = 134;
      newC.lat = 31.05;
      newC.lng = 28.95;
      newC.priceFrom = 7.5;
      newC.deliveryYear = 2029;
      newC.developer = "Serac Developments";
      newC.areaSize = "70 feddan";
      newC.amenities = [
        "Private beachfront",
        "Crystal lagoons",
        "Boutique hotel",
        "Commercial strip",
        "Clubhouse",
      ];
    }

    return newC;
  });

console.log(`Rewriting ${finalCompounds.length} compounds to compounds.generated.ts`);

const outputPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");
const outputContent = `// Auto-generated from Command Center save action — do not edit by hand.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(finalCompounds, null, 2)};
`;

fs.writeFileSync(outputPath, outputContent, "utf-8");
console.log("Successfully wrote final compounds.generated.ts");
