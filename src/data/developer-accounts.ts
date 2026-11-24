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

export function validateDeveloperAccess(
  identifierOrPasscode: string,
  optionalPasscode?: string,
): DeveloperAccount | null {
  if (!identifierOrPasscode) return null;
  const trimmed = identifierOrPasscode.trim();

  // If a separate passcode was provided (e.g. from developer selection dropdown + passcode input)
  if (optionalPasscode) {
    const cleanPass = optionalPasscode.trim().toUpperCase();
    const cleanId = trimmed.toLowerCase();
    const account =
      developerAccountsBySlug.get(cleanId) ||
      developerAccounts.find((d) => d.email.toLowerCase() === cleanId);
    if (account && account.accessCode.toUpperCase() === cleanPass) {
      return account;
    }
    return null;
  }

  // Strictly verify against secret access passcode (DEV_[SLUG]_2026)
  const upper = trimmed.toUpperCase();
  if (developerAccountsByCode.has(upper)) {
    return developerAccountsByCode.get(upper)!;
  }

  return null;
}
