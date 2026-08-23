import { isReadyToMove, MAX_RTM_DELIVERY_YEAR } from "../src/lib/delivery";
import { compoundsGenerated } from "../src/data/compounds.generated";
import { availability } from "../src/data/availability.generated";

console.log("=== TESTING RTM FILTERING RULES ===");
console.log(`MAX_RTM_DELIVERY_YEAR: ${MAX_RTM_DELIVERY_YEAR}`);

// 1. Test unit cases
const testCases = [
  { year: 2026, note: "Ready to Move", status: "RTM", expected: true },
  { year: 2027, note: "Q4 2027", status: "Off-Plan", expected: true },
  { year: 2028, note: "Delivery 2028", status: "RTM", expected: false },
  { year: 2029, note: "4 Years", status: "Off-Plan", expected: false },
  { year: 2030, note: "2030 Q1", status: "Off-Plan", expected: false },
  { year: undefined, note: "Immediate Delivery", status: "Off-Plan", expected: true },
  { year: undefined, note: "Delivery 2028", status: "Off-Plan", expected: false },
];

let unitPass = 0;
for (const tc of testCases) {
  const result = isReadyToMove(tc.year, tc.note, tc.status);
  const ok = result === tc.expected;
  if (ok) unitPass++;
  console.log(
    `${ok ? "✅" : "❌"} year=${tc.year}, note="${tc.note}", status="${tc.status}" => got ${result}, expected ${tc.expected}`
  );
}

// 2. Test actual database compounds
const rtmCompounds = compoundsGenerated.filter((c) =>
  isReadyToMove(c.deliveryYear, undefined, c.status)
);
const over2027InRtm = rtmCompounds.filter(
  (c) => c.deliveryYear && c.deliveryYear > MAX_RTM_DELIVERY_YEAR
);

console.log(`Total compounds in DB: ${compoundsGenerated.length}`);
console.log(`Compounds evaluated as RTM: ${rtmCompounds.length}`);
console.log(`Compounds with deliveryYear > 2027 in RTM list: ${over2027InRtm.length}`);

if (over2027InRtm.length > 0) {
  console.error("❌ FAILED: Found compounds with deliveryYear > 2027 in RTM!");
  over2027InRtm.forEach((c) => console.log(`  - ${c.name} (${c.deliveryYear})`));
  process.exit(1);
} else {
  console.log("✅ SUCCESS: 0 compounds with deliveryYear > 2027 are classified as RTM!");
}

// 3. Test actual availability units with deliveryNote or deliveryYear > 2027
let totalUnitsChecked = 0;
let rtmUnitsWithLateDelivery = 0;

for (const avail of availability) {
  const comp = compoundsGenerated.find((c) => c.slug === avail.slug);
  if (!comp) continue;

  for (const b of avail.breakdown || []) {
    for (const u of (b as any).units || []) {
      totalUnitsChecked++;
      const note = u.deliveryNote || b.deliveryNote || "";
      const isRtm = isReadyToMove(comp.deliveryYear, note, comp.status);

      if (isRtm) {
        const noteYear = note.match(/\b(20\d{2})\b/);
        if (noteYear && parseInt(noteYear[1], 10) > 2027) {
          rtmUnitsWithLateDelivery++;
          console.log(`❌ Unit in RTM has delivery > 2027: ${comp.name} - ${u.id} note="${note}"`);
        }
      }
    }
  }
}

console.log(`Total live units evaluated: ${totalUnitsChecked}`);
console.log(`Live units with delivery > 2027 in RTM: ${rtmUnitsWithLateDelivery}`);

if (rtmUnitsWithLateDelivery === 0) {
  console.log("✅ ALL TESTS PASSED SUCCESSFULLY!");
} else {
  console.error("❌ SOME UNITS FAILED RTM AUDIT!");
  process.exit(1);
}
