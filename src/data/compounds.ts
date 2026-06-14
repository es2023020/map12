import { kmToLatLng } from "./coast";

export type Compound = {
  slug: string;
  name: string;
  area: string; // area slug
  km?: number;
  lat: number;
  lng: number;
  developer: string;
  developerSlug: string;
  priceFrom: number; // EGP millions
  deliveryYear: number;
  status: "Delivered" | "Under Construction" | "Off-Plan";
  beachfront?: boolean;
  types: string[]; // Chalet, Twin, Villa, Apartment, Townhouse, Penthouse
  amenities: string[];
  hero: string;
  gallery: string[];
  blurb: string;
  paymentPlan: string;
  areaSize?: string; // total feddan
  unitSizes?: string;
  city?: string;
  type?: "Residential" | "Mixed-use" | "Resort" | "Coastal";
  flagship?: boolean;
  highlights?: string[];
};

const beachImgs = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=1600&q=80",
  "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=1600&q=80",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&q=80",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
  "https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=1600&q=80",
  "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=1600&q=80",
];
const cityImgs = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80",
];
const pick = (arr: string[], seed: number) => arr[seed % arr.length];
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type SahelInput = [name: string, km: number, area: string, developer: string, priceFrom: number, year: number, beach?: boolean];

const sahelRaw: SahelInput[] = [
  // SIDI HENEISH
  ["Alam Al Roum", 275, "sidi-heneish", "Modon", 18, 2028, true],
  ["Jamila", 273, "sidi-heneish", "Inertia", 14, 2027, true],
  ["Almaza Bay", 250, "sidi-heneish", "Travco", 12, 2026, true],
  ["Hacienda Heneish", 248, "sidi-heneish", "Palm Hills Developments", 16, 2027, true],
  ["Silversands", 247, "sidi-heneish", "Ora Developers", 22, 2027, true],
  ["Sky North", 246, "sidi-heneish", "Roya Developments", 11, 2027, false],
  ["Summer", 246, "sidi-heneish", "Misr Italia", 9, 2026, true],
  ["Beit Al Bahr", 241, "sidi-heneish", "Wadi Degla", 7, 2025, true],
  ["Marsa Baghush", 240, "sidi-heneish", "Marakez", 13, 2027, true],
  // RAS EL HEKMA
  ["Hacienda Ras El Hekma", 238, "ras-el-hekma", "Palm Hills Developments", 15, 2027, true],
  ["Modon Ras El Hekma", 220, "ras-el-hekma", "Modon", 20, 2028, true],
  ["Ramla", 215, "ras-el-hekma", "ADD Properties", 10, 2027, true],
  ["Azha", 214, "ras-el-hekma", "Madaar", 9, 2026, true],
  ["Naia Bay", 212, "ras-el-hekma", "Jadeer Developments", 8, 2026, true],
  ["El Masyaf", 212, "ras-el-hekma", "M Squared", 11, 2027, true],
  ["Fouka Bay", 211, "ras-el-hekma", "Tatweer Misr", 10, 2026, true],
  ["Hacienda West", 208, "ras-el-hekma", "Palm Hills Developments", 14, 2027, true],
  ["Hyde Park North - Seashore", 207, "ras-el-hekma", "Hyde Park", 13, 2027, true],
  ["Playa Seashell", 206, "ras-el-hekma", "Al Marasem", 9, 2026, true],
  ["Ogami", 205, "ras-el-hekma", "Roya Developments", 12, 2027, true],
  ["La Vista Ras El Hekma", 204, "ras-el-hekma", "La Vista Developments", 11, 2027, true],
  ["Caesar Sodic", 202, "ras-el-hekma", "SODIC", 14, 2027, true],
  ["Koun", 202, "ras-el-hekma", "MAVEN Developments", 10, 2027, true],
  ["Caesar Bay", 201, "ras-el-hekma", "Madaar", 12, 2026, true],
  ["Lyv", 200, "ras-el-hekma", "Cred Developments", 13, 2027, true],
  ["Mountain View Ras El Hekma", 200, "ras-el-hekma", "Mountain View", 16, 2028, true],
  ["Solare", 199, "ras-el-hekma", "Misr Italia", 10, 2027, true],
  ["Swan Lake", 197, "ras-el-hekma", "Hassan Allam Properties", 11, 2026, true],
  ["Seashell Ras El Hekma", 195, "ras-el-hekma", "Al Marasem", 9, 2026, true],
  ["Gaia", 194, "ras-el-hekma", "Tatweer Misr", 9, 2026, true],
  ["June", 194, "ras-el-hekma", "SODIC", 14, 2027, true],
  ["Direction White", 193, "ras-el-hekma", "Wadi Degla", 8, 2026, true],
  ["Cali Coast Ras El Hekma", 193, "ras-el-hekma", "Maven", 10, 2027, true],
  ["The Med", 192, "ras-el-hekma", "PRE Developments", 11, 2027, true],
  ["Hacienda Waters", 191, "ras-el-hekma", "Palm Hills Developments", 15, 2027, true],
  ["Marbay", 191, "ras-el-hekma", "Eagle Hills", 12, 2027, true],
  ["Jefaira", 190, "ras-el-hekma", "Inertia", 12, 2026, true],
  ["The C", 188, "ras-el-hekma", "Coldwell Banker", 9, 2026, true],
  ["Youd", 186, "ras-el-hekma", "ARENCO", 8, 2027, false],
  ["Salt", 185, "ras-el-hekma", "Tatweer Misr", 8, 2026, true],
  ["Azzar Island", 185, "ras-el-hekma", "Reedy Group", 10, 2027, true],
  ["Katameya Coast", 184, "ras-el-hekma", "Starlight Developments", 9, 2026, true],
  ["Safia", 183, "ras-el-hekma", "Maxim Developments", 8, 2026, true],
  ["Sa'ada Sahel", 183, "ras-el-hekma", "Cred Developments", 9, 2027, true],
  ["Soul", 180, "ras-el-hekma", "Emaar Misr", 13, 2027, true],
  ["LVLS", 179, "ras-el-hekma", "Hyde Park", 11, 2027, true],
  // AL DABAA
  ["D.O.S.E", 174, "al-dabaa", "Maven", 9, 2026, true],
  ["The Waterway", 173, "al-dabaa", "Equity", 8, 2025, false],
  ["Seazen", 172, "al-dabaa", "Cred", 8, 2026, true],
  ["La Vista Bay", 169, "al-dabaa", "La Vista Developments", 9, 2025, true],
  ["La Vista Bay East", 169, "al-dabaa", "La Vista Developments", 9, 2025, true],
  ["Hacienda Blue", 168, "al-dabaa", "Palm Hills Developments", 12, 2026, true],
  ["Lasirena Sahel", 167, "al-dabaa", "Lasirena Group", 6, 2025, true],
  ["D-Bay", 166, "al-dabaa", "Wadi Degla", 7, 2026, true],
  ["South Med", 165, "al-dabaa", "Talaat Moustafa Group", 10, 2027, true],
  // GHAZALA BAY
  ["Playa", 146, "ghazala-bay", "Maven Developments", 7, 2026, true],
  ["Ghazala Bay", 145, "ghazala-bay", "Talaat Moustafa Group", 6, 2024, true],
  ["Zoya", 145, "ghazala-bay", "ADD Properties", 8, 2026, true],
  // SIDI ABDELRAHMAN
  ["Telal", 142, "sidi-abdelrahman", "Roya Developments", 9, 2025, true],
  ["Hacienda Red", 139, "sidi-abdelrahman", "Palm Hills Developments", 14, 2026, true],
  ["Hacienda White", 138, "sidi-abdelrahman", "Palm Hills Developments", 13, 2024, true],
  ["Blumar", 137, "sidi-abdelrahman", "Memaar Al Morshedy", 6, 2024, true],
  ["Amwaj", 136, "sidi-abdelrahman", "Al Ahly Sabbour", 8, 2025, true],
  ["Seashell", 135, "sidi-abdelrahman", "Al Marasem", 8, 2025, true],
  ["Bianchi ILios", 135, "sidi-abdelrahman", "Inertia", 9, 2026, true],
  ["Shamasi", 134, "sidi-abdelrahman", "MQR Developments", 7, 2026, true],
  ["Masaya", 134, "sidi-abdelrahman", "M Squared", 8, 2026, true],
  ["Stella Heights", 133, "sidi-abdelrahman", "Talaat Moustafa Group", 9, 2025, true],
  ["La Vista Cascada", 133, "sidi-abdelrahman", "La Vista Developments", 8, 2025, true],
  ["Marassi", 126, "sidi-abdelrahman", "Emaar Misr", 18, 2025, true],
  ["Stella Sidi Abdel Rahman", 125, "sidi-abdelrahman", "Talaat Moustafa Group", 7, 2024, true],
  ["Diplo 3", 125, "sidi-abdelrahman", "NCB", 6, 2025, false],
  ["Hacienda Bay", 124, "sidi-abdelrahman", "Palm Hills Developments", 16, 2024, true],
  // NEW ALAMEIN
  ["Zahra", 123, "new-alamein", "Wadi Degla", 7, 2026, true],
  ["Il Latini City Edge", 109, "new-alamein", "City Edge Developments", 9, 2026, false],
  ["Il Latini SED", 109, "new-alamein", "SED Developments", 9, 2026, false],
  ["Lagoons Al Alamein", 109, "new-alamein", "City Edge", 8, 2026, true],
  ["Downtown New Alamein", 108, "new-alamein", "City Edge", 12, 2025, false],
  ["Palm Hills New Alamein", 108, "new-alamein", "Palm Hills Developments", 14, 2027, true],
  ["Mazarine", 107, "new-alamein", "City Edge", 11, 2026, true],
  ["The Gate New Alamein", 107, "new-alamein", "City Edge", 8, 2026, false],
  ["North Edge Towers", 106, "new-alamein", "City Edge", 13, 2025, true],
  ["The Islands", 100, "new-alamein", "City Edge", 10, 2026, true],
  ["Dayz", 100, "new-alamein", "Tatweer Misr", 9, 2026, true],
  ["Marina", 100, "new-alamein", "ETAMDA", 6, 2024, true],
  ["Q Bay", 92, "new-alamein", "Palm Hills Developments", 8, 2026, true],
];

