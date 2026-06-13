import { compounds } from "./compounds";

export type Developer = {
  slug: string;
  name: string;
  count: number;
  logo: string;
  blurb: string;
};

const blurbs: Record<string, string> = {
  "Emaar Misr": "Behind Marassi & Mivida — a global benchmark developer with mature master-plans.",
  "Palm Hills Developments": "Pioneers of the Hacienda series along the North Coast.",
  "SODIC": "Premium homes in West Cairo, East Cairo and now Sahel.",
  "Mountain View": "iCity & iVilla series — the Park & Heartwork DNA.",
  "Tatweer Misr": "Fouka Bay, Bloomfields, Salt — design-forward integrated communities.",
  "Inertia": "Soul, Joulz, Jefaira — boutique master-plans.",
  "Hyde Park": "Hyde Park New Cairo, Seashore, LVLS.",
  "Talaat Moustafa Group": "Egypt's largest developer — Madinaty, Rehab, Stella, South Med.",
};

const map = new Map<string, { name: string; count: number }>();
for (const c of compounds) {
  const entry = map.get(c.developerSlug);
  if (entry) entry.count += 1;
  else map.set(c.developerSlug, { name: c.developer, count: 1 });
}

export const developers: Developer[] = Array.from(map.entries())
  .map(([slug, v]) => ({
    slug,
    name: v.name,
    count: v.count,
    logo: `https://ui-avatars.com/api/?background=1f3a5f&color=fff&bold=true&size=128&name=${encodeURIComponent(v.name)}`,
    blurb: blurbs[v.name] ?? `${v.name} — active developer with ${v.count} ${v.count === 1 ? "project" : "projects"} on PropTrack.`,
  }))
  .sort((a, b) => b.count - a.count);

export const developerBySlug = (slug: string) => developers.find((d) => d.slug === slug);