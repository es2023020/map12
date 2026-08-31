import { PdfProposalModal } from "@/components/ui/PdfProposalModal";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  FileText,
  ZoomOut,
  RotateCcw,
  Minimize2,
  Maximize2,
  Heart,
  MapPin,
  Waves,
  Calendar,
  Building2,
  Wallet,
  Ruler,
  Check,
  ArrowLeft,
  Phone,
  ChevronLeft,
  ChevronRight,
  Globe,
  X,
  ExternalLink,
  Star,
  Calculator,
  Map as MapIcon,
  ZoomIn,
  ChevronDown,
  Sparkles,
} from "lucide-react";
function LogoBadge({
  src,
  name,
  className = "",
}: {
  src: string;
  name: string;
  className?: string;
}) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-primary">
        <span className="text-primary-foreground font-bold text-sm select-none">{initials}</span>
      </div>
      <img
        src={src}
        alt={name}
        className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-300 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLogoLoaded(true)}
        onError={() => {}}
      />
    </div>
  );
}

import { buildProjectSchema, buildBreadcrumbSchema } from "@/lib/seo";
import { getProjectSEO } from "@/lib/seo-templates";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const c = compoundBySlug(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const seo = getProjectSEO(loaderData, "en");

    const projectSchema = buildProjectSchema({
      name: loaderData.name,
      slug: loaderData.slug,
      developer: loaderData.developer,
      developerSlug: loaderData.developerSlug,
      destination: loaderData.destination,
      priceFrom: loaderData.priceFrom,
      deliveryYear: loaderData.deliveryYear,
      hero: loaderData.hero,
      blurb: loaderData.blurb,
      status: loaderData.status,
    });

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Destinations", item: "/destinations" },
      { name: loaderData.destination, item: `/destinations/${loaderData.destination}` },
      { name: loaderData.name, item: `/projects/${loaderData.slug}` },
    ]);

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.metaDesc },
        { property: "og:image", content: loaderData.hero },
        { property: "og:url", content: seo.canonical },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: seo.canonical },
        { rel: "alternate", hrefLang: "en", href: seo.alternateEn },
        { rel: "alternate", hrefLang: "ar", href: seo.alternateAr },
        { rel: "alternate", hrefLang: "x-default", href: seo.alternateEn },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(projectSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: CompoundPage,
});

