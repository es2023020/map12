import { staticCompounds, compounds } from "../src/data/compounds";

console.log("=== STATIC COMPOUNDS ===");
const staticAzha = staticCompounds.find((c) => c.slug === "azha-north-coast");
console.log("Static Azha:", staticAzha);

console.log("=== PROXIED COMPOUNDS ===");
const proxiedAzha = compounds.find((c) => c.slug === "azha-north-coast");
console.log("Proxied Azha:", proxiedAzha);

console.log("=== CAESAR DETAILS ===");
const caesarBay = compounds.find((c) => c.slug === "caesar-bay");
console.log("Caesar Bay:", caesarBay);
const caesarSodic = compounds.find((c) => c.slug === "caesar-sodic");
console.log("Caesar Sodic:", caesarSodic);
