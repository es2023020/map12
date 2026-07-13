import { compounds } from "../src/data/compounds";

for (const c of compounds) {
  console.log(`SLUG:${c.slug}|NAME:${c.name}`);
}
