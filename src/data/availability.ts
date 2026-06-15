// Real availability data extracted from developer Excel sheets (June 2026)
// Sources: Palm Hills (11-Jun-2026), Mountain View (14-Jun-2026),
//          Madinet Masr, SODIC (14-Jun-2026)

export interface UnitBreakdown {
  type: string;
  available: number;
  minSqm: number;
  maxSqm: number;
  minPriceM: number; // EGP millions
  maxPriceM: number;
}

export interface ProjectAvailability {
  slug: string;
  developer: string;
  totalAvailable: number;
  breakdown: UnitBreakdown[];
  lastUpdated: string;
  note?: string;
}

export const availability: ProjectAvailability[] = [
  // ─── PALM HILLS ──────────────────────────────────────────────────────────────
  {
    slug: "palm-parks",
    developer: "Palm Hills Developments",
    totalAvailable: 10,
    breakdown: [
      { type: "Apartment", available: 10, minSqm: 132, maxSqm: 170, minPriceM: 16.9, maxPriceM: 20.7 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-bay",
    developer: "Palm Hills Developments",
    totalAvailable: 1,
    breakdown: [
      { type: "Villa", available: 1, minSqm: 358, maxSqm: 358, minPriceM: 141.3, maxPriceM: 141.3 },
    ],
    lastUpdated: "2026-06-11",
    note: "Very limited — final release",
  },
  {
    slug: "97-hills",
    developer: "Palm Hills Developments",
    totalAvailable: 53,
    breakdown: [
      { type: "Apartment", available: 32, minSqm: 183, maxSqm: 193, minPriceM: 26.8, maxPriceM: 27.6 },
      { type: "Town House", available: 7, minSqm: 224, maxSqm: 226, minPriceM: 32.6, maxPriceM: 35.9 },
      { type: "Twin House", available: 2, minSqm: 226, maxSqm: 226, minPriceM: 38.1, maxPriceM: 39.6 },
      { type: "Villa", available: 12, minSqm: 206, maxSqm: 417, minPriceM: 38.5, maxPriceM: 62.0 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "palm-hills-alexandria",
    developer: "Palm Hills Developments",
    totalAvailable: 40,
    breakdown: [
      { type: "Apartment", available: 13, minSqm: 90, maxSqm: 179, minPriceM: 10.4, maxPriceM: 20.3 },
      { type: "Town House", available: 21, minSqm: 194, maxSqm: 197, minPriceM: 29.8, maxPriceM: 32.1 },
      { type: "Villa", available: 6, minSqm: 283, maxSqm: 384, minPriceM: 58.1, maxPriceM: 78.1 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "bamboo-iii",
    developer: "Palm Hills Developments",
    totalAvailable: 43,
    breakdown: [
      { type: "Apartment", available: 21, minSqm: 191, maxSqm: 192, minPriceM: 27.3, maxPriceM: 29.2 },
      { type: "Town House", available: 22, minSqm: 221, maxSqm: 222, minPriceM: 32.6, maxPriceM: 34.4 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "the-crown-extension",
    developer: "Palm Hills Developments",
    totalAvailable: 52,
    breakdown: [
      { type: "Apartment", available: 52, minSqm: 217, maxSqm: 223, minPriceM: 29.0, maxPriceM: 31.5 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "badya",
    developer: "Palm Hills Developments",
    totalAvailable: 443,
    breakdown: [
      { type: "Apartment", available: 343, minSqm: 60, maxSqm: 253, minPriceM: 5.4, maxPriceM: 21.4 },
      { type: "Villa", available: 53, minSqm: 180, maxSqm: 504, minPriceM: 23.6, maxPriceM: 58.1 },
      { type: "Town House", available: 47, minSqm: 191, maxSqm: 194, minPriceM: 20.2, maxPriceM: 23.1 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-blue",
    developer: "Palm Hills Developments",
    totalAvailable: 22,
    breakdown: [
      { type: "Chalet", available: 20, minSqm: 115, maxSqm: 164, minPriceM: 23.3, maxPriceM: 30.1 },
      { type: "Villa", available: 2, minSqm: 278, maxSqm: 278, minPriceM: 69.6, maxPriceM: 69.6 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-heneish",
    developer: "Palm Hills Developments",
    totalAvailable: 3,
    breakdown: [
      { type: "Chalet", available: 1, minSqm: 156, maxSqm: 156, minPriceM: 27.8, maxPriceM: 27.8 },
      { type: "Town House", available: 2, minSqm: 196, maxSqm: 199, minPriceM: 37.5, maxPriceM: 43.8 },
    ],
    lastUpdated: "2026-06-11",
    note: "Very limited — final units",
  },
  {
    slug: "hacienda-waters",
    developer: "Palm Hills Developments",
    totalAvailable: 223,
    breakdown: [
      { type: "Chalet", available: 144, minSqm: 65, maxSqm: 151, minPriceM: 13.5, maxPriceM: 23.7 },
      { type: "Cabin", available: 74, minSqm: 42, maxSqm: 46, minPriceM: 18.7, maxPriceM: 22.8 },
      { type: "Villa", available: 5, minSqm: 278, maxSqm: 374, minPriceM: 72.2, maxPriceM: 110.1 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "palm-hills-jirian",
    developer: "Palm Hills Developments",
    totalAvailable: 465,
    breakdown: [
      { type: "Apartment", available: 422, minSqm: 62, maxSqm: 220, minPriceM: 7.9, maxPriceM: 26.5 },
      { type: "Villa", available: 32, minSqm: 196, maxSqm: 405, minPriceM: 33.6, maxPriceM: 95.0 },
      { type: "Town House", available: 11, minSqm: 174, maxSqm: 176, minPriceM: 22.8, maxPriceM: 24.6 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "palm-hills-one",
    developer: "Palm Hills Developments",
    totalAvailable: 59,
    breakdown: [
      { type: "Town House", available: 17, minSqm: 358, maxSqm: 358, minPriceM: 47.5, maxPriceM: 48.0 },
      { type: "Twin House", available: 15, minSqm: 340, maxSqm: 358, minPriceM: 58.0, maxPriceM: 71.8 },
      { type: "Villa", available: 27, minSqm: 195, maxSqm: 673, minPriceM: 86.1, maxPriceM: 340.4 },
    ],
    lastUpdated: "2026-06-11",
    note: "Ultra-premium collection",
  },
  {
    slug: "palm-hills-new-cairo",
    developer: "Palm Hills Developments",
    totalAvailable: 81,
    breakdown: [
      { type: "Apartment", available: 81, minSqm: 114, maxSqm: 200, minPriceM: 14.6, maxPriceM: 28.2 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "px",
    developer: "Palm Hills Developments",
    totalAvailable: 296,
    breakdown: [
      { type: "Apartment", available: 224, minSqm: 78, maxSqm: 172, minPriceM: 14.0, maxPriceM: 30.5 },
      { type: "Town House", available: 72, minSqm: 201, maxSqm: 214, minPriceM: 27.1, maxPriceM: 31.6 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "village-de-la-capitale",
    developer: "Palm Hills Developments",
    totalAvailable: 209,
    breakdown: [
      { type: "Apartment", available: 155, minSqm: 146, maxSqm: 150, minPriceM: 13.6, maxPriceM: 14.1 },
      { type: "Villa", available: 54, minSqm: 185, maxSqm: 262, minPriceM: 29.2, maxPriceM: 41.7 },
    ],
    lastUpdated: "2026-06-11",
  },
  {
    slug: "hacienda-west",
    developer: "Palm Hills Developments",
    totalAvailable: 16,
    breakdown: [
      { type: "Chalet", available: 7, minSqm: 111, maxSqm: 205, minPriceM: 17.2, maxPriceM: 27.1 },
      { type: "Cabin", available: 8, minSqm: 112, maxSqm: 179, minPriceM: 32.2, maxPriceM: 75.0 },
      { type: "Villa", available: 1, minSqm: 340, maxSqm: 340, minPriceM: 118.9, maxPriceM: 118.9 },
    ],
    lastUpdated: "2026-06-11",
    note: "Final units — last phase",
  },

  // ─── MOUNTAIN VIEW ───────────────────────────────────────────────────────────
  {
    slug: "lvls",
    developer: "Mountain View",
    totalAvailable: 4,
    breakdown: [
      { type: "Beach House", available: 2, minSqm: 145, maxSqm: 145, minPriceM: 21.5, maxPriceM: 21.5 },
      { type: "Town House", available: 2, minSqm: 185, maxSqm: 185, minPriceM: 36.0, maxPriceM: 38.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Very limited — almost sold out",
  },
  {
    slug: "mountain-view-aliva",
    developer: "Mountain View",
    totalAvailable: 236,
    breakdown: [
      { type: "Millennial Apartment", available: 78, minSqm: 115, maxSqm: 130, minPriceM: 12.0, maxPriceM: 18.5 },
      { type: "Garden Millennial", available: 85, minSqm: 115, maxSqm: 135, minPriceM: 14.8, maxPriceM: 20.5 },
      { type: "I-Villa", available: 42, minSqm: 220, maxSqm: 300, minPriceM: 28.0, maxPriceM: 48.0 },
      { type: "Villa", available: 18, minSqm: 280, maxSqm: 350, minPriceM: 42.0, maxPriceM: 59.0 },
      { type: "Town House", available: 13, minSqm: 230, maxSqm: 270, minPriceM: 35.0, maxPriceM: 45.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-icity-new-cairo",
    developer: "Mountain View",
    totalAvailable: 25,
    breakdown: [
      { type: "Garden Apartment", available: 12, minSqm: 110, maxSqm: 155, minPriceM: 14.0, maxPriceM: 22.0 },
      { type: "Lake House", available: 5, minSqm: 250, maxSqm: 320, minPriceM: 45.0, maxPriceM: 68.0 },
      { type: "Palace", available: 3, minSqm: 420, maxSqm: 565, minPriceM: 72.0, maxPriceM: 88.0 },
      { type: "Villa", available: 5, minSqm: 280, maxSqm: 380, minPriceM: 38.0, maxPriceM: 58.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-jirian",
    developer: "Mountain View",
    totalAvailable: 188,
    breakdown: [
      { type: "Apartment", available: 48, minSqm: 60, maxSqm: 145, minPriceM: 8.0, maxPriceM: 18.5 },
      { type: "Garden Apartment", available: 32, minSqm: 90, maxSqm: 150, minPriceM: 10.0, maxPriceM: 20.0 },
      { type: "Town House", available: 38, minSqm: 170, maxSqm: 240, minPriceM: 18.5, maxPriceM: 28.0 },
      { type: "Twin House", available: 28, minSqm: 180, maxSqm: 260, minPriceM: 22.0, maxPriceM: 35.0 },
      { type: "Villa", available: 22, minSqm: 220, maxSqm: 320, minPriceM: 32.0, maxPriceM: 52.0 },
      { type: "One Storey", available: 20, minSqm: 220, maxSqm: 280, minPriceM: 38.0, maxPriceM: 48.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-icity-october",
    developer: "Mountain View",
    totalAvailable: 224,
    breakdown: [
      { type: "I-Apartment", available: 82, minSqm: 110, maxSqm: 200, minPriceM: 9.0, maxPriceM: 22.0 },
      { type: "Garden Apartment", available: 64, minSqm: 110, maxSqm: 165, minPriceM: 10.0, maxPriceM: 20.0 },
      { type: "I-Villa", available: 35, minSqm: 220, maxSqm: 310, minPriceM: 28.0, maxPriceM: 50.0 },
      { type: "Park Villa", available: 18, minSqm: 280, maxSqm: 385, minPriceM: 42.0, maxPriceM: 64.0 },
      { type: "Sky Loft", available: 14, minSqm: 200, maxSqm: 280, minPriceM: 22.0, maxPriceM: 38.0 },
      { type: "Millennial", available: 11, minSqm: 130, maxSqm: 175, minPriceM: 14.0, maxPriceM: 22.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-ras-el-hekma",
    developer: "Mountain View",
    totalAvailable: 18,
    breakdown: [
      { type: "Twin House", available: 6, minSqm: 154, maxSqm: 170, minPriceM: 25.0, maxPriceM: 35.0 },
      { type: "Town House", available: 7, minSqm: 165, maxSqm: 180, minPriceM: 24.0, maxPriceM: 33.0 },
      { type: "Villa", available: 5, minSqm: 200, maxSqm: 225, minPriceM: 48.0, maxPriceM: 62.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Phase 2 — limited release",
  },
  {
    slug: "mountain-view-kingsway",
    developer: "Mountain View",
    totalAvailable: 2,
    breakdown: [
      { type: "Town House", available: 2, minSqm: 185, maxSqm: 185, minPriceM: 16.7, maxPriceM: 17.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Almost sold out",
  },
  {
    slug: "mountain-view-grand-valley",
    developer: "Mountain View",
    totalAvailable: 62,
    breakdown: [
      { type: "Grand View Villa", available: 62, minSqm: 250, maxSqm: 250, minPriceM: 30.0, maxPriceM: 38.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-chillout",
    developer: "Mountain View",
    totalAvailable: 4,
    breakdown: [
      { type: "Town House", available: 4, minSqm: 210, maxSqm: 220, minPriceM: 22.0, maxPriceM: 25.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Very limited",
  },
  {
    slug: "mountain-view-crystal",
    developer: "Mountain View",
    totalAvailable: 276,
    breakdown: [
      { type: "Chalet", available: 110, minSqm: 50, maxSqm: 110, minPriceM: 10.0, maxPriceM: 22.0 },
      { type: "Town House", available: 65, minSqm: 155, maxSqm: 210, minPriceM: 22.0, maxPriceM: 42.0 },
      { type: "Beach House", available: 48, minSqm: 120, maxSqm: 190, minPriceM: 28.0, maxPriceM: 55.0 },
      { type: "Cabana", available: 30, minSqm: 50, maxSqm: 70, minPriceM: 14.0, maxPriceM: 22.0 },
      { type: "One Storey", available: 23, minSqm: 220, maxSqm: 285, minPriceM: 65.0, maxPriceM: 122.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "mountain-view-mv4",
    developer: "Mountain View",
    totalAvailable: 22,
    breakdown: [
      { type: "Town House", available: 15, minSqm: 210, maxSqm: 230, minPriceM: 23.0, maxPriceM: 30.0 },
      { type: "Villa", available: 7, minSqm: 240, maxSqm: 245, minPriceM: 30.0, maxPriceM: 37.0 },
    ],
    lastUpdated: "2026-06-14",
  },

  // ─── MADINET MASR ────────────────────────────────────────────────────────────
  {
    slug: "esse-residence",
    developer: "Madinet Masr",
    totalAvailable: 174,
    breakdown: [
      { type: "Apartment", available: 120, minSqm: 50, maxSqm: 160, minPriceM: 4.0, maxPriceM: 15.0 },
      { type: "Villa", available: 54, minSqm: 180, maxSqm: 239, minPriceM: 18.0, maxPriceM: 27.2 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "rai-valleys",
    developer: "Madinet Masr",
    totalAvailable: 37,
    breakdown: [
      { type: "Villa", available: 37, minSqm: 175, maxSqm: 212, minPriceM: 17.0, maxPriceM: 28.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "the-butterfly",
    developer: "Madinet Masr",
    totalAvailable: 367,
    breakdown: [
      { type: "Apartment", available: 280, minSqm: 74, maxSqm: 175, minPriceM: 6.0, maxPriceM: 20.0 },
      { type: "Villa", available: 87, minSqm: 180, maxSqm: 259, minPriceM: 22.0, maxPriceM: 35.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "club-views",
    developer: "Madinet Masr",
    totalAvailable: 212,
    breakdown: [
      { type: "Apartment", available: 165, minSqm: 63, maxSqm: 155, minPriceM: 5.0, maxPriceM: 15.0 },
      { type: "Villa", available: 47, minSqm: 165, maxSqm: 239, minPriceM: 18.0, maxPriceM: 25.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "talala",
    developer: "Madinet Masr",
    totalAvailable: 1040,
    breakdown: [
      { type: "Apartment", available: 820, minSqm: 48, maxSqm: 180, minPriceM: 4.0, maxPriceM: 22.0 },
      { type: "Villa", available: 220, minSqm: 160, maxSqm: 288, minPriceM: 20.0, maxPriceM: 46.0 },
    ],
    lastUpdated: "2026-06",
    note: "Largest community by Madinet Masr",
  },
  {
    slug: "sheya-residence",
    developer: "Madinet Masr",
    totalAvailable: 26,
    breakdown: [
      { type: "Apartment", available: 26, minSqm: 81, maxSqm: 220, minPriceM: 6.0, maxPriceM: 20.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "elm-tree-park",
    developer: "Madinet Masr",
    totalAvailable: 521,
    breakdown: [
      { type: "Apartment", available: 380, minSqm: 50, maxSqm: 155, minPriceM: 4.0, maxPriceM: 17.0 },
      { type: "Villa", available: 141, minSqm: 165, maxSqm: 239, minPriceM: 18.0, maxPriceM: 30.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "origami",
    developer: "Madinet Masr",
    totalAvailable: 23,
    breakdown: [
      { type: "Apartment", available: 23, minSqm: 115, maxSqm: 131, minPriceM: 10.0, maxPriceM: 12.0 },
    ],
    lastUpdated: "2026-06",
  },
  {
    slug: "origami-golf",
    developer: "Madinet Masr",
    totalAvailable: 8,
    breakdown: [
      { type: "Apartment", available: 8, minSqm: 81, maxSqm: 129, minPriceM: 7.0, maxPriceM: 12.0 },
    ],
    lastUpdated: "2026-06",
    note: "Golf course views",
  },

  // ─── SODIC ───────────────────────────────────────────────────────────────────
  {
    slug: "o-west",
    developer: "SODIC",
    totalAvailable: 197,
    breakdown: [
      { type: "Chalet", available: 45, minSqm: 150, maxSqm: 190, minPriceM: 23.0, maxPriceM: 38.0 },
      { type: "Town House", available: 52, minSqm: 200, maxSqm: 280, minPriceM: 35.0, maxPriceM: 68.0 },
      { type: "Twin House", available: 40, minSqm: 250, maxSqm: 320, minPriceM: 55.0, maxPriceM: 95.0 },
      { type: "Villa", available: 60, minSqm: 285, maxSqm: 394, minPriceM: 80.0, maxPriceM: 246.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Premium masterplan — 6th October",
  },
  {
    slug: "botanica",
    developer: "SODIC",
    totalAvailable: 156,
    breakdown: [
      { type: "Chalet", available: 156, minSqm: 123, maxSqm: 144, minPriceM: 17.0, maxPriceM: 20.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "karmell",
    developer: "SODIC",
    totalAvailable: 260,
    breakdown: [
      { type: "Apartment", available: 120, minSqm: 82, maxSqm: 160, minPriceM: 11.0, maxPriceM: 28.0 },
      { type: "Duplex", available: 48, minSqm: 170, maxSqm: 240, minPriceM: 28.0, maxPriceM: 55.0 },
      { type: "Villa", available: 52, minSqm: 280, maxSqm: 384, minPriceM: 55.0, maxPriceM: 83.0 },
      { type: "Town House", available: 40, minSqm: 200, maxSqm: 270, minPriceM: 35.0, maxPriceM: 60.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "vye-sodic",
    developer: "SODIC",
    totalAvailable: 76,
    breakdown: [
      { type: "Apartment", available: 28, minSqm: 108, maxSqm: 160, minPriceM: 16.0, maxPriceM: 28.0 },
      { type: "Town House", available: 24, minSqm: 175, maxSqm: 215, minPriceM: 28.0, maxPriceM: 40.0 },
      { type: "Twin House", available: 24, minSqm: 200, maxSqm: 239, minPriceM: 35.0, maxPriceM: 47.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "sodic-east",
    developer: "SODIC",
    totalAvailable: 183,
    breakdown: [
      { type: "Apartment", available: 85, minSqm: 125, maxSqm: 220, minPriceM: 13.0, maxPriceM: 35.0 },
      { type: "Town House", available: 50, minSqm: 200, maxSqm: 280, minPriceM: 30.0, maxPriceM: 55.0 },
      { type: "Villa", available: 48, minSqm: 310, maxSqm: 427, minPriceM: 55.0, maxPriceM: 75.0 },
    ],
    lastUpdated: "2026-06-14",
  },
  {
    slug: "villette",
    developer: "SODIC",
    totalAvailable: 13,
    breakdown: [
      { type: "Apartment", available: 8, minSqm: 109, maxSqm: 175, minPriceM: 23.0, maxPriceM: 38.0 },
      { type: "Duplex", available: 5, minSqm: 195, maxSqm: 239, minPriceM: 42.0, maxPriceM: 57.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Limited final phase",
  },
  {
    slug: "the-estates-sodic",
    developer: "SODIC",
    totalAvailable: 7,
    breakdown: [
      { type: "Apartment", available: 4, minSqm: 159, maxSqm: 220, minPriceM: 29.0, maxPriceM: 42.0 },
      { type: "Duplex", available: 3, minSqm: 280, maxSqm: 318, minPriceM: 45.0, maxPriceM: 55.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "Ultra-exclusive",
  },
  {
    slug: "june",
    developer: "SODIC",
    totalAvailable: 82,
    breakdown: [
      { type: "Chalet", available: 45, minSqm: 177, maxSqm: 230, minPriceM: 27.0, maxPriceM: 65.0 },
      { type: "Villa", available: 37, minSqm: 260, maxSqm: 347, minPriceM: 80.0, maxPriceM: 240.0 },
    ],
    lastUpdated: "2026-06-14",
    note: "North Coast flagship — Ras El Hekma",
  },
];

export function availabilityBySlug(slug: string): ProjectAvailability | undefined {
  return availability.find((a) => a.slug === slug);
}

export function totalAvailableBySlug(slug: string): number {
  return availabilityBySlug(slug)?.totalAvailable ?? 0;
}
