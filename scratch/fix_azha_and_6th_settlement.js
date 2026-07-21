import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

// 1. Fix azha in project-images.ts
const imgPath = path.join(root, 'src', 'data', 'project-images.ts');
let imgCode = fs.readFileSync(imgPath, 'utf-8');

// Replace "/projects/azha/1.jpg" references with "/projects/azha-north-coast/1.jpg"
imgCode = imgCode.replace(/\/projects\/azha\//g, '/projects/azha-north-coast/');
fs.writeFileSync(imgPath, imgCode, 'utf-8');
console.log('Updated src/data/project-images.ts for azha to use /projects/azha-north-coast/');

// 2. Add grova-east-hills and la-vista-east to compounds.ts additionalLaunches
const compPath = path.join(root, 'src', 'data', 'compounds.ts');
let compCode = fs.readFileSync(compPath, 'utf-8');

const grovaObj = `  {
    slug: "grova-east-hills",
    name: "Grova East Hills",
    destination: "6th-settlement",
    lat: 30.008, lng: 31.542,
    developer: "Hassan Allam Holding",
    developerSlug: "hassan-allam-holding",
    priceFrom: 18,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: false,
    types: ["Town House Middle", "Town House Corner", "Twin House", "Villa V1", "Villa V2", "Villa V3"],
    amenities: ["Clubhouse", "Elevated parks", "Water features", "Sports facilities", "Commercial hub", "24/7 security"],
    hero: "/projects/grova-east-hills/hero.jpg",
    gallery: [],
    blurb: "Grova East Hills is Hassan Allam Holding's newest 305-faddan luxury villa community in New Cairo's 6th Settlement, adjacent to Patio Town.",
    paymentPlan: "5% down, installments up to 8 years",
    type: "Residential",
    highlights: ["305 faddans in 6th Settlement New Cairo", "Hassan Allam signature luxury villas", "Adjacent to Patio Town & major corridors"]
  },
  {
    slug: "la-vista-east",
    name: "La Vista East",
    destination: "6th-settlement",
    lat: 29.9788, lng: 31.6415,
    developer: "La Vista Developments",
    developerSlug: "la-vista-developments",
    priceFrom: 16,
    deliveryYear: 2028,
    status: "Off-Plan",
    beachfront: false,
    types: ["Apartment", "Townhouse", "Twin House", "Standalone Villa"],
    amenities: ["Clubhouse", "Swimming pools", "Sports club", "Parks", "Walking & cycling trails", "24/7 security"],
    hero: "/projects/la-vista-east/hero.jpg",
    gallery: [],
    blurb: "La Vista East is a luxury residential compound by La Vista spanning approximately 310 acres in the Sixth Settlement.",
    paymentPlan: "10% down, installments up to 8 years",
    type: "Residential",
    highlights: ["310 acres of green luxury living", "Sixth Settlement prime location", "Close to New Administrative Capital"]
  },`;

if (!compCode.includes('"grova-east-hills"')) {
  compCode = compCode.replace(
    'const additionalLaunches: Compound[] = [',
    `const additionalLaunches: Compound[] = [\n${grovaObj}`
  );
  fs.writeFileSync(compPath, compCode, 'utf-8');
  console.log('Added grova-east-hills and la-vista-east to compounds.ts additionalLaunches');
}
