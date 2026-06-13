import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { Link } from "@tanstack/react-router";
import type { Compound } from "@/data/compounds";
import { areas } from "@/data/areas";

function makeIcon(c: Compound) {
  const cls = c.beachfront ? "pt-pin beach" : "pt-pin";
  const html = `<div class="${cls}"><span class="dot"></span><span>${c.name}</span></div>`;
  return L.divIcon({ html, className: "", iconSize: [10, 10], iconAnchor: [5, 5] });
}

function FlyTo({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.9 });
  }, [center?.[0], center?.[1], zoom]); // eslint-disable-line
  return null;
}

type Props = {
  compounds: Compound[];
  initialCenter?: [number, number];
  initialZoom?: number;
  focus?: Compound | null;
  className?: string;
};

export function MapView({ compounds, initialCenter = [30.95, 28.8], initialZoom = 9, focus, className }: Props) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const icons = useMemo(() => new Map(compounds.map((c) => [c.slug, makeIcon(c)])), [compounds]);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!ready) {
    return (
      <div ref={containerRef} className={className} style={{ background: "oklch(0.92 0.03 220)" }}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={focus ? [focus.lat, focus.lng] : initialCenter}
        zoom={focus ? 13 : initialZoom}
        zoomControl={false}
        scrollWheelZoom
        preferCanvas
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> · &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <ZoomControl position="bottomright" />
        <FlyTo center={focus ? [focus.lat, focus.lng] : undefined} zoom={focus ? 14 : undefined} />
        {compounds.map((c) => (
          <Marker key={c.slug} position={[c.lat, c.lng]} icon={icons.get(c.slug)!}>
            <Popup closeButton={false}>
              <div className="w-full">
                <div className="relative h-28 w-full overflow-hidden">
                  <img src={c.hero} alt={c.name} className="h-full w-full object-cover" />
                  {c.beachfront && (
                    <span className="absolute left-2 top-2 rounded-full bg-sunset px-2 py-0.5 text-[10px] font-semibold text-white">Beachfront</span>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-display text-base font-semibold leading-tight text-primary">{c.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {c.developer} {c.km ? `· km ${c.km}` : ""}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-sm font-semibold text-primary">From EGP {c.priceFrom}M</span>
                    <Link to="/projects/$slug" params={{ slug: c.slug }}
                      className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground hover:bg-primary/90">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export { areas };