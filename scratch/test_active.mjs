import { compounds } from '../src/data/compounds.ts';

const targets = [
  { slug: 'la-vista-bay', expectedLat: 31.0657004 },
  { slug: 'azzar-islands', expectedLat: 31.2466667 },
  { slug: 'playa', expectedLat: 31.0250849 },
  { slug: 'lasirena-sahel', expectedLat: 31.0228412 },
  { slug: 'youd', expectedLat: 31.0868086 },
  { slug: 'the-waterway', expectedLat: 31.0689544 },
  { slug: 'seashell', expectedLat: 30.9895515 },
  { slug: 'south-med', expectedLat: 31.0655500 },
  { slug: 'telal-soul', expectedLat: 31.0139519 },
  { slug: 'surf-and-sand-seazen', expectedLat: 31.0688546 },
  { slug: 'dayz', expectedLat: 30.8473374 },
  { slug: 'soul', expectedLat: 31.0640551 },
  { slug: 'zahra', expectedLat: 30.9524885 },
  { slug: 'saada-north-coast', expectedLat: 31.1315000 }
];

console.log('\n--- Testing getActiveCompounds() live output ---');
let allPassed = true;
targets.forEach(t => {
  const c = compounds.find(x => x.slug === t.slug);
  if (c) {
    const isMatch = Math.abs(c.lat - t.expectedLat) < 0.001;
    if (!isMatch) allPassed = false;
    console.log(`${isMatch ? '✅' : '❌'} ${t.slug.padEnd(25)} -> Lat: ${c.lat}, Lng: ${c.lng} (dest: ${c.destination})`);
  } else {
    allPassed = false;
    console.log(`❌ ${t.slug.padEnd(25)} -> NOT FOUND`);
  }
});

console.log(`\nResult: ${allPassed ? 'ALL 14 PASSED PERFECTLY (100%)' : 'SOME FAILED'}`);
