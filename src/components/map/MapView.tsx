import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, LayersControl } from "react-leaflet";
import L from "leaflet";
import type { Compound } from "@/data/compounds";
import { areas, areaColor } from "@/data/areas";
import { landmarks as allLandmarks, landmarkColors, type Landmark } from "@/data/landmarks";

function projectIcon(c: Compound, active: boolean) {
  const color = areaColor(c.area);
  const star = c.flagship ? `<span class="pt-dot-star">★</span>` : "";
  const html = `<div class="pt-dot-wrap"><div class="pt-dot ${active ? "active" : ""}" style="background:${color}"></div>${star}</div>`;
  return L.divIcon({
    html,
    className: "pt-dot-icon",
    iconSize: active ? [20, 20] : [14, 14],
    iconAnchor: active ? [10, 10] : [7, 7],
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
      <MapContainer
        center={focused ? [focused.lat, focused.lng] : initialCenter}
        zoom={focused ? Math.max(13, initialZoom) : initialZoom}
        zoomControl={false}
        scrollWheelZoom
        preferCanvas
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> · &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        <FlyTo center={focused ? [focused.lat, focused.lng] : undefined} zoom={focused ? Math.max(14, initialZoom) : undefined} />
        {showLandmarks && lmList.map((l) => {
          if (Number.isNaN(l.lat) || Number.isNaN(l.lng)) return null;
          return (
            <Marker key={l.id} position={[l.lat, l.lng]} icon={lmIcons.get(l.id)!} interactive={false} keyboard={false} />
          );
        })}
        {compounds.map((c) => {
          if (Number.isNaN(c.lat) || Number.isNaN(c.lng)) return null;
          return (
            <Marker
              key={c.slug}
              position={[c.lat, c.lng]}
              icon={icons.get(c.slug)!}
              eventHandlers={onSelect ? { click: () => onSelect(c.slug) } : undefined}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}

export { areas };