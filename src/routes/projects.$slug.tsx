import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { MapClient } from "@/components/map/MapClient";
import { compoundBySlug, compoundsByDestination } from "@/data/compounds";
import { destinationBySlug, destinationLocationString } from "@/data/destinations";
import { projectLocations } from "@/data/project-locations";
import { developerBySlug } from "@/data/developers";
import { CompoundCard } from "@/components/CompoundCard";
import { availabilityBySlug } from "@/data/availability";
import { AvailabilitySection } from "@/components/AvailabilitySection";
import { BrochureButton } from "@/components/BrochureButton";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Heart, MapPin, Waves, Calendar, Building2, Wallet, Ruler,
  Check, ArrowLeft, Phone, ChevronLeft, ChevronRight, Globe,
  X, ExternalLink, Star, Calculator, Map as MapIcon, ZoomIn
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
      <div className={`grid gap-2 overflow-hidden rounded-2xl md:rounded-3xl ${
        imgs.length === 1 ? "grid-cols-1" :
        imgs.length === 2 ? "grid-cols-2" :
        imgs.length === 3 ? "grid-cols-3" :
        "grid-cols-2 md:grid-cols-4"
      }`}>
        {/* Main image */}
        <div
          className={`group relative overflow-hidden bg-secondary cursor-pointer ${
            imgs.length >= 4 ? "md:col-span-2 md:row-span-2" : ""
          }`}
          style={{ aspectRatio: imgs.length === 1 ? "16/7" : "4/3" }}
          onClick={() => setLightbox(0)}
        >
          <img src={imgs[0]} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/20">
              <ZoomIn className="h-3.5 w-3.5" /> View Gallery
            </span>
          </div>
          {imgs.length > 1 && (
            <div className="absolute top-3 right-3 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
              1 / {imgs.length}
            </div>
          )}
        </div>
        {/* Secondary images */}
        {imgs.slice(1, imgs.length >= 4 ? 4 : imgs.length).map((img, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-secondary cursor-pointer"
            style={{ aspectRatio: "4/3" }}
            onClick={() => setLightbox(i + 1)}
          >
            <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {i === 2 && imgs.length > 4 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-sm">
                <ZoomIn className="h-7 w-7 text-white/80 mb-1" />
                <span className="font-display text-xl font-bold text-white">+{imgs.length - 4} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 rounded-full bg-white/10 border border-white/20 p-2.5 text-white hover:bg-white/25 transition-colors" onClick={() => setLightbox(null)}>
            <X className="h-5 w-5" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/20 p-3 text-white hover:bg-white/25 transition-colors" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 border border-white/20 p-3 text-white hover:bg-white/25 transition-colors" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="h-6 w-6" />
          </button>
          <img
            src={imgs[lightbox]}
            alt={name}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 px-4 py-1.5 text-sm font-semibold text-white/80">
            {lightbox + 1} / {imgs.length}
          </div>
        </div>
      )}
    </>
  );
}

