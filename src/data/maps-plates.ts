export interface MapPlate {
  id: string;
  region: "new-cairo" | "mostakbal" | "west" | "coast";
  regionName: string;
  plateNumber: string;
  title: string;
  description: string;
  tags: string[];
  bearing: string;
  borders: string;
  accessRoads: string;
  image: string;
  keyCompounds: string[];
  kmRange?: string;
}

export const mapPlates: MapPlate[] = [
  {
    id: "nc-01",
    region: "new-cairo",
    regionName: "New Cairo",
    plateNumber: "Plate 01",
    title: "New Cairo District Overview & Major Arteries",
    description:
      "The full layout of New Cairo — El Rehab, Madinaty, Beit Al Watan, Investors area, Katameya, and the 5th and 6th Settlements — charted against Suez Road, South 90th, and Ain Sokhna corridor.",
    tags: ["Districts", "Road Network", "Suez Road", "90th Street"],
    bearing: "East of Greater Cairo",
    borders: "New Administrative Capital, Mostakbal City",
    accessRoads: "Cairo-Suez Highway, Middle Ring Road, Ain Sokhna Road",
    image: "/destinations/new-cairo.jpg",
    keyCompounds: ["Madinaty", "El Rehab", "Mivida", "Katameya Heights", "Beit Al Watan"],
  },
  {
    id: "nc-02",
    region: "new-cairo",
    regionName: "New Cairo",
    plateNumber: "Plate 02",
    title: "Golden Square & 5th Settlement Core",
    description:
      "The prestigious Golden Square luxury corridor along North and South 90th axes, featuring Cairo's highest density of prime residential compounds and business parks.",
    tags: ["Golden Square", "Luxury Living", "Business District"],
    bearing: "5th Settlement Heart",
    borders: "AUC Campus, Club Street, Choueifat",
    accessRoads: "North 90, South 90, Mohamed Bin Zayed Axis",
    image: "/Masterplans/villette.svg",
    keyCompounds: ["Villette by SODIC", "Katameya Dunes", "Mivida", "Mountain View iCity", "Layan"],
  },
  {
    id: "nc-03",
    region: "new-cairo",
    regionName: "New Cairo",
    plateNumber: "Plate 03",
    title: "The 6th Settlement & Capital Connector",
    description:
      "The easternmost expansion of New Cairo, directly buffering the Green River and the New Administrative Capital's diplomatic district.",
    tags: ["6th Settlement", "Capital Gate", "New Launches"],
    bearing: "South-East Frontier",
    borders: "New Administrative Capital, Ain Sokhna Highway",
    accessRoads: "Middle Ring Road, Regional Ring Road",
    image: "/Masterplans/the-water-marq.svg",
    keyCompounds: ["Noll New Cairo", "Saada New Cairo", "Vie Collective", "The MarQ"],
  },
  {
    id: "mc-01",
    region: "mostakbal",
    regionName: "Mostakbal City",
    plateNumber: "Plate 04",
    title: "Mostakbal City Master Zoning & Green Spine",
    description:
      "Over 11,000 feddans of integrated smart master planning along the Cairo-Suez corridor, featuring continuous pedestrian spines, civic plazas, and prime educational zones.",
    tags: ["Smart City", "Master Planned", "Green Spine"],
    bearing: "East-North-East",
    borders: "Madinaty, New Administrative Capital, Shorouk",
    accessRoads: "Cairo-Suez Road, Al Amal Axis, Regional Ring Road",
    image: "/Masterplans/aliva.jpg",
    keyCompounds: ["Aliva Mountain View", "Haptown Hassan Allam", "Bloomfields", "Il Bosco City", "101 Premium"],
  },
  {
    id: "mc-02",
    region: "mostakbal",
    regionName: "Mostakbal City",
    plateNumber: "Plate 05",
    title: "Phase 1 & Commercial Promenade",
    description:
      "Detailed view of Mostakbal City's first delivery phase, commercial hubs, sports clubs, and luxury gated phases.",
    tags: ["Phase 1", "Commercial Strip", "Immediate Delivery"],
    bearing: "North Gate Sector",
    borders: "Shorouk City, Al Amal Axis",
    accessRoads: "Direct entrance from Cairo-Suez Highway",
    image: "/Masterplans/the-valleys-mostakbal-city.svg",
    keyCompounds: ["The Rift", "The Valleys", "Aria", "City Gate", "Green Square"],
  },
  {
    id: "gw-01",
    region: "west",
    regionName: "Greater West",
    plateNumber: "Plate 06",
    title: "Sheikh Zayed Central & 26th of July Corridor",
    description:
      "The established West Cairo crown jewel — Beverly Hills, Allegria, ZED Towers, and Arkan Plaza along the central 26th July Mehwar.",
    tags: ["Sheikh Zayed", "Established West", "Mehwar Axis"],
    bearing: "West of Cairo",
    borders: "Giza Plateau, Dahshour Link",
    accessRoads: "26th of July Corridor, Cairo-Alexandria Desert Road",
    image: "/Masterplans/allegria.jpg",
    keyCompounds: ["Allegria by SODIC", "ZED Towers", "Beverly Hills", "Al Karma", "Etapa"],
  },
  {
    id: "gw-02",
    region: "west",
    regionName: "Greater West",
    plateNumber: "Plate 07",
    title: "New Zayed Extension & Dabaa Axis",
    description:
      "The greenfield luxury frontier of West Cairo spanning north of Zayed along Dabaa Road and the Middle Ring Road.",
    tags: ["New Zayed", "Dabaa Road", "Ultra Luxury"],
    bearing: "North-West Extension",
    borders: "Sphinx International Airport, Desert Road",
    accessRoads: "Dabaa Axis, Waslet Dahshour, Ring Road",
    image: "/Masterplans/VYE.jpg",
    keyCompounds: ["Solana by Ora", "VYE SODIC", "Karmell", "Belle Vie Emaar", "Rivers"],
  },
  {
    id: "gw-03",
    region: "west",
    regionName: "Greater West",
    plateNumber: "Plate 08",
    title: "6th of October & Badya Megacity",
    description:
      "The massive urban expanse of 6th of October, anchored by Palm Hills October, O West by Orascom, and Palm Hills' 3,000-feddan Badya smart city.",
    tags: ["October City", "Badya", "Megacities"],
    bearing: "South-West Cairo",
    borders: "Wahat Road, Fayoum Desert Link",
    accessRoads: "Al Wahat Road, Middle Ring Road, Southern Ring Road",
    image: "/Masterplans/badya.jpg",
    keyCompounds: ["Badya by Palm Hills", "O West Orascom", "Palm Hills October", "Sun Capital", "Pyramid Hills"],
  },
  {
    id: "nc-c-01",
    region: "coast",
    regionName: "North Coast",
    plateNumber: "Plate 09",
    title: "North Coast Master Shoreline (Km 100 to Km 273)",
    description:
      "The full 273-kilometer Mediterranean shoreline surveyed sequentially from New Alamein to Marsa Matrouh, capturing Egypt's premier summer destinations.",
    tags: ["Sahel Shoreline", "Mediterranean", "Full 273km"],
    bearing: "Mediterranean Shore, North",
    borders: "Alexandria West to Marsa Matrouh",
    accessRoads: "Alexandria-Matrouh Coastal Highway, Dabaa Road, Fouka Road",
    image: "/Masterplans/Ras-Elhekma.jpeg",
    keyCompounds: ["Marassi", "Hacienda Bay", "Silversands", "Cali Coast", "Almaza Bay"],
    kmRange: "Km 100 – 273",
  },
  {
    id: "nc-c-02",
    region: "coast",
    regionName: "North Coast",
    plateNumber: "Plate 10",
    title: "New Alamein & Marina Hub (Km 100 – 125)",
    description:
      "Egypt's flagship fourth-generation coastal metropolis featuring high-rise beachfront towers, heritage city, and the original Marina lagoons.",
    tags: ["New Alamein", "Towers", "Marina"],
    bearing: "East Sahel",
    borders: "El Alamein War Memorial, Marina 1-7",
    accessRoads: "Coastal Highway, Wadi El Natrun Road",
    image: "/Masterplans/beachfront-towers-new-alamein.svg",
    keyCompounds: ["North Edge Towers", "The Gate", "Mazarine", "Palm Hills New Alamein", "Marina 7"],
    kmRange: "Km 100 – 125",
  },
  {
    id: "nc-c-03",
    region: "coast",
    regionName: "North Coast",
    plateNumber: "Plate 11",
    title: "Sidi Abdel Rahman & Ghazala Bay (Km 125 – 165)",
    description:
      "The undisputed classic heart of Sahel's white sand beaches — Marassi's international marina, Hacienda White, Bianchi, and Seashell.",
    tags: ["Sidi Abdel Rahman", "Marassi", "White Sands"],
    bearing: "Central Sahel",
    borders: "Alamein West to Dabaa",
    accessRoads: "Alexandria-Matrouh Road, Dabaa Corridor",
    image: "/Masterplans/hacienda-white.svg",
    keyCompounds: ["Marassi", "Hacienda White", "Bianchi", "Seashell", "Stella Sidi Abdel Rahman"],
    kmRange: "Km 125 – 165",
  },
  {
    id: "nc-c-04",
    region: "coast",
    regionName: "North Coast",
    plateNumber: "Plate 12",
    title: "Ras El Hekma Master Bay (Km 170 – 220)",
    description:
      "The world-renowned turquoise bay, site of Egypt and ADQ's historic urban megacity, featuring Caesar, Mountain View Ras El Hekma, Solare, and Cali Coast.",
    tags: ["Ras El Hekma", "ADQ Megacity", "Turquoise Waters"],
    bearing: "West Sahel Peninsula",
    borders: "Dabaa to Sidi Heneish",
    accessRoads: "Fouka Road direct exit, Coastal Highway",
    image: "/Masterplans/cali-coast.svg",
    keyCompounds: ["Mountain View Ras El Hekma", "Caesar SODIC", "Solare Misr Italia", "Cali Coast", "Koun"],
    kmRange: "Km 170 – 220",
  },
  {
    id: "nc-c-05",
    region: "coast",
    regionName: "North Coast",
    plateNumber: "Plate 13",
    title: "Sidi Heneish & Almaza Bay (Km 220 – 260)",
    description:
      "The ultra-exclusive serene waters of Sidi Heneish, Almaza Bay's boutique beachfront community, and Ora's flagship Silversands.",
    tags: ["Sidi Heneish", "Almaza Bay", "Silversands"],
    bearing: "Outer West Coast",
    borders: "Ras El Hekma to Marsa Matrouh",
    accessRoads: "Coastal Highway, New Fouka extension",
    image: "/Masterplans/silversands.svg",
    keyCompounds: ["Silversands by Ora", "Almaza Bay Travco", "Marsa Baghush", "Silver Sands", "Summer"],
    kmRange: "Km 220 – 260",
  },
  {
    id: "nc-c-06",
    region: "coast",
    regionName: "North Coast",
    plateNumber: "Plate 14",
    title: "Linear Kilometer Road Index & Sequence",
    description:
      "A complete technical roadmap mapping every compound in chronological sequence from km 100 to km 273 along the Mediterranean shore.",
    tags: ["Road Index", "Kilometer Sequence", "Technical Atlas"],
    bearing: "Linear Shore Axis",
    borders: "Full Shoreline",
    accessRoads: "Alex-Matrouh Road markers",
    image: "/Masterplans/june.svg",
    keyCompounds: ["June SODIC (km 192)", "Hacienda Red (km 142)", "Salt (km 185)", "Seashore (km 181)"],
    kmRange: "Km 100 – 273",
  },
];