const cairoRaw: Array<{
  name: string; area: string; lat: number; lng: number; developer: string; price: number; year: number;
}> = [
  // NEW CAIRO / TAGAMO3
  { name: "Mountain View iCity New Cairo", area: "new-cairo", lat: 30.012, lng: 31.498, developer: "Mountain View", price: 12, year: 2026 },
  { name: "Mivida", area: "new-cairo", lat: 30.014, lng: 31.479, developer: "Emaar Misr", price: 18, year: 2024 },
  { name: "Hyde Park New Cairo", area: "new-cairo", lat: 30.020, lng: 31.493, developer: "Hyde Park", price: 14, year: 2026 },
  { name: "Eastown", area: "new-cairo", lat: 30.005, lng: 31.470, developer: "SODIC", price: 9, year: 2024 },
  { name: "Villette", area: "new-cairo", lat: 30.034, lng: 31.503, developer: "SODIC", price: 11, year: 2026 },
  { name: "Katameya Heights", area: "new-cairo", lat: 30.000, lng: 31.450, developer: "Tameer", price: 25, year: 2020 },
  { name: "Katameya Dunes", area: "new-cairo", lat: 29.990, lng: 31.440, developer: "DAMAC", price: 30, year: 2018 },
  { name: "Al Rehab", area: "new-cairo", lat: 30.058, lng: 31.490, developer: "Talaat Moustafa Group", price: 4, year: 2010 },
  { name: "Madinaty", area: "new-cairo", lat: 30.110, lng: 31.660, developer: "Talaat Moustafa Group", price: 6, year: 2024 },
  { name: "Cairo Festival City", area: "new-cairo", lat: 30.029, lng: 31.408, developer: "Al-Futtaim", price: 11, year: 2022 },
  { name: "Palm Hills Katameya", area: "new-cairo", lat: 30.005, lng: 31.460, developer: "Palm Hills Developments", price: 16, year: 2024 },
  { name: "Stone Residence", area: "new-cairo", lat: 30.028, lng: 31.466, developer: "PRE Developments", price: 10, year: 2025 },
  { name: "The Square Sabbour", area: "new-cairo", lat: 30.022, lng: 31.482, developer: "Al Ahly Sabbour", price: 9, year: 2025 },
  { name: "Lake View Residence", area: "new-cairo", lat: 30.027, lng: 31.488, developer: "El Hazek Construction", price: 12, year: 2026 },
  { name: "Zed East", area: "new-cairo", lat: 30.045, lng: 31.498, developer: "Ora Developers", price: 13, year: 2027 },
  { name: "Taj City", area: "new-cairo", lat: 30.063, lng: 31.408, developer: "Madinet Masr", price: 8, year: 2026 },
  { name: "Sodic East", area: "new-cairo", lat: 30.080, lng: 31.660, developer: "SODIC", price: 10, year: 2027 },
  { name: "Bloomfields", area: "new-cairo", lat: 30.060, lng: 31.660, developer: "Tatweer Misr", price: 9, year: 2027 },
  // SHEIKH ZAYED
  { name: "Beverly Hills", area: "sheikh-zayed", lat: 30.050, lng: 30.970, developer: "SODIC", price: 14, year: 2010 },
  { name: "Allegria", area: "sheikh-zayed", lat: 30.020, lng: 30.965, developer: "SODIC", price: 22, year: 2014 },
  { name: "Westown Residences", area: "sheikh-zayed", lat: 30.018, lng: 30.985, developer: "SODIC", price: 13, year: 2024 },
  { name: "SODIC West", area: "sheikh-zayed", lat: 30.012, lng: 30.960, developer: "SODIC", price: 12, year: 2025 },
  { name: "Palm Hills Sheikh Zayed", area: "sheikh-zayed", lat: 30.050, lng: 30.955, developer: "Palm Hills Developments", price: 11, year: 2024 },
  { name: "Hyde Park West", area: "sheikh-zayed", lat: 30.060, lng: 30.940, developer: "Hyde Park", price: 12, year: 2027 },
  { name: "Belle Vie", area: "sheikh-zayed", lat: 30.043, lng: 30.945, developer: "Emaar Misr", price: 15, year: 2026 },
  { name: "ZED Towers", area: "sheikh-zayed", lat: 30.030, lng: 30.990, developer: "Ora Developers", price: 11, year: 2025 },
  { name: "Cairo Gate", area: "sheikh-zayed", lat: 30.055, lng: 30.990, developer: "Emaar Misr", price: 17, year: 2027 },
  { name: "Vinci", area: "sheikh-zayed", lat: 30.045, lng: 30.928, developer: "Misr Italia", price: 10, year: 2027 },
  { name: "Karmell", area: "sheikh-zayed", lat: 30.040, lng: 30.935, developer: "SODIC", price: 12, year: 2027 },
  { name: "O West", area: "sheikh-zayed", lat: 30.055, lng: 30.910, developer: "Orascom Development", price: 13, year: 2026 },
];

