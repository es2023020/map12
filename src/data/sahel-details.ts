// Source: Sahel_Project_Directory.pdf + Egypt_Real_Estate_Projects_Locations.pdf
export type SahelDetail = {
  developer?: string;
  blurb?: string;
  areaSize?: string;
  unitSizes?: string;
  priceFrom?: number;
  deliveryYear?: number;
  status?: "Delivered" | "Under Construction" | "Off-Plan";
  paymentPlan?: string;
  highlights?: string[];
  mapsUrl?: string;
};

export const sahelDetails: Record<string, SahelDetail> = {
  "alam-al-roum": {
    developer: "Qatari Diar / Alam Al Roum Developments",
    areaSize: "~4,900 acres",
    blurb:
      "Alam Al Roum at km 275 � Egypt's furthest-north coastal city by Qatari Diar and NUCA. ~7.2 km beachfront, marina, golf and a self-contained masterplan with ~60% residential and ~25% green space.",
    status: "Off-Plan",
    deliveryYear: 2031,
    priceFrom: 18,
    paymentPlan: "Pre-launch � contact developer for current plan",
    highlights: ["275 km from Alexandria", "~7.2 km beach", "Qatari Diar partnership", "Mega coastal city"],
  },
  jamila: {
    developer: "New Jersey Developments",
    areaSize: "130 acres",
    unitSizes: "79�209 m�",
    blurb:
      "Jamila at km 273 � boutique Sidi Heneish resort with 91% green and water features. Phase 1 chalets, apartments, duplexes and D-Villas on ~700 m beachfront.",
    priceFrom: 5,
    deliveryYear: 2027,
    paymentPlan: "10% down � up to 8�10 years",
    highlights: ["91% green space", "700 m beach", "Chalets from EGP 5M"],
  },
  "almaza-bay": {
    developer: "Travco Properties",
    areaSize: "~1,550 acres",
    blurb:
      "Almaza Bay at km 250 � mature Travco resort with 8 phases, 3,000+ units and integrated Jaz hotels along ~5.5 km beachfront.",
    priceFrom: 12,
    deliveryYear: 2026,
    status: "Delivered",
    highlights: ["Mature resort", "5.5 km beach", "Hotel-integrated", "8 phases"],
  },
  "hacienda-heneish": {
    developer: "Palm Hills Developments",
    areaSize: "~420 acres",
    blurb:
      "Hacienda Heneish at km 248 � Palm Hills' western Sahel launch with Crystal Bay phase targeting ~2028 delivery.",
    priceFrom: 16,
    deliveryYear: 2028,
    highlights: ["Palm Hills quality", "Crystal Bay phase", "Low built footprint"],
  },
  silversands: {
    developer: "Ora Developers",
    areaSize: "~724 acres",
    unitSizes: "417+ m� villas",
    blurb:
      "Silversands at km 247 � Ora's WATG-masterplanned resort with 88,000 sqm lagoon, 4 clubhouses, 2 hotels and the Acclaro phase.",
    priceFrom: 22,
    deliveryYear: 2028,
    paymentPlan: "5�10% down � up to 9 years",
    highlights: ["WATG masterplan", "88,000 sqm lagoon", "Apartments from EGP 23.7M"],
  },
  "sky-north": {
    developer: "Sky Abu Dhabi Developments",
    areaSize: "~430 acres",
    blurb:
      "Sky North at km 246 � Diamond Group's Sidi Heneish resort with ~80% greenery, hotel component and lagoon network. Completion targeted ~2029.",
    priceFrom: 11,
    deliveryYear: 2029,
    highlights: ["80% landscape", "Hotel & lagoons", "From 82 m�"],
  },
  summer: {
    developer: "Al Ahly Sabbour Developments",
    areaSize: "864 acres",
    blurb:
      "Summer at km 246 � Al Ahly Sabbour's WATG-designed double-beachfront resort with private islands and the Serpentine concept.",
    priceFrom: 8,
    deliveryYear: 2027,
    paymentPlan: "5% down � 10�12 years",
    highlights: ["~1 km beachfront", "WATG masterplan", "Chalets from EGP 8M"],
  },
  "marsa-baghush": {
    developer: "Shehab A. Mazhar Architects (SQM Developments)",
    areaSize: "~338 acres",
    unitSizes: "113�375 m�",
    blurb:
      "Marsa Baghush at km 240 � botanical resort with 5 themed clusters, Aqua Heneish Hotel and Leeloo Beach Club on ~550 m beach.",
    priceFrom: 13,
    deliveryYear: 2026,
    paymentPlan: "5% down � up to 8 years",
    highlights: ["5 botanical clusters", "Fully finished options", "Chalets from EGP 13M"],
  },
  "beit-al-bahr": {
    developer: "Beit Al Bahr Developments",
    areaSize: "~450 acres",
    unitSizes: "125�350+ m�",
    blurb:
      "Beit Al Bahr at km 241 � BAM alliance resort (El Abd, Guira, J Developments) within El Abd Resort Sidi Heneish with ~3.5 km private beachfront.",
    priceFrom: 15,
    deliveryYear: 2027,
    paymentPlan: "5% down � up to 8 years",
    highlights: ["3.5 km beach", "BAM alliance", "Sidi Heneish", "Chalets & villas"],
  },
  koun: {
    developer: "Mabany Edris",
    areaSize: "~106 acres",
    unitSizes: "60�155+ m�",
    blurb:
      "Koun at km 201 � Mabany Edris' Ras El Hekma lagoon resort with 100% waterfront units, central lagoon and private beach access.",
    priceFrom: 10,
    deliveryYear: 2027,
    paymentPlan: "5% down � up to 10 years",
    highlights: ["Km 201 Ras El Hekma", "Central lagoon", "Waterfront units", "Mabany Edris"],
  },
  "hacienda-ras-el-hekma": {
    developer: "Palm Hills Developments",
    areaSize: "~1,400 acres",
    blurb:
      "Hacienda Ras El Hekma at km 238 � OBMI-designed beachfront city with ~4.8 km coast and tiered villa rows for sea views.",
    priceFrom: 11,
    deliveryYear: 2029,
    paymentPlan: "5% + 5% � up to 10 years",
    highlights: ["4.8 km beach", "OBMI design", "86% greenery"],
  },
  "modon-ras-el-hekma": {
    developer: "Modon Holding",
    areaSize: "Phase 1: Wadi Yamm",
    blurb:
      "Modon Ras El Hekma at km 220 � Abu Dhabi-backed mega-city; Phase 1 Wadi Yamm in active sales with smart-city infrastructure.",
    priceFrom: 16,
    deliveryYear: 2028,
    paymentPlan: "5% down � up to 8 years",
    highlights: ["Mega-city scale", "Wadi Yamm Phase 1", "Modon / NUCA"],
  },
  ramla: {
    developer: "Marakez Developments",
    areaSize: "~406 acres",
    unitSizes: "100�500 m�",
    blurb:
      "Ramla at km 215 � Marakez beachfront resort with tiered terraces, 20-acre crystal lagoon and Oasis & Grove phases.",
    priceFrom: 10,
    deliveryYear: 2027,
    paymentPlan: "10% down � up to 6 years",
    highlights: ["1.4 km beach", "Crystal lagoon", "Fully finished clusters"],
  },
  azha: {
    developer: "Madaar Developments",
    areaSize: "~250 acres",
    blurb:
      "Azha at km 214 � Madaar's lagoon resort with 45-acre swimmable lagoon, Ogma/Naos phases and two 5-star hotels.",
    priceFrom: 9,
    deliveryYear: 2027,
    paymentPlan: "5% down � up to 9 years",
    highlights: ["45-acre lagoon", "Two hotels", "800 m beach"],
  },
  "fouka-bay": {
    developer: "Tatweer Misr",
    areaSize: "~220 acres",
    blurb:
      "Fouka Bay at km 211 � award-winning Tatweer Misr resort with Crystal Lagoons, Italian masterplan and House Hotel.",
    priceFrom: 10,
    deliveryYear: 2026,
    status: "Under Construction",
    highlights: ["Crystal Lagoons", "Award-winning design", "Multiple delivered phases"],
  },
  "d-bay": {
    developer: "Tatweer Misr",
    blurb: "D-Bay at km 190 � Tatweer Misr's established Ras El Hekma bay community with lagoon pools and resort amenities.",
    priceFrom: 7,
    deliveryYear: 2026,
  },
  jefaira: {
    developer: "Inertia Egypt",
    blurb:
      "Jefaira at km 190 � Inertia's minimalist Mediterranean resort with beachfront chalets and twin houses on the RHK corridor.",
    priceFrom: 12,
    deliveryYear: 2026,
  },
  ogami: {
    developer: "SODIC",
    areaSize: "~440 acres",
    blurb:
      "Ogami at km 205 � SODIC and Nobu Hospitality's sandy-beach resort with sunset townhomes and branded residences.",
    priceFrom: 12,
    deliveryYear: 2027,
    highlights: ["SODIC � Nobu", "800 m sandy beach", "Sunset townhomes"],
  },
  marassi: {
    developer: "Emaar Misr",
    blurb:
      "Marassi at km 126 � Emaar Misr's flagship North Coast city with marina, golf, hotels and Egypt's most established premium Sahel address.",
    priceFrom: 18,
    deliveryYear: 2025,
    status: "Under Construction",
    paymentPlan: "10% down � up to 8 years",
    highlights: ["Emaar flagship", "Marina & golf", "Sidi Abdel Rahman", "km 126"],
    mapsUrl: "https://maps.google.com/?q=Marassi+North+Coast+Egypt",
  },
  "hacienda-bay": {
    developer: "Palm Hills Developments",
    blurb:
      "Hacienda Bay at km 124 � Palm Hills' original North Coast success story and one of the Sahel's most traded resort communities.",
    priceFrom: 16,
    deliveryYear: 2024,
    status: "Delivered",
    highlights: ["Palm Hills flagship", "Mature resort", "km 124"],
  },
  "hacienda-white": {
    developer: "Palm Hills Developments",
    priceFrom: 13,
    deliveryYear: 2024,
    status: "Delivered",
  },
  "amwaj": {
    developer: "Al Ahly Sabbour Developments",
    blurb: "Amwaj at km 136 � Al Ahly Sabbour's established Sidi Abdel Rahman resort with lagoon pools and family chalets.",
    priceFrom: 8,
    deliveryYear: 2025,
  },
  soul: {
    developer: "Emaar Misr",
    blurb: "Soul at km 180 � Emaar Misr's contemporary Ras El Hekma beachfront community.",
    priceFrom: 13,
    deliveryYear: 2027,
  },
  "swan-lake": {
    developer: "Hassan Allam Properties",
    priceFrom: 11,
    deliveryYear: 2026,
  },
  "hyde-park-north-seashore": {
    developer: "Hyde Park Developments",
    areaSize: "~240 acres",
    blurb:
      "Hyde Park North Seashore at km 207 � EDSA/SB Architects terraced resort with 25+ beach pools and 5-star hotel.",
    priceFrom: 9,
    deliveryYear: 2028,
    highlights: ["550 m beach", "~1,850 units", "5-star hotel"],
  },
};
