import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { CompoundCard } from "@/components/CompoundCard";
import { developerBySlug } from "@/data/developers";
import { compoundsByDeveloper } from "@/data/compounds";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/developers/$slug")({
  loader: ({ params }) => {
    const d = developerBySlug(params.slug);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Projects | PropTrack` },
      { name: "description", content: `${loaderData.blurb} Browse ${loaderData.count} projects by ${loaderData.name}.` },
      { property: "og:title", content: `${loaderData.name} | PropTrack` },
      { property: "og:description", content: loaderData.blurb },
    ] : [],
  }),
  component: DevPage,
});

function DevPage() {
  const d = Route.useLoaderData();
  const list = compoundsByDeveloper(d.slug);
  return (
    <Shell>
      <div className="border-b border-border/60 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
          <Link to="/developers" className="inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-accent">
            <ArrowLeft className="h-3.5 w-3.5" /> All developers
          </Link>
          <div className="mt-3 flex items-center gap-4">
            <img src={d.logo} alt={d.name} className="h-16 w-16 rounded-2xl border border-white/20" />
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight">{d.name}</h1>
              <p className="mt-1 text-sm text-primary-foreground/80">{d.count} projects on PropTrack</p>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">{d.blurb}</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((c) => <CompoundCard key={c.slug} c={c} />)}
        </div>
      </div>
    </Shell>
  );
}