import fs from 'fs';

// Load compounds
const compFile = fs.readFileSync('src/data/compounds.generated.ts', 'utf8');
const compJsonMatch = compFile.match(/export const compoundsGenerated:\s*Compound\[\]\s*=\s*(\[[\s\S]*\]);/);
const compounds = JSON.parse(compJsonMatch[1]);

// Load availability
let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
const availList = new Function(availArrayCode)();

const compMap = new Map(compounds.map(c => [c.slug, c]));

console.log("=== 1. PRICE HIERARCHY INVERSIONS ===");
for (const a of availList) {
  const types = Array.from(new Set((a.breakdown || []).map(b => b.type)));
  for (const type of types) {
    const typeItems = (a.breakdown || []).filter(b => b.type === type && b.beds > 0 && b.minPriceM > 0);
    typeItems.sort((x, y) => x.beds - y.beds);
    for (let i = 0; i < typeItems.length - 1; i++) {
      const b1 = typeItems[i];
      const b2 = typeItems[i+1];
      if (b1.beds < b2.beds && b1.minPriceM > b2.minPriceM * 1.15) {
        console.log(`• [${a.slug}] ${type}: ${b1.beds}BR min EGP ${b1.minPriceM}M > ${b2.beds}BR min EGP ${b2.minPriceM}M`);
        console.log(`    ${b1.beds}BR units:`, b1.units.map(u => `${u.unitNo} (${u.areaSqm}m², ${u.priceEGP/1e6}M)`).join(', '));
        console.log(`    ${b2.beds}BR units:`, b2.units.map(u => `${u.unitNo} (${u.areaSqm}m², ${u.priceEGP/1e6}M)`).join(', '));
      }
    }
  }
}

console.log("\n=== 2. CATALOG PRICEFROM VS LOWEST UNIT AVAILABLE SYNC ===");
let syncCount = 0;
for (const a of availList) {
  const c = compMap.get(a.slug);
  if (!c) continue;
  const availPrices = (a.breakdown || []).flatMap(b => (b.units || []).map(u => u.priceEGP / 1e6)).filter(p => p > 0);
  if (availPrices.length > 0) {
    const lowestAvailPriceM = Math.min(...availPrices);
    const roundedMin = Math.round(lowestAvailPriceM * 100) / 100;
    if (Math.abs(c.priceFrom - roundedMin) > 0.05) {
      console.log(`• [${c.slug}] Catalog priceFrom: ${c.priceFrom}M -> Lowest Unit Available: ${roundedMin}M`);
      syncCount++;
    }
  }
}
console.log(`Total priceFrom mismatches needing sync: ${syncCount}`);
