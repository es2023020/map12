import * as fs from "fs";
import * as path from "path";
import * as https from "https";

const targets = [
  { slug: "marbay-ras-el-hekma", query: "luxury-beach-resort-villa-turquoise-sea" },
  { slug: "la-vista-topaz", query: "red-sea-luxury-resort-swimming-pool" },
  { slug: "la-vista-gardens", query: "coastal-resort-gardens-beach" },
  { slug: "katameya-dunes", query: "luxury-golf-resort-villa-greenery" },
  { slug: "katameya-heights", query: "exclusive-luxury-mansion-gardens" },
  { slug: "kai-sokhna", query: "modern-coastal-chalets-sea-view" },
  { slug: "jebal-sokhna", query: "mountain-side-sea-view-resort" },
  { slug: "grova-east-hills", query: "modern-residential-compound-park" },
  { slug: "fifth-square", query: "modern-apartment-buildings-pool" },
  { slug: "elm-tree-new-zayed", query: "luxury-park-villas-modern-architecture" },
  { slug: "diplo-3", query: "mediterranean-beach-resort-villas" },
  { slug: "coral-coves", query: "red-sea-coral-bay-resort" },
  { slug: "citystars-park-street", query: "modern-commercial-retail-plaza" },
  { slug: "carnelia", query: "terraced-sea-view-resort" },
  { slug: "chapters-residence", query: "modern-residential-architecture-pool" },
  { slug: "cairo-business-park", query: "modern-glass-office-park-buildings" },
  { slug: "business-district-nac", query: "modern-financial-district-skyscrapers" },
  { slug: "blumar-sokhna", query: "red-sea-beachfront-chalets" },
  { slug: "business-district", query: "corporate-office-district-architecture" },
  { slug: "azzar-islands", query: "island-villa-crystal-lagoon" },
  { slug: "bamboo-extension", query: "modern-boutique-residential-villa" },
  { slug: "azha-sokhna", query: "luxury-lagoon-beach-resort" },
];

// Direct high qualityUnsplash image IDs for architecture / real estate
const unsplashImages: Record<string, string> = {
  "marbay-ras-el-hekma":
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "la-vista-topaz":
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  "la-vista-gardens":
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "katameya-dunes":
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "katameya-heights":
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "kai-sokhna":
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
  "jebal-sokhna":
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  "grova-east-hills":
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  "fifth-square":
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "elm-tree-new-zayed":
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  "diplo-3":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "coral-coves":
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
  "citystars-park-street":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  carnelia:
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
  "chapters-residence":
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  "cairo-business-park":
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  "business-district-nac":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  "blumar-sokhna":
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "business-district":
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
  "azzar-islands":
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "bamboo-extension":
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  "azha-sokhna":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
};

async function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          return download(response.headers.location!, dest).then(resolve).catch(reject);
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function run() {
  console.log("Downloading cover images for 22 projects...");
  for (const item of targets) {
    const dir = path.join(process.cwd(), "public", "projects", item.slug);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const destFile = path.join(dir, "1.jpg");
    const url = unsplashImages[item.slug];
    if (url) {
      try {
        await download(url, destFile);
        console.log(`✅ Downloaded image for ${item.slug} (${fs.statSync(destFile).size} bytes)`);
      } catch (err) {
        console.error(`❌ Error downloading for ${item.slug}:`, err);
      }
    }
  }
}

run();
