// Lerp coastline anchors. km is measured from Alexandria westward along the coast road.
// Calibrated to align pins perfectly with the physical coastal road (Route 60) and beach resorts.
// This prevents markers from rendering inside the Mediterranean Sea or deep in the southern desert.
const anchors: Array<{ km: number; lat: number; lng: number }> = [
  { km: 0,   lat: 31.200, lng: 29.950 }, // Alexandria
  { km: 60,  lat: 30.900, lng: 29.350 },
  { km: 92,  lat: 30.825, lng: 28.950 }, // Marina / Q Bay road alignment
  { km: 100, lat: 30.825, lng: 28.860 }, // Dayz / The Islands road alignment
  { km: 108, lat: 30.832, lng: 28.757 }, // New Alamein road alignment
  { km: 124, lat: 30.887, lng: 28.615 }, // Hacienda Bay
  { km: 126, lat: 30.893, lng: 28.597 }, // Marassi
  { km: 133, lat: 30.905, lng: 28.532 }, // Stella Heights / La Vista Cascada
  { km: 136, lat: 30.915, lng: 28.505 }, // Amwaj
  { km: 138, lat: 30.920, lng: 28.486 }, // Hacienda White
  { km: 145, lat: 30.932, lng: 28.421 }, // Ghazala Bay / Zoya
  { km: 166, lat: 30.995, lng: 28.219 }, // D-Bay
  { km: 170, lat: 31.012, lng: 28.180 }, // Al Dabaa area
  { km: 190, lat: 31.075, lng: 27.970 }, // Jefaira
  { km: 200, lat: 31.108, lng: 27.872 }, // Mountain View RHK / Lyv
  { km: 210, lat: 31.140, lng: 27.758 }, // Fouka Bay
  { km: 220, lat: 31.170, lng: 27.676 }, // Modon Ras El Hekma
  { km: 238, lat: 31.228, lng: 27.498 }, // Hacienda Ras El Hekma
  { km: 240, lat: 31.238, lng: 27.480 }, // Ras El Hekma headland
  { km: 250, lat: 31.220, lng: 27.402 }, // Almaza Bay
  { km: 275, lat: 31.320, lng: 27.230 }, // Sidi Heneish / Alam Al Roum
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
