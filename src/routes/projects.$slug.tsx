import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compoundBySlug, compoundsByArea, compounds } from "@/data/compounds";
import { areaBySlug } from "@/data/areas";
import { developerBySlug } from "@/data/developers";
import { CompoundCard } from "@/components/CompoundCard";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Waves, Calendar, Building2, Wallet, Ruler, Check, ArrowLeft, Phone } from "lucide-react";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const c = compoundBySlug(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ${loaderData.developer} | PropTrack` },
          { name: "description", content: loaderData.blurb },
          { property: "og:title", content: `${loaderData.name} | PropTrack` },
          { property: "og:description", content: loaderData.blurb },
          { property: "og:image", content: loaderData.hero },
        ]
      : [],
  }),
  component: CompoundPage,
});

function CompoundPage() {
  const c = Route.useLoaderData();
  const area = areaBySlug(c.area);
  const dev = developerBySlug(c.developerSlug);
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const addRecent = useStore((s) => s.addRecent);
  useEffect(() => { addRecent(c.slug); }, [c.slug, addRecent]);

  const related = compoundsByArea(c.area).filter((x) => x.slug !== c.slug).slice(0, 4);

  return (
    <Shell>
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5" /> All projects
          </Link>
        </div>
      </div>

      {/* Hero gallery */}
      <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <div className="grid h-[420px] gap-2 overflow-hidden rounded-3xl md:grid-cols-4 md:grid-rows-2">
          <img src={c.gallery[0] ?? c.hero} alt={c.name} className="h-full w-full object-cover md:col-span-2 md:row-span-2" />
          {c.gallery.slice(1, 5).map((g: string, i: number) => (
            <img key={i} src={g} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {c.beachfront && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sunset px-2.5 py-1 text-xs font-semibold text-white">
                <Waves className="h-3 w-3" /> Beachfront
              </span>
            )}
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">{c.status}</span>
            <span className="text-xs text-muted-foreground">{area?.name}{c.km ? ` · km ${c.km}` : ""}</span>
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-primary md:text-5xl">{c.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">by <Link to="/developers/$slug" params={{ slug: c.developerSlug }} className="font-medium text-primary hover:text-accent">{c.developer}</Link></p>
          <p className="mt-5 max-w-2xl leading-relaxed text-foreground/80">{c.blurb}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <Stat icon={Wallet} label="Starting from" value={`EGP ${c.priceFrom}M`} />
            <Stat icon={Calendar} label="Delivery" value={String(c.deliveryYear)} />
            <Stat icon={Ruler} label="Unit sizes" value={c.unitSizes ?? "—"} />
            <Stat icon={Building2} label="Project size" value={c.areaSize ?? "—"} />
          </div>

          {/* Unit types */}
          <Section title="Unit types">
            <div className="flex flex-wrap gap-2">
              {c.types.map((t: string) => (
                <span key={t} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm">{t}</span>
              ))}
            </div>
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <ul className="grid gap-2 sm:grid-cols-2">
              {c.amenities.map((a: string) => (
                <li key={a} className="inline-flex items-center gap-2 text-sm text-foreground/80">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </Section>

          {/* Payment plan */}
          <Section title="Payment plan">
            <div className="rounded-2xl border border-border bg-gradient-sand p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recommended plan</div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary">{c.paymentPlan}</div>
              <div className="mt-3 text-xs text-muted-foreground">Bespoke plans available — contact your PropTrack advisor for current launch offers.</div>
            </div>
          </Section>

          {/* Mini-map */}
          <Section title="Location">
            <div className="h-[320px] overflow-hidden rounded-2xl border border-border">
              <MapClient compounds={[c]} focus={c} showLandmarks={false} className="h-full w-full" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {area?.name}{c.km ? ` · km ${c.km}` : ""} · {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
            </div>
          </Section>
        </div>

        {/* Sticky CTA */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Starting from</div>
            <div className="mt-1 font-display text-3xl font-semibold text-primary">EGP {c.priceFrom}M</div>
            <div className="mt-4 space-y-2">
              <Button className="w-full rounded-full" size="lg"><Phone className="mr-2 h-4 w-4" />Request a viewing</Button>
              <Button onClick={() => toggleFav(c.slug)} variant="outline" className="w-full rounded-full" size="lg">
                <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
                {isFav ? "Saved" : "Save to favorites"}
              </Button>
            </div>
            {dev && (
              <Link to="/developers/$slug" params={{ slug: dev.slug }}
                className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 hover:bg-secondary">
                <img src={dev.logo} alt={dev.name} className="h-10 w-10 rounded-lg" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Developer</div>
                  <div className="truncate font-medium text-primary">{dev.name}</div>
                </div>
              </Link>
            )}
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-gradient-sand">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <h2 className="font-display text-2xl font-semibold text-primary">More in {area?.name}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => <CompoundCard key={r.slug} c={r} />)}
            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent"><Icon className="h-4 w-4" /></div>
      <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-lg font-semibold text-primary">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}