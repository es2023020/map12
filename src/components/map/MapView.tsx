import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
  ZoomControl,
  LayersControl,
  ScaleControl,
  LayerGroup,
  Polygon,
} from "react-leaflet";
import L from "leaflet";

function MapClickEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}
import type { Compound } from "@/data/compounds";
import { destinations, destinationColor } from "@/data/destinations";
import { landmarks as allLandmarks, landmarkColors, type Landmark } from "@/data/landmarks";
import { availability } from "@/data/availability";
import {
  WIKIMAPIA_API_KEY,
  resolveWikimapiaLocation,
  wikimapiaLocations,
  getWikimapiaBoxPlaces,
  type WikimapiaPlace,
} from "@/lib/wikimapia";

// Override getTileUrl directly — Leaflet's {s} substitution doesn't work well
// for Wikimapia's numeric subdomain scheme (i0–i15), so we build the URL ourselves.
const WikimapiaTileLayerClass = L.TileLayer.extend({
  getTileUrl: function (coords: L.Coords) {
    const x = coords.x;
    const y = coords.y;
    const z = (this as any)._getZoomForUrl();
    const num = (((x % 4) + 4) % 4) + (((y % 4) + 4) % 4) * 4;
    return `https://i${num}.wikimapia.org/?x=${x}&y=${y}&zoom=${z}&type=&lng=0&key=${WIKIMAPIA_API_KEY}`;
  },
});

function CustomWikimapiaTileLayer({ opacity = 1.0 }: { opacity?: number }) {
  const map = useMap();
  useEffect(() => {
    const layer = new (WikimapiaTileLayerClass as any)("", {
      maxZoom: 19,
      opacity,
      attribution: '&copy; <a href="http://wikimapia.org" target="_blank" rel="noopener noreferrer">Wikimapia.org</a>',
    });
    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, opacity]);
  return null;
}


function getAvailableCount(slug: string): number {
  return availability.find((a) => a.slug === slug)?.totalAvailable ?? 0;
}

function projectIcon(c: Compound, active: boolean) {
  const color = destinationColor(c.destination);
  const avail = getAvailableCount(c.slug);
  const availBadge =
    avail > 0 ? `<span class="pt-dot-avail">${avail > 99 ? "99+" : avail}</span>` : "";
  const star = c.flagship ? `<span class="pt-dot-star">★</span>` : "";
  const sizeClass = active ? "pt-dot-lg" : "pt-dot-sm";
  const pulse = active ? `<div class="pt-dot-pulse"></div>` : "";
  const html = `<div class="pt-dot-wrap">
    ${pulse}
    <div class="pt-dot ${sizeClass} ${active ? "active" : ""}" style="background:${color}"></div>
    ${star}
    ${availBadge}
  </div>`;
  return L.divIcon({
    html,
    className: "pt-dot-icon",
    iconSize: active ? [28, 28] : [14, 14],
    iconAnchor: active ? [14, 14] : [7, 7],
  });
}

function FocusedProjectPolygon({ focused }: { focused: any }) {
  if (!focused) return null;
  const wmLoc = resolveWikimapiaLocation(focused.slug) || resolveWikimapiaLocation(focused.name);
  const polygon = wmLoc?.polygon || focused.polygon;
  if (!polygon || polygon.length <= 2) return null;

  const positions = polygon.map((p: any) => [p.y, p.x] as [number, number]);

  return (
    <Polygon
      positions={positions}
      pathOptions={{
        color: "#ea580c",
        fillColor: "#f97316",
        fillOpacity: 0.35,
        weight: 3.5,
        dashArray: "6, 6",
      }}
    >
      <Tooltip permanent direction="center" opacity={0.9}>
        <span style={{ fontWeight: 800, color: "#9a3412", fontSize: "11px" }}>📍 {focused.name} Plot</span>
      </Tooltip>
    </Polygon>
  );
}

function landmarkIcon(l: Landmark) {
  const color = landmarkColors[l.category];
  const html = `<div class="pt-lm"><span class="pt-lm-dot" style="background:${color}"></span><span class="pt-lm-label">${l.name}</span></div>`;
  return L.divIcon({ html, className: "pt-lm-icon", iconSize: [10, 10], iconAnchor: [5, 5] });
}

function FlyTo({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 1.0 });
  }, [center?.[0], center?.[1], zoom]); // eslint-disable-line
  return null;
}

