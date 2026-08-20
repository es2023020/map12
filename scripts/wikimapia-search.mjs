import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = "3F982F58-7F9183CE-7062C621-4D295418-CAED2D59-CB05F1E2-22EEB064-1E90E75";
const DELAY_MS = 600;
const wmPath = path.join(__dirname, "../src/data/wikimapia-locations.json");
const wmData = JSON.parse(fs.readFileSync(wmPath, "utf8"));
const unmatchedPath = path.join(__dirname, "wikimapia-unmatched.json");
const projects = JSON.parse(fs.readFileSync(unmatchedPath, "utf8"));
console.log(`\nSearching Wikimapia for ${projects.length} unmatched projects...\n`);
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function confidence(projectName, wmName) {
  if (!wmName) return 0;
  const a = projectName.toLowerCase().trim();
  const b = wmName.toLowerCase().trim();
  if (a === b) return 100;
  if (b.includes(a) || a.includes(b)) return 90;
  const aWords = a.split(/\s+/);
  const bWords = b.split(/\s+/);
  const overlap = aWords.filter((w) => bWords.some((bw) => bw.includes(w) || w.includes(bw)));
  return Math.round((overlap.length / Math.max(aWords.length, bWords.length)) * 80);
}
async function searchWikimapia(project) {
  const { name, lat, lng } = project;
  const url = `https://api.wikimapia.org/?function=place.search&q=${encodeURIComponent(name)}&lat=${lat}&lon=${lng}&format=json&count=5&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const candidates = data.map((item) => ({
      wmId: item.id,
      wmName: item.title || item.name || "",
      lat: parseFloat(item.location?.lat ?? item.lat ?? 0),
      lng: parseFloat(item.location?.lon ?? item.lng ?? 0),
      url: item.id ? `https://wikimapia.org/${item.id}` : null,
      confidence: confidence(name, item.title || item.name || ""),
    }));
    candidates.sort((a, b) => b.confidence - a.confidence);
    return candidates[0];
  } catch (e) { return null; }
}
const results = [];
for (let i = 0; i < projects.length; i++) {
  const project = projects[i];
  process.stdout.write(`[${String(i+1).padStart(3)}/${projects.length}] ${project.name.padEnd(45)} `);
  const match = await searchWikimapia(project);
  if (match && match.lat && match.lng) {
    const conf = match.confidence;
    const icon = conf >= 90 ? "OK" : conf >= 50 ? "REVIEW" : "LOW";
    console.log(`${icon} ${conf}% "${match.wmName}" (${match.lat.toFixed(4)}, ${match.lng.toFixed(4)})`);
    results.push({ slug: project.slug, name: project.name, developer: project.developer, destination: project.destination, currentLat: project.lat, currentLng: project.lng, wmId: match.wmId, wmName: match.wmName, wmLat: match.lat, wmLng: match.lng, wmUrl: match.url, confidence: match.confidence, decision: conf >= 90 ? "approve" : "review" });
  } else {
    console.log("NO_RESULT");
    results.push({ slug: project.slug, name: project.name, developer: project.developer, destination: project.destination, currentLat: project.lat, currentLng: project.lng, wmId: null, wmName: null, wmLat: null, wmLng: null, wmUrl: null, confidence: 0, decision: "no_match" });
  }
  if (i < projects.length - 1) await sleep(DELAY_MS);
}
const outPath = path.join(__dirname, "wikimapia-review.json");
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
const approved = results.filter(r => r.decision === "approve").length;
const needReview = results.filter(r => r.decision === "review").length;
const noMatch = results.filter(r => r.decision === "no_match").length;
console.log(`\nDONE: ${approved} auto-approve | ${needReview} need review | ${noMatch} no match\nSaved to scripts/wikimapia-review.json`);