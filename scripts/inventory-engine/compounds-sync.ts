import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DiscoveredProject } from "./types";
import { reconcileSingleProject } from "./reconciliation";
import { triggerAppAvailabilitySync } from "./orchestrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const COMPOUNDS_FILE = path.join(ROOT, "src", "data", "compounds.generated.ts");
const ALIASES_FILE = path.join(ROOT, "config", "project-aliases.json");
const PENDING_FILE = path.join(ROOT, "data", "availability", "pending_reviews.json");

/**
 * Updates a known compound with New Launch status, price, and payment plan
 */
export function updateKnownCompoundLaunch(slug: string, launch: Partial<DiscoveredProject>): boolean {
  if (!fs.existsSync(COMPOUNDS_FILE)) return false;
  try {
    let content = fs.readFileSync(COMPOUNDS_FILE, "utf8");
    const jsonMatch = content.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);/);
    if (!jsonMatch) return false;

    const compounds = JSON.parse(jsonMatch[1]);
    const idx = compounds.findIndex((c: any) => c.slug === slug);
    if (idx === -1) return false;

    compounds[idx].isNewLaunch = true;
    if (launch.priceFromM && (!compounds[idx].priceFrom || launch.priceFromM < compounds[idx].priceFrom)) {
      compounds[idx].priceFrom = launch.priceFromM;
    }
    if (launch.paymentPlan) {
      compounds[idx].paymentPlan = launch.paymentPlan;
    }
    if (launch.types && Array.isArray(launch.types) && launch.types.length > 0) {
      const merged = new Set([...(compounds[idx].types || []), ...launch.types]);
      compounds[idx].types = Array.from(merged);
    }

    const updatedCode = `// Auto-generated from Command Center save action — do not edit by hand.\nimport type { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};\n`;
    fs.writeFileSync(COMPOUNDS_FILE, updatedCode, "utf8");
    return true;
  } catch (err) {
    console.error(`Failed to update compound launch for ${slug}:`, err);
    return false;
  }
}

/**
 * Adds an unregistered project into Property Atlas
 */
export function approveAndAddDiscoveredProject(
  discovered: DiscoveredProject,
  asNewLaunch = true
): { success: boolean; message: string } {
  if (!fs.existsSync(COMPOUNDS_FILE)) {
    return { success: false, message: "compounds.generated.ts not found" };
  }

  try {
    let content = fs.readFileSync(COMPOUNDS_FILE, "utf8");
    const jsonMatch = content.match(/export const compoundsGenerated: Compound\[\] = (\[[\s\S]*\]);/);
    if (!jsonMatch) {
      return { success: false, message: "Failed to parse compoundsGenerated array" };
    }

    const compounds = JSON.parse(jsonMatch[1]);
    const slug = discovered.suggestedSlug || discovered.suggestedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Check if already exists
    if (compounds.some((c: any) => c.slug === slug)) {
      updateKnownCompoundLaunch(slug, discovered);
      return { success: true, message: `Project '${slug}' already exists — updated launch status.` };
    }

    const newCompound: any = {
      slug,
      name: discovered.suggestedName,
      developer: discovered.developerName,
      developerSlug: discovered.developerSlug,
      destination: discovered.destination || "new-cairo",
      city: `${(discovered.destination || "new-cairo").replace(/-/g, " ")}, Egypt`,
      priceFrom: discovered.priceFromM || 10,
      areaSize: "Master-planned Community",
      unitSizes: discovered.unitSizes || "90–320 m²",
      status: "Off-Plan",
      deliveryYear: discovered.deliveryYear || 2028,
      paymentPlan: discovered.paymentPlan || "10% Down Payment over 8 years equal installments",
      types: discovered.types && discovered.types.length > 0 ? discovered.types : ["Apartment", "Standalone Villa"],
      isNewLaunch: asNewLaunch,
      blurb: discovered.blurb || `${discovered.suggestedName} is an exclusive new development by ${discovered.developerName}.`,
      amenities: [
        "Green Spaces & Landscaping",
        "Clubhouse & Commercial Hub",
        "24/7 Security & Gated Community",
        "Water Features & Lagoons",
        "Jogging & Cycling Tracks",
      ],
    };

    compounds.unshift(newCompound);

    const updatedCode = `// Auto-generated from Command Center save action — do not edit by hand.\nimport type { Compound } from "./compounds";\n\nexport const compoundsGenerated: Compound[] = ${JSON.stringify(compounds, null, 2)};\n`;
    fs.writeFileSync(COMPOUNDS_FILE, updatedCode, "utf8");

    // Add to project-aliases.json
    if (fs.existsSync(ALIASES_FILE)) {
      try {
        const aliases = JSON.parse(fs.readFileSync(ALIASES_FILE, "utf8"));
        aliases.compounds = aliases.compounds || {};
        aliases.compounds[discovered.suggestedName.toLowerCase().trim()] = slug;
        aliases.compounds[slug.replace(/-/g, " ")] = slug;
        fs.writeFileSync(ALIASES_FILE, JSON.stringify(aliases, null, 2), "utf8");
      } catch {}
    }

    // If units were attached to the discovery, write an initial project workbook
    if (discovered.units && discovered.units.length > 0) {
      reconcileSingleProject(
        discovered.developerSlug,
        slug,
        discovered.units as any,
        `WhatsApp Text Release: ${discovered.suggestedName}`
      );
    }

    // Trigger full app sync
    triggerAppAvailabilitySync();

    return {
      success: true,
      message: `Successfully added '${discovered.suggestedName}' to Property Atlas!`,
    };
  } catch (err: any) {
    return { success: false, message: `Failed to add discovered project: ${err.message}` };
  }
}

/**
 * Stages a discovered project into pending_reviews.json
 */
export function stageDiscoveredProject(project: DiscoveredProject) {
  try {
    const pending = fs.existsSync(PENDING_FILE)
      ? JSON.parse(fs.readFileSync(PENDING_FILE, "utf8"))
      : { autonomous_mode: false, pending_updates: [], discovered_projects: [] };

    pending.discovered_projects = pending.discovered_projects || [];
    // Deduplicate by suggestedSlug
    const existingIdx = pending.discovered_projects.findIndex(
      (p: any) => p.suggestedSlug === project.suggestedSlug
    );
    if (existingIdx >= 0) {
      pending.discovered_projects[existingIdx] = project;
    } else {
      pending.discovered_projects.unshift(project);
    }

    fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to stage discovered project:", err);
  }
}
