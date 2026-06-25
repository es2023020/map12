import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, ZoomControl, LayersControl, ScaleControl, LayerGroup } from "react-leaflet";
import L from "leaflet";
import type { Compound } from "@/data/compounds";
import { destinations, destinationColor } from "@/data/destinations";
import { landmarks as allLandmarks, landmarkColors, type Landmark } from "@/data/landmarks";
import { availability } from "@/data/availability";

function getAvailableCount(slug: string): number {
  return availability.find((a) => a.slug === slug)?.totalAvailable ?? 0;
}

function projectIcon(c: Compound, active: boolean) {
  const color = destinationColor(c.destination);
  const avail = getAvailableCount(c.slug);
  const availBadge = avail > 0
    ? `<span class="pt-dot-avail">${avail > 99 ? "99+" : avail}</span>`
    : "";
  const star = c.flagship ? `<span class="pt-dot-star">★</span>` : "";
  const sizeClass = active ? "pt-dot-lg" : "pt-dot-sm";
  const html = `<div class="pt-dot-wrap">
    <div class="pt-dot ${sizeClass} ${active ? "active" : ""}" style="background:${color}"></div>
    ${star}
    ${availBadge}
  </div>`;
  return L.divIcon({
    html,
    className: "pt-dot-icon",
    iconSize: active ? [22, 22] : [14, 14],
    iconAnchor: active ? [11, 11] : [7, 7],
  });
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
  showLandmarks = true,
  landmarks: lmProp,
  className,
}: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const activeId = activeSlug ?? focus?.slug ?? null;
  const icons = useMemo(
    () => new Map(compounds.map((c) => [c.slug, projectIcon(c, c.slug === activeId)])),
    [compounds, activeId],
  );
  const lmList = lmProp ?? allLandmarks;
  const lmIcons = useMemo(() => new Map(lmList.map((l) => [l.id, landmarkIcon(l)])), [lmList]);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!ready) {
    return (
      <div ref={containerRef} className={className} style={{ background: "oklch(0.92 0.03 220)" }}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>
      </div>
    );
  }

  const focused = focus ?? (activeId ? compounds.find((c) => c.slug === activeId) ?? null : null);

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
        .pt-popup-types { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 8px; }
        .pt-popup-type { font-size: 10px; background: #f1f5f9; color: #475569; border-radius: 99px; padding: 2px 7px; font-weight: 500; }
        .pt-popup-btn { display: block; width: 100%; text-align: center; background: #1a2b3c; color: #fff; border-radius: 6px; padding: 7px 10px; font-size: 12px; font-weight: 600; text-decoration: none; margin-top: 4px; }
        .pt-popup-btn:hover { background: #2a3f55; }
        .leaflet-popup-content-wrapper { border-radius: 10px !important; padding: 0 !important; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; border: 1px solid #e2e8f0 !important; }
        .leaflet-popup-content { margin: 0 !important; width: 220px !important; }
        .leaflet-popup-tip-container { margin-top: -1px; }
      `}</style>
      <MapContainer
        center={focused ? [focused.lat, focused.lng] : initialCenter}
        zoom={focused ? Math.max(13, initialZoom) : initialZoom}
        zoomControl={false}
        scrollWheelZoom
        preferCanvas={false}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Streets">
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains={["a", "b", "c", "d"]}
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite Hybrid">
            <LayerGroup>
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                attribution="&copy; CARTO"
                url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                subdomains={["a", "b", "c", "d"]}
                maxZoom={19}
              />
            </LayerGroup>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light">
            <TileLayer
              attribution="&copy; OpenStreetMap &copy; CARTO"
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              subdomains={["a", "b", "c", "d"]}
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" metric imperial={false} />
        <FlyTo center={focused ? [focused.lat, focused.lng] : undefined} zoom={focused ? Math.max(14, initialZoom) : undefined} />

        {showLandmarks && lmList.map((l) => {
          if (Number.isNaN(l.lat) || Number.isNaN(l.lng)) return null;
          return (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={lmIcons.get(l.id)!} interactive={false} keyboard={false} />
          );
        })}

        {compounds.map((c) => {
          if (Number.isNaN(c.lat) || Number.isNaN(c.lng)) return null;
          const areaColor_ = destinationColor(c.destination);
          const avail = getAvailableCount(c.slug);
          const availStr = avail > 0 ? `<div class="pt-popup-avail">✓ ${avail} units available</div>` : "";
          const typesHtml = (c.types ?? []).slice(0, 4).map((t: string) =>
            `<span class="pt-popup-type">${t}</span>`
          ).join("");
          const kmBadge = c.km ? `<span style="display:inline-block; font-size:10px; background:#f0f9ff; color:#0369a1; border:1px solid #bae6fd; padding:1px 5px; border-radius:4px; font-weight:600; margin-left:6px; vertical-align:middle;">km ${c.km}</span>` : "";
          const popupHtml = `
            <img class="pt-popup-img" src="${c.hero}" alt="${c.name}" loading="lazy" />
            <div class="pt-popup-body">
              <p class="pt-popup-name">${c.name}${kmBadge}</p>
              <p class="pt-popup-dev">${c.developer}</p>
              <div class="pt-popup-stats">
                <div class="pt-popup-stat">
                  <div class="pt-popup-stat-label">From</div>
                  <div class="pt-popup-stat-value">EGP ${c.priceFrom}M</div>
                </div>
                <div class="pt-popup-stat">
                  <div class="pt-popup-stat-label">Delivery</div>
                  <div class="pt-popup-stat-value">${c.deliveryYear}</div>
                </div>
                <div class="pt-popup-stat">
                  <div class="pt-popup-stat-label">Status</div>
                  <div class="pt-popup-stat-value" style="color:${c.status === 'Delivered' ? '#16a34a' : c.status === 'Under Construction' ? '#d97706' : '#2563eb'};font-size:10px;">${c.status}</div>
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
              icon={icons.get(c.slug)!}
              eventHandlers={onSelect ? { click: () => onSelect(c.slug) } : undefined}
            >
              <Popup closeButton={true} maxWidth={220} minWidth={220}>
                <div dangerouslySetInnerHTML={{ __html: popupHtml }} />
              </Popup>
              <Tooltip
                direction="top"
                offset={[0, -8]}
                opacity={0.96}
                permanent={false}
              >
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 1 }}>
                  {c.name} {c.km ? `(km ${c.km})` : ""}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>EGP {c.priceFrom}M+{avail > 0 ? ` · ${avail} units avail.` : ""}</div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export { destinations };
