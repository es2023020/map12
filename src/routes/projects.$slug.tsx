import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compoundBySlug, compoundsByArea } from "@/data/compounds";
import { areaBySlug } from "@/data/areas";
import { developerBySlug } from "@/data/developers";
import { CompoundCard } from "@/components/CompoundCard";
import { availabilityBySlug } from "@/data/availability";
import { AvailabilitySection } from "@/components/AvailabilitySection";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Heart, MapPin, Waves, Calendar, Building2, Wallet, Ruler,
  Check, ArrowLeft, Phone, ChevronLeft, ChevronRight, Globe,
  X, ExternalLink, Star
} from "lucide-react";
function LogoBadge({ src, name, className = "" }: { src: string; name: string; className?: string }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const initials = name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-primary">
        <span className="text-primary-foreground font-bold text-sm select-none">{initials}</span>
      </div>
      <img src={src} alt={name}
        className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-300 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLogoLoaded(true)} onError={() => {}} />
    </div>
  );
}

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

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const imgs = images.length > 0 ? images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"];

  const prev = () => setLightbox((v) => v !== null ? (v - 1 + imgs.length) % imgs.length : null);
  const next = () => setLightbox((v) => v !== null ? (v + 1) % imgs.length : null);

  return (
    <>
      {/* Gallery grid */}
      <div className={`grid gap-1.5 overflow-hidden rounded-2xl md:rounded-3xl ${
        imgs.length === 1 ? "grid-cols-1" :
        imgs.length === 2 ? "grid-cols-2" :
        imgs.length === 3 ? "grid-cols-3" :
        "grid-cols-2 md:grid-cols-4"
      }`}>
        {/* Main image */}
        <div
          className={`relative overflow-hidden bg-secondary cursor-pointer ${
            imgs.length >= 4 ? "md:col-span-2 md:row-span-2" : ""
          }`}
          style={{ aspectRatio: imgs.length === 1 ? "16/7" : "4/3" }}
          onClick={() => setLightbox(0)}
        >
          <img src={imgs[0]} alt={name} className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          {imgs.length > 1 && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
          )}
        </div>
        {/* Secondary images */}
        {imgs.slice(1, imgs.length >= 4 ? 4 : imgs.length).map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden bg-secondary cursor-pointer"
            style={{ aspectRatio: "4/3" }}
            onClick={() => setLightbox(i + 1)}
          >
            <img src={img} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
            {i === 2 && imgs.length > 4 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="font-display text-2xl font-bold text-white">+{imgs.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" onClick={() => setLightbox(null)}>
            <X className="h-6 w-6" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="h-6 w-6" />
          </button>
          <img
            src={imgs[lightbox]}
            alt={name}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-sm text-white/60">{lightbox + 1} / {imgs.length}</div>
        </div>
      )}
    </>
  );
}

