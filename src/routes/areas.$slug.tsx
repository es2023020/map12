import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { CompoundCard } from "@/components/CompoundCard";
import { areaBySlug } from "@/data/areas";
import { compoundsByArea } from "@/data/compounds";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const a = areaBySlug(params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Compounds & Map | PropTrack` },
      { name: "description", content: `${loaderData.blurb} Browse every compound in ${loaderData.name} on PropTrack.` },
      { property: "og:title", content: `${loaderData.name} | PropTrack` },
      { property: "og:description", content: loaderData.blurb },
      { property: "og:image", content: loaderData.hero },
    ] : [],
  }),
  component: AreaPage,
});

function AreaPage() {
  const a = Route.useLoaderData();
  const list = compoundsByArea(a.slug);

  return (
    <Shell>
      <div className="relative h-[300px] overflow-hidden">
        <img src={a.hero} alt={a.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 text-primary-foreground lg:px-8">
          <Link to="/areas" className="inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> All areas
          </Link>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">{a.name}</h1>
          <p className="mt-1 text-primary-foreground/80">{a.kmRange ?? "Greater Cairo"} · {list.length} projects</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="max-w-3xl text-foreground/80">{a.blurb}</p>

        <div className="mt-8 h-[480px] overflow-hidden rounded-3xl border border-border">
          <MapClient compounds={list} initialCenter={a.center} initialZoom={a.zoom} showLandmarks className="h-full w-full" />
        </div>

        <h2 className="mt-12 font-display text-2xl font-semibold text-primary">All {list.length} projects in {a.name}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => <CompoundCard key={c.slug} c={c} />)}
        </div>
      </div>
    </Shell>
  );
}