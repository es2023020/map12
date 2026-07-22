import { compounds } from "../src/data/compounds";
import * as fs from "fs";
import * as path from "path";

const content = `// Auto-generated initial seed.
import type { Compound } from "./compounds";

export const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};
`;
fs.writeFileSync(path.join(process.cwd(), "src", "data", "compounds.generated.ts"), content, "utf-8");
console.log("Wrote compounds.generated.ts successfully");
