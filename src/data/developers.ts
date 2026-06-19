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
  "Emaar Misr": "Behind Marassi & Mivida — a global benchmark developer with mature master-plans. Emaar Misr brings world-class Dubai standards to Egypt's North Coast and New Cairo, plus Belle Vie and Cairo Gate in Sheikh Zayed.",
  "Palm Hills Developments": "Egypt's premier lifestyle developer — Hacienda North Coast series, Badya, 97 Hills, Bamboo III, Cleo Water Residence, and 15+ active projects across Cairo and the coast.",
  "SODIC": "Premium homes in West Cairo, East Cairo and Sahel — Villette, Karmell, VYE, Allegria, Beverly Hills, Eastown, June, Caesar and SODIC East.",
  "Mountain View": "iCity & iVilla series across Cairo, Mostakbal City and Ras El Hekma — 12 active projects, Crystal, Jirian, Grand Valley, Aliva, and Kingsway.",
  "Madinet Masr": "Cairo's integrated city developer — Sarai, Taj City, TALALA, ELM TREE PARK, The Butterfly, Club Views and 9+ active communities across New Cairo East.",
  "Tatweer Misr": "Fouka Bay, D-Bay, Bloomfields, Salt, IL Monte Galala — design-forward integrated communities across the North Coast, Ain Sokhna and Mostakbal City.",
  "Inertia": "Jefaira, Soul, Bianchi ILios — boutique beachfront master-plans with a focus on understated Mediterranean design.",
  "Hyde Park": "Hyde Park New Cairo, Seashore Ras El Hekma, Hyde Park West, Cleo Mostakbal — premium East Cairo backbone developer with signature park-fronted communities.",
  "Talaat Moustafa Group": "Egypt's largest developer by scale — Madinaty, Al Rehab, Stella, South Med and Ghazala Bay across Cairo and the North Coast.",
  "City Edge": "New Alamein, 6th of October and NAC — government-backed quality communities: Lagoons, Mazarine, North Edge Towers, Downtown New Alamein.",
  "Ora Developers": "Naguib Sawiris-backed developer — ZED Towers, ZED East, Solana, Silversands and D.O.S.E.",
  "Misr Italia": "IL Bosco City, Stone Residence, Vinci, Solare — signature Italian-inspired communities in New Capital, New Cairo, Sheikh Zayed and North Coast.",
  "Al Ahly Sabbour": "Amwaj, Gaia, Summer, Youd, The Square Sabbour, At East — North Coast backbone developer with 20+ years of Egyptian market delivery.",
  "Hassan Allam Properties": "Swan Lake, The Mornings, Haptown, Beit Al Bahr — premium integrated communities across North Coast, New Cairo and Ain Sokhna.",
  "Wadi Degla": "Direction White, Zahra, Zayed 2000, Murano Ain Sokhna — North Coast, New Alamein and Red Sea coastal communities.",
  "Modon": "Modon Ras El Hekma — a premium resort community by the Saudi developer Modon in the new Ras El Hekma coastal city.",
  "Alam Al Roum Developments": "Alam Al Roum — an exclusive ultra-low-density resort at km 275 in Sidi Heneish, Egypt's furthest-north premium coast destination. A Qatari Diar affiliated development.",
  "Travco": "Almaza Bay — large-scale Sahel beachfront community at Sidi Heneish, backed by Travco's hospitality expertise.",
  "Memaar El Morshedy": "Blumar North Coast, Anakaji New Capital — Al Morshedy Group's signature coastal resort and capital-city communities.",
  "La Vista Developments": "La Vista Ras El Hekma, La Vista Bay, La Vista Cascada Ain Sokhna, La Vista City — premium resort living across Egypt's key markets.",
  "Eagle Hills": "The Abu Dhabi-based global developer with hospitality and residential communities across the UAE and wider region.",
  "Reedy Group": "Azzar Island Ain Sokhna — a distinctive island-concept resort community on Egypt's Red Sea coast.",
  "Madaar": "Azha Ras El Hekma, Caesar Bay — premium beachfront resort compounds by Madaar Development on Egypt's North Coast.",
  "NGD": "Botanica Sheikh Zayed — Nature Group Developments' award-winning botanically themed residential community in West Cairo.",
  "Maven Developments": "Cali Coast Ras El Hekma, Playa — Maven's California-inspired coastal resort communities on the North Coast.",
  "Maven": "Cali Coast Ras El Hekma, Playa Ghazala Bay — Maven's California-inspired coastal resort communities on the North Coast.",
  "Marakez Properties": "District 5, Crescent Walk, Aeon, Ramla — Majid Al Futtaim's Egyptian residential arm delivering integrated communities in New Cairo and Ras El Hekma.",
  "Marakez": "District 5, Crescent Walk, Aeon, Ramla, Marsa Baghush — Majid Al Futtaim's Egyptian residential arm across New Cairo and the North Coast.",
  "Mercon": "Dayz New Alamein — a vibrant lifestyle resort community by Mercon Developments on the New Alamein coastline.",
  "Al-Futtaim": "Cairo Festival City — Al-Futtaim's mixed-use masterplan in New Cairo, integrating retail, hospitality and premium residences.",
  "ACUD": "Iconic Tower District New Capital — the Administrative Capital for Urban Development's flagship mixed-use tower district in Egypt's New Administrative Capital.",
  "Safwa Urban Development": "Capital Heights New Administrative Capital — SUD's premium residential community inside the New Capital.",
  "Orascom Development": "El Gouna Red Sea, Makadi Heights, O West Sheikh Zayed — Orascom's integrated resort cities and urban communities across Egypt.",
  "Orascom Hotels & Development": "Byoum Lakeside Fayoum, El Gouna Red Sea — Orascom's iconic resort destinations offering unique lakeside and Red Sea living.",
  "Iwan Developments": "Arabella — New Cairo's established family community with mature landscaping and strong infrastructure.",
  "Mena Developments": "Bali — El Alamein's upcoming resort city.",
  "Better Home": "Sun Capital, Spring — 6th of October established communities at accessible price points.",
  "Rooya Group": "Golf Central, Stone Park — East Cairo and the Red Sea.",
  "M Squared": "El Masyaf, Masaya Ain Sokhna — M Squared's premium resort compounds on the Ain Sokhna coast.",
  "Roya Developments": "Sky North, Ogami, Telal, Telal Sokhna, Telal Soul — Egypt's leading resort developer with a strong North Coast and Ain Sokhna portfolio spanning km 60 to km 275.",
  "Stella Di Mare": "Stella Heights, Stella Sidi Abdel Rahman, Stella di Mare Ain Sokhna — the Egyptian resort developer behind some of the North Coast's most established beachfront communities.",
  "Master Group Developments": "City Oval New Administrative Capital — Master Group's flagship mixed-use community in Egypt's new capital city.",
  "Al Marasem Developments": "Marbay Ain Sokhna — Al Marasem's premium Red Sea resort in the Ain Sokhna coastal corridor.",
  "Horizon Egypt Developments": "Sa'ada Sahel — Horizon's beachfront North Coast resort community at km 183 Ras El Hekma.",
  "Al Attal Holding": "Ras Sudr Riviera — Al Attal's coastal resort destination on the Gulf of Suez in South Sinai.",
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
  "orascom-development": "https://logo.clearbit.com/orascomdevelopment.com",
  "orascom-hotels-development": "https://logo.clearbit.com/orascomdevelopment.com",
  "marakez": "https://logo.clearbit.com/marakez.net",
  "marakez-properties": "https://logo.clearbit.com/marakez.net",
  "maven-developments": "https://logo.clearbit.com/maven-developments.com",
  "maven": "https://logo.clearbit.com/maven-developments.com",
  "al-futtaim": "https://logo.clearbit.com/alfuttaim.com",
  "madaar": "https://logo.clearbit.com/madaar.com",
  "acud": "https://logo.clearbit.com/acud.gov.eg",
  "safwa-urban-development": "https://logo.clearbit.com/safwadevelopments.com",
  "ngd": "https://logo.clearbit.com/ngdevelopments.com",
  "mercon": "https://logo.clearbit.com/mercondevelopments.com",
  "m-squared": "https://logo.clearbit.com/msquaredegypt.com",
  "roya-developments": "https://logo.clearbit.com/royadevelopments.com",
  "stella-di-mare": "https://logo.clearbit.com/stelladimare.com",
  "master-group-developments": "https://logo.clearbit.com/mastergroup.com.eg",
  "al-marasem-developments": "https://logo.clearbit.com/almarasem.com",
  "horizon-egypt-developments": "https://logo.clearbit.com/horizonegypt.com",
  "al-attal-holding": "https://logo.clearbit.com/alattaldevelopment.com",
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
  "orascom-development": "https://orascomdevelopment.com",
  "orascom-hotels-development": "https://orascomdevelopment.com",
  "marakez": "https://marakez.net",
  "marakez-properties": "https://marakez.net",
  "maven-developments": "https://maven-developments.com",
  "al-futtaim": "https://alfuttaim.com",
  "madaar": "https://madaar.com",
  "acud": "https://acud.gov.eg",
  "roya-developments": "https://royadevelopments.com",
  "stella-di-mare": "https://stelladimare.com",
  "master-group-developments": "https://mastergroup.com.eg",
  "al-marasem-developments": "https://almarasem.com",
  "horizon-egypt-developments": "https://horizonegypt.com",
  "al-attal-holding": "https://alattaldevelopment.com",
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
