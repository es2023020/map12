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
  "developer": "Qatari Diar",
  "areaSize": "5000 feddan",
  "unitSizes": "Chalet, Twin House, Villa",
  "priceFrom": 0,
  "deliveryYear": 2026,
  "status": "Off-Plan",
  "paymentPlan": "Price on request",
  "blurb": "Alam Al Roum by Qatari Diar is a mega-scale coastal resort destination of 5,000 faddans east of Marsa Matrouh, featuring a yacht marina, hotels, and 7.2 km of private beachfront.",
  "highlights": [
    "by Qatari Diar",
    "7.2 km private beach",
    "International Yacht Marina"
  ]
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
  "developer": "Palm Hills Developments",
  "areaSize": "420 feddan",
  "unitSizes": "80–350 m²",
  "priceFrom": 12,
  "deliveryYear": 2028,
  "status": "Off-Plan",
  "paymentPlan": "5% down payment · installments up to 8 years",
  "blurb": "Hacienda Heneish by Palm Hills Developments is a massive 420-feddan coastal retreat in Sidi Heneish, offering premium hospitality, crystal lagoons, and direct beach access to signature turquoise waters.",
  "highlights": [
    "Palm Hills premium quality",
    "420 acres masterplan",
    "Turquoise water beachfront"
  ]
},
  silversands: {
  "developer": "Ora Developers",
  "areaSize": "506 feddan",
  "unitSizes": "95–450 m²",
  "priceFrom": 9.7,
  "deliveryYear": 2028,
  "status": "Off-Plan",
  "paymentPlan": "5% down payment · installments up to 10 years",
  "blurb": "Silversands Sidi Heneish is Ora Developers' flagship WATG-masterplanned resort spanning 506 feddans, featuring 1.2 km of private beachfront and an 88,000 sqm swimmable lagoon.",
  "highlights": [
    "1.2 km beachfront",
    "88,000 sqm Crystal Lagoon",
    "Ora premium masterplan"
  ]
},
  "marsa-baghush": {
  "developer": "Shehab Mazhar / SQM Developments",
  "areaSize": "130 feddan",
  "unitSizes": "80–300 m²",
  "priceFrom": 6,
  "deliveryYear": 2027,
  "status": "Under Construction",
  "paymentPlan": "5% down payment · installments up to 8 years",
  "blurb": "Marsa Baghush by Shehab Mazhar (SQM Developments) is a boutique 130-feddan community in Sidi Heneish, designed with tiered elevations to ensure panoramic sea views from every residence.",
  "highlights": [
    "Designed by Shehab Mazhar",
    "Tiered sea views",
    "Sidi Heneish beachfront"
  ]
},
  "beit-al-bahr": {
  "developer": "Beit Al Bahr Developments",
  "areaSize": "450 feddan",
  "unitSizes": "95–400 m²",
  "priceFrom": 14.9,
  "deliveryYear": 2027,
  "status": "Under Construction",
  "paymentPlan": "10% down payment · installments up to 8 years",
  "blurb": "Beit El Bahr inside El Abd Resort Sidi Heneish is a tiered 450-feddan beachfront project offering 3.5 km of private white sand beach and swimmable lagoons.",
  "highlights": [
    "3.5 km private beachfront",
    "Tiered beachfront phases",
    "Inside El Abd Resort"
  ]
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
