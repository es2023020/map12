import * as fs from "fs";
import * as path from "path";

const compoundsPath = path.join(process.cwd(), "src", "data", "compounds.ts");
const registryPath = path.join(process.cwd(), "src", "data", "compound-registry.ts");
const locationsPath = path.join(process.cwd(), "src", "data", "project-locations.ts");
const generatedPath = path.join(process.cwd(), "src", "data", "compounds.generated.ts");

console.log("Starting comprehensive updates...");

// 1. Update src/data/compounds.ts
let compoundsText = fs.readFileSync(compoundsPath, "utf-8");

compoundsText = compoundsText.replace(
  '  ["Playa Seashell", 206, "ras-el-hekma", "G Developments", 14, 2027, true],',
  '  // Playa Seashell removed'
);
compoundsText = compoundsText.replace(
  '  { name: "Palm Hills Sheikh Zayed", destination: "sheikh-zayed", lat: 30.0180, lng: 30.9750, developer: "Palm Hills Developments", price: 11, year: 2024 },',
  '  // Palm Hills Sheikh Zayed removed'
);
compoundsText = compoundsText.replace(
  '  ["AZZAR Islands", 182, "ras-el-hekma", "Reedy Group", 10, 2027, true],',
  '  ["AZZAR Islands", 182, "ras-el-hekma", "Reedy Group", 12.9, 2027, true],'
);
compoundsText = compoundsText.replace(
  '  ["LVLS", 179, "ras-el-hekma", "Mountain View", 11, 2027, true],',
  '  ["LVLS", 179, "ras-el-hekma", "Mountain View", 8.2, 2027, true],'
);
compoundsText = compoundsText.replace(
  '  ["Shamasi", 134, "sidi-abdelrahman", "MQR Developments", 7, 2026, true],',
  '  ["Shamasi", 134, "sidi-abdelrahman", "Serac Developments", 7.5, 2029, true],'
);
compoundsText = compoundsText.replace(
  '  { name: "Sodic East", destination: "new-cairo", lat: 30.1380, lng: 31.6250, developer: "SODIC", price: 10, year: 2027 },',
  '  { name: "Sodic East", destination: "eastern-expansion", lat: 30.1250, lng: 31.6250, developer: "SODIC", price: 13.528, year: 2027 },'
);
compoundsText = compoundsText.replace(
  '    slug: "palm-hills-jirian",\n    name: "Palm Hills Jirian",\n    destination: "mostakbal-city",',
  '    slug: "palm-hills-jirian",\n    name: "Palm Hills Jirian",\n    destination: "new-zayed",'
);
compoundsText = compoundsText.replace(
  '    slug: "dejoya-residence",\n    name: "Dejoya Residence",\n    destination: "sheikh-zayed",',
  '    slug: "dejoya-residence",\n    name: "Dejoya Residence",\n    destination: "new-zayed",'
);
compoundsText = compoundsText.replace(
  '    slug: "v-levels",\n    name: "V-Levels",\n    destination: "sheikh-zayed",',
  '    slug: "v-levels",\n    name: "V-Levels",\n    destination: "6th-october",'
);
compoundsText = compoundsText.replace(
  '    slug: "one33",\n    name: "ONE33",\n    destination: "sheikh-zayed",',
  '    slug: "one33",\n    name: "ONE33",\n    destination: "northern-expansion",'
);

