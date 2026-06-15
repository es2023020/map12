import { compounds } from "./compounds";

export type Developer = {
  slug: string;
  name: string;
  count: number;
  logo: string;
  blurb: string;
  website?: string;
};

const blurbs: Record<string, string> = {
  "Emaar Misr": "Behind Marassi & Mivida — a global benchmark developer with mature master-plans.",
  "Palm Hills Developments": "Egypt's premier lifestyle developer — Hacienda North Coast series, Badya, 97 Hills, Palm Hills Jirian and 15+ active projects across Cairo and the coast.",
  "SODIC": "Premium homes in West Cairo, East Cairo and Sahel — Villette, Karmell, VYE, Botanica, June, and SODIC East.",
  "Mountain View": "iCity & iVilla series across Cairo, Mostakbal City and Ras El Hekma — 12 active projects, Crystal, Jirian, Grand Valley, Aliva.",
  "Madinet Masr": "Cairo's integrated city developer — Sarai, Taj City, TALALA, ELM TREE PARK, The Butterfly and 9+ active communities across New Cairo East.",
  "Tatweer Misr": "Fouka Bay, Bloomfields, Salt — design-forward integrated communities.",
  "Inertia": "Soul, Joulz, Jefaira — boutique master-plans.",
  "Hyde Park": "Hyde Park New Cairo, Seashore, LVLS.",
  "Talaat Moustafa Group": "Egypt's largest developer — Madinaty, Rehab, Stella, South Med.",
  "City Edge": "New Cairo, El Alamein, October — government-backed quality communities.",
  "Ora Developers": "Naguib Sawiris-backed — Zed Towers, Sheikh Zayed.",
  "Misr Italia": "IL Monte Galala, LaVista — Red Sea and the North Coast.",
  "Rooya Group": "Golf Central, Stone Park — East Cairo and the Red Sea.",
  "Al Ahly Sabbour": "Sixty Iconic Tower, North Edge — East Cairo backbone developer.",
  "Hassan Allam Properties": "Swan Lake, Haptown — 6th of October and North Coast.",
  "Iwan Developments": "Arabella — New Cairo's established family community.",
  "Wadi Degla": "Palm Hills Katameya, Royal Meadows — premium East Cairo.",
  "Mena Developments": "Bali — El Alamein's upcoming resort city.",
  "Modon": "Alam Al Roum — premium Sidi Heneish resort.",
  "Travco": "Jamila — large-scale Sahel beachfront.",
  "Better Home": "Sun Capital, Spring — 6th of October established communities.",
  "Badya": "Palm Hills' urban city project — Sheikh Zayed.",
};

const logoMap: Record<string, string> = {
  "emaar-misr": "https://logo.clearbit.com/emaarmisr.com",
  "palm-hills-developments": "https://logo.clearbit.com/palmhillsdevelopments.com",
  "sodic": "https://logo.clearbit.com/sodic.com.eg",
  "mountain-view": "https://logo.clearbit.com/mountainviewegypt.com",
  "madinet-masr": "https://logo.clearbit.com/madinetmasr.com",
  "tatweer-misr": "https://logo.clearbit.com/tatweermisrdevelopments.com",
  "inertia": "https://logo.clearbit.com/inertia-eg.com",
  "hyde-park": "https://logo.clearbit.com/hydeparke.com",
  "talaat-moustafa-group": "https://logo.clearbit.com/talaatmoustafa.com",
  "city-edge": "https://logo.clearbit.com/cityedge.com.eg",
  "ora-developers": "https://logo.clearbit.com/oradevelopers.com",
  "misr-italia": "https://logo.clearbit.com/misritalia.com.eg",
  "rooya-group": "https://logo.clearbit.com/rooyagroup.com",
  "al-ahly-sabbour": "https://logo.clearbit.com/sabbour.com",
  "hassan-allam-properties": "https://logo.clearbit.com/hassanallamproperties.com",
  "iwan-developments": "https://logo.clearbit.com/iwandevelopments.com",
  "wadi-degla": "https://logo.clearbit.com/wadidegla.com",
  "mena-developments": "https://logo.clearbit.com/menadev.com.eg",
};

const websiteMap: Record<string, string> = {
  "emaar-misr": "https://emaarmisr.com",
  "palm-hills-developments": "https://palmhillsdevelopments.com",
  "sodic": "https://sodic.com.eg",
  "mountain-view": "https://mountainviewegypt.com",
  "madinet-masr": "https://madinetmasr.com",
  "tatweer-misr": "https://tatweermisrdevelopments.com",
  "inertia": "https://inertia-eg.com",
  "hyde-park": "https://hydeparke.com",
  "talaat-moustafa-group": "https://talaatmoustafa.com",
  "city-edge": "https://cityedge.com.eg",
  "ora-developers": "https://oradevelopers.com",
  "misr-italia": "https://misritalia.com.eg",
};

function fallbackLogo(name: string) {
  return `https://ui-avatars.com/api/?background=1f3a5f&color=fff&bold=true&size=128&name=${encodeURIComponent(name)}`;
}

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
    logo: logoMap[slug] ?? fallbackLogo(v.name),
    blurb: blurbs[v.name] ?? `${v.name} — active developer with ${v.count} ${v.count === 1 ? "project" : "projects"} on PropTrack.`,
    website: websiteMap[slug],
  }))
  .sort((a, b) => b.count - a.count);

export const developerBySlug = (slug: string) => developers.find((d) => d.slug === slug);
