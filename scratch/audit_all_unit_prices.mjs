import fs from 'fs';

let availFile = fs.readFileSync('src/data/availability.generated.ts', 'utf8');
availFile = availFile.replace(/^import\s+.*;/gm, '').replace(/^\/\/.*$/gm, '');
const availArrayCode = availFile.replace(/export const availability:\s*ProjectAvailability\[\]\s*=\s*/, 'return ').replace(/;\s*$/, '');
const availList = new Function(availArrayCode)();

console.log(`Auditing ${availList.length} availability items for price/bed anomalies...`);

const anomalies = [];

for (const item of availList) {
  if (!item.breakdown || !Array.isArray(item.breakdown)) continue;

  // Group by type or beds
  const byBeds = {};
  for (const b of item.breakdown) {
    if (b.beds && b.minPriceM > 0) {
      if (!byBeds[b.beds] || b.minPriceM < byBeds[b.beds].minPriceM) {
        byBeds[b.beds] = b;
      }
    }
  }

  const bedKeys = Object.keys(byBeds).map(Number).sort((a,b) => a - b);
  for (let i = 0; i < bedKeys.length - 1; i++) {
    const bLower = bedKeys[i];
    const bHigher = bedKeys[i+1];
    const lowerMinPrice = byBeds[bLower].minPriceM;
    const higherMinPrice = byBeds[bHigher].minPriceM;

    // Check if smaller bed count has a higher minimum price than larger bed count in same property type category (or Chalet/Apartment vs Villa)
    if (byBeds[bLower].type === byBeds[bHigher].type && lowerMinPrice > higherMinPrice * 1.15) {
      anomalies.push({
        slug: item.slug,
        dev: item.developer,
        type: byBeds[bLower].type,
        lowerBeds: bLower,
        lowerPriceM: lowerMinPrice,
        higherBeds: bHigher,
        higherPriceM: higherMinPrice
      });
    }
  }
}

console.log('\n=== PRICE ANOMALIES FOUND (LOWER BEDS > HIGHER BEDS PRICE) ===');
anomalies.forEach(a => {
  console.log(`- Project: ${a.slug} [${a.dev}] | ${a.type} ${a.lowerBeds}BR min EGP ${a.lowerPriceM}M > ${a.higherBeds}BR min EGP ${a.higherPriceM}M`);
});
