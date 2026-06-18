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
  "Emaar Misr": "Behind Marassi & Mivida — a global benchmark developer with mature master-plans. Emaar Misr brings world-class Dubai standards to Egypt's North Coast and New Cairo.",
  "Palm Hills Developments": "Egypt's premier lifestyle developer — Hacienda North Coast series, Badya, 97 Hills, Palm Hills Jirian and 15+ active projects across Cairo and the coast.",
  "SODIC": "Premium homes in West Cairo, East Cairo and Sahel — Villette, Karmell, VYE, Botanica, June, and SODIC East.",
  "Mountain View": "iCity & iVilla series across Cairo, Mostakbal City and Ras El Hekma — 12 active projects, Crystal, Jirian, Grand Valley, Aliva.",
  "Madinet Masr": "Cairo's integrated city developer — Sarai, Taj City, TALALA, ELM TREE PARK, The Butterfly and 9+ active communities across New Cairo East.",
  "Tatweer Misr": "Fouka Bay, Bloomfields, Salt, IL Monte Galala — design-forward integrated communities on the North Coast, Ain Sokhna and Mostakbal City.",
  "Inertia": "Jefaira, Soul, Bianchi ILios — boutique beachfront master-plans with a focus on understated Mediterranean design.",
  "Hyde Park": "Hyde Park New Cairo, Seashore North Coast, LVLS, Cleo Mostakbal — premium East Cairo backbone developer.",
  "Talaat Moustafa Group": "Egypt's largest developer by scale — Madinaty, Al Rehab, Stella, South Med and Ghazala Bay.",
  "City Edge": "New Alamein, 6th of October and NAC — government-backed quality communities at accessible price points.",
  "Ora Developers": "Naguib Sawiris-backed developer — ZED Towers, ZED East, Solana, Silversands and D.O.S.E.",
  "Misr Italia": "IL Bosco City, Vinci, Solare — signature Italian-inspired communities in New Capital, Sheikh Zayed and North Coast.",
  "Rooya Group": "Golf Central, Stone Park — East Cairo and the Red Sea.",
  "Al Ahly Sabbour": "Amwaj, Youd, The Square Sabbour — New Cairo and North Coast backbone developer.",
  "Hassan Allam Properties": "Swan Lake, Haptown, Beit Al Bahr — North Coast and Ain Sokhna premium resort communities.",
  "Iwan Developments": "Arabella — New Cairo's established family community.",
  "Wadi Degla": "Direction White, D-Bay, Zahra — North Coast and New Alamein communities.",
  "Mena Developments": "Bali — El Alamein's upcoming resort city.",
  "Modon": "Modon Ras El Hekma — a premium resort community by the Saudi developer Modon in the new Ras El Hekma coastal city.",
  "Alam Al Roum Developments": "Alam Al Roum — an exclusive ultra-low-density resort at km 275 in Sidi Heneish, Egypt's furthest-north premium coast destination.",
  "Travco": "Almaza Bay — large-scale Sahel beachfront community at Sidi Heneish.",
  "Better Home": "Sun Capital, Spring — 6th of October established communities.",
  "Memaar El Morshedy": "Blumar North Coast, Anakaji New Capital — Al Morshedy Group's signature coastal resort and capital-city communities.",
  "La Vista Developments": "La Vista Ras El Hekma, La Vista Bay, La Vista Cascada Ain Sokhna, La Vista City — premium resort living across Egypt's key markets.",
  "Eagle Hills": "Marbay Ain Sokhna — the Abu Dhabi-based developer's Egyptian resort flagship on the Red Sea coast.",
  "Reedy Group": "Azzar Island Ain Sokhna — a distinctive island-concept resort community.",
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
  "memaar-el-morshedy": "https://logo.clearbit.com/morshedy.com",
  "la-vista-developments": "https://logo.clearbit.com/lavistadevelopments.com",
  "eagle-hills": "https://logo.clearbit.com/eaglehills.ae",
  "modon": "https://logo.clearbit.com/modon.sa",
  "travco": "https://logo.clearbit.com/travco.com",
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
  "rooya-group": "https://rooyagroup.com",
  "al-ahly-sabbour": "https://sabbour.com",
  "hassan-allam-properties": "https://hassanallamproperties.com",
  "iwan-developments": "https://iwandevelopments.com",
  "wadi-degla": "https://wadidegla.com",
  "memaar-el-morshedy": "https://morshedy.com",
  "la-vista-developments": "https://lavistadevelopments.com",
  "eagle-hills": "https://eaglehills.ae",
  "modon": "https://modon.sa",
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
