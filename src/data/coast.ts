// Lerp coastline anchors. km is measured from Alexandria westward along the coast road.
// These anchors are calibrated against well-known compound locations.
const anchors: Array<{ km: number; lat: number; lng: number }> = [
  { km: 0, lat: 31.200, lng: 29.950 }, // Alexandria
  { km: 60, lat: 30.900, lng: 29.350 },
  { km: 92, lat: 30.830, lng: 28.950 }, // Marina
  { km: 108, lat: 30.860, lng: 28.760 }, // New Alamein
  { km: 126, lat: 30.890, lng: 28.595 }, // Marassi / Sidi Abdelrahman
  { km: 145, lat: 30.940, lng: 28.420 }, // Ghazala Bay
  { km: 170, lat: 31.020, lng: 28.180 }, // Dabaa
  { km: 190, lat: 31.090, lng: 27.970 }, // Jefaira
  { km: 210, lat: 31.150, lng: 27.770 }, // Fouka
  { km: 240, lat: 31.260, lng: 27.480 }, // Ras El Hekma headland
  { km: 275, lat: 31.345, lng: 27.230 }, // Sidi Heneish / Alam Roum
];

export function kmToLatLng(km: number): [number, number] {
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i], b = anchors[i + 1];
    if (km >= a.km && km <= b.km) {
      const t = (km - a.km) / (b.km - a.km);
      // Compounds are pinned just inland of the actual coast, with deterministic jitter.
      const jitterLat = ((km * 9301 + 49297) % 233280) / 233280 * 0.012 - 0.006;
      const jitterLng = ((km * 1103 + 12345) % 233280) / 233280 * 0.012 - 0.006;
      return [a.lat + (b.lat - a.lat) * t + jitterLat, a.lng + (b.lng - a.lng) * t + jitterLng];
    }
  }
  const last = anchors[anchors.length - 1];
  return [last.lat, last.lng];
}