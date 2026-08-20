import { compounds } from '../src/data/compounds.ts';
import { availability } from '../src/data/availability.ts';

const availMap = new Map(availability.map(a => [a.slug, a]));

const withAvail = [];
const withoutAvail = [];

compounds.forEach(c => {
  if (c.parentSlug) return;
  const avail = availMap.get(c.slug);
  const hasAvail = avail && avail.totalAvailable > 0 && Array.isArray(avail.breakdown) && avail.breakdown.length > 0;
  
  if (hasAvail) {
    withAvail.push({ slug: c.slug, name: c.name, priceFrom: c.priceFrom, total: avail.totalAvailable, breakdownCount: avail.breakdown.length });
  } else {
    withoutAvail.push({ slug: c.slug, name: c.name, priceFrom: c.priceFrom, hasAvailObj: !!avail, total: avail?.totalAvailable ?? 0 });
  }
});

console.log(`\nTotal Main Compounds: ${withAvail.length + withoutAvail.length}`);
console.log(`With real availability/pricing breakdown: ${withAvail.length}`);
console.log(`WITHOUT availability/pricing breakdown (only starting price): ${withoutAvail.length}\n`);

console.log('--- Sample projects WITHOUT availability (to be hidden from calculator) ---');
withoutAvail.slice(0, 15).forEach(p => console.log(`  ❌ ${p.slug.padEnd(30)} | ${p.name.padEnd(30)} | starting price: EGP ${p.priceFrom}M`));
