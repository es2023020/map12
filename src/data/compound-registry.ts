/**
 * Authoritative corrections for compound metadata.
 * Overrides PDF / scraped data when Nawy, developer sites, or Sahel directory disagree.
 * Sources: Sahel Project Directory, Nawy.com, official developer sites (Jun 2026).
 */
export type CompoundRegistryEntry = {
  name?: string;
  area?: string;
  km?: number;
  lat?: number;
  lng?: number;
  developer?: string;
  city?: string;
  mapsUrl?: string;
  beachfront?: boolean;
  type?: "Residential" | "Mixed-use" | "Resort" | "Coastal";
  priceFrom?: number;
  deliveryYear?: number;
};

export const compoundRegistry: Record<string, CompoundRegistryEntry> = {
  // ── Sidi Heneish (km 240–273) ──
  "beit-al-bahr": {
    area: "sidi-heneish",
    km: 241,
    developer: "Beit Al Bahr Developments",
    city: "Sidi Heneish, North Coast (km 241), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Beit+Al+Bahr+Sidi+Heneish+North+Coast+Egypt",
    beachfront: true,
    type: "Resort",
    priceFrom: 15,
    deliveryYear: 2027,
  },
  "alam-al-roum": {
    area: "sidi-heneish",
    km: 275,
    city: "Sidi Heneish, North Coast (km 275), Matrouh Governorate, Egypt",
  },
  "jamila": {
    area: "sidi-heneish",
    km: 273,
    city: "Sidi Heneish, North Coast (km 273), Matrouh Governorate, Egypt",
  },
  "summer": {
    area: "sidi-heneish",
    km: 246,
    city: "Sidi Heneish, North Coast (km 246), Matrouh Governorate, Egypt",
  },

  // ── Ras El Hekma (km 178–238) ──
  "hacienda-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 238,
    city: "Ras El Hekma, North Coast (km 238), Matrouh Governorate, Egypt",
  },
  "modon-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 220,
    city: "Ras El Hekma, North Coast (km 220), Matrouh Governorate, Egypt",
  },
  "ramla": {
    area: "ras-el-hekma",
    km: 215,
    city: "Ras El Hekma, North Coast (km 215), Matrouh Governorate, Egypt",
  },
  "azha": {
    area: "ras-el-hekma",
    km: 214,
    developer: "Madaar",
    city: "Ras El Hekma, North Coast (km 214), Matrouh Governorate, Egypt",
  },
  "naia-bay": {
    area: "ras-el-hekma",
    km: 212,
    developer: "Jumeirah Egypt",
    city: "Ras El Hekma, North Coast (km 212), Matrouh Governorate, Egypt",
  },
  "el-masyaf": {
    area: "ras-el-hekma",
    km: 212,
    developer: "M Squared",
    city: "Ras El Hekma, North Coast (km 212), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=El+Masyaf+Ras+El+Hekma+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "fouka-bay": {
    area: "ras-el-hekma",
    km: 211,
    city: "Ras El Hekma, North Coast (km 211), Matrouh Governorate, Egypt",
  },
  "hacienda-west": {
    area: "ras-el-hekma",
    km: 208,
    city: "Ras El Hekma, North Coast (km 208), Matrouh Governorate, Egypt",
  },
  "hyde-park-north-seashore": {
    area: "ras-el-hekma",
    km: 207,
    city: "Ras El Hekma, North Coast (km 207), Matrouh Governorate, Egypt",
  },
  "playa-seashell": {
    area: "ras-el-hekma",
    km: 206,
    developer: "Al Marasem Developments",
    city: "Ras El Hekma, North Coast (km 206), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Playa+Seashell+Ras+El+Hekma+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "ogami": {
    area: "ras-el-hekma",
    km: 205,
    developer: "SODIC",
    city: "Ras El Hekma, North Coast (km 205), Matrouh Governorate, Egypt",
  },
  "la-vista-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 204,
    city: "Ras El Hekma, North Coast (km 204), Matrouh Governorate, Egypt",
  },
  "caesar-sodic": {
    area: "ras-el-hekma",
    km: 202,
    city: "Ras El Hekma, North Coast (km 202), Matrouh Governorate, Egypt",
  },
  koun: {
    area: "ras-el-hekma",
    km: 202,
    developer: "Mabany Edris",
    city: "Ras El Hekma, North Coast (km 202), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Koun+Ras+El+Hekma+North+Coast+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "caesar-bay": {
    area: "ras-el-hekma",
    km: 201,
    developer: "Madaar",
    city: "Ras El Hekma, North Coast (km 201), Matrouh Governorate, Egypt",
  },
  "lyv": {
    area: "ras-el-hekma",
    km: 200,
    city: "Ras El Hekma, North Coast (km 200), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Lyv+Ras+El+Hekma+Egypt",
  },
  "mountain-view-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 200,
    city: "Ras El Hekma, North Coast (km 200), Matrouh Governorate, Egypt",
  },
  "solare": {
    area: "ras-el-hekma",
    km: 199,
    city: "Ras El Hekma, North Coast (km 199), Matrouh Governorate, Egypt",
  },
  "swan-lake": {
    area: "ras-el-hekma",
    km: 197,
    city: "Ras El Hekma, North Coast (km 197), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Swan+Lake+Sahel+Egypt",
  },
  "seashell-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 195,
    city: "Ras El Hekma, North Coast (km 195), Matrouh Governorate, Egypt",
  },
  "gaia": {
    area: "ras-el-hekma",
    km: 194,
    city: "Ras El Hekma, North Coast (km 194), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Gaia+Ras+El+Hekma+Egypt",
  },
  "june": {
    area: "ras-el-hekma",
    km: 194,
    city: "Ras El Hekma, North Coast (km 194), Matrouh Governorate, Egypt",
  },
  "direction-white": {
    area: "ras-el-hekma",
    km: 193,
    city: "Ras El Hekma, North Coast (km 193), Matrouh Governorate, Egypt",
  },
  "cali-coast-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 193,
    developer: "Maven Developments",
    city: "Ras El Hekma, North Coast (km 193), Matrouh Governorate, Egypt",
  },
  "the-med": {
    area: "ras-el-hekma",
    km: 192,
    city: "Ras El Hekma, North Coast (km 192), Matrouh Governorate, Egypt",
  },
  "hacienda-waters": {
    area: "ras-el-hekma",
    km: 191,
    developer: "Palm Hills Developments",
    city: "Ras El Hekma, North Coast (km 191), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Waters+Ras+El+Hekma+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "marbay": {
    area: "ras-el-hekma",
    km: 191,
    city: "Ras El Hekma, North Coast (km 191), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Marbay+Ras+El+Hekma+Egypt",
  },
  "marbay-ras-el-hekma": {
    area: "ras-el-hekma",
    km: 191,
    city: "Ras El Hekma, North Coast (km 191), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=MarBay+Ras+El+Hekma+Egypt",
  },
  "jefaira": {
    area: "ras-el-hekma",
    km: 190,
    city: "Ras El Hekma, North Coast (km 190), Matrouh Governorate, Egypt",
  },
  "the-c": {
    area: "ras-el-hekma",
    km: 188,
    city: "Ras El Hekma, North Coast (km 188), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=The+C+Ras+El+Hekma+Egypt",
  },
  "youd": {
    area: "ras-el-hekma",
    km: 186,
    city: "Ras El Hekma, North Coast (km 186), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Youd+Ras+El+Hekma+Egypt",
  },
  "salt": {
    area: "ras-el-hekma",
    km: 185,
    city: "Ras El Hekma, North Coast (km 185), Matrouh Governorate, Egypt",
  },
  "azzar-island": {
    area: "ras-el-hekma",
    km: 185,
    developer: "Reedy Group",
    city: "Ras El Hekma, North Coast (km 185), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Azzar+Island+Ras+El+Hekma+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "katameya-coast": {
    area: "ras-el-hekma",
    km: 184,
    city: "Ras El Hekma, North Coast (km 184), Matrouh Governorate, Egypt",
  },
  "safia": {
    area: "ras-el-hekma",
    km: 183,
    city: "Ras El Hekma, North Coast (km 183), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Safia+Ras+El+Hekma+Egypt",
  },
  "sa-ada-sahel": {
    area: "ras-el-hekma",
    km: 183,
    city: "Ras El Hekma, North Coast (km 183), Matrouh Governorate, Egypt",
  },
  "soul": {
    area: "ras-el-hekma",
    km: 180,
    city: "Ras El Hekma, North Coast (km 180), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Soul+Sahel+Emaar+Egypt",
  },
  "lvls": {
    area: "ras-el-hekma",
    km: 179,
    city: "Ras El Hekma, North Coast (km 179), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=LVLS+Sahel+Mountain+View+Egypt",
  },

  // ── Al Dabaa (km 155–177) ──
  "d-o-s-e": {
    area: "al-dabaa",
    km: 174,
    city: "Al Dabaa, North Coast (km 174), Matrouh Governorate, Egypt",
  },
  "the-waterway": {
    area: "al-dabaa",
    km: 173,
    city: "Al Dabaa, North Coast (km 173), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=The+Waterway+Sahel+Egypt",
  },
  "seazen": {
    area: "al-dabaa",
    km: 172,
    city: "Al Dabaa, North Coast (km 172), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Seazen+Sahel+Egypt",
  },
  "la-vista-bay": {
    area: "al-dabaa",
    km: 169,
    city: "Al Dabaa, North Coast (km 169), Matrouh Governorate, Egypt",
  },
  "la-vista-bay-east": {
    area: "al-dabaa",
    km: 169,
    city: "Al Dabaa, North Coast (km 169), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=La+Vista+Bay+East+Egypt",
  },
  "hacienda-blue": {
    area: "al-dabaa",
    km: 168,
    city: "Al Dabaa, North Coast (km 168), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Blue+Sahel+Egypt",
  },
  "lasirena-sahel": {
    area: "al-dabaa",
    km: 167,
    city: "Al Dabaa, North Coast (km 167), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Lasirena+Sahel+Egypt",
  },
  "d-bay": {
    area: "al-dabaa",
    km: 166,
    city: "Al Dabaa, North Coast (km 166), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=D-Bay+Sahel+Egypt",
  },
  "south-med": {
    area: "al-dabaa",
    km: 165,
    city: "Al Dabaa, North Coast (km 165), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=South+Med+Sahel+Egypt",
  },

  // ── Ghazala Bay (km 145–154) ──
  "playa": {
    area: "ghazala-bay",
    km: 146,
    developer: "Maven Developments",
    city: "Ghazala Bay, North Coast (km 146), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Playa+Sahel+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "ghazala-bay": {
    area: "ghazala-bay",
    km: 145,
    city: "Ghazala Bay, North Coast (km 145), Matrouh Governorate, Egypt",
  },
  "zoya": {
    area: "ghazala-bay",
    km: 145,
    city: "Ghazala Bay, North Coast (km 145), Matrouh Governorate, Egypt",
  },

  // ── Sidi Abdelrahman (km 124–144) ──
  "telal": {
    area: "sidi-abdelrahman",
    km: 142,
    city: "Sidi Abdel Rahman, North Coast (km 142), Matrouh Governorate, Egypt",
  },
  "telal-soul": {
    area: "sidi-abdelrahman",
    km: 143,
    city: "Sidi Abdel Rahman, North Coast (km 143), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Telal+Sahel+Egypt",
  },
  "hacienda-red": {
    area: "sidi-abdelrahman",
    km: 139,
    developer: "Palm Hills Developments",
    city: "Sidi Abdel Rahman, North Coast (km 139), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Red+Sahel+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "hacienda-white": {
    area: "sidi-abdelrahman",
    km: 138,
    city: "Sidi Abdel Rahman, North Coast (km 138), Matrouh Governorate, Egypt",
  },
  "blumar": {
    area: "sidi-abdelrahman",
    km: 137,
    city: "Sidi Abdel Rahman, North Coast (km 137), Matrouh Governorate, Egypt",
  },
  "amwaj": {
    area: "sidi-abdelrahman",
    km: 136,
    city: "Sidi Abdel Rahman, North Coast (km 136), Matrouh Governorate, Egypt",
  },
  "seashell": {
    area: "sidi-abdelrahman",
    km: 135,
    city: "Sidi Abdel Rahman, North Coast (km 135), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Seashell+Sahel+Egypt",
  },
  "bianchi-ilios": {
    area: "sidi-abdelrahman",
    km: 135,
    city: "Sidi Abdel Rahman, North Coast (km 135), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Bianchi+Ilios+Sahel+Egypt",
  },
  "shamasi": {
    area: "sidi-abdelrahman",
    km: 134,
    city: "Sidi Abdel Rahman, North Coast (km 134), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Shamasi+Sahel+Egypt",
  },
  "masaya": {
    area: "sidi-abdelrahman",
    km: 134,
    city: "Sidi Abdel Rahman, North Coast (km 134), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Masaya+Sahel+Egypt",
  },
  "stella-heights": {
    area: "sidi-abdelrahman",
    km: 133,
    city: "Sidi Abdel Rahman, North Coast (km 133), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Stella+Heights+Sahel+Egypt",
  },
  "la-vista-cascada": {
    area: "sidi-abdelrahman",
    km: 133,
    developer: "La Vista Developments",
    city: "Sidi Abdel Rahman, North Coast (km 133), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=La+Vista+Cascada+Sahel+Egypt",
    beachfront: true,
    type: "Resort",
  },
  "marassi": {
    area: "sidi-abdelrahman",
    km: 126,
    city: "Sidi Abdel Rahman, North Coast (km 126), Matrouh Governorate, Egypt",
  },
  "stella-sidi-abdel-rahman": {
    area: "sidi-abdelrahman",
    km: 125,
    city: "Sidi Abdel Rahman, North Coast (km 125), Matrouh Governorate, Egypt",
  },
  "diplo-3": {
    area: "sidi-abdelrahman",
    km: 125,
    city: "Sidi Abdel Rahman, North Coast (km 125), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Diplo+3+Sahel+Egypt",
  },
  "hacienda-bay": {
    area: "sidi-abdelrahman",
    km: 124,
    city: "Sidi Abdel Rahman, North Coast (km 124), Matrouh Governorate, Egypt",
  },

  // ── New Alamein (km 100–123) ──
  "zahra": {
    area: "new-alamein",
    km: 123,
    city: "New Alamein, North Coast (km 123), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Zahra+Sahel+Egypt",
  },
  "il-latini-city-edge": {
    area: "new-alamein",
    km: 109,
    city: "New Alamein, North Coast (km 109), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Il+Latini+City+Edge+New+Alamein",
  },
  "il-latini-sed": {
    area: "new-alamein",
    km: 109,
    city: "New Alamein, North Coast (km 109), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Il+Latini+SED+New+Alamein",
  },
  "lagoons-al-alamein": {
    area: "new-alamein",
    km: 109,
    city: "New Alamein, North Coast (km 109), Matrouh Governorate, Egypt",
  },
  "downtown-new-alamein": {
    area: "new-alamein",
    km: 108,
    city: "New Alamein, North Coast (km 108), Matrouh Governorate, Egypt",
  },
  "palm-hills-new-alamein": {
    area: "new-alamein",
    km: 108,
    city: "New Alamein, North Coast (km 108), Matrouh Governorate, Egypt",
  },
  "mazarine": {
    area: "new-alamein",
    km: 107,
    city: "New Alamein, North Coast (km 107), Matrouh Governorate, Egypt",
  },
  "the-gate-new-alamein": {
    area: "new-alamein",
    km: 107,
    city: "New Alamein, North Coast (km 107), Matrouh Governorate, Egypt",
  },
  "north-edge-towers": {
    area: "new-alamein",
    km: 106,
    city: "New Alamein, North Coast (km 106), Matrouh Governorate, Egypt",
  },
  "the-islands": {
    area: "new-alamein",
    km: 100,
    city: "New Alamein, North Coast (km 100), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=The+Islands+New+Alamein",
  },
  "dayz": {
    area: "new-alamein",
    km: 100,
    city: "New Alamein, North Coast (km 100), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Dayz+New+Alamein",
  },
  "marina": {
    area: "new-alamein",
    km: 100,
    city: "New Alamein, North Coast (km 100), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Marina+New+Alamein",
  },
  "q-bay": {
    area: "new-alamein",
    km: 92,
    city: "New Alamein, North Coast (km 92), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Q+Bay+New+Alamein",
  },

  // ── Cairo / NAC placement ──
  "district-5": { area: "mostakbal-city" },
  "il-bosco-city": { area: "mostakbal-city" },
  "at-east": { area: "new-administrative-capital" },
  "crescent-walk": { area: "new-administrative-capital" },
  karmell: { area: "new-zayed" },
  "bamboo-iii": { area: "new-cairo", city: "New Cairo, Cairo Governorate, Egypt" },
  "talala": { area: "sarai", city: "Sarai, New Cairo East, Cairo Governorate, Egypt" },
  "sheya-residence": { area: "sarai", city: "Sarai, New Cairo East, Cairo Governorate, Egypt" },

  // ── Developer Corrections & Scoped Defaults ──
  "sky-north": {
    developer: "Sky Abu Dhabi Developments",
  },
};