type Props = {
  compounds: Compound[];
  initialCenter?: [number, number];
  initialZoom?: number;
  focus?: Compound | null;
  activeSlug?: string | null;
  onSelect?: (slug: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  showLandmarks?: boolean;
  landmarks?: Landmark[];
  className?: string;
};

export function MapView({
  compounds,
  initialCenter = [29.5, 31.0],
  initialZoom = 6,
  focus,
  activeSlug,
  onSelect,
  onMapClick,
  showLandmarks = true,
  landmarks: lmProp,
  className,
}: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const activeId = activeSlug ?? focus?.slug ?? null;
  const baseIcons = useMemo(
    () => new Map(compounds.map((c) => [c.slug, projectIcon(c, false)])),
    [compounds],
  );
  const activeIcon = useMemo(() => {
    if (!activeId) return null;
    const activeComp = compounds.find((c) => c.slug === activeId);
    return activeComp ? projectIcon(activeComp, true) : null;
  }, [activeId, compounds]);
  const lmList = lmProp ?? allLandmarks;
  const lmIcons = useMemo(() => new Map(lmList.map((l) => [l.id, landmarkIcon(l)])), [lmList]);
  const containerRef = useRef<HTMLDivElement>(null);

  // ⚠️ This useMemo MUST be above the early return — hooks must always run in the same order
  const rawFocused = focus ?? (activeId ? (compounds.find((c) => c.slug === activeId) ?? null) : null);
  const focused = useMemo(() => {
    if (!rawFocused) return null;
    const wmLoc = resolveWikimapiaLocation(rawFocused.slug) || resolveWikimapiaLocation(rawFocused.name);
    if (wmLoc) {
      return {
        ...rawFocused,
        lat: wmLoc.lat,
        lng: wmLoc.lng,
      };
    }
    return rawFocused;
  }, [rawFocused]);

  if (!ready) {
    return (
      <div ref={containerRef} className={className} style={{ background: "oklch(0.92 0.03 220)" }}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Loading map…
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <style>{`
        .pt-dot-avail {
          position: absolute;
          top: -7px;
          right: -9px;
          background: #f97316;
          color: #fff;
          font-size: 8px;
          font-weight: 700;
          border-radius: 99px;
          padding: 1px 3px;
          line-height: 1.3;
          white-space: nowrap;
          border: 1px solid white;
          z-index: 2;
        }
        .pt-popup-img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px 8px 0 0;
          display: block;
        }
        .pt-popup-body { padding: 10px 12px 12px; }
        .pt-popup-name { font-size: 13px; font-weight: 700; color: #1a2b3c; margin: 0 0 2px; line-height: 1.3; }
        .pt-popup-dev { font-size: 11px; color: #64748b; margin: 0 0 8px; }
        .pt-popup-stats { display: flex; gap: 10px; margin-bottom: 8px; }
        .pt-popup-stat { flex: 1; }
        .pt-popup-stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 1px; }
        .pt-popup-stat-value { font-size: 12px; font-weight: 600; color: #1a2b3c; }
        .pt-popup-avail { font-size: 11px; color: #16a34a; font-weight: 600; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 4px 8px; display: inline-block; margin-bottom: 8px; }
        .pt-popup-avail-none { font-size: 11px; color: #d97706; font-weight: 600; background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 4px 8px; display: inline-block; margin-bottom: 8px; }
        .pt-popup-types { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 8px; }
        .pt-popup-type { font-size: 10px; background: #f1f5f9; color: #475569; border-radius: 99px; padding: 2px 7px; font-weight: 500; }
        .pt-popup-btn { display: block; width: 100%; text-align: center; background: #1a2b3c; color: #fff; border-radius: 6px; padding: 7px 10px; font-size: 12px; font-weight: 600; text-decoration: none; margin-top: 4px; }
        .pt-popup-btn:hover { background: #2a3f55; }
        .leaflet-popup-content-wrapper { border-radius: 10px !important; padding: 0 !important; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; border: 1px solid #e2e8f0 !important; }
        .leaflet-popup-content { margin: 0 !important; width: 220px !important; }
        .leaflet-popup-tip-container { margin-top: -1px; }
        .pt-wm-pin { width: 12px; height: 12px; display: flex; align-items: center; justify-center: center; }
        .pt-wm-dot { width: 8px; height: 8px; background: #f97316; border: 1.5px solid #ffffff; border-radius: 99px; box-shadow: 0 0 6px rgba(249, 115, 22, 0.6); }
        @keyframes pt-pulse-beacon {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .pt-dot-pulse {
          position: absolute;
          top: -4px;
          left: -4px;
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background: #f97316;
          animation: pt-pulse-beacon 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <MapContainer
        center={focused ? [focused.lat, focused.lng] : initialCenter}
        zoom={focused ? Math.max(14, initialZoom) : initialZoom}
        zoomControl={false}
        scrollWheelZoom
        preferCanvas={false}
        style={{ height: "100%", width: "100%" }}
      >
        <MapClickEvents onMapClick={onMapClick} />
        <FocusedProjectPolygon focused={focused} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Wikimapia Hybrid">
            <LayerGroup>
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <CustomWikimapiaTileLayer opacity={0.85} />
            </LayerGroup>
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Wikimapia Only">
            <LayerGroup>
              <TileLayer
                attribution="&copy; OpenStreetMap &copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                subdomains={["a", "b", "c", "d"]}
                maxZoom={19}
              />
              <CustomWikimapiaTileLayer opacity={1.0} />
            </LayerGroup>
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Light Street Map">
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains={["a", "b", "c", "d"]}
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay name="Wikimapia Outlines &amp; Polygons" checked>
            <WikimapiaPlacesOverlay />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Project Markers &amp; Pins">
            <LayerGroup>
              {compounds.map((c) => {
                if (Number.isNaN(c.lat) || Number.isNaN(c.lng)) return null;
                const areaColor_ = destinationColor(c.destination);
                const avail = getAvailableCount(c.slug);
                const availStr =
                  avail > 0
                    ? `<div class="pt-popup-avail">✓ ${avail} units available</div>`
                    : `<div class="pt-popup-avail-none">⏳ Not updated yet</div>`;
                const typesHtml = (c.types ?? [])
                  .slice(0, 4)
                  .map((t: string) => `<span class="pt-popup-type">${t}</span>`)
                  .join("");
                const kmBadge = c.km
                  ? `<span style="display:inline-block; font-size:10px; background:#f0f9ff; color:#0369a1; border:1px solid #bae6fd; padding:1px 5px; border-radius:4px; font-weight:600; margin-left:6px; vertical-align:middle;">km ${c.km}</span>`
                  : "";
                const popupHtml = `
                  <img class="pt-popup-img" src="${c.hero}" alt="${c.name}" loading="lazy" />
                  <div class="pt-popup-body">
                    <p class="pt-popup-name">${c.name}${kmBadge}</p>
                    <p class="pt-popup-dev">${c.developer}</p>
                    <div class="pt-popup-stats">
                      <div class="pt-popup-stat">
                        <div class="pt-popup-stat-label">From</div>
                        <div class="pt-popup-stat-value">${c.priceFrom > 0 ? `EGP ${c.priceFrom}M` : "Price on Request"}</div>
                      </div>
                      <div class="pt-popup-stat">
                        <div class="pt-popup-stat-label">Delivery</div>
                        <div class="pt-popup-stat-value">${c.deliveryYear}</div>
                      </div>
                      <div class="pt-popup-stat">
                        <div class="pt-popup-stat-label">Status</div>
                        <div class="pt-popup-stat-value" style="color:${c.status === "RTM" ? "#16a34a" : "#2563eb"};font-size:10px;">${c.status}</div>
                      </div>
                    </div>
                    ${availStr}
                    <div class="pt-popup-types">${typesHtml}</div>
                    <a class="pt-popup-btn" href="/projects/${c.slug}">View full project →</a>
                  </div>
                `;

                return (
                  <Marker
                    key={c.slug}
                    position={[c.lat, c.lng]}
                    icon={
                      c.slug === activeId && activeIcon
                        ? activeIcon
                        : baseIcons.get(c.slug) || projectIcon(c, false)
                    }
                    eventHandlers={onSelect ? { click: () => onSelect(c.slug) } : undefined}
                  >
                    <Popup closeButton={true} maxWidth={220} minWidth={220}>
                      <div dangerouslySetInnerHTML={{ __html: popupHtml }} />
                    </Popup>
                    <Tooltip direction="top" offset={[0, -8]} opacity={0.96} permanent={c.slug === activeId}>
                      <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 1 }}>
                        {c.name} {c.km ? `(km ${c.km})` : ""}
                      </div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>
                        {c.priceFrom > 0 ? `EGP ${c.priceFrom}M+` : "Price on Request"}
                        {avail > 0 ? ` · ${avail} units avail.` : ""}
                      </div>
                    </Tooltip>
                  </Marker>
                );
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" metric imperial={false} />
        <FlyTo
          center={focused ? [focused.lat, focused.lng] : undefined}
          zoom={focused ? Math.max(14, initialZoom) : undefined}
        />

        {showLandmarks &&
          lmList.map((l) => {
            if (Number.isNaN(l.lat) || Number.isNaN(l.lng)) return null;
            return (
              <Marker
                key={l.id}
                position={[l.lat, l.lng]}
                icon={lmIcons.get(l.id)!}
                interactive={false}
                keyboard={false}
              />
            );
          })}
      </MapContainer>
    </div>
  );
}

function WikimapiaPlacesOverlay() {
  const map = useMap();
  const [bounds, setBounds] = useState(() => map.getBounds());
  const [zoom, setZoom] = useState(() => map.getZoom());

  useEffect(() => {
    const updateView = () => {
      setBounds(map.getBounds());
      setZoom(map.getZoom());
    };
    map.on("moveend", updateView);
    return () => {
      map.off("moveend", updateView);
    };
  }, [map]);

  if (zoom < 12) return null;

  const places = Object.values(wikimapiaLocations).filter((p: any) => {
    if (!p.lat || !p.lng) return false;
    return (
      p.lat >= bounds.getSouth() &&
      p.lat <= bounds.getNorth() &&
      p.lng >= bounds.getWest() &&
      p.lng <= bounds.getEast()
    );
  });

  return (
    <LayerGroup>
      {places.map((place: any) => {
        const positions = place.polygon?.map((p: any) => [p.y, p.x] as [number, number]);
        if (!positions || positions.length <= 2) return null;
        return (
          <Polygon
            key={place.id || place.name}
            positions={positions}
            pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.15, weight: 1.5 }}
          />
        );
      })}
    </LayerGroup>
  );
}

export { destinations };
