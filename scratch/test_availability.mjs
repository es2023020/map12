import { compounds } from '../src/data/compounds.ts';
import { availability } from '../src/data/availability.generated.ts';

const availMap = new Map(availability.map(a => [a.slug, a]));

const validProjects = [];
const hiddenProjects = [];

compounds.forEach(c => {
  if (c.parentSlug) return;
  const avail = availMap.get(c.slug);
  
  // Check if project has real availability / breakdown pricing
  const hasTotalAvail = avail && typeof avail.totalAvailable === 'number' && avail.totalAvailable > 0;
  const hasBreakdown = avail && Array.isArray(avail.breakdown) && avail.breakdown.length > 0;
  
  // Check if any breakdown has actual units or valid minPriceM > 0
  const hasActualUnitsOrPrice = hasBreakdown && avail.breakdown.some(b => 
    (typeof b.minPriceM === 'number' && b.minPriceM > 0) || (b.units && b.units.length > 0)
  );

  if (hasTotalAvail && hasBreakdown && hasActualUnitsOrPrice) {
    validProjects.push({ slug: c.slug, name: c.name, total: avail.totalAvailable, breakdown: avail.breakdown.length });
  } else {
    hiddenProjects.push({
      slug: c.slug,
      name: c.name,
      priceFrom: c.priceFrom,
      reason: !avail ? 'No availability object' : (!hasTotalAvail ? 'totalAvailable === 0' : 'No breakdown/units')
    });
  }
});

console.log(`\n======================================================`);
console.log(`Total Main Projects: ${validProjects.length + hiddenProjects.length}`);
console.log(`VALID Projects with real availability/pricing: ${validProjects.length}`);
console.log(`HIDDEN Projects (no availability / only starting price): ${hiddenProjects.length}`);
console.log(`======================================================\n`);

console.log('--- Sample VALID Projects (Will appear in Calculator) ---');
validProjects.slice(0, 10).forEach(p => console.log(`  ✅ ${p.slug.padEnd(30)} | ${p.name.padEnd(30)} | Total: ${p.total} units`));

console.log('\n--- Sample HIDDEN Projects (Will NOT appear in Calculator) ---');
hiddenProjects.slice(0, 15).forEach(p => console.log(`  🚫 ${p.slug.padEnd(30)} | ${p.name.padEnd(30)} | Reason: ${p.reason}`));