// New areas: 6th October, NAC, Mostakbal, Heliopolis, Sokhna, Red Sea, South Sinai, Fayoum
const extraRaw: Array<{
  name: string; area: string; lat: number; lng: number; developer: string; price: number; year: number; beach?: boolean; type?: Compound["type"];
}> = [
  // 6TH OCTOBER
  { name: "Palm Hills October", area: "6th-october", lat: 29.965, lng: 30.940, developer: "Palm Hills Developments", price: 9, year: 2024 },
  { name: "Mountain View iCity October", area: "6th-october", lat: 29.985, lng: 30.910, developer: "Mountain View", price: 11, year: 2026 },
  { name: "Zayed 2000", area: "6th-october", lat: 29.978, lng: 30.955, developer: "Wadi Degla", price: 7, year: 2023 },
  { name: "Sun Capital", area: "6th-october", lat: 29.940, lng: 30.890, developer: "Arabia Holding", price: 6, year: 2025 },
  { name: "Badya", area: "6th-october", lat: 29.910, lng: 30.880, developer: "Palm Hills Developments", price: 8, year: 2027, type: "Mixed-use" },
  // NEW ADMINISTRATIVE CAPITAL
  { name: "Il Bosco City", area: "new-administrative-capital", lat: 30.020, lng: 31.745, developer: "Misr Italia", price: 9, year: 2026 },
  { name: "La Verde", area: "new-administrative-capital", lat: 30.015, lng: 31.730, developer: "La Verde Developments", price: 8, year: 2026 },
  { name: "Anakaji", area: "new-administrative-capital", lat: 30.030, lng: 31.760, developer: "Misr Italia", price: 10, year: 2027 },
  { name: "Capital Heights", area: "new-administrative-capital", lat: 30.025, lng: 31.720, developer: "Safwa Urban Development", price: 7, year: 2026 },
  { name: "City Oval", area: "new-administrative-capital", lat: 30.010, lng: 31.755, developer: "Mountain View", price: 9, year: 2027 },
  { name: "Iconic Tower District", area: "new-administrative-capital", lat: 30.025, lng: 31.745, developer: "ACUD", price: 14, year: 2026, type: "Mixed-use" },
  // MOSTAKBAL CITY
  { name: "Bloomfields", area: "mostakbal-city", lat: 30.078, lng: 31.665, developer: "Tatweer Misr", price: 9, year: 2027 },
  { name: "Mountain View Aliva", area: "mostakbal-city", lat: 30.072, lng: 31.650, developer: "Mountain View", price: 10, year: 2027 },
  { name: "Cleo Mostakbal", area: "mostakbal-city", lat: 30.080, lng: 31.672, developer: "Hyde Park", price: 9, year: 2027 },
  { name: "La Vista City", area: "mostakbal-city", lat: 30.085, lng: 31.658, developer: "La Vista Developments", price: 8, year: 2026 },
  // HELIOPOLIS
  { name: "Heliopark", area: "heliopolis", lat: 30.103, lng: 31.355, developer: "Heliopolis Company", price: 7, year: 2025 },
  { name: "New Heliopolis", area: "heliopolis", lat: 30.140, lng: 31.420, developer: "New Heliopolis", price: 6, year: 2024 },
  { name: "Sheraton Residences", area: "heliopolis", lat: 30.095, lng: 31.345, developer: "Tabarak Holding", price: 8, year: 2025 },
  // AIN SOKHNA
  { name: "Telal Sokhna", area: "ain-sokhna", lat: 29.605, lng: 32.335, developer: "Roya Developments", price: 7, year: 2025, beach: true, type: "Resort" },
  { name: "IL Monte Galala", area: "ain-sokhna", lat: 29.580, lng: 32.350, developer: "Tatweer Misr", price: 9, year: 2026, beach: true, type: "Resort" },
  { name: "Stella di Mare", area: "ain-sokhna", lat: 29.615, lng: 32.320, developer: "Talaat Moustafa Group", price: 8, year: 2024, beach: true, type: "Resort" },
  { name: "Murano", area: "ain-sokhna", lat: 29.590, lng: 32.340, developer: "M Squared", price: 6, year: 2026, beach: true, type: "Resort" },
  // RED SEA
  { name: "El Gouna", area: "red-sea", lat: 27.395, lng: 33.677, developer: "Orascom Development", price: 18, year: 2024, beach: true, type: "Resort" },
  { name: "Makadi Heights", area: "red-sea", lat: 26.978, lng: 33.880, developer: "Orascom Development", price: 9, year: 2026, beach: true, type: "Resort" },
  { name: "Soma Bay", area: "red-sea", lat: 26.840, lng: 33.985, developer: "Abu Soma Development", price: 14, year: 2026, beach: true, type: "Resort" },
  { name: "Sahl Hasheesh", area: "red-sea", lat: 27.080, lng: 33.890, developer: "ERC Egypt", price: 12, year: 2025, beach: true, type: "Resort" },
  // SOUTH SINAI
  { name: "Soma Sharm", area: "south-sinai", lat: 27.870, lng: 34.300, developer: "Travco", price: 11, year: 2025, beach: true, type: "Resort" },
  { name: "Nabq Bay Residences", area: "south-sinai", lat: 28.060, lng: 34.420, developer: "Pickalbatros", price: 7, year: 2024, beach: true, type: "Resort" },
  { name: "Ras Sudr Riviera", area: "south-sinai", lat: 29.580, lng: 32.700, developer: "Maven Developments", price: 5, year: 2026, beach: true, type: "Resort" },
  // FAYOUM
  { name: "Byoum Lakeside", area: "fayoum", lat: 29.470, lng: 30.635, developer: "Tamayoz Developments", price: 5, year: 2025, type: "Resort" },
  { name: "Lazib Inn Tunis", area: "fayoum", lat: 29.385, lng: 30.405, developer: "Lazib", price: 4, year: 2024, type: "Resort" },
];

