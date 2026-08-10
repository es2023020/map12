/**
 * Hardcoded brochure mapping: project slug → public brochure filename
 * All files are under /public/brochures/ and served at /brochures/<filename>
 *
 * RULES:
 * - Seashell has two distinct phase brochures - both are linked as separate phases
 * - Hacienda West has two duplicate files (Hacienda-West.pdf and Hacienda-West-Brochure.pdf) → prefer the simpler one
 * - marassi.pdf → Marassi North Coast  |  Marassi-Red-Sea-Brochure.pdf → Marassi Red Sea
 * - Beit-Al-Bahr-Brochure-June.pdf is a different project (Beit Al Bahr) not June SODIC
 */

export const brochureMap: Record<string, string> = {
  solana: "Solana.pdf",
  "solana-west": "Solana.pdf",
  "solana-east": "Solana.pdf",
  sarai: "Sarai.pdf",
  // ─── Cairo & West Cairo ──────────────────────────────────────────────
  "31-west": "31-west.pdf",
  "97-hills": "97-hills.pdf",
  badya: "badya.pdf",
  "bamboo-iii": "bamboo-iii.pdf",
  "belle-vie": "belle-vie.pdf",
  botanica: "botanica.pdf",
  "cairo-gate": "Cairo-Gate.pdf",
  "o-west": "O-west.pdf",
  "cairo-business-park": "cairo-business-park.pdf",
  "cleo-water-residence": "cleo Water Residences.pdf",
  dose: "DOSE.pdf",
  mivida: "Mivida.pdf",
  "mivida-gardens": "Mivida-Gardens.pdf",
  "uptown-cairo": "Uptown-Cairo.pdf",
  aeon: "aeon.pdf",
  "business-district": "business-district.pdf",
  safia: "Safia-Brochure-IL-Cazar.pdf",
  zoya: "zoya-brochure.pdf",

  // ─── New Cairo & East Cairo ──────────────────────────────────────────
  "at-east": "at-east.pdf",
  "grova-east-hills": "Grova Easthills.pdf",
  "new-capital-gardens": "New Capital Gardens brochure.pdf",
  "mountain-view-kingsway": "mountain-view-kingsway.pdf",
  "mountain-view-grand-valley": "mountain-view-grand-valley.pdf",
  seazen: "Seazen-brochure.pdf",

  // ─── North Coast – Sidi Heneish ──────────────────────────────────────
  "hacienda-heneish": "hacienda-heneish.pdf",
  jamila: "Jamila-Brochure.pdf",
  "marsa-baghush": "Marsa-Baghush-Brochure.pdf",

  // ─── North Coast – Ras El Hekma ─────────────────────────────────────
  amwaj: "Amwaj.pdf",
  "azha-north-coast": "Azha-North-ras-al-hekma-Madaar-Developments-Brochure.pdf",
  "caesar-bay": "Caesar-Bay-Residences-Brochure.pdf",
  "caesar-sodic": "Caesar-Bay-Residences-Brochure.pdf",
  "cali-coast-ras-el-hekma": "cali coast.pdf",
  "fouka-bay": "fouka-bay.pdf",
  gaia: "gaia.pdf",
  "hacienda-west": "Hacienda-West.pdf",
  "hassan-allam-swan-lake": "Hassan-Allam-SwanLake-North-C.pdf",
  "swan-lake": "Hassan-Allam-SwanLake-North-C.pdf",
  "hyde-park-north-seashore": "Hyde-park-seashore .pdf",
  jefaira: "jefaira.pdf",
  "katameya-coast": "katameya-coast.pdf",
  "la-vista-ras-el-hekma": "Lavista-Ras-Hikma.pdf",
  lvls: "LVLS_brochure.pdf",
  lyv: "Lyv-Brochure-.pdf",
  "marbay-ras-el-hekma": "marbay-brochure.pdf",
  marassi: "marassi.pdf",
  "mountain-view-ras-el-hekma": "Mountain-View-Ras-Elhikma.pdf",
  ogami: "ogami.pdf",
  "playa-seashell": "Playa-Brochure .pdf",
  salt: "Salt-Marina.pdf",
  "seashell-ras-el-hekma": "SEASHELL REH VILLAS brochure.pdf",
  solare: "solare.pdf",
  soul: "Soul.pdf",
  "the-c": "The-C-Brochure.pdf",
  "the-med": "The-Mediterranean-Two-Storey-Villas-Brochure.pdf",
  youd: "youd.pdf",
  "beit-al-bahr": "Beit-Al-Bahr-Brochure-June.pdf",

  // ─── North Coast – Sidi Abdelrahman ──────────────────────────────────
  "hacienda-bay": "Hacienda-Blue.pdf",
  "hacienda-waters": "hacienda-waters.pdf",
  "palm-hills-new-alamein": "palm-hills-new alamen.pdf",
  "the-waterway-north-coast": "The-Waterway-North-Coast-brochure.pdf",

  // ─── Ain Sokhna / Red Sea ────────────────────────────────────────────
  "azzar-island": "AZZAR-Islands.pdf",
  "el-masyaf": "Masyaf-brochure.pdf",
  "telal-east": "Telal-East-Roya.pdf",
  "marassi-red-sea": "Marassi-Red-Sea-Brochure.pdf",

  // ─── Silvertown / Silversands ────────────────────────────────────────
  silversands: "silvertown-lagoon-cabanas.pdf",
  "silver-town": "silvertown-lagoon-cabanas.pdf",
  "silvertown-lagoon-cabanas": "silvertown-lagoon-cabanas.pdf",

  // ─── Sa'ada North Coast ──────────────────────────────────────────────
  saada: "saada sa7el.pdf",
  "saada-sahel": "saada sa7el.pdf",
  "saada-north-coast": "saada sa7el.pdf",
  "sa-ada-sahel": "saada sa7el.pdf",

  // ─── D-Bay ───────────────────────────────────────────────────────────
  "d-bay": "Tatweer-Misr-D-bay.pdf",

  // ─── La Vista Bay East ───────────────────────────────────────────────
  "la-vista-bay-east": "lavista Bay-east-brochure-v07-2022.pdf",

  // ─── Seashell ────────────────────────────────────────────────────────
  seashell: "SEASHELL REH LAGOON CHALET  brochure.pdf",
};