import { Image as ImageIcon } from "lucide-react";

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const imgs =
    images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"];

  const prev = () => setLightbox((v) => (v !== null ? (v - 1 + imgs.length) % imgs.length : null));
  const next = () => setLightbox((v) => (v !== null ? (v + 1) % imgs.length : null));

  const renderImageOrFallback = (src: string, index: number, isMain: boolean = false) => {
    if (failedImages[index]) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary/50 to-secondary/80 border border-dashed border-border/80 rounded-xl p-6 text-center select-none">
          <ImageIcon
            className={`${isMain ? "h-10 w-10" : "h-6 w-6"} text-muted-foreground/60 mb-2`}
          />
          <span
            className={`${isMain ? "text-xs" : "text-[10px]"} font-bold text-muted-foreground uppercase tracking-wider`}
          >
            No image uploaded
          </span>
          <span className="text-[9px] text-muted-foreground/80 mt-1 max-w-[150px]">
            Use the admin center to add pictures for {name}
          </span>
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={name}
        className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        onError={() => setFailedImages((prev) => ({ ...prev, [index]: true }))}
      />
    );
  };

  return (
    <>
      {/* Gallery grid */}
      <div
        className={`grid gap-2 overflow-hidden rounded-2xl md:rounded-3xl border border-border/40 bg-card p-1.5 shadow-lg ${
          imgs.length === 1
            ? "grid-cols-1"
            : imgs.length === 2
              ? "grid-cols-2"
              : imgs.length === 3
                ? "grid-cols-3"
                : "grid-cols-2 md:grid-cols-4"
        }`}
      >
        {/* Main image */}
        <div
          className={`relative overflow-hidden rounded-xl bg-secondary cursor-pointer ${
            imgs.length >= 4 ? "md:col-span-2 md:row-span-2" : ""
          }`}
          style={{ aspectRatio: imgs.length === 1 ? "16/7" : "4/3" }}
          onClick={() => setLightbox(0)}
        >
          {renderImageOrFallback(imgs[0], 0, true)}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-xs font-semibold backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full flex items-center gap-1">
              <ZoomIn className="h-3 w-3" /> View Photo
            </span>
          </div>
        </div>
        {/* Secondary images */}
        {imgs.slice(1, imgs.length >= 4 ? 4 : imgs.length).map((img, i) => {
          const index = i + 1;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl bg-secondary cursor-pointer"
              style={{ aspectRatio: "4/3" }}
              onClick={() => setLightbox(index)}
            >
              {renderImageOrFallback(img, index)}
              {i === 2 && imgs.length > 4 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                  <span className="font-display text-2xl font-black text-white">
                    +{imgs.length - 4}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 mt-1">
                    Photos
                  </span>
                </div>
              )}
              {!(i === 2 && imgs.length > 4) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                  <span className="text-white text-[10px] font-semibold backdrop-blur-md bg-black/30 px-2 py-1 rounded-full flex items-center gap-0.5">
                    <ZoomIn className="h-2.5 w-2.5" /> Zoom
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20 transition-colors shadow-lg"
            onClick={() => setLightbox(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3.5 text-white hover:bg-white/20 transition-all shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3.5 text-white hover:bg-white/20 transition-all shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div
            className="max-h-[80vh] max-w-[85vw] flex items-center justify-center rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl p-1"
            onClick={(e) => e.stopPropagation()}
          >
            {failedImages[lightbox] ? (
              <div className="w-[600px] aspect-video flex flex-col items-center justify-center bg-zinc-900 text-center p-8">
                <ImageIcon className="h-12 w-12 text-zinc-600 mb-4" />
                <h4 className="text-sm font-bold text-zinc-400">No Image File Found</h4>
                <p className="text-xs text-zinc-500 mt-2 max-w-xs">
                  Upload files for {name} in the admin panel to show here.
                </p>
              </div>
            ) : (
              <img
                src={imgs[lightbox]}
                alt={name}
                className="max-h-[78vh] max-w-[82vw] object-contain rounded-xl"
              />
            )}
          </div>
          <div className="absolute bottom-6 font-semibold text-xs text-white bg-black/55 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            Photo {lightbox + 1} of {imgs.length}
          </div>
        </div>
      )}
    </>
  );
}

function CompoundPage() {
  const c = Route.useLoaderData();
  const destination = destinationBySlug(c.destination);
  const dev = developerBySlug(c.developerSlug) || {
    slug: c.developerSlug || "unknown",
    name: c.developer || "Unknown Developer",
    logo: `https://ui-avatars.com/api/?background=1f3a5f&color=fff&bold=true&size=128&name=${encodeURIComponent(c.developer || "D")}`,
    count: 1,
    blurb: `${c.developer} is an active real estate developer with projects tracked on Property Atlas.`,
    website: "",
  };
  const isFav = useStore((s) => s.favorites.includes(c.slug));
  const toggleFav = useStore((s) => s.toggleFavorite);
  const addRecent = useStore((s) => s.addRecent);
  const trackEvent = useStore((s) => s.trackEvent);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);

  const user = useStore((s) => s.user);
  const addLead = useStore((s) => s.addLead);

  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadUnit, setLeadUnit] = useState("");
  const [leadInterestType, setLeadInterestType] = useState("Buying");
  const [leadTime, setLeadTime] = useState("Any Time");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (interestModalOpen) {
      setLeadName(user?.name || "");
      setLeadPhone((user as any)?.phone || "");
      if (!leadUnit) {
        setLeadUnit(c.types?.[0] || "Apartment");
      }
      setLeadInterestType("Buying");
      setLeadTime("Any Time");
    }
  }, [interestModalOpen, user, c.types]);

  const handleRegisterInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name: leadName,
        phone: leadPhone,
        budget: c.priceFrom || 0,
        interest: c.slug,
        stage: "new" as const,
        notes: `Preferred Unit: ${leadUnit}\nInterest Type: ${leadInterestType}\nBest Time to Call: ${leadTime}`,
      };
      addLead(payload);

      // Persist to server backend API
      fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Lead API sync notice:", err));

      toast.success("Interest registered successfully! Our agent will call you shortly.");
      setInterestModalOpen(false);
    } catch (err) {
      toast.error("Failed to register interest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    addRecent(c.slug);
    trackEvent({ type: "view", slug: c.slug, area: c.destination });

    // Load heavy availability data asynchronously in background
    import("@/data/availability").then((mod) => {
      mod.loadAvailabilityAsync().then(() => {
        setAvailabilityLoaded(true);
      });
    });
  }, [c.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = compoundsByDestination(c.destination)
    .filter((x) => x.slug !== c.slug)
    .slice(0, 4);
  const allImages = c.gallery && c.gallery.length > 0 ? c.gallery : [c.hero];

  const avail = availabilityBySlug(c.slug);
  const livePaymentPlans = avail
    ? Array.from(new Set(avail.breakdown.map((b) => b.paymentPlan).filter(Boolean)))
    : [];

  // Master plan popup state
  const [masterPlanOpen, setMasterPlanOpen] = useState(false);
  // Proposal PDF modal state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  // Read live compound data from the store to get admin-updated fields
  const storeCompounds = useStore((s) => s.compoundsList);
  const liveProject = storeCompounds?.find((p: any) => p.slug === c.slug);
  const parentSlug = liveProject?.parentSlug ?? (c as any).parentSlug;
  const parentProject = parentSlug ? storeCompounds?.find((p: any) => p.slug === parentSlug) : null;
  const masterPlanUrl: string | undefined = liveProject?.masterPlanUrl ?? (c as any).masterPlanUrl;

  return (
    <Shell>
      {/* Breadcrumb */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
            <Link
              to="/projects"
              search={{ destination: "", dev: "", q: "" }}
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All projects
            </Link>
            <span>/</span>
            {destination && (
              <>
                <Link
                  to="/destinations/$slug"
                  params={{ slug: destination.slug }}
                  className="hover:text-primary transition-colors"
                >
                  {destination.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-primary font-medium truncate">{c.name}</span>
            {parentProject && (
              <>
                <span>/</span>
                <span className="text-xs bg-accent/10 border border-accent/20 text-accent rounded-full px-2 py-0.5 inline-flex items-center gap-1 font-bold">
                  Phase of{" "}
                  <Link
                    to="/projects/$slug"
                    params={{ slug: parentProject.slug }}
                    className="underline hover:underline transition-all"
                  >
                    {parentProject.name}
                  </Link>
                </span>
              </>
            )}
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
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                c.status === "RTM" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {c.status}
            </span>
            {c.flagship && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Flagship
              </span>
            )}
            {c.km ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 border border-sky-500/30 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-400">
                <MapPin className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" /> Km {c.km} · {destination?.name || c.destination}
              </span>
            ) : destination ? (
              <Link
                to="/destinations/$slug"
                params={{ slug: destination.slug }}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-accent hover:border-accent transition-colors"
              >
                <MapPin className="h-3 w-3" />
                {destination.name}
              </Link>
            ) : null}
          </div>

          {/* Title */}
          <h1 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-primary">
            {c.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            by{" "}
            {dev ? (
              <Link
                to="/developers/$slug"
                params={{ slug: dev.slug }}
                className="font-medium text-primary hover:text-accent transition-colors"
              >
                {c.developer}
              </Link>
            ) : (
              <span className="font-medium text-primary">{c.developer}</span>
            )}
          </p>

          {c.slug === "alam-al-roum" ? (
            <div className="mt-6 space-y-6">
              <p className="text-base leading-relaxed text-foreground/90 font-medium">
                Alam El Roum is a massive{" "}
                <span className="font-extrabold text-accent">$29.7 billion</span> mega-development
                on Egypt's Mediterranean coast west of Marsa Matrouh. Developed by{" "}
                <a
                  href="https://www.qataridiar.com/project/alam-al-roum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-accent font-semibold inline-flex items-center gap-0.5"
                >
                  Qatari Diar <ExternalLink className="h-3 w-3 inline" />
                </a>
                , the 4,900-acre project features a 7.2-kilometer shoreline, an international
                marina, luxury hotels, and year-round residential districts.
              </p>

              <Section title="Project Overview & Masterplan">
                <div className="grid gap-6 sm:grid-cols-2 bg-secondary/15 p-5 rounded-2xl border border-border/60">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Developer Partnership
                    </div>
                    <div className="mt-1 font-semibold text-primary text-sm">
                      Qatari Diar in partnership with Egypt's Ministry of Housing
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Master Planner
                    </div>
                    <div className="mt-1 font-semibold text-primary text-sm font-display text-accent">
                      Skidmore, Owings &amp; Merrill (SOM)
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Total Land Size
                    </div>
                    <div className="mt-1 font-semibold text-primary text-sm">
                      20.5 million sqm (approx. 4,900 feddans)
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      Pristine Beachfront
                    </div>
                    <div className="mt-1 font-semibold text-primary text-sm font-display text-accent">
                      7.2 Kilometers shoreline
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl border border-border/40 bg-card text-xs text-muted-foreground leading-relaxed">
                  <strong>Key Features:</strong> Features a state-of-the-art 370-berth international
                  yacht marina, championship golf course, polo club, and luxury hospitality
                  districts.
                </div>
              </Section>

              <Section title="Location & Accessibility">
                <ul className="space-y-3 text-xs text-foreground/80">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>
                      <strong>Position:</strong> Situated East of Marsa Matrouh city center.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>
                      <strong>Airport Proximity:</strong> Roughly 6 kilometers from Marsa Matrouh
                      International Airport.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span>
                      <strong>Surrounds:</strong> Easy connectivity to Ras El Hikma and wider
                      regions via the International Coastal Road.
                    </span>
                  </li>
                </ul>
              </Section>
            </div>
          ) : (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80">{c.blurb}</p>
          )}

          {/* Key stats + Brochure */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            <StatCard icon={Wallet} label="Starting from" value={`EGP ${c.priceFrom}M`} accent />
            <StatCard icon={Calendar} label="Delivery" value={String(c.deliveryYear)} />
            <StatCard icon={Ruler} label="Unit sizes" value={c.unitSizes ?? "—"} />
            <StatCard icon={Building2} label="Project size" value={c.areaSize ?? "—"} />
            {c.km && <StatCard icon={MapPin} label="Highway Location" value={`Km ${c.km}`} accent />}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <BrochureButton projectSlug={c.slug} projectName={c.name} />
            <button
              onClick={() => setMasterPlanOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-soft hover:border-accent/60 hover:bg-accent/5 hover:text-accent transition-all duration-200 group cursor-pointer"
            >
              <MapIcon className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
              View Master Plan
              {masterPlanUrl && (
                <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            <button
              onClick={() => setProposalModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 hover:border-amber-500/50 transition-all duration-200 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              Create Client Proposal PDF
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
                    <div className="text-[10px] uppercase tracking-widest font-bold text-accent">
                      Master Plan
                    </div>
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
                      The official master plan layout for{" "}
                      <strong className="text-white">{c.name}</strong> is being prepared by the
                      developer. Request it directly from our team.
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

          {/* Phases & Neighborhoods */}
          {(() => {
            const phases = storeCompounds?.filter((p: any) => p.parentSlug === c.slug) || [];
            if (phases.length === 0) return null;
            return (
              <Section title="Phases & Neighborhoods">
                <div className="grid gap-4 sm:grid-cols-2">
                  {phases.map((phase: any) => (
                    <Link
                      key={phase.slug}
                      to="/projects/$slug"
                      params={{ slug: phase.slug }}
                      className="group rounded-2xl border border-border/85 bg-card p-4 hover:border-accent/40 shadow-soft hover:-translate-y-0.5 transition-all flex gap-4"
                    >
                      <div className="h-20 w-24 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={phase.hero}
                          alt={phase.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-primary text-sm truncate group-hover:text-accent transition-colors">
                            {phase.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {phase.blurb}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-border/30">
                          <span className="text-[10px] text-accent font-bold">
                            From EGP {phase.priceFrom}M
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {phase.deliveryYear}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            );
          })()}

          

          {/* Live Availability from developer sheets */}
          {c.slug === "alam-al-roum" ? (
            <Section title="Live Connected Inventory">
              <div className="space-y-8">
                {/* Sealine Estates */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                  <div className="border-b border-border pb-3 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="font-display font-bold text-base text-primary">
                        Sealine Estates — "Limitless Waterfront"
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Standalone sea-view villas ordered by row (1st Row = closest to sea)
                      </p>
                    </div>
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent uppercase">
                      Villas Only
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-border bg-secondary/40 text-[10px] font-bold text-muted-foreground uppercase">
                          <th className="p-3 text-left">Row &amp; Type</th>
                          <th className="p-3 text-center">BUA (m²)</th>
                          <th className="p-3 text-center">Avg. Plot (m²)</th>
                          <th className="p-3 text-left">Features &amp; Views</th>
                          <th className="p-3 text-right">Starting Price (EGP)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {[
                          {
                            row: "1st Row",
                            type: "1 Story Villa",
                            bua: "601",
                            plot: "1,500",
                            feat: "6 Ensuites · Full Sea View",
                            price: "227,000,000",
                            isRange: false,
                          },
                          {
                            row: "2nd Row",
                            type: "1 Story Villa",
                            bua: "453",
                            plot: "1,300",
                            feat: "5 Ensuites · Full Sea View",
                            price: "154,000,000",
                            isRange: false,
                          },
                          {
                            row: "3rd Row",
                            type: "1 Story Villa",
                            bua: "326 – 391",
                            plot: "1,100",
                            feat: "5 Ensuites · Full Sea View",
                            price: "96,000,000 – 112,000,000",
                            isRange: true,
                          },
                          {
                            row: "4th Row",
                            type: "G+1 Villa",
                            bua: "331",
                            plot: "550",
                            feat: "5 Ensuites · Partial Sea View",
                            price: "73,000,000",
                            isRange: false,
                          },
                          {
                            row: "5th Row",
                            type: "G+1+Penthouse Villa",
                            bua: "307",
                            plot: "500",
                            feat: "5 Ensuites · Partial Sea View",
                            price: "64,000,000",
                            isRange: false,
                          },
                          {
                            row: "6th–9th Row",
                            type: "Villa",
                            bua: "307",
                            plot: "500",
                            feat: "5 Ensuites · Riviera Park & Spine View",
                            price: "48,000,000 – 59,000,000",
                            isRange: true,
                          },
                        ].map((v, i) => (
                          <tr key={i} className="hover:bg-secondary/20 transition-colors">
                            <td className="p-3">
                              <span className="font-semibold text-primary block">{v.row}</span>
                              <span className="text-[10px] text-muted-foreground">{v.type}</span>
                            </td>
                            <td className="p-3 text-center text-muted-foreground">{v.bua} m²</td>
                            <td className="p-3 text-center text-muted-foreground">{v.plot} m²</td>
                            <td className="p-3 text-foreground font-medium">{v.feat}</td>
                            <td className="p-3 text-right">
                              <span className="font-bold text-accent">EGP {v.price}</span>
                              <span className="block text-[9px] text-muted-foreground">
                                starting rate
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sandside Lagoons Section */}
                <div className="space-y-6">
                  <div className="border-b border-border pb-2">
                    <h3 className="font-display font-bold text-base text-primary">
                      Sandside Lagoons — "A Waterfront for Every Home"
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Sandy beach lagoons and chalets
                    </p>
                  </div>

                  {/* 2a. Lagoon Villas & Townhouses */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div className="border-b border-border pb-3 flex justify-between items-center flex-wrap gap-2">
                      <h4 className="font-semibold text-sm text-primary">
                        Lagoon Villas &amp; Townhouses
                      </h4>
                      <span className="text-[9px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        Crystal Sandy Beach Lagoon
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-border bg-secondary/40 text-[10px] font-bold text-muted-foreground uppercase">
                            <th className="p-3 text-left">Type / Row</th>
                            <th className="p-3 text-center">BUA (m²)</th>
                            <th className="p-3 text-center">Avg. Plot (m²)</th>
                            <th className="p-3 text-left">Features</th>
                            <th className="p-3 text-right">Starting Price (EGP)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {[
                            {
                              type: "1st Row – Open to Sea Lagoon Villa",
                              bua: "331",
                              plot: "500",
                              feat: "5 Ensuite · Full Lagoon View",
                              price: "78,400,000",
                            },
                            {
                              type: "2nd Row – Open to Sea Lagoon Villa",
                              bua: "307",
                              plot: "500",
                              feat: "5 Ensuite · Partial Lagoon View",
                              price: "49,700,000",
                            },
                            {
                              type: "1st Row – Crystal Lagoon Villa",
                              bua: "272",
                              plot: "550",
                              feat: "5 Ensuite",
                              price: "55,000,000",
                            },
                            {
                              type: "1st Row – Crystal Lagoon Villa",
                              bua: "230",
                              plot: "450",
                              feat: "4 Ensuite",
                              price: "35,900,000",
                            },
                            {
                              type: "1st Row – Crystal Lagoon Twin House",
                              bua: "204",
                              plot: "400",
                              feat: "4 Ensuite",
                              price: "35,500,000",
                            },
                            {
                              type: "Townhouse",
                              bua: "180",
                              plot: "275/200",
                              feat: "4 Ensuite",
                              price: "30,800,000",
                            },
                            {
                              type: "Townhouse",
                              bua: "144",
                              plot: "275/200",
                              feat: "3 Ensuite",
                              price: "24,300,000",
                            },
                          ].map((l, i) => (
                            <tr key={i} className="hover:bg-secondary/20 transition-colors">
                              <td className="p-3 font-semibold text-primary">{l.type}</td>
                              <td className="p-3 text-center text-muted-foreground">{l.bua} m²</td>
                              <td className="p-3 text-center text-muted-foreground">{l.plot} m²</td>
                              <td className="p-3 text-foreground font-medium">{l.feat}</td>
                              <td className="p-3 text-right">
                                <span className="font-bold text-accent">
                                  EGP {l.price.toLocaleString()}
                                </span>
                                <span className="block text-[9px] text-muted-foreground">
                                  starting rate
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2b. Beach Chalets */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div className="border-b border-border pb-3 flex justify-between items-center flex-wrap gap-2">
                      <h4 className="font-semibold text-sm text-primary">Beach Chalets</h4>
                      <span className="text-[9px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        Crystal Sandy Beach Chalets
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-border bg-secondary/40 text-[10px] font-bold text-muted-foreground uppercase">
                            <th className="p-3 text-left">Type &amp; Floor</th>
                            <th className="p-3 text-center">BUA (m²)</th>
                            <th className="p-3 text-center">Terrace / Garden</th>
                            <th className="p-3 text-left">Features</th>
                            <th className="p-3 text-right">Starting Price (EGP)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {[
                            {
                              type: "Twin Chalet",
                              floor: "Ground",
                              bua: "161",
                              ext: "Terrace 20m² · Garden 200m²",
                              feat: "4 Beds + Nanny's Room",
                              price: "24,150,000",
                            },
                            {
                              type: "Twin Chalet",
                              floor: "Upper",
                              bua: "161",
                              ext: "Terrace 20m²",
                              feat: "4 Beds + Nanny's Room",
                              price: "20,150,000",
                            },
                            {
                              type: "Twin Chalet",
                              floor: "Ground",
                              bua: "141",
                              ext: "Terrace 25m² · Garden 200m²",
                              feat: "3 Beds + Nanny's Room",
                              price: "20,700,000",
                            },
                            {
                              type: "Twin Chalet",
                              floor: "Upper",
                              bua: "141",
                              ext: "Terrace 25m²",
                              feat: "3 Beds + Nanny's Room",
                              price: "17,150,000",
                            },
                            {
                              type: "Quad Chalet",
                              floor: "Ground",
                              bua: "153",
                              ext: "Terrace 40m² · Garden 200m²",
                              feat: "3 Beds + Nanny's Room",
                              price: "21,700,000",
                            },
                            {
                              type: "Quad Chalet",
                              floor: "Upper",
                              bua: "153",
                              ext: "Terrace 40m²",
                              feat: "3 Beds + Nanny's Room",
                              price: "18,800,000",
                            },
                            {
                              type: "Quad Chalet",
                              floor: "Ground",
                              bua: "125",
                              ext: "Terrace 25m² · Garden 75m²",
                              feat: "2 Beds + Nanny's Room",
                              price: "18,800,000",
                            },
                            {
                              type: "Quad Chalet",
                              floor: "Upper",
                              bua: "125",
                              ext: "Terrace 25m²",
                              feat: "2 Beds + Nanny's Room",
                              price: "15,600,000",
                            },
                          ].map((c, i) => (
                            <tr key={i} className="hover:bg-secondary/20 transition-colors">
                              <td className="p-3">
                                <span className="font-semibold text-primary block">{c.type}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {c.floor} Floor
                                </span>
                              </td>
                              <td className="p-3 text-center text-muted-foreground">{c.bua} m²</td>
                              <td className="p-3 text-center text-muted-foreground">{c.ext}</td>
                              <td className="p-3 text-foreground font-medium">{c.feat}</td>
                              <td className="p-3 text-right">
                                <span className="font-bold text-accent">
                                  EGP {c.price.toLocaleString()}
                                </span>
                                <span className="block text-[9px] text-muted-foreground">
                                  starting rate
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          ) : (
            availabilityBySlug(c.slug) && (
              <Section title="Live Availability">
                <AvailabilitySection
                  data={availabilityBySlug(c.slug)!}
                  projectSlug={c.slug}
                  onRegisterInterest={(type) => {
                    setLeadUnit(type);
                    setInterestModalOpen(true);
                  }}
                />
              </Section>
            )
          )}

          {/* Unit types */}
          <Section title="Unit types">
            <div className="flex flex-wrap gap-2">
              {c.types.map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-primary"
                >
                  {t}
                </span>
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
                Bespoke plans available — contact your Property Atlas advisor for current launch offers
                and exclusive discounts.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="tel:201029324783"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Phone className="h-4 w-4" /> Speak to an advisor
                </a>
                <Link
                  to="/calculator"
                  search={{ project: c.slug }}
                  className="inline-flex items-center gap-2 rounded-full border border-accent bg-card px-5 py-2.5 text-sm font-semibold text-accent hover:bg-accent/5 transition-colors"
                >
                  <Calculator className="h-4 w-4" /> Calculate installments
                </Link>
              </div>
            </div>
          </Section>

          {/* Location Highlights & Connectivity */}
          <Section title="Location Highlights & Connectivity">
            <div className="space-y-4">
              {/* Location Metric Badges Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Destination & City
                    </div>
                    <div className="font-semibold text-primary text-sm mt-0.5 truncate">
                      {destination?.name || c.destination}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {c.city || destinationLocationString(c.destination)}
                    </div>
                  </div>
                </div>

                {c.km ? (
                  <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Highway Marker
                      </div>
                      <div className="font-semibold text-primary text-sm mt-0.5">
                        Km {c.km} Coastal Corridor
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Prime Mediterranean shoreline access
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        Urban Setting
                      </div>
                      <div className="font-semibold text-primary text-sm mt-0.5">
                        {c.city ? c.city.split(",")[0] : destination?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Established infrastructure & services
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex items-start gap-3 sm:col-span-2 lg:col-span-1">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Coordinates & Maps
                    </div>
                    <div className="font-semibold text-primary text-xs mt-0.5 font-mono">
                      {c.lat.toFixed(4)}° N, {c.lng.toFixed(4)}° E
                    </div>
                    <a
                      href={
                        c.mapsUrl ||
                        projectLocations[c.slug]?.mapsUrl ||
                        `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" /> Direct Google Maps Link
                    </a>
                  </div>
                </div>
              </div>

              {/* Highlights List */}
              {c.highlights && c.highlights.length > 0 && (
                <div className="rounded-2xl border border-border/80 bg-secondary/30 p-5 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" /> Key Location & Project Highlights
                  </h3>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {c.highlights.map((h: string, idx: number) => {
                      const isLocation =
                        /location|km|road|axis|district|settlement|zayed|cairo|coast|ring|corridor|square|pyramid|sea|beach|gulf|bay|gate|street|teseen/i.test(
                          h
                        );
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs leading-relaxed font-medium transition-colors ${
                            isLocation
                              ? "bg-accent/5 border-accent/30 text-accent-foreground font-semibold"
                              : "bg-card border-border/60 text-foreground/90"
                          }`}
                        >
                          <span
                            className={`mt-0.5 rounded-full p-1 shrink-0 ${
                              isLocation ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {isLocation ? (
                              <MapPin className="h-3 w-3" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </span>
                          <span>{h}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Section>

          {/* Location map */}
          <Section title="Interactive Location Map">
            <div className="h-[300px] md:h-[360px] overflow-hidden rounded-2xl border border-border shadow-soft">
              <MapClient
                compounds={[c]}
                focus={c}
                showLandmarks={false}
                className="h-full w-full"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                {c.city ?? destinationLocationString(c.destination)}
                {c.km ? ` · km ${c.km}` : ""}
              </span>
              <a
                href={
                  c.mapsUrl ||
                  projectLocations[c.slug]?.mapsUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`
                }
                target="_blank"
                rel="noreferrer"
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
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Starting from
            </div>
            <div className="mt-1 font-display text-3xl font-semibold text-primary">
              EGP {c.priceFrom}M
            </div>
            <div className="mt-4 space-y-2.5">
              <Button
                className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                size="lg"
                onClick={() => setInterestModalOpen(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" /> Register Interest
              </Button>
              <Button
                onClick={() => {
                  toggleFav(c.slug);
                  trackEvent({
                    type: isFav ? "unsave" : "save",
                    slug: c.slug,
                    area: c.destination,
                  });
                }}
                variant="outline"
                className="w-full rounded-full"
                size="lg"
              >
                <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
                {isFav ? "Saved to favorites" : "Save to favorites"}
              </Button>
              <Link to="/calculator" search={{ project: c.slug }} className="block w-full">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-accent text-accent hover:bg-accent/5"
                  size="lg"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Installment Calculator
                </Button>
              </Link>
            </div>

            {/* Developer card */}
            {dev && (
              <Link
                to="/developers/$slug"
                params={{ slug: dev.slug }}
                className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors"
              >
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
              <Link
                to="/destinations/$slug"
                params={{ slug: destination.slug }}
                className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-secondary/50 p-3 hover:bg-secondary transition-colors"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: destination.color + "22" }}
                >
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
              <a
                href={dev.website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-2 text-xs text-accent hover:underline"
              >
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
            <div className="font-display text-lg font-semibold text-primary">
              EGP {c.priceFrom}M
            </div>
          </div>
          <Link to="/calculator" search={{ project: c.slug }} className="shrink-0">
            <Button variant="outline" size="sm" className="rounded-full border-accent text-accent">
              <Calculator className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            onClick={() => toggleFav(c.slug)}
            variant="outline"
            size="sm"
            className="rounded-full shrink-0"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-sunset text-sunset" : ""}`} />
          </Button>
          <Button
            onClick={() => setInterestModalOpen(true)}
            size="sm"
            className="rounded-full bg-accent text-accent-foreground font-semibold px-4 cursor-pointer"
          >
            Register Interest
          </Button>
        </div>
      </div>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="bg-gradient-sand">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:py-14 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-primary">
                More in {destination?.name}
              </h2>
              {destination && (
                <Link
                  to="/destinations/$slug"
                  params={{ slug: destination.slug }}
                  className="text-sm text-accent hover:underline"
                >
                  View all in {destination.name} →
                </Link>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <CompoundCard key={r.slug} c={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Action Bar (< lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-md p-3 lg:hidden shadow-2xl flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider truncate">
            Starting from
          </div>
          <div className="font-display text-base font-extrabold text-primary leading-tight truncate">
            EGP {c.priceFrom}M
          </div>
        </div>

        <Button
          size="sm"
          className="flex-1 rounded-xl bg-accent text-accent-foreground font-bold text-xs py-2.5 h-10 shadow-sm cursor-pointer"
          onClick={() => setInterestModalOpen(true)}
        >
          <Sparkles className="mr-1.5 h-3.5 w-3.5 shrink-0" /> Register Interest
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            toggleFav(c.slug);
            trackEvent({ type: isFav ? "unsave" : "save", slug: c.slug, area: c.destination });
          }}
          className="rounded-xl border-border px-3 h-10 shrink-0"
        >
          <Heart
            className={`h-4 w-4 ${isFav ? "fill-sunset text-sunset" : "text-muted-foreground"}`}
          />
        </Button>

        <Link to="/calculator" search={{ project: c.slug }} className="shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-accent text-accent px-3 h-10"
          >
            <Calculator className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Register Interest Modal */}
      <Dialog
        open={interestModalOpen}
        onOpenChange={(open) => {
          setInterestModalOpen(open);
          if (!open) setLeadUnit("");
        }}
      >
        <DialogContent className="max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
          <DialogHeader className="text-left sm:text-left">
            <DialogTitle className="font-display text-2xl font-bold text-primary">
              Register Interest
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Interested in <strong className="text-primary font-semibold">{c.name}</strong>? Fill
              out your details below and an agent will call you.
            </p>
          </DialogHeader>

          <form onSubmit={handleRegisterInterest} className="space-y-4 mt-3">
            <div className="space-y-1.5">
              <label
                htmlFor="lead-name"
                className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                Full Name
              </label>
              <input
                id="lead-name"
                type="text"
                required
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lead-phone"
                className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                Phone Number
              </label>
              <input
                id="lead-phone"
                type="tel"
                required
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                placeholder="e.g. +20 100 123 4567"
                className="w-full rounded-xl border border-border/80 bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="lead-unit"
                  className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  Preferred Unit
                </label>
                <div className="relative">
                  <select
                    id="lead-unit"
                    value={leadUnit}
                    onChange={(e) => setLeadUnit(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-3.5 pr-8 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
                  >
                    {(c.types && c.types.length > 0
                      ? c.types
                      : ["Apartment", "Chalet", "Villa", "Townhouse", "Twin House"]
                    ).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="lead-interest"
                  className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  Type of Interest
                </label>
                <div className="relative">
                  <select
                    id="lead-interest"
                    value={leadInterestType}
                    onChange={(e) => setLeadInterestType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-3.5 pr-8 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
                  >
                    <option value="Buying">Buying</option>
                    <option value="Renting">Renting</option>
                    <option value="Investing">Investing</option>
                    <option value="Selling">Selling</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                    <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="lead-time"
                className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80"
              >
                Best Time to Call
              </label>
              <div className="relative">
                <select
                  id="lead-time"
                  value={leadTime}
                  onChange={(e) => setLeadTime(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border/80 bg-background/50 pl-3.5 pr-8 py-2.5 text-xs font-medium text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
                >
                  <option value="Any Time">Any Time</option>
                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                  <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <div className="pt-3 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl cursor-pointer"
                onClick={() => setInterestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-accent text-accent-foreground font-bold cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Interest"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    
      {/* Client Proposal PDF Modal */}
      {proposalModalOpen && (
        <PdfProposalModal
          data={{
            projectName: c.name,
            projectSlug: c.slug,
            developerName: c.developer,
            location: destination ? `${destination.name}, Egypt` : `${c.destination.replace("-", " ").toUpperCase()}, Egypt`,
            unitType: c.types && c.types.length > 0 ? c.types[0] : "Luxury Layout",
            areaSqm: c.unitSizes || "145",
            startingPriceEgp: (c.priceFrom || 10) * 1000000,
            paymentPlanStr: c.paymentPlan || "10% DP over 8 Yrs",
            dpPct: 10,
            durationYrs: 8,
            deliveryNote: String(c.deliveryYear),
            amenities: c.amenities,
            description: c.blurb,
          }}
          onClose={() => setProposalModalOpen(false)}
        />
      )}
    </Shell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-card"}`}
    >
      <div
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${accent ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent"}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-display text-base font-semibold text-primary leading-tight">
        {value}
      </div>
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


function MasterplanModal({
  c,
  masterPlanUrl,
  onClose,
}: {
  c: any;
  masterPlanUrl?: string;
  onClose: () => void;
}) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 25, 300));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const handleShareWhatsApp = () => {
    const url = masterPlanUrl || `${window?.location?.origin || "https://propertyatlas.eg"}/projects/${c.slug}/1.jpg`;
    const text = `*${c.name} Official Master Plan* (${c.developer})
View site layout & masterplan map:
${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-200 ${
        isFullscreen ? "p-0" : "p-4 sm:p-6"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative flex flex-col w-full max-w-5xl h-[88vh] rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? "h-full w-full max-w-none rounded-none border-none" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-zinc-900/90 px-6 py-4 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground font-bold shadow-sm">
              <MapIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Official Master Plan Layout
                </span>
                <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/20">
                  HD Site Footprint
                </span>
              </div>
              <h3 className="font-display font-bold text-white text-base leading-tight mt-0.5">
                {c.name}
              </h3>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {masterPlanUrl && (
              <>
                {/* Zoom controls */}
                <div className="flex items-center gap-1 rounded-xl bg-zinc-800/80 border border-white/10 p-1 text-xs text-white">
                  <button
                    onClick={handleZoomOut}
                    className="rounded-lg p-1.5 hover:bg-zinc-700 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="px-2 font-mono font-bold text-[11px] min-w-[42px] text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="rounded-lg p-1.5 hover:bg-zinc-700 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="rounded-lg p-1.5 hover:bg-zinc-700 transition-colors border-l border-white/10 ml-0.5"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Direct Download */}
                <a
                  href={masterPlanUrl}
                  download={`${c.name.replace(/[^a-zA-Z0-9]/g, "_")}_Masterplan.jpg`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Download Map
                </a>

                {/* Share WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  Share Map
                </button>
              </>
            )}

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl border border-white/10 bg-zinc-800 p-2 text-white/80 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-zinc-800 p-2 text-white/80 hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer Frame */}
        <div className="relative flex-1 bg-zinc-950 overflow-auto flex items-center justify-center p-4">
          {masterPlanUrl ? (
            <div
              className="transition-transform duration-200 flex items-center justify-center min-h-full min-w-full"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "center center",
              }}
            >
              <img
                src={masterPlanUrl}
                alt={`${c.name} Master Plan`}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-900/60 rounded-2xl border border-white/10 max-w-md my-auto">
              <div className="mx-auto rounded-2xl bg-accent/15 p-5 w-fit mb-4 text-accent border border-accent/20">
                <MapIcon className="h-10 w-10" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Official Master Plan Pending</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                The high-resolution masterplan layout for <strong className="text-white">{c.name}</strong> is currently being formatted by {c.developer}.
              </p>
              <a
                href={`https://wa.me/201029324783?text=Hi!%20I%20am%20requesting%20the%20official%20master%20plan%20for%20${encodeURIComponent(c.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all py-3 px-6 shadow-lg"
              >
                Request Masterplan via WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-zinc-900/80 px-6 py-3 text-xs text-zinc-400 shrink-0">
          <div>
            Developer: <strong className="text-white">{c.developer}</strong> • Location: <strong className="text-white">{destinationLocationString(c.destination)}</strong>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            Use zoom controls or scroll to inspect site layout
          </div>
        </div>
      </div>
    </div>
  );
}