function CompoundPage() {
  const c = Route.useLoaderData();
  const destination = destinationBySlug(c.destination);
  const dev = developerBySlug(c.developerSlug);
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const addRecent = useStore((s) => s.addRecent);
  useEffect(() => { addRecent(c.slug); }, [c.slug, addRecent]);

  const related = compoundsByDestination(c.destination).filter((x) => x.slug !== c.slug).slice(0, 4);
  const allImages = c.gallery && c.gallery.length > 0 ? c.gallery : [c.hero];

  const avail = availabilityBySlug(c.slug);
  const livePaymentPlans = avail
    ? Array.from(new Set(avail.breakdown.map((b) => b.paymentPlan).filter(Boolean)))
    : [];

  // Master plan popup state
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);
  const storeCompounds = useStore((s) => s.compoundsList);
  const liveProject = storeCompounds?.find((p: any) => p.slug === c.slug);
  const masterPlanUrl: string | undefined = liveProject?.masterPlanUrl ?? (c as any).masterPlanUrl;
  const phases = storeCompounds?.filter((p: any) => p.parentSlug === c.slug) || [];

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
            {destination && (
              <>
                <Link to="/destinations/$slug" params={{ slug: destination.slug }} className="hover:text-primary transition-colors">{destination.name}</Link>
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
            {destination && (
              <Link to="/destinations/$slug" params={{ slug: destination.slug }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-accent hover:border-accent transition-colors">
                <MapPin className="h-3 w-3" />
                {destination.name}{c.km ? ` · km ${c.km}` : ""}
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

          {/* Key stats + Brochure */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={Wallet} label="Starting from" value={`EGP ${c.priceFrom}M`} accent />
            <StatCard icon={Calendar} label="Delivery" value={String(c.deliveryYear)} />
            <StatCard icon={Ruler} label="Unit sizes" value={c.unitSizes ?? "—"} />
            <StatCard icon={Building2} label="Project size" value={c.areaSize ?? "—"} />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <BrochureButton projectSlug={c.slug} projectName={c.name} />
            <button
              onClick={() => setMasterPlanOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-soft hover:border-accent/60 hover:bg-accent/5 hover:text-accent transition-all duration-200 group"
            >
              <MapIcon className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
              View Master Plan
              {masterPlanUrl && <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            </button>
          </div>

          {/* Master Plan Popup — always available, shows image or coming-soon */}
          {masterPlanOpen && (
            <div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
              onClick={() => setMasterPlanOpen(false)}
            >
              <div
                className="relative w-full max-w-5xl mx-4 rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/90 backdrop-blur-sm border-b border-white/10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-accent">Master Plan</div>
                    <div className="font-display font-bold text-white mt-0.5">{c.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {masterPlanUrl && (
                      <a
                        href={masterPlanUrl}
                        download={`${c.name}-MasterPlan`}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ZoomIn className="h-3.5 w-3.5" /> Full Size
                      </a>
                    )}
                    <button
                      onClick={() => setMasterPlanOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                {masterPlanUrl ? (
                  <div className="max-h-[75vh] overflow-auto flex items-center justify-center bg-zinc-900 p-4">
                    <img
                      src={masterPlanUrl}
                      alt={`${c.name} Master Plan`}
                      className="max-w-full rounded-lg shadow-xl"
                      style={{ maxHeight: "68vh" }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900 min-h-[300px]">
                    <div className="mx-auto rounded-full bg-accent/10 p-5 w-fit mb-5">
                      <MapIcon className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Master Plan Coming Soon</h3>
                    <p className="text-sm text-zinc-400 mt-2 max-w-md leading-relaxed">
                      The official master plan layout for <strong className="text-white">{c.name}</strong> is being prepared by the developer. Request it directly from our team.
                    </p>
                    <a
                      href={`https://wa.me/201029324783?text=Hi!%20I%20am%20requesting%20the%20master%20plan%20for%20${encodeURIComponent(c.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-600 transition-colors py-3 px-6 shadow-md"
                    >
                      Request via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Phases */}
          {phases.length > 0 && (
            <Section title="Project Phases">
              <p className="text-xs text-muted-foreground mb-4">
                Explore the residential neighborhoods and exclusive phases within {c.name}.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {phases.map((phase: any) => (
                  <div key={phase.slug} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                      <img src={phase.hero} alt={phase.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 animate-fade-in" loading="lazy" />
                      <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white border border-white/10 uppercase tracking-wider">
                        {phase.status}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-display text-base font-bold text-primary">{phase.name}</h4>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">{phase.blurb}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Starts From</div>
                          <div className="text-accent font-bold text-xs">EGP {phase.priceFrom}M</div>
                        </div>
                        <Link to="/projects/$slug" params={{ slug: phase.slug }} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-bold text-primary bg-secondary/20 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all">
                          Explore Phase →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Live Availability from developer sheets */}
          {availabilityBySlug(c.slug) && (
            <Section title="Live Availability">
              <AvailabilitySection data={availabilityBySlug(c.slug)!} projectSlug={c.slug} />
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
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {livePaymentPlans.length > 1 ? "Available plans" : "Recommended plan"}
              </div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary">
                {livePaymentPlans.length > 0 ? livePaymentPlans.join(" / ") : c.paymentPlan}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Bespoke plans available — contact your PropTrack advisor for current launch offers and exclusive discounts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="tel:201029324783"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Phone className="h-4 w-4" /> Speak to an advisor
                </a>
                <Link to="/calculator" search={{ project: c.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-accent bg-card px-5 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5 transition-colors">
                  <Calculator className="h-4 w-4" /> Calculate installments
                </Link>
              </div>
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
                {c.city ?? destinationLocationString(c.destination)}{c.km ? ` · km ${c.km}` : ""}
              </span>
              <a
                href={projectLocations[c.slug]?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
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
              <Link to="/calculator" search={{ project: c.slug }} className="block w-full">
                <Button variant="outline" className="w-full rounded-full border-accent text-accent hover:bg-accent/5" size="lg">
                  <Calculator className="mr-2 h-4 w-4" />
                  Installment Calculator
                </Button>
              </Link>
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

            {/* Destination card */}
            {destination && (
              <Link to="/destinations/$slug" params={{ slug: destination.slug }}
                className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: destination.color + "22" }}>
                  <MapPin className="h-5 w-5" style={{ color: destination.color }} />
                </span>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="truncate font-medium text-primary">{destination.name}</div>
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
          <Link to="/calculator" search={{ project: c.slug }} className="shrink-0">
            <Button variant="outline" size="sm" className="rounded-full border-accent text-accent">
              <Calculator className="h-4 w-4" />
            </Button>
          </Link>
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
              <h2 className="font-display text-2xl font-semibold text-primary">More in {destination?.name}</h2>
              {destination && (
                <Link to="/destinations/$slug" params={{ slug: destination.slug }}
                  className="text-sm text-accent hover:underline">View all in {destination.name} →</Link>
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
