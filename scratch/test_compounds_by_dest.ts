import { compoundsByDestination } from "../src/data/compounds";

const rasElHekmaCompounds = compoundsByDestination("ras-el-hekma");
console.log("Ras El Hekma Compounds count:", rasElHekmaCompounds.length);
const azhaInDest = rasElHekmaCompounds.find((c) => c.slug === "azha-north-coast");
console.log("Azha in Ras El Hekma destination:", azhaInDest ? "YES" : "NO");

const madaarDev = "madaar";
import { compoundsByDeveloper } from "../src/data/compounds";
const madaarCompounds = compoundsByDeveloper(madaarDev);
console.log("Madaar Compounds count:", madaarCompounds.length);
const azhaInDev = madaarCompounds.find((c) => c.slug === "azha-north-coast");
console.log("Azha in Madaar developer:", azhaInDev ? "YES" : "NO");
