/**
 * Authoritative corrections for compound metadata.
 * Overrides PDF / scraped data when Nawy, developer sites, or Sahel directory disagree.
 * Sources: Sahel Project Directory, Nawy.com, official developer sites, verified coordinates (Jul 2026).
 */
export type CompoundRegistryEntry = {
  name?: string;
  destination?: string;
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
  "31-west": {
  },
  "97-hills": {
    lat: 30.03324,
    lng: 31.4758,
    developer: "97 Hills",
    city: "97 Hills, new-cairo",
  },
  "aeon": {
    lat: 30.03414,
    lng: 31.4808,
    developer: "Marakez",
    city: "Aeon, new-cairo",
  },
  "alam-al-roum": {
    destination: "sidi-heneish",
    km: 275,
    city: "Sidi Heneish, North Coast (km 275), Matrouh Governorate, Egypt",
    lat: 30.93116,
    lng: 28.73305,
  },
  "almaza-bay": {
    lat: 31.12033,
    lng: 27.85044,
    developer: "Travco Properties",
    city: "Almaza Bay, ras-el-hekma",
  },
  "amwaj": {
    destination: "sidi-abdelrahman",
    km: 136,
    city: "Sidi Abdel Rahman, North Coast (km 136), Matrouh Governorate, Egypt",
    lat: 30.92502,
    lng: 28.72754,
  },
  "aqua-lagoons-june": {
    lat: 30.02508,
    lng: 31.47826,
    developer: "SODIC",
    city: "June, new-cairo",
  },
  "at-east": {
    lat: 30.00874,
    lng: 31.75279,
    developer: "Al Ahly Sabbour",
    city: "At East, new-administrative-capital",
  },
  "azha": {
    destination: "ras-el-hekma",
    km: 214,
    developer: "Madaar",
    city: "Ras El Hekma, North Coast (km 214), Matrouh Governorate, Egypt",
    lat: 29.59864,
    lng: 32.33003,
  },
  "badya": {
    lat: 29.95319,
    lng: 30.91836,
    developer: "Palm Hills Developments",
    city: "Badya, 6th-of-october-city",
  },
  "bamboo-iii": {
    lat: 30.03217,
    lng: 31.47611,
    developer: "Palm Hills Developments",
    city: "Bamboo III, new-cairo",
  },
  "beit-al-bahr": {
    destination: "sidi-heneish",
    km: 241,
    developer: "Beit Al Bahr Developments",
    city: "Sidi Heneish, North Coast (km 241), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Beit+Al+Bahr+Sidi+Heneish+North+Coast+Egypt",
    beachfront: true,
    type: "Resort",
    priceFrom: 15,
    deliveryYear: 2027,
    lat: 29.59641,
    lng: 32.32822,
  },
  "belle-vie": {
    lat: 29.95001,
    lng: 30.91551,
    developer: "Emaar Misr",
    city: "Belle Vie, 6th-of-october-city",
  },
  "bianchi-ilios": {
    destination: "sidi-abdelrahman",
    km: 135,
    city: "Sidi Abdel Rahman, North Coast (km 135), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Bianchi+Ilios+Sahel+Egypt",
    lat: 30.03408,
    lng: 31.48366,
  },
  "blumar": {
    destination: "sidi-abdelrahman",
    km: 137,
    city: "Sidi Abdel Rahman, North Coast (km 137), Matrouh Governorate, Egypt",
    lat: 30.92535,
    lng: 28.72565,
  },
  "botanica": {
    lat: 30.03466,
    lng: 31.4801,
    developer: "New Generation Developments",
    city: "Botanica, new-cairo",
  },
  "business-district": {
  },
  "caesar-bay": {
    destination: "ras-el-hekma",
    km: 201,
    developer: "Madaar",
    city: "Ras El Hekma, North Coast (km 201), Matrouh Governorate, Egypt",
    lat: 30.02534,
    lng: 31.482,
  },
  "caesar-sodic": {
    destination: "ras-el-hekma",
    km: 202,
    city: "Ras El Hekma, North Coast (km 202), Matrouh Governorate, Egypt",
    lat: 30.03268,
    lng: 31.48056,
  },
  "cairo-business-park": {
  },
  "cairo-gate": {
    lat: 30.02395,
    lng: 30.98402,
    developer: "Emaar Misr",
    city: "Cairo Gate, sheikh-zayed",
  },
  "cali-coast-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 193,
    developer: "Maven Developments",
    city: "Ras El Hekma, North Coast (km 193), Matrouh Governorate, Egypt",
    lat: 31.11891,
    lng: 27.85,
  },
  "chapters-residence": {
  },
  "cleo-water-residence": {
  },
  "club-hill-solare": {
    lat: 31.12341,
    lng: 27.85456,
    developer: "Misr Italia Properties",
    city: "Solare, ras-el-hekma",
  },
  "club-views": {
    lat: 30.03301,
    lng: 31.48177,
    developer: "Club Views",
    city: "Club Views, new-cairo",
  },
  "commonhaus": {
  },
  "coral-coves": {
  },
  "covaya": {
  },
  "creekview": {
  },
  "crescent-walk": {
    lat: 30.00702,
    lng: 31.74511,
    developer: "Crescent Walk",
    city: "Crescent Walk, new-administrative-capital",
  },
  "d-bay": {
    destination: "al-dabaa",
    km: 166,
    city: "Al Dabaa, North Coast (km 166), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=D-Bay+Sahel+Egypt",
    lat: 31.12017,
    lng: 27.84821,
  },
  "d-o-s-e": {
    destination: "al-dabaa",
    km: 174,
    city: "Al Dabaa, North Coast (km 174), Matrouh Governorate, Egypt",
    lat: 30.02551,
    lng: 31.48399,
  },
  "dayz": {
    destination: "new-alamein",
    km: 100,
    city: "New Alamein, North Coast (km 100), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Dayz+New+Alamein",
    lat: 30.02776,
    lng: 31.48048,
  },
  "dejoya-residence": {
  },
  "diplo-3": {
    destination: "sidi-abdelrahman",
    km: 125,
    city: "Sidi Abdel Rahman, North Coast (km 125), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Diplo+3+Sahel+Egypt",
    lat: 30.02688,
    lng: 31.48284,
  },
  "diplo-village": {
  },
  "direction-white": {
    destination: "ras-el-hekma",
    km: 193,
    developer: "Arabella Developments",
    priceFrom: 9.7,
    city: "Ras El Hekma, North Coast (km 193), Matrouh Governorate, Egypt",
    lat: 30.03053,
    lng: 31.47777,
  },
  "district-5": {
  "il-bosco-city": { destination: "mostakbal-city" },
  "at-east": { destination: "mostakbal-city" },
  "crescent-walk": { destination: "new-cairo" },
  karmell: { destination: "new-zayed" },
  "bamboo-iii": { destination: "new-cairo", city: "New Cairo, Cairo Governorate, Egypt" },
  "talala": { destination: "sarai", city: "Sarai, New Cairo East, Cairo Governorate, Egypt" },
  "sheya-residence": { destination: "sarai", city: "Sarai, New Cairo East, Cairo Governorate, Egypt" },
  "the-mornings": { developer: "Al Ahly Sabbour" },
  "stone-residence": { developer: "PRE Developments" },
  
  // Shorouk Mappings — La Vista Shorouk compounds
  "el-patio-sola": { destination: "shorouk" },
  "patio-5-east": { destination: "shorouk" },
  "patio-casa": { destination: "shorouk" },
  "patio-prime": { destination: "shorouk" },
  // Patio Jade is in the New Administrative Capital (R4 district, next to La Vista City) — NOT Shorouk
  "patio-jade": { destination: "new-administrative-capital" },
  // Patio Vida and Hills are in New Cairo (6th Settlement) — NOT Shorouk
  "patio-vida": { destination: "new-cairo" },
  "patio-hills": { destination: "new-cairo" },
  
  // Obour Mapping
    lat: 30.02597,
  
  // Zayed Mappings
  "palm-hills-jirian": { destination: "new-zayed" },
  "mountain-view-jirian": { destination: "new-zayed" },

  // ── Developer Corrections & Scoped Defaults ──
  "sky-north": {
    developer: "Sky Abu Dhabi Developments",
  },
    lng: 31.47855,
  },
  "downtown-new-alamein": {
    destination: "new-alamein",
    km: 108,
    city: "New Alamein, North Coast (km 108), Matrouh Governorate, Egypt",
    lat: 30.82987,
    lng: 28.94508,
  },
  "el-patio-riva": {
  },
  "el-patio-sola": {
  },
  "el-patio-town": {
  },
  "el-patio-vera": {
  },
  "elea-azha-north": {
    lat: 29.59864,
    lng: 32.33003,
    developer: "Madaar Development",
    city: "Azha, ain-sokhna",
  },
  "elm-tree-park": {
    lat: 30.02943,
    lng: 31.4767,
    developer: "Elm Tree",
    city: "ELM TREE PARK, new-cairo",
  },
  "esse-residence": {
    lat: 30.01125,
    lng: 31.75005,
    developer: "Esse",
    city: "Esse Residence, new-administrative-capital",
  },
  "fouka-bay": {
    destination: "ras-el-hekma",
    km: 211,
    city: "Ras El Hekma, North Coast (km 211), Matrouh Governorate, Egypt",
    lat: 31.12471,
    lng: 27.85027,
  },
  "gaia": {
    destination: "ras-el-hekma",
    km: 194,
    city: "Ras El Hekma, North Coast (km 194), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Gaia+Ras+El+Hekma+Egypt",
    lat: 30.92912,
    lng: 28.73467,
  },
  "ghazala-bay": {
    destination: "ghazala-bay",
    km: 145,
    city: "Ghazala Bay, North Coast (km 145), Matrouh Governorate, Egypt",
    lat: 30.93017,
    lng: 28.72744,
  },
  "hacienda-bay": {
    destination: "sidi-abdelrahman",
    km: 124,
    city: "Sidi Abdel Rahman, North Coast (km 124), Matrouh Governorate, Egypt",
    lat: 30.93393,
    lng: 28.72748,
  },
  "hacienda-blue": {
    destination: "al-dabaa",
    km: 168,
    city: "Al Dabaa, North Coast (km 168), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Blue+Sahel+Egypt",
    lat: 30.02805,
    lng: 31.47541,
  },
  "hacienda-heneish": {
    lat: 30.02667,
    lng: 31.4772,
    developer: "Palm Hills Developments",
    city: "Hacienda Heneish, new-cairo",
  },
  "hacienda-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 238,
    city: "Ras El Hekma, North Coast (km 238), Matrouh Governorate, Egypt",
    lat: 30.02593,
    lng: 31.47742,
  },
  "hacienda-waters": {
    destination: "ras-el-hekma",
    km: 191,
    developer: "Palm Hills Developments",
    city: "Ras El Hekma, North Coast (km 191), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Hacienda+Waters+Ras+El+Hekma+Egypt",
    beachfront: true,
    type: "Resort",
    lat: 29.59583,
    lng: 32.32828,
  },
  "hacienda-west": {
    destination: "ras-el-hekma",
    km: 208,
    city: "Ras El Hekma, North Coast (km 208), Matrouh Governorate, Egypt",
    lat: 30.02593,
    lng: 31.47742,
  },
  "hacienda-white": {
    destination: "sidi-abdelrahman",
    km: 138,
    city: "Sidi Abdel Rahman, North Coast (km 138), Matrouh Governorate, Egypt",
    lat: 30.92752,
    lng: 28.72863,
  },
  "haptown": {
  },
  "hyde-park-north-seashore": {
    destination: "ras-el-hekma",
    km: 207,
    city: "Ras El Hekma, North Coast (km 207), Matrouh Governorate, Egypt",
    lat: 30.02836,
    lng: 31.47844,
  },
  "il-latini-city-edge": {
    destination: "new-alamein",
    km: 109,
    city: "New Alamein, North Coast (km 109), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Il+Latini+City+Edge+New+Alamein",
  },
  "il-latini-sed": {
    destination: "new-alamein",
    km: 109,
    city: "New Alamein, North Coast (km 109), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Il+Latini+SED+New+Alamein",
  },
  "jamila": {
    destination: "sidi-heneish",
    km: 273,
    city: "Sidi Heneish, North Coast (km 273), Matrouh Governorate, Egypt",
    lat: 30.92765,
    lng: 28.727,
  },
  "jebal-sokhna": {
  },
  "jefaira": {
    destination: "ras-el-hekma",
    km: 190,
    city: "Ras El Hekma, North Coast (km 190), Matrouh Governorate, Egypt",
    lat: 31.11703,
    lng: 27.84582,
  },
  "june": {
    destination: "ras-el-hekma",
    km: 194,
    city: "Ras El Hekma, North Coast (km 194), Matrouh Governorate, Egypt",
    lat: 30.02508,
    lng: 31.47826,
  },
  "kai-sokhna": {
  },
  "katameya-coast": {
    destination: "ras-el-hekma",
    km: 184,
    city: "Ras El Hekma, North Coast (km 184), Matrouh Governorate, Egypt",
    lat: 30.02736,
    lng: 31.48038,
  },
  "keeva": {
  },
  "kinda-residence": {
  },
  "koun": {
    destination: "ras-el-hekma",
    km: 202,
    developer: "Mabany Edris",
    city: "Ras El Hekma, North Coast (km 202), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Koun+Ras+El+Hekma+North+Coast+Egypt",
    beachfront: true,
    type: "Resort",
    lat: 30.02948,
    lng: 31.48103,
  },
  "kynd-residence-gaia": {
    lat: 30.92912,
    lng: 28.73467,
    developer: "Al Ahly Sabbour",
    city: "Gaia, north-coast-sidi-abdel-rahman",
  },
  "la-vista-6": {
  },
  "la-vista-7": {
  },
  "la-vista-bay": {
    destination: "al-dabaa",
    km: 169,
    city: "Al Dabaa, North Coast (km 169), Matrouh Governorate, Egypt",
    lat: 30.03395,
    lng: 31.48054,
  },
  "la-vista-bay-east": {
    destination: "al-dabaa",
    km: 169,
    city: "Al Dabaa, North Coast (km 169), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=La+Vista+Bay+East+Egypt",
    lat: 30.02869,
    lng: 31.48496,
  },
  "la-vista-gardens": {
  },
  "la-vista-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 204,
    city: "Ras El Hekma, North Coast (km 204), Matrouh Governorate, Egypt",
    lat: 31.11949,
    lng: 27.85392,
  },
  "la-vista-topaz": {
  },
  "lagoons-al-alamein": {
    destination: "new-alamein",
    km: 109,
    city: "New Alamein, North Coast (km 109), Matrouh Governorate, Egypt",
    lat: 30.82583,
    lng: 28.94682,
  },
  "lasirena-sahel": {
    destination: "al-dabaa",
    km: 167,
    city: "Al Dabaa, North Coast (km 167), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Lasirena+Sahel+Egypt",
    lat: 30.03356,
    lng: 31.48443,
  },
  "lvls": {
    destination: "ras-el-hekma",
    km: 179,
    city: "Ras El Hekma, North Coast (km 179), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=LVLS+Sahel+Mountain+View+Egypt",
    lat: 30.02975,
    lng: 31.48284,
  },
  "lyv": {
    destination: "ras-el-hekma",
    km: 200,
    city: "Ras El Hekma, North Coast (km 200), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Lyv+Ras+El+Hekma+Egypt",
    lat: 30.02174,
    lng: 30.98014,
  },
  "marassi": {
    destination: "sidi-abdelrahman",
    km: 126,
    city: "Sidi Abdel Rahman, North Coast (km 126), Matrouh Governorate, Egypt",
    lat: 30.93231,
    lng: 28.72801,
  },
  "marbay-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 191,
    city: "Ras El Hekma, North Coast (km 191), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=MarBay+Ras+El+Hekma+Egypt",
    lat: 29.60402,
    lng: 32.33253,
  },
  "marina": {
    destination: "new-alamein",
    km: 100,
    city: "New Alamein, North Coast (km 100), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Marina+New+Alamein",
    lat: 30.03416,
    lng: 31.48135,
  },
  "marresidence": {
  },
  "marsa-baghush": {
    lat: 31.14771,
    lng: 27.49592,
    developer: "SQM Development",
    city: "Marsa Baghush, sidi-heneish",
  },
  "masaya": {
    destination: "sidi-abdelrahman",
    km: 134,
    city: "Sidi Abdel Rahman, North Coast (km 134), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Masaya+Sahel+Egypt",
    lat: 30.93339,
    lng: 28.73337,
  },
  "mazarine": {
    destination: "new-alamein",
    km: 107,
    city: "New Alamein, North Coast (km 107), Matrouh Governorate, Egypt",
    lat: 30.82813,
    lng: 28.949,
  },
  "menorca": {
  },
  "mist": {
  },
  "mivida": {
    lat: 30.03274,
    lng: 31.47867,
    developer: "Emaar Misr",
    city: "Mivida, new-cairo",
  },
  "modon-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 220,
    city: "Ras El Hekma, North Coast (km 220), Matrouh Governorate, Egypt",
    lat: 31.11902,
    lng: 27.85383,
  },
  "mountain-view-chillout": {
    lat: 29.95051,
    lng: 30.91913,
    developer: "Mountain View",
    city: "Mountain View Chillout, 6th-of-october-city",
  },
  "mountain-view-crystal": {
    lat: 29.59666,
    lng: 32.32731,
    developer: "Mountain View",
    city: "Mountain View Crystal, ain-sokhna",
  },
  "mountain-view-grand-valley": {
    lat: 30.03149,
    lng: 31.47578,
    developer: "Mountain View",
    city: "Mountain View Grand Valley, new-cairo",
  },
  "mountain-view-jirian": {
    lat: 29.95029,
    lng: 30.92076,
    developer: "Mountain View",
    city: "Mountain View Jirian, 6th-of-october-city",
  },
  "mountain-view-kingsway": {
    lat: 29.94931,
    lng: 30.91959,
    developer: "Mountain View",
    city: "Mountain View Kingsway, 6th-of-october-city",
  },
  "mountain-view-mv4": {
    lat: 29.94799,
    lng: 30.91994,
    developer: "Mountain View",
    city: "Mountain View MV4, 6th-of-october-city",
  },
  "mountain-view-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 200,
    city: "Ras El Hekma, North Coast (km 200), Matrouh Governorate, Egypt",
    lat: 31.12138,
    lng: 27.84593,
  },
  "naia-bay": {
    destination: "ras-el-hekma",
    km: 212,
    developer: "Jumeirah Egypt",
    city: "Ras El Hekma, North Coast (km 212), Matrouh Governorate, Egypt",
    lat: 31.12463,
    lng: 27.85279,
  },
  "nmq": {
  },
  "north-edge-towers": {
    destination: "new-alamein",
    km: 106,
    city: "New Alamein, North Coast (km 106), Matrouh Governorate, Egypt",
    lat: 30.82915,
    lng: 28.9469,
  },
  "o-west": {
    lat: 29.95357,
    lng: 30.92436,
    developer: "Orascom Development",
    city: "O West, 6th-of-october-city",
  },
  "ogami": {
    destination: "ras-el-hekma",
    km: 205,
    developer: "SODIC",
    city: "Ras El Hekma, North Coast (km 205), Matrouh Governorate, Egypt",
    lat: 31.11659,
    lng: 27.85043,
  },
  "olive-oasis": {
  },
  "one33": {
  },
  "origami": {
    lat: 30.02875,
    lng: 31.47736,
    developer: "Origami",
    city: "ORIGAMI, new-cairo",
  },
  "origami-golf": {
    lat: 30.02907,
    lng: 31.48332,
    developer: "Al Ahly Sabbour",
    city: "Origami Golf, new-cairo",
  },
  "palm-hills-alexandria": {
    lat: 31.20006,
    lng: 29.92217,
    developer: "Palm Hills Developments",
    city: "Palm Hills Alexandria, alexandria",
  },
  "palm-hills-jirian": {
    lat: 29.95333,
    lng: 30.9215,
    developer: "Palm Hills Developments",
    city: "Palm Hills Jirian, 6th-of-october-city",
  },
  "palm-hills-new-alamein": {
    destination: "new-alamein",
    km: 108,
    city: "New Alamein, North Coast (km 108), Matrouh Governorate, Egypt",
    lat: 30.82712,
    lng: 28.9497,
  },
  "palm-hills-new-cairo": {
  },
  "palm-hills-one": {
    lat: 30.02783,
    lng: 31.48319,
    developer: "Palm Hills Developments",
    city: "Palm Hills One, new-cairo",
  },
  "palm-parks": {
    lat: 29.9468,
    lng: 30.92008,
    developer: "Palm Hills Developments",
    city: "Palm Parks, 6th-of-october-city",
  },
  "park-sight": {
  },
  "patio-5-east": {
  },
  "patio-casa": {
  },
  "patio-hills": {
  },
  "patio-jade": {
  },
  "patio-oro": {
  },
  "patio-prime": {
  },
  "patio-vida": {
  },
  "patio-zahraa": {
    lat: 30.02593,
    lng: 31.47704,
    developer: "Memaar Al Morshedy",
    city: "Zahra, new-cairo",
  },
  "playa": {
    destination: "ghazala-bay",
    km: 146,
    developer: "Maven Developments",
    city: "Ghazala Bay, North Coast (km 146), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Playa+Sahel+Egypt",
    beachfront: true,
    type: "Resort",
    lat: 29.60253,
    lng: 32.32882,
  },
  "px": {
    lat: 30.03306,
    lng: 31.47773,
    developer: "Palm Hills Developments",
    city: "PX, new-cairo",
  },
  "q-bay": {
    destination: "new-alamein",
    km: 92,
    city: "New Alamein, North Coast (km 92), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Q+Bay+New+Alamein",
    lat: 31.12309,
    lng: 27.84878,
  },
  "rai-valleys": {
  },
  "ramla": {
    destination: "ras-el-hekma",
    km: 215,
    city: "Ras El Hekma, North Coast (km 215), Matrouh Governorate, Egypt",
  },
  "riv-amwaj": {
    lat: 30.92502,
    lng: 28.72754,
    developer: "Al Ahly Sabbour",
    city: "Amwaj, north-coast-sidi-abdel-rahman",
  },
  "rivers": {
  },
  "rock-capital-1": {
  },
  "rock-gold": {
  },
  "rock-sheraton": {
  },
  "rock-vera": {
  },
  "rock-ville": {
  },
  "sa-ada-sahel": {
    destination: "ras-el-hekma",
    km: 183,
    city: "Ras El Hekma, North Coast (km 183), Matrouh Governorate, Egypt",
    lat: 30.02591,
    lng: 31.47501,
  },
  "saada-sahel": {
  },
  "sadaf": {
    lat: 30.02508,
    lng: 31.47826,
    developer: "SODIC",
    city: "June, new-cairo",
  },
  "safia": {
    destination: "ras-el-hekma",
    km: 183,
    city: "Ras El Hekma, North Coast (km 183), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Safia+Ras+El+Hekma+Egypt",
    lat: 31.12283,
    lng: 27.85375,
  },
  "salt": {
    destination: "ras-el-hekma",
    km: 185,
    city: "Ras El Hekma, North Coast (km 185), Matrouh Governorate, Egypt",
    lat: 31.1221,
    lng: 27.84937,
  },
  "sarai": {
  },
  "sealine-seashore": {
  },
  "seashell": {
    destination: "sidi-abdelrahman",
    km: 135,
    developer: "New Giza Developments",
    city: "Sidi Abdel Rahman, North Coast (km 135), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Seashell+Sahel+Egypt",
    lat: 30.03065,
    lng: 31.4848,
  },
  "seashell-ras-el-hekma": {
    destination: "ras-el-hekma",
    km: 195,
    developer: "New Giza Developments",
    city: "Ras El Hekma, North Coast (km 195), Matrouh Governorate, Egypt",
    lat: 31.11997,
    lng: 27.84731,
  },
  "seazen": {
    destination: "al-dabaa",
    km: 172,
    city: "Al Dabaa, North Coast (km 172), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Seazen+Sahel+Egypt",
    lat: 30.02947,
    lng: 31.47542,
  },
  "shamasi": {
    destination: "sidi-abdelrahman",
    km: 134,
    city: "Sidi Abdel Rahman, North Coast (km 134), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Shamasi+Sahel+Egypt",
    lat: 30.92776,
    lng: 28.72827,
  },
  "sheya-residence": {
    lat: 30.83349,
    lng: 28.95249,
    developer: "City Edge Developments",
    city: "Sheya Residence, new-alamein-city",
  },
  "silversands": {
    lat: 30.03244,
    lng: 31.48256,
    developer: "Ora Developers",
    city: "Silversands, new-cairo",
  },
  "silvertown-lagoon-cabanas": {
  },
  "sky-north": {
    lat: 30.03134,
    lng: 31.48095,
    developer: "Sky North",
    city: "Sky North, new-cairo",
  },
  "solana-east": {
    lat: 30.02,
    lng: 30.97775,
    developer: "Ora Developers",
    city: "Solana, sheikh-zayed",
  },
  "solare": {
    destination: "ras-el-hekma",
    km: 199,
    city: "Ras El Hekma, North Coast (km 199), Matrouh Governorate, Egypt",
    lat: 31.12341,
    lng: 27.85456,
  },
  "soul": {
    destination: "ras-el-hekma",
    km: 180,
    city: "Ras El Hekma, North Coast (km 180), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Soul+Sahel+Emaar+Egypt",
    lat: 30.02518,
    lng: 31.48046,
  },
  "south-med": {
    destination: "al-dabaa",
    km: 165,
    city: "Al Dabaa, North Coast (km 165), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=South+Med+Sahel+Egypt",
    lat: 30.02893,
    lng: 31.47984,
  },
  "stella-heights": {
    destination: "sidi-abdelrahman",
    km: 133,
    city: "Sidi Abdel Rahman, North Coast (km 133), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Stella+Heights+Sahel+Egypt",
    lat: 30.83108,
    lng: 28.9514,
  },
  "stella-sidi-abdel-rahman": {
    destination: "sidi-abdelrahman",
    km: 125,
    city: "Sidi Abdel Rahman, North Coast (km 125), Matrouh Governorate, Egypt",
    lat: 30.92975,
    lng: 28.72572,
  },
  "summer": {
    destination: "sidi-heneish",
    km: 246,
    city: "Sidi Heneish, North Coast (km 246), Matrouh Governorate, Egypt",
    lat: 31.12398,
    lng: 27.85045,
  },
  "swan-lake": {
    destination: "ras-el-hekma",
    km: 197,
    city: "Ras El Hekma, North Coast (km 197), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Swan+Lake+Sahel+Egypt",
    lat: 30.02,
    lng: 30.98175,
  },
  "swanlake-el-gouna": {
    lat: 27.26104,
    lng: 33.81398,
    developer: "Orascom Development",
    city: "El Gouna, hurghada",
  },
  "swanlake-west": {
  },
  "talala": {
    lat: 30.02664,
    lng: 31.47967,
    developer: "Talala",
    city: "TALALA, new-cairo",
  },
  "telal": {
    destination: "sidi-abdelrahman",
    km: 142,
    city: "Sidi Abdel Rahman, North Coast (km 142), Matrouh Governorate, Egypt",
    lat: 30.92622,
    lng: 28.7278,
  },
  "telal-east": {
    lat: 30.92622,
    lng: 28.7278,
    developer: "Roya Developments",
    city: "Telal, north-coast-sidi-abdel-rahman",
  },
  "telal-soul": {
    destination: "sidi-abdelrahman",
    km: 143,
    city: "Sidi Abdel Rahman, North Coast (km 143), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Telal+Sahel+Egypt",
    lat: 30.02884,
    lng: 31.47663,
  },
  "the-brooks": {
  },
  "the-butterfly": {
    lat: 30.02514,
    lng: 31.48294,
    developer: "Madinet Masr",
    city: "The Butterfly, new-cairo",
  },
  "the-c": {
    destination: "ras-el-hekma",
    km: 188,
    city: "Ras El Hekma, North Coast (km 188), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=The+C+Ras+El+Hekma+Egypt",
    lat: 30.00563,
    lng: 31.75283,
  },
  "the-commons": {
    lat: 30.00563,
    lng: 31.75283,
    developer: "The C",
    city: "The C, new-administrative-capital",
  },
  "the-crown-extension": {
    lat: 29.95441,
    lng: 30.91992,
    developer: "Palm Hills Developments",
    city: "The Crown Extension, 6th-of-october-city",
  },
  "the-gate-new-alamein": {
    destination: "new-alamein",
    km: 107,
    city: "New Alamein, North Coast (km 107), Matrouh Governorate, Egypt",
    lat: 30.83146,
    lng: 28.95228,
  },
  "the-hillage": {
  },
  "the-islands": {
    destination: "new-alamein",
    km: 100,
    city: "New Alamein, North Coast (km 100), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=The+Islands+New+Alamein",
    lat: 30.01043,
    lng: 31.74972,
  },
  "the-lynks": {
  },
  "the-med": {
    destination: "ras-el-hekma",
    km: 192,
    city: "Ras El Hekma, North Coast (km 192), Matrouh Governorate, Egypt",
    lat: 31.12156,
    lng: 27.85458,
  },
  "the-mornings": {
    lat: 30.02424,
    lng: 30.98037,
    developer: "The Mornings",
    city: "The Mornings, sheikh-zayed",
  },
  "the-waterway": {
    destination: "al-dabaa",
    km: 173,
    city: "Al Dabaa, North Coast (km 173), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=The+Waterway+Sahel+Egypt",
    lat: 30.03057,
    lng: 31.48451,
  },
  "trio": {
  },
  "uptown-cairo": {
  },
  "v-levels": {
  },
  "vea-new-cairo": {
  },
  "vie-collective": {
  },
  "vie-halo": {
  },
  "village-de-la-capitale": {
    lat: 30.01326,
    lng: 31.75194,
    developer: "Village de la Capitale",
    city: "Village de la Capitale, new-administrative-capital",
  },
  "vye-sodic": {
    lat: 30.01895,
    lng: 30.9752,
    developer: "SODIC",
    city: "VYE SODIC, sheikh-zayed",
  },
  "youd": {
    destination: "ras-el-hekma",
    km: 186,
    city: "Ras El Hekma, North Coast (km 186), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Youd+Ras+El+Hekma+Egypt",
    lat: 30.0346,
    lng: 31.47868,
  },
  "zahra": {
    destination: "new-alamein",
    km: 123,
    city: "New Alamein, North Coast (km 123), Matrouh Governorate, Egypt",
    mapsUrl: "https://maps.google.com/?q=Zahra+Sahel+Egypt",
    lat: 30.02593,
    lng: 31.47704,
  },
  "zoya": {
    destination: "ghazala-bay",
    km: 145,
    city: "Ghazala Bay, North Coast (km 145), Matrouh Governorate, Egypt",
    lat: 31.11957,
    lng: 27.85089,
  },
};