// Updates to static blocks in compounds.ts
compoundsText = compoundsText.replace(
  /slug:\s*"district-5",\s*name:\s*"District 5",\s*destination:\s*"new-cairo",\s*lat:\s*30.010,\s*lng:\s*31.462,\s*developer:\s*"Marakez",\s*developerSlug:\s*"marakez-properties",\s*priceFrom:\s*11/g,
  'slug: "district-5",\n    name: "District 5",\n    destination: "new-cairo",\n    lat: 29.985, lng: 31.425,\n    developer: "Marakez",\n    developerSlug: "marakez-properties",\n    priceFrom: 9.5'
);
compoundsText = compoundsText.replace(
  /slug:\s*"crescent-walk",\s*name:\s*"Crescent Walk",\s*destination:\s*"new-cairo",\s*lat:\s*30.012,\s*lng:\s*31.456,\s*developer:\s*"Marakez",\s*developerSlug:\s*"marakez-properties",\s*priceFrom:\s*8/g,
  'slug: "crescent-walk",\n    name: "Crescent Walk",\n    destination: "6th-settlement",\n    lat: 30.01, lng: 31.52,\n    developer: "Marakez",\n    developerSlug: "marakez-properties",\n    priceFrom: 8.1'
);
compoundsText = compoundsText.replace(
  /slug:\s*"keeva",\s*name:\s*"Keeva",\s*destination:\s*"6th-october",\s*lat:\s*29.980,\s*lng:\s*30.950,\s*developer:\s*"Al Ahly Sabbour",\s*developerSlug:\s*"al-ahly-sabbour",\s*priceFrom:\s*13/g,
  'slug: "keeva",\n    name: "Keeva",\n    destination: "6th-october",\n    lat: 30.015, lng: 31.005,\n    developer: "Al Ahly Sabbour",\n    developerSlug: "al-ahly-sabbour",\n    priceFrom: 5.7'
);
compoundsText = compoundsText.replace(
  /slug:\s*"el-patio-vera",\s*name:\s*"El Patio Vera",\s*destination:\s*"new-zayed",\s*lat:\s*30.128,\s*lng:\s*30.868,\s*developer:\s*"La Vista Developments",\s*developerSlug:\s*"la-vista-developments",\s*priceFrom:\s*18,\s*deliveryYear:\s*2028/g,
  'slug: "el-patio-vera",\n    name: "El Patio Vera",\n    destination: "sheikh-zayed",\n    lat: 30.065, lng: 30.985,\n    developer: "La Vista Developments",\n    developerSlug: "la-vista-developments",\n    priceFrom: 15.0,\n    deliveryYear: 2027'
);
compoundsText = compoundsText.replace(
  /slug:\s*"elm-tree-park",\s*name:\s*"ELM TREE PARK",\s*destination:\s*"sarai",\s*lat:\s*30.095,\s*lng:\s*31.625,\s*developer:\s*"Madinet Masr",\s*developerSlug:\s*"madinet-masr",\s*priceFrom:\s*4/g,
  'slug: "elm-tree-park",\n    name: "ELM TREE PARK",\n    destination: "new-cairo",\n    lat: 30.12, lng: 31.61,\n    developer: "Madinet Masr",\n    developerSlug: "madinet-masr",\n    priceFrom: 3.3'
);
compoundsText = compoundsText.replace(
  /slug:\s*"the-mornings",\s*name:\s*"The Mornings",\s*destination:\s*"new-cairo",\s*lat:\s*30.022,\s*lng:\s*31.485,\s*developer:\s*"Al Ahly Sabbour",\s*developerSlug:\s*"al-ahly-sabbour",\s*priceFrom:\s*4,\s*deliveryYear:\s*2029/g,
  'slug: "the-mornings",\n    name: "The Mornings",\n    destination: "new-cairo",\n    lat: 30.035, lng: 31.435,\n    developer: "Al Ahly Sabbour",\n    developerSlug: "al-ahly-sabbour",\n    priceFrom: 5.3,\n    deliveryYear: 2028'
);
compoundsText = compoundsText.replace(
  /slug:\s*"mountain-view-crystal",\s*name:\s*"Mountain View Crystal",\s*destination:\s*"ras-el-hekma",\s*lat:\s*31.155,\s*lng:\s*28.030,\s*developer:\s*"Mountain View",\s*developerSlug:\s*"mountain-view",\s*priceFrom:\s*10/g,
  'slug: "mountain-view-crystal",\n    name: "Mountain View Crystal",\n    destination: "sidi-abdelrahman",\n    lat: 31.045, lng: 28.875,\n    developer: "Mountain View",\n    developerSlug: "mountain-view",\n    priceFrom: 9.4'
);

