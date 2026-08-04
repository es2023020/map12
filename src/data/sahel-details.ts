// Source: Sahel_Project_Directory.pdf + Egypt_Real_Estate_Projects_Locations.pdf
export type SahelDetail = {
  developer?: string;
  blurb?: string;
  areaSize?: string;
  unitSizes?: string;
  priceFrom?: number;
  deliveryYear?: number;
  status?: "RTM" | "Off-Plan";
  paymentPlan?: string;
  highlights?: string[];
  mapsUrl?: string;
};

export const sahelDetails: Record<string, SahelDetail> = {
  "alam-al-roum": {
    "developer": "Qatari Diar",
    "areaSize": "5000 feddan",
    "unitSizes": "Chalet, Twin House, Villa",
    "priceFrom": 9,
    "deliveryYear": 2030,
    "status": "Off-Plan",
    "paymentPlan": "5% down payment, remaining balance spread over 8–10 years in equal installments",
    "blurb": "Alam El Roum by Qatari Diar in partnership with NUCA is a mega-scale coastal resort destination of 5,000 faddans east of Marsa Matrouh, featuring a yacht marina, hotels, and 7.2 km of private beachfront.",
    "highlights": [
      "by Qatari Diar & NUCA",
      "7.2 km private beach",
      "International Yacht Marina"
    ]
  },
  jamila: {
    developer: "New Jersey Developments",
    areaSize: "130 feddan",
    unitSizes: "79–209 m²",
    blurb:
      "Jamila Sidi Heneish by New Jersey Developments is a 130-acre coastal resort with a 9% footprint, 700m beach, 16,000 sqm pool complex, and Marriott 5-star hotel.",
    priceFrom: 5.8,
    deliveryYear: 2029,
    status: "Off-Plan",
    paymentPlan: "5% down payment (or 10%), remaining balance spread over 7 to 8 years interest-free",
    highlights: ["9% building footprint", "Marriott 5-star hotel", "700m private beach"],
  },
  "almaza-bay": {
    developer: "Travco Properties",
    areaSize: "1,550 feddan",
    blurb:
      "Almaza Bay at km 250 – mature Travco resort with multiple phases, chalets, townhouses and villas along white-sand beach.",
    priceFrom: 10.7,
    deliveryYear: 2026,
    status: "RTM",
    paymentPlan: "6% down + 6% contract over 7 yrs | 10% down over 6 yrs",
    highlights: ["Mature resort", "White sand beach", "Hotel-integrated", "Multiple phases"],
  },
  "hacienda-heneish": {
    developer: "Palm Hills Developments",
    areaSize: "420 feddan",
    unitSizes: "80–350 m²",
    priceFrom: 17.8,
    deliveryYear: 2028,
    status: "Off-Plan",
    paymentPlan: "5% down payment, remaining balance spread over 7.5 to 8 years interest-free",
    blurb: "Hacienda Heneish by Palm Hills Developments is a massive 420-feddan coastal retreat in Sidi Heneish, offering premium hospitality, crystal lagoons, and direct beach access to signature turquoise waters.",
    highlights: [
      "Palm Hills premium quality",
      "420 acres masterplan",
      "Turquoise water beachfront"
    ]
  },
  silversands: {
    developer: "Ora Developers (Naguib Sawiris)",
    areaSize: "485–503 feddan",
    unitSizes: "95–450+ m²",
    priceFrom: 18,
    deliveryYear: 2028,
    status: "Off-Plan",
    paymentPlan: "5% down payment (+ 5% after 3 months), remaining balance spread over 6 to 10 years interest-free",
    blurb: "SilverSands by Ora Developers (Naguib Sawiris) is a 485–503 acre luxury resort in Sidi Heneish (KM 222) with 1.2 km beach, 88,000 sqm lagoon, and Armani branded villas.",
    highlights: [
      "1.2 km beachfront",
      "88,000 sqm Crystal Lagoon",
      "Ora premium masterplan"
    ]
  },
  "marsa-baghush": {
    developer: "Shehab Mazhar / SQM Developments",
    areaSize: "338 feddan",
    unitSizes: "115–400+ m²",
    priceFrom: 13.5,
    deliveryYear: 2027,
    status: "RTM",
    paymentPlan: "5%–10% down payment, remaining balance spread over 7 to 9 years interest-free",
    blurb: "Marsa Baghush by Shehab Mazhar (SQM Developments) is a boutique 338-feddan community in Sidi Heneish, designed with tiered elevations to ensure panoramic sea views from every residence.",
    highlights: [
      "Designed by Shehab Mazhar",
      "Tiered sea views",
      "Sidi Heneish beachfront"
    ]
  },
  "beit-al-bahr": {
    "developer": "BAM Alliance (El Abd / IWAN)",
    "areaSize": "450 feddan",
    "unitSizes": "95–400 m²",
    "priceFrom": 14.9,
    "deliveryYear": 2028,
    "status": "Off-Plan",
    "paymentPlan": "5%–10% down payment, remaining balance over 7–8 years equal interest-free installments",
    "blurb": "Beit El Bahr inside El Abd Resort Sidi Heneish is a tiered 450-feddan beachfront project offering 3.5 km of private white sand beach and swimmable lagoons.",
    "highlights": [
      "3.5 km private beachfront",
      "Tiered beachfront phases",
      "Inside El Abd Resort"
    ]
  },
  koun: {
    developer: "Mabany Edris",
    areaSize: "106 feddan",
    unitSizes: "50–200+ m²",
    blurb:
      "Koun by Mabany Edris is a 106-acre coastal resort in Ras El Hekma (km 201) with 15% footprint, 100% lagoon/sea-facing units, boutique hotel, and full finishing.",
    priceFrom: 5,
    deliveryYear: 2027,
    status: "RTM",
    paymentPlan: "0%–5% down payment (or 10%), remaining balance spread over 8 to 12 years interest-free",
    highlights: ["Km 201 Ras El Hekma", "100% waterfront view layout", "15% building footprint", "Mabany Edris"],
  },
  "hacienda-ras-el-hekma": {
    developer: "Palm Hills Developments",
    areaSize: "137–140 feddan",
    blurb:
      "Hacienda Ras El Hekma is a 137–140 acre beachfront community by Palm Hills featuring tiered sea-view architecture, crystal lagoons, and boutique beach clubs.",
    priceFrom: 13.5,
    deliveryYear: 2024,
    status: "RTM",
    paymentPlan: "5%–10% down payment, remaining balance spread over 7 to 8 years",
    highlights: ["Tiered sea view layout", "Palm Hills quality", "Swimmable crystal lagoons"],
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
