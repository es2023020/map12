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
const availMap = new Map(availList.map(a => [a.slug, a]));

console.log(`Analyzing ${compounds.length} compounds and ${availList.length} availability records...\n`);

const issues = {
  priceHierarchy: [],
  priceFromMismatch: [],
  priceSqmOutliers: [],
  coordinateOutliers: [],
  unitCountMismatch: [],
  deliveryStatusMismatch: []
};

// 1. Audit Compounds
for (const c of compounds) {
  // Check Coordinates
  if (!c.lat || !c.lng || c.lat < 22 || c.lat > 32 || c.lng < 24 || c.lng > 37) {
    issues.coordinateOutliers.push({
      slug: c.slug,
      name: c.name,
      lat: c.lat,
      lng: c.lng
    });
  }

  // Check Delivery vs Status
  if (c.status === "RTM" && c.deliveryYear > 2026) {
    issues.deliveryStatusMismatch.push({
      slug: c.slug,
      name: c.name,
      status: c.status,
      deliveryYear: c.deliveryYear,
      note: "Status is Ready-To-Move but delivery year is in the future"
    });
  }
}

// 2. Audit Availability & Unit Pricing
for (const a of availList) {
  const c = compMap.get(a.slug);
  let totalUnitsFound = 0;
  const availPricesM = [];

  for (const b of a.breakdown || []) {
    const units = b.units || [];
    totalUnitsFound += units.length;

    for (const u of units) {
      if (u.priceEGP > 0) {
        const priceM = u.priceEGP / 1_000_000;
        availPricesM.push(priceM);

        // Price per sqm check
        if (u.areaSqm > 0) {
          const pricePerSqm = u.priceEGP / u.areaSqm;
          if (pricePerSqm > 350000) { // > 350k EGP/sqm (Potential typo)
            issues.priceSqmOutliers.push({
              slug: a.slug,
              dev: a.developer,
              unitNo: u.unitNo,
              type: u.type || b.type,
              beds: u.beds || b.beds,
              areaSqm: u.areaSqm,
              priceEGP: u.priceEGP,
              pricePerSqm: Math.round(pricePerSqm),
              reason: "Extremely high price per sqm (> 350k EGP/m²)"
            });
          } else if (pricePerSqm < 15000) { // < 15k EGP/sqm (Potential typo)
            issues.priceSqmOutliers.push({
              slug: a.slug,
              dev: a.developer,
              unitNo: u.unitNo,
              type: u.type || b.type,
              beds: u.beds || b.beds,
              areaSqm: u.areaSqm,
              priceEGP: u.priceEGP,
              pricePerSqm: Math.round(pricePerSqm),
              reason: "Extremely low price per sqm (< 15k EGP/m²)"
            });
          }
        }
      }
    }
  }

  // Check Unit Count Mismatch
  if (a.totalAvailable !== totalUnitsFound && totalUnitsFound > 0) {
    issues.unitCountMismatch.push({
      slug: a.slug,
      dev: a.developer,
      totalAvailableField: a.totalAvailable,
      actualUnitsCount: totalUnitsFound
    });
  }

  // Check PriceFrom vs Availability min price mismatch
  if (c && availPricesM.length > 0) {
    const actualMinPrice = Math.min(...availPricesM);
    // If catalog priceFrom is vastly different (> 25% lower or higher than actual lowest unit available)
    if (c.priceFrom > 0 && Math.abs(c.priceFrom - actualMinPrice) / actualMinPrice > 0.25) {
      issues.priceFromMismatch.push({
        slug: a.slug,
        name: c.name,
        catalogPriceFrom: c.priceFrom,
        lowestUnitPriceM: Math.round(actualMinPrice * 100) / 100
      });
    }
  }

  // Check Price Hierarchy Inversions (same type, lower beds > higher beds price)
  const byTypeAndBeds = {};
  for (const b of a.breakdown || []) {
    if (b.beds && b.minPriceM > 0) {
      const key = `${b.type}-${b.beds}`;
      if (!byTypeAndBeds[key] || b.minPriceM < byTypeAndBeds[key].minPriceM) {
        byTypeAndBeds[key] = b;
      }
    }
  }

  // Compare beds within same property type
  const types = Array.from(new Set((a.breakdown || []).map(b => b.type)));
  for (const type of types) {
    const typeItems = (a.breakdown || []).filter(b => b.type === type && b.beds > 0 && b.minPriceM > 0);
    typeItems.sort((x, y) => x.beds - y.beds);
    for (let i = 0; i < typeItems.length - 1; i++) {
      const b1 = typeItems[i];
      const b2 = typeItems[i+1];
      // If b1 (fewer beds) has minPriceM > 1.2 * b2 (more beds)
      if (b1.beds < b2.beds && b1.minPriceM > b2.minPriceM * 1.2) {
        issues.priceHierarchy.push({
          slug: a.slug,
          dev: a.developer,
          type,
          bed1: b1.beds,
          price1M: b1.minPriceM,
          bed2: b2.beds,
          price2M: b2.minPriceM
        });
      }
    }
  }
}

console.log("=== AUDIT SUMMARY ===");
console.log(`1. Price Hierarchy Inversions: ${issues.priceHierarchy.length}`);
console.log(`2. Price per m² Outliers: ${issues.priceSqmOutliers.length}`);
console.log(`3. Catalog priceFrom vs Lowest Unit Mismatches: ${issues.priceFromMismatch.length}`);
console.log(`4. Total Available Unit Count Discrepancies: ${issues.unitCountMismatch.length}`);
console.log(`5. Coordinate Anomalies: ${issues.coordinateOutliers.length}`);
console.log(`6. Delivery Year / Status Mismatches: ${issues.deliveryStatusMismatch.length}`);

console.log("\n=== DETAILED FINDINGS ===");

if (issues.priceHierarchy.length > 0) {
  console.log("\n--- PRICE HIERARCHY INVERSIONS ---");
  issues.priceHierarchy.forEach(x => {
    console.log(`• [${x.slug}] ${x.type}: ${x.bed1}BR min EGP ${x.price1M}M > ${x.bed2}BR min EGP ${x.price2M}M`);
  });
}

if (issues.priceSqmOutliers.length > 0) {
  console.log("\n--- PRICE PER SQM OUTLIERS ---");
  issues.priceSqmOutliers.forEach(x => {
    console.log(`• [${x.slug}] Unit ${x.unitNo} (${x.type} ${x.beds}BR, ${x.areaSqm}m²): EGP ${x.priceEGP.toLocaleString()} (${Math.round(x.priceEGP/1e6 * 100)/100}M) => ${x.pricePerSqm.toLocaleString()} EGP/m² [${x.reason}]`);
  });
}

if (issues.priceFromMismatch.length > 0) {
  console.log("\n--- CATALOG PRICEFROM VS LOWEST UNIT AVAILABLE MISMATCHES ---");
  issues.priceFromMismatch.slice(0, 15).forEach(x => {
    console.log(`• [${x.slug}] Catalog priceFrom: EGP ${x.catalogPriceFrom}M vs Lowest Unit Available: EGP ${x.lowestUnitPriceM}M`);
  });
}

if (issues.unitCountMismatch.length > 0) {
  console.log("\n--- TOTAL AVAILABLE UNIT COUNT DISCREPANCIES ---");
  issues.unitCountMismatch.forEach(x => {
    console.log(`• [${x.slug}] Field totalAvailable = ${x.totalAvailableField}, but actual units in breakdown = ${x.actualUnitsCount}`);
  });
}