// Flagship slugs — surfaced by the agency as priorities.
const FLAGSHIPS = new Set([
  "marassi", "hacienda-bay", "mivida", "mountain-view-icity-new-cairo",
  "soul", "jefaira", "almaza-bay", "hyde-park-new-cairo", "el-gouna",
  "silversands", "alam-al-roum", "mountain-view-ras-el-hekma", "june",
  "il-monte-galala", "il-bosco-city", "bloomfields", "o-west", "belle-vie",
]);

const allAmenities = [
  "Private Beach", "Crystal Lagoon", "Marina", "18-Hole Golf", "Clubhouse",
  "Kids Area", "Gym & Spa", "Beach Bar", "Co-working", "24/7 Security",
  "Cycling Track", "Restaurants Strip", "Mosque", "Smart Home", "Pet Park",
];

function buildAmenities(seed: number, beach: boolean) {
  const list = beach ? ["Private Beach", "Crystal Lagoon", "Beach Bar"] : ["Crystal Lagoon", "Clubhouse"];
  for (let i = 0; i < 5; i++) {
    const a = allAmenities[(seed * (i + 7)) % allAmenities.length];
    if (!list.includes(a)) list.push(a);
  }
  return list;
}

function gallery(seed: number, beach: boolean) {
  const pool = beach ? beachImgs : cityImgs;
  return [0, 1, 2, 3].map((i) => pool[(seed + i) % pool.length]);
}

