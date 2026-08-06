const fs = require("fs");
const path = require("path");

function main() {
  const jsonPath = path.join(__dirname, "compounds_dump.json");
  const outputPath = path.join(__dirname, "..", "campaigns-project", "src", "data", "compounds.ts");

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const rawJson = fs.readFileSync(jsonPath, "utf8");
  const compoundsList = JSON.parse(rawJson);

  const fileContent = `export type Compound = {
  slug: string;
  name: string;
  destination: string;
  developer: string;
  priceFrom: number;
  status: "RTM" | "Off-Plan";
};

export const compounds: Compound[] = ${JSON.stringify(compoundsList, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, "utf8");
  console.log(`Successfully generated ${outputPath}`);
}

main();
