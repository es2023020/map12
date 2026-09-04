import wikimapiaLocationsRaw from "@/data/wikimapia-locations.json";

export const WIKIMAPIA_API_KEY = "3F982F58-7F9183CE-7062C621-4D295418-CAED2D59-CB05F1E2-22EEB064-1E90E75";
export const WIKIMAPIA_TILE_URL = `https://i{s}.wikimapia.org/?x={x}&y={y}&zoom={z}&type=&lng=0&key=${WIKIMAPIA_API_KEY}`;
export const WIKIMAPIA_SUBDOMAINS = Array.from({ length: 16 }, (_, i) => String(i));

export interface WikimapiaPlace {
  id: number;
  name: string;
  url?: string;
  location: {
    north: number;
    south: number;
    east: number;
    west: number;
    lat: number;
    lon: number;
  };
  polygon?: Array<{ x: number; y: number }>;
  description?: string;
}

/**
 * Calculates official Wikimapia tile host i[NUM].wikimapia.org
 * Algorithm: NUM = (X % 4) + (Y % 4) * 4
 */
export function getWikimapiaTileUrl(x: number, y: number, z: number): string {
  const num = (((x % 4) + 4) % 4) + (((y % 4) + 4) % 4) * 4;
  return `https://i${num}.wikimapia.org/?x=${x}&y=${y}&zoom=${z}&type=&lng=0&key=${WIKIMAPIA_API_KEY}`;
}

export const wikimapiaLocations = wikimapiaLocationsRaw as Record<string, any>;

/**
 * Resolve project slug or name to exact Wikimapia location metadata
 */
export function resolveWikimapiaLocation(query: string): { lat: number; lng: number; name?: string; url?: string; polygon?: Array<{ x: number; y: number }> } | null {
  if (!query) return null;
  const clean = query.toLowerCase().trim().replace(/-/g, " ");
  
  // 1. Direct match in Wikimapia dictionary
  for (const [key, val] of Object.entries(wikimapiaLocations)) {
    if (key.includes(clean) || clean.includes(key)) {
      return {
        lat: val.lat,
        lng: val.lng,
        name: val.name,
        url: val.url,
        polygon: val.polygon,
      };
    }
  }
  return null;
}

/**
 * Fetch Wikimapia places within a bounding box
 */
export async function getWikimapiaBoxPlaces(bbox: {
  lon_min: number;
  lat_min: number;
  lon_max: number;
  lat_max: number;
}, count = 30): Promise<WikimapiaPlace[]> {
  try {
    const url = `https://api.wikimapia.org/?function=box&bbox=${bbox.lon_min},${bbox.lat_min},${bbox.lon_max},${bbox.lat_max}&format=json&count=${count}&key=${WIKIMAPIA_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (data && Array.isArray(data.folder)) {
      return data.folder.map((item: any) => ({
        id: Number(item.id),
        name: item.name,
        url: item.url,
        location: item.location,
        polygon: item.polygon,
      }));
    }
  } catch (err) {
    console.error("Error fetching Wikimapia box places:", err);
  }
  return [];
}

/**
 * Search Wikimapia places by text query
 */
export async function searchWikimapiaPlaces(
  query: string,
  lat = 30.0444,
  lon = 31.2357,
  count = 10,
): Promise<WikimapiaPlace[]> {
  try {
    const url = `https://api.wikimapia.org/?function=place.search&q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&format=json&count=${count}&key=${WIKIMAPIA_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        id: Number(item.id),
        name: item.title || item.name,
        url: item.urlhtml ? `http://wikimapia.org/${item.id}` : undefined,
        location: {
          north: item.location?.north || item.lat || lat,
          south: item.location?.south || item.lat || lat,
          east: item.location?.east || item.lon || lon,
          west: item.location?.west || item.lon || lon,
          lat: item.location?.lat || item.lat || lat,
          lon: item.location?.lon || item.lon || lon,
        },
        description: item.description,
      }));
    }
  } catch (err) {
    console.error("Error searching Wikimapia places:", err);
  }
  return [];
}

/**
 * Fetch detailed place info by Wikimapia ID
 */
export async function getWikimapiaPlaceDetails(id: number): Promise<any | null> {
  try {
    const url = `https://api.wikimapia.org/?function=place.getbyid&id=${id}&format=json&key=${WIKIMAPIA_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching Wikimapia place details:", err);
    return null;
  }
}
