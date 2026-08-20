// Lerp coastline anchors. km is measured from Alexandria westward along the coast road.
// Calibrated with strict monotonic longitude (East to West / Right to Left).
const anchors: Array<{ km: number; lat: number; lng: number }> = [
  { km: 0, lat: 31.2001, lng: 29.95 },
  { km: 45, lat: 30.985, lng: 29.58 },
  { km: 60, lat: 30.91, lng: 29.36 },
  { km: 75, lat: 30.88, lng: 29.18 },
  { km: 92, lat: 30.83, lng: 29.00 },
  { km: 100, lat: 30.832, lng: 28.94 },
  { km: 106, lat: 30.834, lng: 28.88 },
  { km: 108, lat: 30.836, lng: 28.86 },
  { km: 110, lat: 30.839, lng: 28.84 },
  { km: 120, lat: 30.87, lng: 28.78 },
  { km: 124, lat: 30.94, lng: 28.76 },
  { km: 126, lat: 30.97, lng: 28.74 },
  { km: 133, lat: 30.99, lng: 28.70 },
  { km: 136, lat: 30.996, lng: 28.67 },
  { km: 138, lat: 30.999, lng: 28.65 },
  { km: 140, lat: 31.005, lng: 28.63 },
  { km: 145, lat: 31.025, lng: 28.59 },
  { km: 150, lat: 31.035, lng: 28.52 },
  { km: 160, lat: 31.043, lng: 28.42 },
  { km: 165, lat: 31.045, lng: 28.37 },
  { km: 168, lat: 31.046, lng: 28.34 },
  { km: 170, lat: 31.048, lng: 28.32 },
  { km: 174, lat: 31.052, lng: 28.27 },
  { km: 178, lat: 31.058, lng: 28.23 },
  { km: 183, lat: 31.065, lng: 28.18 },
  { km: 185, lat: 31.068, lng: 28.15 },
  { km: 190, lat: 31.074, lng: 28.10 },
  { km: 193, lat: 31.076, lng: 28.08 },
  { km: 195, lat: 31.077, lng: 28.06 },
  { km: 197, lat: 31.078, lng: 28.04 },
  { km: 199, lat: 31.080, lng: 28.02 },
  { km: 200, lat: 31.083, lng: 28.01 },
  { km: 201, lat: 31.084, lng: 28.00 },
  { km: 202, lat: 31.085, lng: 27.99 },
  { km: 204, lat: 31.086, lng: 27.97 },
  { km: 205, lat: 31.087, lng: 27.96 },
  { km: 206, lat: 31.088, lng: 27.95 },
  { km: 207, lat: 31.089, lng: 27.94 },
  { km: 208, lat: 31.090, lng: 27.93 },
  { km: 211, lat: 31.093, lng: 27.90 },
  { km: 212, lat: 31.095, lng: 27.89 },
  { km: 214, lat: 31.098, lng: 27.87 },
  { km: 215, lat: 31.100, lng: 27.86 },
  { km: 220, lat: 31.105, lng: 27.81 },
  { km: 238, lat: 31.130, lng: 27.63 },
  { km: 240, lat: 31.135, lng: 27.61 },
  { km: 246, lat: 31.170, lng: 27.55 },
  { km: 247, lat: 31.175, lng: 27.53 },
  { km: 248, lat: 31.180, lng: 27.52 },
  { km: 250, lat: 31.190, lng: 27.50 },
  { km: 273, lat: 31.300, lng: 27.32 },
  { km: 275, lat: 31.310, lng: 27.25 },
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