fs.writeFileSync(compoundsPath, compoundsText, "utf-8");
console.log("Updated compounds.ts successfully.");

// 2. Update src/data/compound-registry.ts
let registryText = fs.readFileSync(registryPath, "utf-8");

// Remove play-seashell and palm-hills-sheikh-zayed entries from registry
// Registry entries are structured as "slug": { ... }, we will replace them with empty strings or comments
const playaSeashellRegex = /\s*"playa-seashell":\s*\{[^}]*\},/g;
registryText = registryText.replace(playaSeashellRegex, "");

const phSZRegex = /\s*"palm-hills-sheikh-zayed":\s*\{[^}]*\},/g;
registryText = registryText.replace(phSZRegex, "");

// Modify existing entries' destinations or properties
registryText = registryText.replace(
  /"sodic-the-estates":\s*\{\s*destination:\s*"[^"]*",/g,
  '"sodic-the-estates": {\n    destination: "new-zayed",'
);
registryText = registryText.replace(
  /"solana":\s*\{\s*destination:\s*"[^"]*",/g,
  '"solana": {\n    destination: "new-zayed",'
);
registryText = registryText.replace(
  /"dejoya-residence":\s*\{\s*destination:\s*"[^"]*",/g,
  '"dejoya-residence": {\n    destination: "new-zayed",'
);
registryText = registryText.replace(
  /"v-levels":\s*\{\s*destination:\s*"[^"]*",/g,
  '"v-levels": {\n    destination: "6th-october",'
);
registryText = registryText.replace(
  /"one33":\s*\{\s*destination:\s*"[^"]*",/g,
  '"one33": {\n    destination: "northern-expansion",'
);
registryText = registryText.replace(
  /"vye-sodic":\s*\{\s*destination:\s*"[^"]*",/g,
  '"vye-sodic": {\n    destination: "new-zayed",'
);
registryText = registryText.replace(
  /"palm-hills-jirian":\s*\{\s*destination:\s*"[^"]*",/g,
  '"palm-hills-jirian": {\n    destination: "new-zayed",'
);

fs.writeFileSync(registryPath, registryText, "utf-8");
console.log("Updated compound-registry.ts successfully.");

// 3. Update src/data/project-locations.ts
let locationsText = fs.readFileSync(locationsPath, "utf-8");

// Remove playa-seashell and palm-hills-sheikh-zayed from locations
locationsText = locationsText.replace(/\s*"playa-seashell":\s*\{[^}]*\},/g, "");
locationsText = locationsText.replace(/\s*"palm-hills-sheikh-zayed":\s*\{[^}]*\},/g, "");