function CompoundPage() {
  const c = Route.useLoaderData();
  const area = areaBySlug(c.area);
  const dev = developerBySlug(c.developerSlug);
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const addRecent = useStore((s) => s.addRecent);
  useEffect(() => { addRecent(c.slug); }, [c.slug, addRecent]);

  const related = compoundsByArea(c.area).filter((x) => x.slug !== c.slug).slice(0, 4);
  const allImages = c.gallery && c.gallery.length > 0 ? c.gallery : [c.hero];

  return (
    <Shell>
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link to="/projects" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> All projects
            </Link>
            <span>/</span>
            {area && (
              <>
                <Link to="/areas/$slug" params={{ slug: area.slug }} className="hover:text-primary transition-colors">{area.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-primary font-medium truncate">{c.name}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-4 pt-5 lg:px-8">
        <Gallery images={allImages} name={c.name} />
      </section>

      {/* Main content + sticky sidebar */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 pt-6 lg:grid-cols-[1fr_360px] lg:pb-12 lg:px-8">
        {/* Left: details */}
        <div>
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {c.beachfront && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sunset px-2.5 py-1 text-xs font-semibold text-white">
                <Waves className="h-3 w-3" /> Beachfront
              </span>
            )}
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              c.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
              c.status === "Under Construction" ? "bg-amber-100 text-amber-700" :
              "bg-blue-100 text-blue-700"
            }`}>{c.status}</span>
            {c.flagship && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Flagship
              </span>
            )}
            {area && (
              <Link to="/areas/$slug" params={{ slug: area.slug }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-accent hover:border-accent transition-colors">
                <MapPin className="h-3 w-3" />
                {area.name}{c.km ? ` · km ${c.km}` : ""}
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-primary">{c.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            by{" "}
            {dev ? (
              <Link to="/developers/$slug" params={{ slug: dev.slug }} className="font-medium text-primary hover:text-accent transition-colors">
                {c.developer}
              </Link>
            ) : (
              <span className="font-medium text-primary">{c.developer}</span>
            )}
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80">{c.blurb}</p>

          {/* Key stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Wallet} label="Starting from" value={`EGP ${c.priceFrom}M`} accent />
            <StatCard icon={Calendar} label="Delivery" value={String(c.deliveryYear)} />
            <StatCard icon={Ruler} label="Unit sizes" value={c.unitSizes ?? "—"} />
            <StatCard icon={Building2} label="Project size" value={c.areaSize ?? "—"} />
          </div>

          {/* Live Availability from developer sheets */}
          {availabilityBySlug(c.slug) && (
            <Section title="Live Availability">
              <AvailabilitySection data={availabilityBySlug(c.slug)!} />
            </Section>
          )}

          {/* Unit types */}
          <Section title="Unit types">
            <div className="flex flex-wrap gap-2">
              {c.types.map((t: string) => (
                <span key={t} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary">{t}</span>
              ))}
            </div>
          </Section>

          {/* Amenities */}
          <Section title="Amenities & features">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {c.amenities.map((a: string) => (
                <li key={a} className="inline-flex items-center gap-2.5 text-sm text-foreground/80">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </Section>

          {/* Payment plan */}
          <Section title="Payment plan">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-5">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Recommended plan</div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary">{c.paymentPlan}</div>
              <p className="mt-3 text-sm text-muted-foreground">
                Bespoke plans available — contact your PropTrack advisor for current launch offers and exclusive discounts.
              </p>
              <a href="tel:01233374501"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Phone className="h-4 w-4" /> Speak to an advisor
              </a>
            </div>
          </Section>

          {/* Location map */}
          <Section title="Location">
            <div className="h-[300px] md:h-[360px] overflow-hidden rounded-2xl border border-border shadow-soft">
              <MapClient compounds={[c]} focus={c} showLandmarks={false} className="h-full w-full" />
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                {area?.name}{c.km ? ` · km ${c.km}` : ""}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open in Google Maps
              </a>
            </div>
          </Section>
        </div>

        {/* Right: Sticky CTA card */}
        <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Starting from</div>
            <div className="mt-1 font-display text-3xl font-semibold text-primary">EGP {c.priceFrom}M</div>
            <div className="mt-4 space-y-2.5">
              <Button className="w-full rounded-full" size="lg">
                <Phone className="mr-2 h-4 w-4" /> Request a viewing
              </Button>
              <Button onClick={() => toggleFav(c.slug)} variant="outline" className="w-full rounded-full" size="lg">
                <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
                {isFav ? "Saved to favorites" : "Save to favorites"}
              </Button>
            </div>

            {/* Developer card */}
            {dev && (
              <Link to="/developers/$slug" params={{ slug: dev.slug }}
                className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors">
                <LogoBadge src={dev.logo} name={dev.name} className="h-11 w-11 rounded-lg" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Developer</div>
                  <div className="truncate font-medium text-primary">{dev.name}</div>
                  <div className="text-xs text-muted-foreground">{dev.count} projects tracked</div>
                </div>
              </Link>
            )}

            {/* Area card */}
            {area && (
              <Link to="/areas/$slug" params={{ slug: area.slug }}
                className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: area.color + "22" }}>
                  <MapPin className="h-5 w-5" style={{ color: area.color }} />
                </span>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Area</div>
                  <div className="truncate font-medium text-primary">{area.name}</div>
                  {c.km && <div className="text-xs text-muted-foreground">km {c.km}</div>}
                </div>
              </Link>
            )}

            {dev?.website && (
              <a href={dev.website} target="_blank" rel="noreferrer"
                className="mt-3 flex items-center gap-2 text-xs text-accent hover:underline">
                <Globe className="h-3.5 w-3.5" /> Visit developer website
              </a>
            )}
          </div>
        </aside>
      </section>

      {/* Mobile sticky CTA bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border bg-card px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">From</div>
            <div className="font-display text-lg font-semibold text-primary">EGP {c.priceFrom}M</div>
          </div>
          <Button onClick={() => toggleFav(c.slug)} variant="outline" size="sm" className="rounded-full shrink-0">
            <Heart className={`h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
          </Button>
          <Button size="sm" className="rounded-full shrink-0 gap-1">
            <Phone className="h-4 w-4" /> Request viewing
          </Button>
        </div>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="bg-gradient-sand">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-primary">More in {area?.name}</h2>
              {area && (
                <Link to="/areas/$slug" params={{ slug: area.slug }}
                  className="text-sm text-accent hover:underline">View all in {area.name} →</Link>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => <CompoundCard key={r.slug} c={r} />)}
            </div>
          </div>
        </section>
      )}
    </Shell>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}>
      <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${accent ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-base font-semibold text-primary leading-tight">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl md:text-2xl font-semibold text-primary">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
