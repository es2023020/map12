import { developers } from "./developers";
import type { DeveloperAccount } from "@/lib/supabase";

function generateAccessCode(slug: string): string {
  const clean = slug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
  return `DEV_${clean}_2026`;
}

export const developerAccounts: DeveloperAccount[] = developers.map((d) => ({
  slug: d.slug,
  name: d.name,
  email: `portal.${d.slug}@propertyatlas.eg`,
  logo: d.logo,
  website: d.website,
  phone: "+20 10 0000 0000",
  accessCode: generateAccessCode(d.slug),
  status: "active",
  createdAt: "2026-01-01T00:00:00Z",
}));

export const developerAccountsBySlug = new Map<string, DeveloperAccount>(
  developerAccounts.map((acc) => [acc.slug, acc]),
);

export const developerAccountsByCode = new Map<string, DeveloperAccount>(
  developerAccounts.map((acc) => [acc.accessCode.toUpperCase(), acc]),
);

export function getDeveloperAccount(slug: string): DeveloperAccount | undefined {
  return developerAccountsBySlug.get(slug);
}

export function validateDeveloperAccess(identifier: string): DeveloperAccount | null {
  if (!identifier) return null;
  const trimmed = identifier.trim();
  const upper = trimmed.toUpperCase();

  // Check by Access Code
  if (developerAccountsByCode.has(upper)) {
    return developerAccountsByCode.get(upper)!;
  }

  // Check by direct slug
  const lower = trimmed.toLowerCase();
  if (developerAccountsBySlug.has(lower)) {
    return developerAccountsBySlug.get(lower)!;
  }

  // Check by email
  const byEmail = developerAccounts.find((d) => d.email.toLowerCase() === lower);
  if (byEmail) return byEmail;

  // Check by developer name
  const byName = developerAccounts.find(
    (d) => d.name.toLowerCase() === lower || d.name.toLowerCase().includes(lower),
  );
  if (byName) return byName;

  return null;
}