function typesFor(price: number, beach: boolean) {
  const base = beach ? ["Chalet", "Twin House", "Villa"] : ["Apartment", "Penthouse", "Villa"];
  if (price > 12) base.push("Standalone Villa");
  if (price < 9) base.push("Studio");
  return base;
}

function paymentPlan(price: number) {
  const dp = price < 10 ? 5 : 10;
  const years = price > 15 ? 9 : price > 10 ? 8 : 7;
  return `${dp}% down payment over ${years} years equal installments`;
}

const sahelCompounds: Compound[] = sahelRaw.map(([name, km, area, dev, price, year, beach], idx) => {
  const [lat, lng] = kmToLatLng(km);
  const slug = slugify(name);
  return {
    slug,
    name,
    area,
    km,
    lat,
    lng,
    developer: dev,
    developerSlug: slugify(dev),
    priceFrom: price,
    deliveryYear: year,
    status: year <= 2025 ? "Delivered" : year <= 2026 ? "Under Construction" : "Off-Plan",
    beachfront: !!beach,
    types: typesFor(price, !!beach),
    amenities: buildAmenities(idx + 3, !!beach),
    hero: pick(beachImgs, idx),
    gallery: gallery(idx, true),
    blurb: `${name} sits at km ${km} on the North Coast in ${area.replace(/-/g, " ")}, developed by ${dev}. A ${beach ? "beachfront" : "lagoon-front"} community designed for premium summer living.`,
    paymentPlan: paymentPlan(price),
    areaSize: `${Math.round(80 + (idx * 37) % 350)} feddan`,
    unitSizes: `${Math.round(85 + (idx * 9) % 60)}–${Math.round(220 + (idx * 21) % 250)} m²`,
  };
});