// Update existing locations
locationsText = locationsText.replace(
  /"crescent-walk":\s*\{\s*name:\s*"Crescent Walk",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"crescent-walk": { name: "Crescent Walk", destination: "6th-settlement", location: "Sixth Settlement, New Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=Crescent+Walk+New+Cairo+Egypt" }'
);
locationsText = locationsText.replace(
  /"district-5":\s*\{\s*name:\s*"District 5",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"district-5": { name: "District 5", destination: "new-cairo", location: "New Cairo, Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=District+5+New+Cairo+Egypt" }'
);
locationsText = locationsText.replace(
  /"lvls":\s*\{\s*name:\s*"LVLS",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"lvls": { name: "LVLS", destination: "ras-el-hekma", location: "Ras El Hekma, North Coast, Egypt", mapsUrl: "https://maps.google.com/?q=LVLS+North+Coast+Egypt" }'
);
locationsText = locationsText.replace(
  /"mountain-view-crystal":\s*\{\s*name:\s*"Mountain View Crystal",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"mountain-view-crystal": { name: "Mountain View Crystal", destination: "sidi-abdelrahman", location: "Sidi Abdel Rahman, North Coast, Egypt", mapsUrl: "https://maps.google.com/?q=Mountain+View+Crystal+North+Coast+Egypt" }'
);
locationsText = locationsText.replace(
  /"shamasi":\s*\{\s*name:\s*"Shamasi",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"shamasi": { name: "Shamasi", destination: "sidi-abdelrahman", location: "Sidi Abdel Rahman, North Coast, Egypt", mapsUrl: "https://maps.google.com/?q=Shamasi+North+Coast+Egypt" }'
);
locationsText = locationsText.replace(
  /"sodic-east":\s*\{\s*name:\s*"Sodic East",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"sodic-east": { name: "Sodic East", destination: "eastern-expansion", location: "New Heliopolis / East Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=Sodic+East+New+Heliopolis" }'
);
locationsText = locationsText.replace(
  /"the-mornings":\s*\{\s*name:\s*"The Mornings",\s*destination:\s*"[^"]*",\s*location:\s*"[^"]*",\s*mapsUrl:\s*"[^"]*"\s*\}/g,
  '"the-mornings": { name: "The Mornings", destination: "new-cairo", location: "Al Yasmeen District, Fifth Settlement, New Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=The+Mornings+New+Cairo+Egypt" }'
);

// Overrides for destinations
locationsText = locationsText.replace(
  /"palm-hills-jirian":\s*\{\s*name:\s*"Palm Hills Jirian",\s*destination:\s*"[^"]*",/g,
  '"palm-hills-jirian": { name: "Palm Hills Jirian", destination: "new-zayed",'
);
locationsText = locationsText.replace(
  /"sodic-the-estates":\s*\{\s*name:\s*"SODIC The Estates",\s*destination:\s*"[^"]*",/g,
  '"sodic-the-estates": { name: "SODIC The Estates", destination: "new-zayed",'
);
locationsText = locationsText.replace(
  /"solana":\s*\{\s*name:\s*"Solana",\s*destination:\s*"[^"]*",/g,
  '"solana": { name: "Solana", destination: "new-zayed",'
);
locationsText = locationsText.replace(
  /"vye-sodic":\s*\{\s*name:\s*"VYE SODIC",\s*destination:\s*"[^"]*",/g,
  '"vye-sodic": { name: "VYE SODIC", destination: "new-zayed",'
);

// Add missing entries
const newEntries = `
  "azzar-islands": { name: "Azzar Islands", destination: "ras-el-hekma", location: "Ras El Hekma, North Coast, Egypt", mapsUrl: "https://maps.google.com/?q=Azzar+Islands+Ras+El+Hekma+Egypt" },
  "el-patio-vera": { name: "El Patio Vera", destination: "sheikh-zayed", location: "Sheikh Zayed City, Giza, Egypt", mapsUrl: "https://maps.google.com/?q=El+Patio+Vera+Zayed+Egypt" },
  "keeva": { name: "Keeva", destination: "6th-october", location: "Waslet Dahshour Road, 6th of October City, Giza, Egypt", mapsUrl: "https://maps.google.com/?q=Keeva+Sabbour+October+Egypt" },
  "dejoya-residence": { name: "Dejoya Residence", destination: "new-zayed", location: "New Zayed City, Giza, Egypt", mapsUrl: "https://maps.google.com/?q=Dejoya+New+Zayed+Egypt" },
  "v-levels": { name: "V-Levels", destination: "6th-october", location: "6th of October City, Giza, Egypt", mapsUrl: "https://maps.google.com/?q=V-Levels+October+Egypt" },
  "one33": { name: "ONE33", destination: "northern-expansion", location: "Northern Expansion, West Cairo, Egypt", mapsUrl: "https://maps.google.com/?q=ONE33+Zayed+Egypt" },
`;

// Insert new entries right after projectLocations = {
locationsText = locationsText.replace(
  "export const projectLocations: Record<string, ProjectLocation> = {",
  "export const projectLocations: Record<string, ProjectLocation> = {" + newEntries
);

fs.writeFileSync(locationsPath, locationsText, "utf-8");
console.log("Updated project-locations.ts successfully.");
