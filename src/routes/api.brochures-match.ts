import { createFileRoute } from "@tanstack/react-router";
import * as fs from "fs";
import * as path from "path";

// Levenshtein distance
function getLevenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1, // deletion
        tmp[i][j - 1] + 1, // insertion
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), // substitution
      );
    }
  }
  return tmp[a.length][b.length];
}

function getSimilarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  return 1.0 - getLevenshteinDistance(a, b) / maxLen;
}

function normalizeName(str: string): string {
  return str
    .toLowerCase()
    .replace(/\.[^/.]+$/, "") // strip extension
    .replace(/brochure/gi, " ") // remove noise word
    .replace(/v\d+(-v\d+)?/gi, " ") // remove versions like v07, v2
    .replace(/\b(19|20)\d{2}\b/g, " ") // remove 4-digit years/dates
    .replace(/_|-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const Route = createFileRoute("/api/brochures-match")({
  server: {
    handlers: {
      GET: async (event: any) => {
        try {
          // Read project names from compounds.ts
          const { compounds } = require("../data/compounds");
          const brochuresDir = "D:\\map12\\public\\brochures";

          if (!fs.existsSync(brochuresDir)) {
            return new Response(JSON.stringify({ error: "Brochures directory not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const files = fs.readdirSync(brochuresDir).filter((f) => {
            const stat = fs.statSync(path.join(brochuresDir, f));
            return stat.isFile() && f.toLowerCase().endsWith(".pdf");
          });

          // List of projects in database
          const dbProjects = compounds.map((c: any) => ({
            slug: c.slug,
            name: c.name,
            developer: c.developer,
            destination: c.destination,
            brochureUrl: c.brochureUrl,
          }));

          const autoLinked: any[] = [];
          const flagged: any[] = [];
          const unmatched: any[] = [];
          const conflicts: any[] = [];
          const duplicates: string[] = [];

          // Keep track of files that have been assigned
          const fileToProjectMap = new Map<string, string[]>();

          files.forEach((filename) => {
            const normFile = normalizeName(filename);
            const fileTokens = normFile.split(" ").filter((t) => t.length > 0);

            // Find match candidates
            const candidates = dbProjects.map((p: any) => {
              const normProj = normalizeName(p.name);
              const projTokens = normProj.split(" ").filter((t) => t.length > 0);

              // Check token intersections
              const commonTokens = fileTokens.filter((t) => projTokens.includes(t));
              const tokenCoverage =
                projTokens.length > 0 ? commonTokens.length / projTokens.length : 0;

              // Check if project has specific details that the file must contain
              // e.g. "Red Sea" vs "North Coast"
              let locationConstraintMet = true;
              if (
                projTokens.includes("red") &&
                projTokens.includes("sea") &&
                !(fileTokens.includes("red") && fileTokens.includes("sea"))
              ) {
                locationConstraintMet = false;
              }
              if (
                projTokens.includes("north") &&
                projTokens.includes("coast") &&
                !(fileTokens.includes("north") && fileTokens.includes("coast"))
              ) {
                locationConstraintMet = false;
              }

              // Levenshtein similarity
              const similarity = getSimilarity(normFile, normProj);

              // Match score combines token coverage and Levenshtein similarity
              let score = 0;
              if (locationConstraintMet) {
                score = tokenCoverage * 0.6 + similarity * 0.4;
              }

              return {
                project: p,
                score,
                tokenCoverage,
                similarity,
              };
            });

            // Sort candidates by score descending
            candidates.sort((a: any, b: any) => b.score - a.score);

            const best = candidates[0];

            if (best && best.score >= 0.8) {
              // High confidence match
              const list = fileToProjectMap.get(best.project.slug) || [];
              list.push(filename);
              fileToProjectMap.set(best.project.slug, list);

              autoLinked.push({
                filename,
                projectSlug: best.project.slug,
                projectName: best.project.name,
                score: best.score,
                alreadySet: !!best.project.brochureUrl,
              });
            } else if (best && best.score >= 0.4) {
              // Medium confidence match
              flagged.push({
                filename,
                topCandidates: candidates.slice(0, 3).map((c: any) => ({
                  slug: c.project.slug,
                  name: c.project.name,
                  developer: c.project.developer,
                  score: c.score,
                })),
              });
            } else {
              // No match
              unmatched.push({ filename });
            }
          });

          // Check for conflicts: multiple files matching the same project
          fileToProjectMap.forEach((matchedFiles, slug) => {
            if (matchedFiles.length > 1) {
              const project = dbProjects.find((p: any) => p.slug === slug);
              duplicates.push(project.name);
              // Move these autoLinked items to conflicts
              matchedFiles.forEach((f) => {
                const idx = autoLinked.findIndex((item) => item.filename === f);
                if (idx !== -1) {
                  const item = autoLinked.splice(idx, 1)[0];
                  conflicts.push({
                    filename: item.filename,
                    projectSlug: item.projectSlug,
                    projectName: item.projectName,
                    conflictType: "multiple_files_matching_one_project",
                    files: matchedFiles,
                  });
                }
              });
            }
          });

          // Also check for already-set brochure conflicts
          autoLinked.forEach((item, idx) => {
            if (item.alreadySet) {
              conflicts.push({
                ...item,
                conflictType: "project_already_has_brochure",
              });
            }
          });

          // Filter out alreadySet from active autoLinked list
          const activeAutoLinked = autoLinked.filter((item) => !item.alreadySet);

          return new Response(
            JSON.stringify({
              success: true,
              summary: {
                autoLinkedCount: activeAutoLinked.length,
                flaggedCount: flagged.length,
                unmatchedCount: unmatched.length,
                duplicateCount: conflicts.length,
              },
              autoLinked: activeAutoLinked,
              flagged,
              unmatched,
              conflicts,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error: any) {
          console.error("Fuzzy brochures match error:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