const cairoCompounds: Compound[] = cairoRaw.map((c, idx) => {
  const slug = slugify(c.name);
  return {
    slug,
    name: c.name,
    area: c.area,
    lat: c.lat,
    lng: c.lng,
    developer: c.developer,
    developerSlug: slugify(c.developer),
    priceFrom: c.price,
    deliveryYear: c.year,
    status: c.year <= 2024 ? "Delivered" : c.year <= 2026 ? "Under Construction" : "Off-Plan",
    beachfront: false,
    types: typesFor(c.price, false),
    amenities: buildAmenities(idx + 11, false),
    hero: pick(cityImgs, idx),
    gallery: gallery(idx, false),
    blurb: `${c.name} is a flagship development in ${c.area === "new-cairo" ? "New Cairo (Tagamo3)" : "Sheikh Zayed"} by ${c.developer}, offering modern residences with full amenities for year-round living.`,
    paymentPlan: paymentPlan(c.price),
    areaSize: `${Math.round(50 + (idx * 41) % 400)} feddan`,
    unitSizes: `${Math.round(100 + (idx * 11) % 80)}–${Math.round(280 + (idx * 19) % 250)} m²`,
  };
});

const extraCompounds: Compound[] = extraRaw.map((c, idx) => {
  const slug = slugify(c.name);
  const beach = !!c.beach;
  return {
    slug,
    name: c.name,
    area: c.area,
    lat: c.lat,
    lng: c.lng,
    developer: c.developer,
    developerSlug: slugify(c.developer),
    priceFrom: c.price,
    deliveryYear: c.year,
    status: c.year <= 2024 ? "Delivered" : c.year <= 2026 ? "Under Construction" : "Off-Plan",
    beachfront: beach,
    types: typesFor(c.price, beach),
    amenities: buildAmenities(idx + 23, beach),
    hero: pick(beach ? beachImgs : cityImgs, idx + 4),
    gallery: gallery(idx + 4, beach),
    blurb: `${c.name} by ${c.developer} — a ${c.type ?? "Residential"} community offering refined living with full amenities and strong location advantages.`,
    paymentPlan: paymentPlan(c.price),
    areaSize: `${Math.round(60 + (idx * 29) % 380)} feddan`,
    unitSizes: `${Math.round(95 + (idx * 13) % 70)}–${Math.round(250 + (idx * 23) % 240)} m²`,
    type: c.type ?? (beach ? "Resort" : "Residential"),
  };
});

const merged: Compound[] = [...sahelCompounds, ...cairoCompounds, ...extraCompounds];

export const compounds: Compound[] = merged.map((c) => ({
  ...c,
  type: c.type ?? (c.beachfront ? "Coastal" : "Residential"),
  flagship: FLAGSHIPS.has(c.slug) || undefined,
  highlights: c.amenities,
}));
export const compoundBySlug = (slug: string) => compounds.find((c) => c.slug === slug);
export const compoundsByArea = (area: string) => compounds.filter((c) => c.area === area);
export const compoundsByDeveloper = (devSlug: string) =>
  compounds.filter((c) => c.developerSlug === devSlug);