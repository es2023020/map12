import { lazy, Suspense, useEffect, useState } from "react";
import type { ComponentProps } from "react";

const MapView = lazy(() => import("./MapView").then((m) => ({ default: m.MapView })));

export function MapClient(props: ComponentProps<typeof MapView>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className={props.className} style={{ background: "oklch(0.92 0.03 220)" }}>
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading map…</div>
      </div>
    );
  }
  return (
    <Suspense fallback={<div className={props.className} style={{ background: "oklch(0.92 0.03 220)" }} />}>
      <MapView {...props} />
    </Suspense>
  );
}