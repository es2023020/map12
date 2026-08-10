// Lerp coastline anchors. km is measured from Alexandria westward along the coast road.
// Calibrated using Google Maps, Wikimapia, Mapcarta, OpenStreetMap, and CompoundGate data (Jul 2026).
// High-confidence pinned anchors are marked with source. Others are interpolated from road geometry.
const anchors: Array<{ km: number; lat: number; lng: number }> = [
  { km: 0, lat: 31.2001, lng: 29.95 }, // Alexandria (Sidi Bishr)
  { km: 45, lat: 30.985, lng: 29.58 }, // Abu Qir / El Agami coastal bend
  { km: 60, lat: 30.91, lng: 29.36 }, // Sidi Kreir area
  { km: 75, lat: 30.88, lng: 29.18 }, // El Nozha / Agami West
  { km: 92, lat: 30.83, lng: 28.955 }, // Marina / Q Bay — road alignment verified
  { km: 100, lat: 30.825, lng: 28.865 }, // The Islands / Dayz area
  { km: 106, lat: 30.832, lng: 28.8 }, // North Edge Towers (New Alamein North)
  { km: 108, lat: 30.834, lng: 28.782 }, // Downtown New Alamein — verified
  { km: 110, lat: 30.839, lng: 28.76 }, // Lagoons Al Alamein
  { km: 120, lat: 30.87, lng: 28.68 }, // Plage / Stella area interpolation
  { km: 124, lat: 30.9458, lng: 28.7911 }, // Hacienda Bay — Wikimapia confirmed: 30°56'45"N 28°47'28"E
  { km: 126, lat: 30.9706, lng: 28.7486 }, // Marassi — Wikimapia confirmed: 30°58'14"N 28°44'55"E
  { km: 133, lat: 30.99, lng: 28.69 }, // Stella Heights interpolated
  { km: 136, lat: 30.996, lng: 28.671 }, // Amwaj interpolated
  { km: 138, lat: 30.999, lng: 28.662 }, // Hacienda White — Mapcarta confirmed: 30.99897°N, 28.66201°E
  { km: 140, lat: 31.005, lng: 28.642 }, // Telal interpolated
  { km: 145, lat: 31.0304, lng: 28.5916 }, // Ghazala Bay — mapping data: 31.030°N, 28.592°E
  { km: 150, lat: 31.038, lng: 28.52 }, // Ghazala Bay West interpolated
  { km: 160, lat: 31.043, lng: 28.41 }, // Al Dabaa coastal approach
  { km: 165, lat: 31.045, lng: 28.362 }, // D-Bay / La Vista Bay (Tatweer Misr) — km 165 Dabaa area
  { km: 168, lat: 31.046, lng: 28.33 }, // Hacienda Blue / Lasirena
  { km: 170, lat: 31.048, lng: 28.31 }, // Al Dabaa town
  { km: 174, lat: 31.052, lng: 28.27 }, // D.O.S.E / Waterway Al Dabaa
  { km: 178, lat: 31.058, lng: 28.23 }, // LVLS / Soul area
  { km: 183, lat: 31.065, lng: 28.175 }, // Sa'ada / Safia / Katameya Coast zone
  { km: 185, lat: 31.068, lng: 28.155 }, // Salt (Tatweer Misr) — est. km 185
  { km: 190, lat: 31.074, lng: 28.105 }, // Jefaira (Inertia) km 190 zone
  { km: 193, lat: 31.076, lng: 28.082 }, // Direction White / Cali Coast km 193
  { km: 195, lat: 31.0764, lng: 28.065 }, // Seashell Ras El Hekma — Wikimapia: 31°4'35"N 28°3'54"E
  { km: 197, lat: 31.0774, lng: 28.062 }, // Swan Lake — Mapcarta: 31.0787°N, 28.0609°E
  { km: 199, lat: 31.079, lng: 28.039 }, // Solare (Misr Italia) interpolated
  { km: 200, lat: 31.083, lng: 28.029 }, // Mountain View REH — Mapcarta: 31.08296°N, 28.02898°E
  { km: 201, lat: 31.082, lng: 28.027 }, // Caesar Bay / Koun interpolated
  { km: 202, lat: 31.082, lng: 28.025 }, // Caesar Sodic interpolated
  { km: 204, lat: 31.084, lng: 28.018 }, // La Vista Ras El Hekma interpolated
  { km: 205, lat: 31.085, lng: 28.014 }, // Ogami (SODIC) interpolated
  { km: 206, lat: 31.086, lng: 28.01 }, // Playa Seashell interpolated
  { km: 207, lat: 31.087, lng: 28.006 }, // Hyde Park North Seashore interpolated
  { km: 208, lat: 31.088, lng: 28.002 }, // Hacienda West interpolated
  { km: 211, lat: 31.067, lng: 27.917 }, // Fouka Bay — est. km 211
  { km: 212, lat: 31.092, lng: 27.98 }, // El Masyaf / Naia Bay interpolated
  { km: 214, lat: 31.0992, lng: 27.9225 }, // Azha North Coast — CompoundGate: 31.0992°N, 27.9225°E
  { km: 215, lat: 31.101, lng: 27.91 }, // Ramla (Marakez) interpolated
  { km: 220, lat: 31.105, lng: 27.87 }, // Modon Ras El Hekma interpolated
  { km: 238, lat: 31.13, lng: 27.62 }, // Hacienda Ras El Hekma (far west) — est. km 238
  { km: 240, lat: 31.132, lng: 27.605 }, // Ras El Hekma headland
  { km: 246, lat: 31.17, lng: 27.54 }, // Sky North / Summer (Sidi Heneish East) interpolated
  { km: 247, lat: 31.175, lng: 27.53 }, // Silversands interpolated
  { km: 248, lat: 31.18, lng: 27.52 }, // Hacienda Heneish interpolated
  { km: 250, lat: 31.19, lng: 27.5 }, // Almaza Bay interpolated
  { km: 273, lat: 31.3, lng: 27.32 }, // Jamila (Sidi Heneish) interpolated
  { km: 275, lat: 31.31, lng: 27.305 }, // Alam Al Roum / Sidi Heneish — est. from PDF
];

export function kmToLatLng(km: number): [number, number] {
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i],
      b = anchors[i + 1];
    if (km >= a.km && km <= b.km) {
      const t = (km - a.km) / (b.km - a.km);
      return [a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t];
    }
  }
  const last = anchors[anchors.length - 1];
  return [last.lat, last.lng];
}
