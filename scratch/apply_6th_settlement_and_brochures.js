import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// 1. Update src/data/destinations.ts
const destPath = path.join(root, 'src', 'data', 'destinations.ts');
let destCode = fs.readFileSync(destPath, 'utf-8');

const newDestObj = `  {
    slug: "6th-settlement",
    name: "6th Settlement",
    region: "greater-cairo",
    color: "#D946EF",
    city: "Cairo",
    blurb: "New Cairo's newest 6th Settlement expansion zone — Hassan Allam's Grova East Hills & La Vista's El Patio master-plans.",
    hero: "/destinations/new cairo.jpg",
    center: [30.008, 31.542],
    zoom: 13,
  },`;

if (!destCode.includes('"6th-settlement"')) {
  destCode = destCode.replace(
    'const staticDestinations: Destination[] = [',
    `const staticDestinations: Destination[] = [\n${newDestObj}`
  );
  destCode = destCode.replace(
    'const locationStrings: Record<string, string> = {',
    `const locationStrings: Record<string, string> = {\n  "6th-settlement": "6th Settlement, New Cairo, Cairo Governorate, Egypt",`
  );
  fs.writeFileSync(destPath, destCode, 'utf-8');
  console.log('Updated src/data/destinations.ts with 6th Settlement');
}

// 2. Update src/data/brochure-map.ts
const bmapPath = path.join(root, 'src', 'data', 'brochure-map.ts');
let bmapCode = fs.readFileSync(bmapPath, 'utf-8');

if (!bmapCode.includes('"solana"')) {
  bmapCode = bmapCode.replace(
    'export const brochureMap: Record<string, string> = {',
    `export const brochureMap: Record<string, string> = {\n  "solana": "Solana.pdf",\n  "solana-west": "Solana.pdf",\n  "solana-east": "Solana.pdf",\n  "sarai": "Sarai.pdf",`
  );
  fs.writeFileSync(bmapPath, bmapCode, 'utf-8');
  console.log('Updated src/data/brochure-map.ts with Solana & Sarai brochures');
}

// 3. Update src/data/compound-registry.ts
const regPath = path.join(root, 'src', 'data', 'compound-registry.ts');
let regCode = fs.readFileSync(regPath, 'utf-8');

regCode = regCode.replace(
  /"grova-east-hills":\s*\{[\s\S]*?destination:\s*"[^"]*"/,
  (m) => m.replace(/destination:\s*"[^"]*"/, 'destination: "6th-settlement"')
);
regCode = regCode.replace(
  /"la-vista-east":\s*\{[\s\S]*?destination:\s*"[^"]*"/,
  (m) => m.replace(/destination:\s*"[^"]*"/, 'destination: "6th-settlement"')
);

fs.writeFileSync(regPath, regCode, 'utf-8');
console.log('Updated src/data/compound-registry.ts for 6th Settlement compounds');

// 4. Update src/data/compounds.ts
const compPath = path.join(root, 'src', 'data', 'compounds.ts');
let compCode = fs.readFileSync(compPath, 'utf-8');

// Update destinations for 6th settlement compounds in compounds.ts
const sixthSettlementSlugs = [
  'el-patio-riva',
  'patio-hills',
  'patio-vida',
  'el-patio-town',
  'la-vista-east',
  'grova-east-hills'
];

for (const slug of sixthSettlementSlugs) {
  const regex = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?destination:\\s*)"[^"]*"`, 'g');
  compCode = compCode.replace(regex, `$1"6th-settlement"`);
}

// Update brochure for Solana in compounds.ts
compCode = compCode.replace(
  /(slug:\s*"solana"[\s\S]*?highlights:[\s\S]*?\]),/,
  `$1,\n    brochureUrl: "/brochures/Solana.pdf",\n    brochureFileName: "Solana.pdf",\n    brochureType: "application/pdf",`
);
compCode = compCode.replace(
  /(slug:\s*"solana-east"[\s\S]*?highlights:[\s\S]*?\]),/,
  `$1,\n    brochureUrl: "/brochures/Solana.pdf",\n    brochureFileName: "Solana.pdf",\n    brochureType: "application/pdf",`
);

// Update brochure for Sarai in compounds.ts
compCode = compCode.replace(
  /(slug:\s*"sarai"[\s\S]*?highlights:[\s\S]*?\]),/,
  `$1,\n    brochureUrl: "/brochures/Sarai.pdf",\n    brochureFileName: "Sarai.pdf",\n    brochureType: "application/pdf",`
);

fs.writeFileSync(compPath, compCode, 'utf-8');
console.log('Updated src/data/compounds.ts with 6th Settlement destinations and brochures for Solana & Sarai');
