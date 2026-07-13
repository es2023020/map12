// Lerp coastline anchors. km is measured from Alexandria westward along the coast road.
// Calibrated using Google Maps, Wikimapia, Mapcarta, OpenStreetMap, and CompoundGate data (Jul 2026).
// High-confidence pinned anchors are marked with source. Others are interpolated from road geometry.
const anchors: Array<{ km: number; lat: number; lng: number }> = [
  { km: 0,   lat: 31.2001, lng: 29.9500 }, // Alexandria (Sidi Bishr)
  { km: 45,  lat: 30.9850, lng: 29.5800 }, // Abu Qir / El Agami coastal bend
  { km: 60,  lat: 30.9100, lng: 29.3600 }, // Sidi Kreir area
  { km: 75,  lat: 30.8800, lng: 29.1800 }, // El Nozha / Agami West
  { km: 92,  lat: 30.8300, lng: 28.9550 }, // Marina / Q Bay — road alignment verified
  { km: 100, lat: 30.8250, lng: 28.8650 }, // The Islands / Dayz area
  { km: 106, lat: 30.8320, lng: 28.8000 }, // North Edge Towers (New Alamein North)
  { km: 108, lat: 30.8340, lng: 28.7820 }, // Downtown New Alamein — verified
  { km: 110, lat: 30.8390, lng: 28.7600 }, // Lagoons Al Alamein
  { km: 120, lat: 30.8700, lng: 28.6800 }, // Plage / Stella area interpolation
  { km: 124, lat: 30.9458, lng: 28.7911 }, // Hacienda Bay — Wikimapia confirmed: 30°56'45"N 28°47'28"E
  { km: 126, lat: 30.9706, lng: 28.7486 }, // Marassi — Wikimapia confirmed: 30°58'14"N 28°44'55"E
  { km: 133, lat: 30.9900, lng: 28.6900 }, // Stella Heights interpolated
  { km: 136, lat: 30.9960, lng: 28.6710 }, // Amwaj interpolated
  { km: 138, lat: 30.9990, lng: 28.6620 }, // Hacienda White — Mapcarta confirmed: 30.99897°N, 28.66201°E
  { km: 140, lat: 31.0050, lng: 28.6420 }, // Telal interpolated
  { km: 145, lat: 31.0304, lng: 28.5916 }, // Ghazala Bay — mapping data: 31.030°N, 28.592°E
  { km: 150, lat: 31.0380, lng: 28.5200 }, // Ghazala Bay West interpolated
  { km: 160, lat: 31.0430, lng: 28.4100 }, // Al Dabaa coastal approach
  { km: 165, lat: 31.0450, lng: 28.3620 }, // D-Bay / La Vista Bay (Tatweer Misr) — km 165 Dabaa area
  { km: 168, lat: 31.0460, lng: 28.3300 }, // Hacienda Blue / Lasirena
  { km: 170, lat: 31.0480, lng: 28.3100 }, // Al Dabaa town
  { km: 174, lat: 31.0520, lng: 28.2700 }, // D.O.S.E / Waterway Al Dabaa
  { km: 178, lat: 31.0580, lng: 28.2300 }, // LVLS / Soul area
  { km: 183, lat: 31.0650, lng: 28.1750 }, // Sa'ada / Safia / Katameya Coast zone
  { km: 185, lat: 31.0680, lng: 28.1550 }, // Salt (Tatweer Misr) — est. km 185
  { km: 190, lat: 31.0740, lng: 28.1050 }, // Jefaira (Inertia) km 190 zone
  { km: 193, lat: 31.0760, lng: 28.0820 }, // Direction White / Cali Coast km 193
  { km: 195, lat: 31.0764, lng: 28.0650 }, // Seashell Ras El Hekma — Wikimapia: 31°4'35"N 28°3'54"E
  { km: 197, lat: 31.0774, lng: 28.0620 }, // Swan Lake — Mapcarta: 31.0787°N, 28.0609°E
  { km: 199, lat: 31.0790, lng: 28.0390 }, // Solare (Misr Italia) interpolated
  { km: 200, lat: 31.0830, lng: 28.0290 }, // Mountain View REH — Mapcarta: 31.08296°N, 28.02898°E
  { km: 201, lat: 31.0820, lng: 28.0270 }, // Caesar Bay / Koun interpolated
  { km: 202, lat: 31.0820, lng: 28.0250 }, // Caesar Sodic interpolated
  { km: 204, lat: 31.0840, lng: 28.0180 }, // La Vista Ras El Hekma interpolated
  { km: 205, lat: 31.0850, lng: 28.0140 }, // Ogami (SODIC) interpolated
  { km: 206, lat: 31.0860, lng: 28.0100 }, // Playa Seashell interpolated
  { km: 207, lat: 31.0870, lng: 28.0060 }, // Hyde Park North Seashore interpolated
  { km: 208, lat: 31.0880, lng: 28.0020 }, // Hacienda West interpolated
  { km: 211, lat: 31.0910, lng: 27.9860 }, // Fouka Bay — est. km 211
  { km: 212, lat: 31.0920, lng: 27.9800 }, // El Masyaf / Naia Bay interpolated
  { km: 214, lat: 31.0992, lng: 27.9225 }, // Azha North Coast — CompoundGate: 31.0992°N, 27.9225°E
  { km: 215, lat: 31.1010, lng: 27.9100 }, // Ramla (Marakez) interpolated
  { km: 220, lat: 31.1050, lng: 27.8700 }, // Modon Ras El Hekma interpolated
  { km: 238, lat: 31.1300, lng: 27.6200 }, // Hacienda Ras El Hekma (far west) — est. km 238
  { km: 240, lat: 31.1320, lng: 27.6050 }, // Ras El Hekma headland
  { km: 246, lat: 31.1700, lng: 27.5400 }, // Sky North / Summer (Sidi Heneish East) interpolated
  { km: 247, lat: 31.1750, lng: 27.5300 }, // Silversands interpolated
  { km: 248, lat: 31.1800, lng: 27.5200 }, // Hacienda Heneish interpolated
  { km: 250, lat: 31.1900, lng: 27.5000 }, // Almaza Bay interpolated
  { km: 273, lat: 31.3000, lng: 27.3200 }, // Jamila (Sidi Heneish) interpolated
  { km: 275, lat: 31.3100, lng: 27.3050 }, // Alam Al Roum / Sidi Heneish — est. from PDF
];

export function kmToLatLng(km: number): [number, number] {
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i], b = anchors[i + 1];
    if (km >= a.km && km <= b.km) {
      const t = (km - a.km) / (b.km - a.km);
      return [a.lat + (b.lat - a.lat) * t, a.lng + (b.lng - a.lng) * t];
    }
  }
  const last = anchors[anchors.length - 1];
  return [last.lat, last.lng];
}
