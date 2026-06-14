export type Landmark = {
  id: string;
  name: string;
  category: "mall" | "airport" | "road" | "university" | "beach" | "landmark";
  area?: string;
  lat: number;
  lng: number;
};

export const landmarkColors: Record<Landmark["category"], string> = {
  mall: "#EA580C",
  airport: "#2563EB",
  road: "#64748B",
  university: "#9333EA",
  beach: "#06B6D4",
  landmark: "#CA8A04",
};

export const landmarks: Landmark[] = [
  // Malls
  { id: "mall-arabia", name: "Mall of Arabia", category: "mall", area: "6th-october", lat: 29.978, lng: 30.972 },
  { id: "mall-cfc", name: "Cairo Festival City", category: "mall", area: "new-cairo", lat: 30.029, lng: 31.408 },
  { id: "mall-point90", name: "Point 90 Mall", category: "mall", area: "new-cairo", lat: 30.011, lng: 31.482 },
  { id: "mall-mallofegypt", name: "Mall of Egypt", category: "mall", area: "6th-october", lat: 29.973, lng: 31.018 },
  { id: "mall-citystars", name: "City Stars Heliopolis", category: "mall", area: "heliopolis", lat: 30.073, lng: 31.346 },
  { id: "mall-dandy", name: "Dandy Mega Mall", category: "mall", area: "sheikh-zayed", lat: 30.024, lng: 30.989 },
  // Airports
  { id: "ap-cai", name: "Cairo Intl. Airport", category: "airport", area: "heliopolis", lat: 30.113, lng: 31.405 },
  { id: "ap-sphinx", name: "Sphinx Intl. Airport", category: "airport", area: "6th-october", lat: 30.099, lng: 30.895 },
  { id: "ap-borg", name: "Borg El Arab Airport", category: "airport", area: "new-alamein", lat: 30.917, lng: 29.694 },
  { id: "ap-hurghada", name: "Hurghada Intl.", category: "airport", area: "red-sea", lat: 27.180, lng: 33.799 },
  { id: "ap-sharm", name: "Sharm El Sheikh Intl.", category: "airport", area: "south-sinai", lat: 27.977, lng: 34.395 },
  { id: "ap-capital", name: "Capital Intl. Airport", category: "airport", area: "new-administrative-capital", lat: 30.005, lng: 31.886 },
  // Roads
  { id: "rd-ring", name: "Ring Road", category: "road", area: "new-cairo", lat: 30.000, lng: 31.510 },
  { id: "rd-middle-ring", name: "Middle Ring Road", category: "road", area: "mostakbal-city", lat: 30.060, lng: 31.620 },
  { id: "rd-cairo-alex", name: "Cairo–Alex Desert Rd.", category: "road", area: "sheikh-zayed", lat: 30.300, lng: 30.700 },
  { id: "rd-suez", name: "Cairo–Suez Road", category: "road", area: "new-cairo", lat: 30.080, lng: 31.700 },
  { id: "rd-sokhna", name: "Cairo–Sokhna Road", category: "road", area: "ain-sokhna", lat: 29.800, lng: 32.000 },
  { id: "rd-fouka", name: "Fouka Road", category: "road", area: "ras-el-hekma", lat: 30.880, lng: 28.700 },
  // Universities
  { id: "uni-auc", name: "AUC New Cairo", category: "university", area: "new-cairo", lat: 30.020, lng: 31.499 },
  { id: "uni-guc", name: "GUC", category: "university", area: "new-cairo", lat: 29.987, lng: 31.443 },
  { id: "uni-nu", name: "Nile University", category: "university", area: "6th-october", lat: 30.018, lng: 30.972 },
  { id: "uni-bue", name: "BUE", category: "university", area: "new-cairo", lat: 30.119, lng: 31.683 },
  { id: "uni-msa", name: "MSA University", category: "university", area: "6th-october", lat: 29.978, lng: 30.937 },
  { id: "uni-aastmt", name: "AAST New Capital", category: "university", area: "new-administrative-capital", lat: 30.013, lng: 31.737 },
  // Beaches
  { id: "bch-hekma", name: "Ras El Hekma Beach", category: "beach", area: "ras-el-hekma", lat: 31.205, lng: 27.780 },
  { id: "bch-heneish", name: "Sidi Heneish Bay", category: "beach", area: "sidi-heneish", lat: 31.320, lng: 27.280 },
  { id: "bch-marassi", name: "Marassi Shoreline", category: "beach", area: "sidi-abdelrahman", lat: 30.880, lng: 28.600 },
  { id: "bch-almaza", name: "Almaza Bay Marina", category: "beach", area: "sidi-heneish", lat: 31.260, lng: 27.470 },
  { id: "bch-gouna", name: "El Gouna Lagoon", category: "beach", area: "red-sea", lat: 27.395, lng: 33.677 },
  // Landmarks
  { id: "lm-pyramids", name: "Pyramids of Giza", category: "landmark", area: "6th-october", lat: 29.979, lng: 31.134 },
  { id: "lm-citadel", name: "Cairo Citadel", category: "landmark", area: "heliopolis", lat: 30.029, lng: 31.260 },
  { id: "lm-iconic", name: "Iconic Tower", category: "landmark", area: "new-administrative-capital", lat: 30.025, lng: 31.744 },
  { id: "lm-greenriver", name: "Green River Park", category: "landmark", area: "new-administrative-capital", lat: 30.020, lng: 31.730 },
  { id: "lm-qarun", name: "Lake Qarun", category: "landmark", area: "fayoum", lat: 29.470, lng: 30.580 },
];

export const landmarksByArea = (areaSlug: string | null) =>
  areaSlug ? landmarks.filter((l) => l.area === areaSlug) : landmarks;