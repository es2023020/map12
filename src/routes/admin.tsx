import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import { useDebounce } from "@/lib/useDebounce";
import { BrochuresMatcherTab } from "@/components/admin/BrochuresMatcherTab";
import { MapClient } from "@/components/map/MapClient";
import { compounds } from "@/data/compounds";
import { availability } from "@/data/availability";
import { destinations } from "@/data/destinations";
import * as XLSX from "xlsx";
import { projectLocations } from "@/data/project-locations";
import {
  ShieldCheck,
  Users,
  CreditCard,
  TrendingUp,
  Check,
  ExternalLink,
  Building2,
  MapPin,
  Layers,
  LayoutGrid,
  Calculator,
  Sliders,
  ShieldAlert,
  Send,
  Bot,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  FileText,
  HelpCircle,
  Database,
  Upload,
  AlertCircle,
  RefreshCw,
  Star,
  ArrowLeftRight,
  CheckCircle,
  Info,
  X,
  Image as ImageIcon,
  ArrowLeft,
  FileSpreadsheet,
  Sparkles,
  Download,
  Search,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const { loadAvailabilityAsync } = await import("@/data/availability");
    await loadAvailabilityAsync();
  },
  head: () => ({
    meta: [
      { title: "Page Not Found — Property Atlas" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabType =
  | "overview"
  | "companies"
  | "destinations"
  | "projects"
  | "launches"
  | "availability"
  | "map"
  | "tools"
  | "people"
  | "crm"
  | "ai"
  | "campaigns"
  | "audit"
  | "brochures"
  | "review";

function AdminPage() {
  const user = useStore((s) => s.user);
  const signIn = useStore((s) => s.signIn);
  const signOut = useStore((s) => s.signOut);

  // Admin credentials checking
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com";

  // Form states for login & stealth 404 security gate
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showGate, setShowGate] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.search.includes("access=") || window.location.search.includes("admin=")) {
        setShowGate(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      emailInput.toLowerCase() === "elsayedshoeip70@gmail.com" &&
      passwordInput === "Sayed@shoeip8"
    ) {
      const success = signIn(emailInput, passwordInput);
      if (success) {
        setLoginError("");
      } else {
        setLoginError("Login handler failed. Verify store configurations.");
      }
    } else {
      setLoginError("Invalid Administrator credentials.");
    }
  };

  if (!user || !isAdmin) {
    if (!showGate) {
      return (
        <Shell>
          <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
            <div
              onClick={() => {
                const next = clickCount + 1;
                setClickCount(next);
                if (next >= 3) setShowGate(true);
              }}
              className="cursor-default select-none mb-4 group"
            >
              <h1 className="font-display text-8xl font-extrabold text-primary/20 transition-colors group-hover:text-primary/30">
                404
              </h1>
            </div>
            <h2 className="font-display text-2xl font-bold text-primary">Page Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              The page you are looking for does not exist, has been removed, or is temporarily unavailable.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="/"
                className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                Back to Home
              </a>
              <a
                href="/projects"
                className="rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold text-primary hover:bg-secondary transition-colors"
              >
                Browse Projects
              </a>
            </div>
          </div>
        </Shell>
      );
    }
    return (
      <Shell>
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-transparent to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="text-center relative">
              <div className="mx-auto h-12 w-12 bg-accent/15 rounded-2xl flex items-center justify-center text-accent shadow-soft mb-3">
                <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">Property Atlas Admin Gate</h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Super-Admin Control layer access panel. Please enter credentials to proceed.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="elsayedshoeip70@gmail.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs font-semibold text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent/90 transition-colors shadow-lg"
              >
                Sign In to Command Center
              </button>
            </form>
          </div>
        </div>
      </Shell>
    );
  }

  return <AdminDashboardPanel onLogout={signOut} />;
}

// ─── Sub-component: Super-Admin Command Center Panel ────────────────────────
function AdminDashboardPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const user = useStore((s) => s.user);

  const [leadSearch, setLeadSearch] = useState("");
  const [leadStageFilter, setLeadStageFilter] = useState("");
  const updateLeadStage = useStore((s) => s.updateLeadStage);
  const deleteLead = useStore((s) => s.deleteLead);

  // Read database state collections with fallback to empty arrays
  const rawCompounds = useStore((s) => s.compoundsList);
  const rawDestinations = useStore((s) => s.destinationsList);
  const rawDevelopers = useStore((s) => s.developersList);
  const rawAvailability = useStore((s) => s.availabilityList);
  const rawAuditLogs = useStore((s) => s.auditLogs);
  const rawLeads = useStore((s) => s.leads);
  const usersDatabase = useStore((s) => s.usersDatabase) || [];

  const compoundsList = useMemo(() => rawCompounds || [], [rawCompounds]);
  const destinationsList = useMemo(() => rawDestinations || [], [rawDestinations]);
  const developersList = useMemo(() => rawDevelopers || [], [rawDevelopers]);
  const availabilityList = useMemo(() => rawAvailability || [], [rawAvailability]);
  const auditLogs = useMemo(() => rawAuditLogs || [], [rawAuditLogs]);
  const leads = useMemo(() => rawLeads || [], [rawLeads]);

  // If collections are missing due to old localStorage schema rehydration, re-seed them immediately
  useEffect(() => {
    const state = useStore.getState();
    if (!state.compoundsList || state.compoundsList.length === 0) {
      const derivedDevs = Array.from(new Set(compounds.map((c) => c.developer))).map((name) => ({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        legalName: `${name} S.A.E.`,
        description: `${name} is a leading real estate developer in Egypt, renowned for high-quality builds and luxury communities.`,
        phone: "+20 19688",
        email: `info@${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
        address: "Cairo, Egypt",
        tier: "Tier A",
        status: "Verified",
        projects: compounds.filter((c) => c.developer === name).map((c) => c.name),
      }));

      useStore.setState({
        compoundsList: compounds,
        availabilityList: availability,
        destinationsList: destinations,
        developersList: derivedDevs,
        auditLogs: [
          {
            id: "a1",
            actor: "System",
            entity: "Database",
            action: "Initialized Property Atlas Command Center databases",
            timestamp: Date.now(),
          },
        ],
      });
    }
  }, [rawCompounds]);

  // CRUD actions
  const addProject = useStore((s) => s.addProject);
  const updateProject = useStore((s) => s.updateProject);
  const deleteProject = useStore((s) => s.deleteProject);

  const addDestination = useStore((s) => s.addDestination);
  const updateDestination = useStore((s) => s.updateDestination);
  const deleteDestination = useStore((s) => s.deleteDestination);

  const addDeveloper = useStore((s) => s.addDeveloper);
  const updateDeveloper = useStore((s) => s.updateDeveloper);
  const deleteDeveloper = useStore((s) => s.deleteDeveloper);

  const updateAvailability = useStore((s) => s.updateAvailability);
  const bulkUpdateAvailability = useStore((s) => s.bulkUpdateAvailability);
  const removeCustomBrochure = useStore((s) => s.removeCustomBrochure);
  const exportDatabaseBackup = useStore((s) => s.exportDatabaseBackup);
  const importDatabaseBackup = useStore((s) => s.importDatabaseBackup);

  const addPendingUpload = useStore((s) => s.addPendingUpload);
  const approvePendingUpload = useStore((s) => s.approvePendingUpload);
  const rejectPendingUpload = useStore((s) => s.rejectPendingUpload);
  const pendingUploadsList = useStore((s) => s.pendingUploadsList);

  // Selected Detail workspaces (Dedicated Webpages)
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedDeveloperSlug, setSelectedDeveloperSlug] = useState<string | null>(null);
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState<string | null>(null);

  const [adminSearch, setAdminSearch] = useState("");
  const debouncedAdminSearch = useDebounce(adminSearch, 250);

  const adminSearchResults = useMemo(() => {
    if (!debouncedAdminSearch) return null;
    const q = debouncedAdminSearch.toLowerCase();

    // Match Projects
    const matchedProjects = compoundsList
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.developer.toLowerCase().includes(q) ||
          c.destination.toLowerCase().includes(q),
      )
      .slice(0, 5);

    // Match Developers
    const matchedDevelopers = developersList
      .filter(
        (d) => d.name.toLowerCase().includes(q) || (d.blurb && d.blurb.toLowerCase().includes(q)),
      )
      .slice(0, 5);

    // Match Brochures
    const matchedBrochures = compoundsList
      .filter(
        (c) =>
          (c.brochureFileName && c.brochureFileName.toLowerCase().includes(q)) ||
          (c.brochureUrl && c.name.toLowerCase().includes(q)),
      )
      .slice(0, 5);

    return {
      projects: matchedProjects,
      developers: matchedDevelopers,
      brochures: matchedBrochures,
    };
  }, [debouncedAdminSearch, compoundsList, developersList]);

  const selectedProject = useMemo(() => {
    return compoundsList.find((c) => c.slug === selectedProjectSlug) || null;
  }, [selectedProjectSlug, compoundsList]);

  const selectedDeveloper = useMemo(() => {
    return developersList.find((d) => d.slug === selectedDeveloperSlug) || null;
  }, [selectedDeveloperSlug, developersList]);

  const selectedDestination = useMemo(() => {
    return destinationsList.find((d) => d.slug === selectedDestinationSlug) || null;
  }, [selectedDestinationSlug, destinationsList]);

  // Form states for adding/editing items
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddDeveloperModal, setShowAddDeveloperModal] = useState(false);
  const [showAddDestinationModal, setShowAddDestinationModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Dependency Safeguard states
  const [dependencyWarning, setDependencyWarning] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; slug: string } | null>(null);

  // Edit Unit Form state
  const [editingUnit, setEditingUnit] = useState<{ bType: string; unit: any } | null>(null);
  const [editUnitNo, setEditUnitNo] = useState("");
  const [editUnitType, setEditUnitType] = useState("");
  const [editUnitBeds, setEditUnitBeds] = useState(2);
  const [editUnitArea, setEditUnitArea] = useState(120);
  const [editUnitView, setEditUnitView] = useState("");
  const [editUnitPrice, setEditUnitPrice] = useState(4500000);
  const [editUnitStatus, setEditUnitStatus] = useState("Available");

  const loadUnitForEdit = (bType: string, u: any) => {
    setEditingUnit({ bType, unit: u });
    setEditUnitNo(u.unitNo || "");
    setEditUnitType(bType);
    setEditUnitBeds(u.beds || 2);
    setEditUnitArea(u.areaSqm || 120);
    setEditUnitView(u.view || "");
    setEditUnitPrice(u.priceEGP || 4500000);
    setEditUnitStatus(u.status || "Available");
  };

  // Project forms inputs
  const [pName, setPName] = useState("");
  const [pStatus, setPStatus] = useState("Off-Plan");
  const [pHandover, setPHandover] = useState(2028);
  const [pPermit, setPPermit] = useState("Permit-98231");
  const [pLat, setPLat] = useState("30.02");
  const [pLng, setPLng] = useState("31.45");
  const [pMapsUrl, setPMapsUrl] = useState("");
  const [pDev, setPDev] = useState("");
  const [pDest, setPDest] = useState("");
  const [pPrice, setPPrice] = useState(12);
  const [pSize, setPSize] = useState("50 feddan");
  const [pUnitSizes, setPUnitSizes] = useState("120-300 sqm");
  const [pPaymentPlan, setPPaymentPlan] = useState("10% down · 8 years installments");
  const [pBlurb, setPBlurb] = useState("");
  const [pAmenities, setPAmenities] = useState("Clubhouse, Pool, Gym, Security");
  const [pIsNewLaunch, setPIsNewLaunch] = useState(false);
  const [pParentSlug, setPParentSlug] = useState("");
  const [pKm, setPKm] = useState("");

  // Load project for edit form
  const loadProjectForForm = (proj: any) => {
    setEditingItem(proj);
    setPName(proj.name);
    setPStatus(proj.status);
    setPHandover(proj.deliveryYear);
    setPPermit(proj.permitNumber || "RERA-23849");
    setPLat(proj.lat !== undefined && proj.lat !== null ? String(proj.lat) : "30.02");
    setPLng(proj.lng !== undefined && proj.lng !== null ? String(proj.lng) : "31.45");
    setPMapsUrl(proj.mapsUrl || projectLocations[proj.slug]?.mapsUrl || "");
    setPDev(proj.developer);
    setPDest(proj.destination);
    setPPrice(proj.priceFrom);
    setPSize(proj.areaSize || "—");
    setPUnitSizes(proj.unitSizes || "—");
    setPPaymentPlan(proj.paymentPlan);
    setPBlurb(proj.blurb);
    setPAmenities(proj.amenities ? proj.amenities.join(", ") : "");
    setPIsNewLaunch(!!proj.isNewLaunch);
    setPParentSlug(proj.parentSlug || "");
    setPKm(proj.km !== undefined && proj.km !== null ? String(proj.km) : "");
    setShowAddProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = pName.trim() || "Untitled Project";
    const slug = editingItem
      ? editingItem.slug
      : resolvedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const amenitiesArr = pAmenities
      ? pAmenities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const destObj = destinationsList.find((d) => d.slug === pDest);
    const isNorthCoast = destObj?.region === "north-coast";
    const parsedLat = parseFloat(pLat) || 30.02;
    const parsedLng = parseFloat(pLng) || 31.45;

    const projData = {
      slug,
      name: resolvedName,
      status: pStatus || "Off-Plan",
      deliveryYear: Number(pHandover) || 2028,
      permitNumber: pPermit || "N/A",
      lat: parsedLat,
      lng: parsedLng,
      mapsUrl:
        pMapsUrl.trim() ||
        `https://www.google.com/maps/search/?api=1&query=${parsedLat},${parsedLng}`,
      developer: pDev || developersList[0]?.name || "SODIC",
      developerSlug: (pDev || developersList[0]?.name || "SODIC")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      destination: pDest || destinationsList[0]?.slug || "new-cairo",
      priceFrom: Number(pPrice) || 0,
      areaSize: pSize || "50 feddan",
      unitSizes: pUnitSizes || "120-300 sqm",
      paymentPlan: pPaymentPlan || "10% down · 8 years installments",
      blurb: pBlurb || "No description available.",
      amenities: amenitiesArr,
      hero: editingItem?.hero || "/projects/vea-new-cairo/1.jpg",
      gallery: editingItem?.gallery || ["/projects/vea-new-cairo/1.jpg"],
      types: editingItem?.types || ["Chalet", "Apartment"],
      isNewLaunch: pIsNewLaunch,
      parentSlug: pParentSlug || undefined,
      km: isNorthCoast && pKm ? Number(pKm) : undefined,
    };

    if (editingItem) {
      updateProject(slug, projData);
    } else {
      addProject(projData);
    }
    setShowAddProjectModal(false);
    setEditingItem(null);
    clearProjectForm();
  };

  const clearProjectForm = () => {
    setPName("");
    setPStatus("Off-Plan");
    setPHandover(2028);
    setPPermit("Permit-98231");
    setPLat("30.02");
    setPLng("31.45");
    setPMapsUrl("");
    setPDev("");
    setPDest("");
    setPPrice(12);
    setPSize("50 feddan");
    setPUnitSizes("120-300 sqm");
    setPPaymentPlan("10% down · 8 years installments");
    setPBlurb("");
    setPAmenities("Clubhouse, Pool, Gym, Security");
    setPIsNewLaunch(false);
    setPParentSlug("");
    setPKm("");
  };

  // Developer form inputs
  const [dName, setDName] = useState("");
  const [dLegal, setDLegal] = useState("");
  const [dPhone, setDPhone] = useState("");
  const [dEmail, setDEmail] = useState("");
  const [dAddress, setDAddress] = useState("");
  const [dTier, setDTier] = useState("Tier A");
  const [dDesc, setDDesc] = useState("");

  const handleSaveDeveloper = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = dName.trim() || "Untitled Developer";
    const slug = editingItem
      ? editingItem.slug
      : resolvedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const devData = {
      slug,
      name: resolvedName,
      legalName: dLegal || "N/A",
      description: dDesc || "No summary available.",
      phone: dPhone || "N/A",
      email: dEmail || "info@developer.com",
      address: dAddress || "Cairo, Egypt",
      tier: dTier || "Tier A",
      status: "Verified",
      projects: editingItem?.projects || [],
    };

    if (editingItem) {
      updateDeveloper(slug, devData);
    } else {
      addDeveloper(devData);
    }
    setShowAddDeveloperModal(false);
    setEditingItem(null);
    clearDevForm();
  };

  const loadDeveloperForForm = (dev: any) => {
    setEditingItem(dev);
    setDName(dev.name);
    setDLegal(dev.legalName);
    setDPhone(dev.phone);
    setDEmail(dev.email);
    setDAddress(dev.address);
    setDTier(dev.tier);
    setDDesc(dev.description);
    setShowAddDeveloperModal(true);
  };

  const clearDevForm = () => {
    setDName("");
    setDLegal("");
    setDPhone("");
    setDEmail("");
    setDAddress("");
    setDTier("Tier A");
    setDDesc("");
  };

  // Destination form inputs
  const [destName, setDestName] = useState("");
  const [destRegion, setDestRegion] = useState<any>("greater-cairo");
  const [destColor, setDestColor] = useState("#8B5CF6");
  const [destCity, setDestCity] = useState("Cairo");
  const [destKm, setDestKm] = useState("");
  const [destBlurb, setDestBlurb] = useState("");
  const [destLat, setDestLat] = useState(30.03);
  const [destLng, setDestLng] = useState(31.47);

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedName = destName.trim() || "Untitled Destination";
    const slug = editingItem
      ? editingItem.slug
      : resolvedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const destData = {
      slug,
      name: resolvedName,
      region: destRegion || "greater-cairo",
      color: destColor || "#8B5CF6",
      city: destCity || "Cairo",
      kmRange: destKm || undefined,
      blurb: destBlurb || "No overview available.",
      center: [Number(destLat) || 30.03, Number(destLng) || 31.47] as [number, number],
      zoom: 12,
      hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    };

    if (editingItem) {
      updateDestination(slug, destData);
    } else {
      addDestination(destData);
    }
    setShowAddDestinationModal(false);
    setEditingItem(null);
    clearDestForm();
  };

  const loadDestForForm = (dest: any) => {
    setEditingItem(dest);
    setDestName(dest.name);
    setDestRegion(dest.region);
    setDestColor(dest.color);
    setDestCity(dest.city || "Cairo");
    setDestKm(dest.kmRange || "");
    setDestBlurb(dest.blurb);
    setDestLat(dest.center[0]);
    setDestLng(dest.center[1]);
    setShowAddDestinationModal(true);
  };

  const clearDestForm = () => {
    setDestName("");
    setDestRegion("greater-cairo");
    setDestColor("#8B5CF6");
    setDestCity("Cairo");
    setDestKm("");
    setDestBlurb("");
    setDestLat(30.03);
    setDestLng(31.47);
  };

  // Availability bulk CSV/Excel Importer logic
  const [selectedAvailSlug, setSelectedAvailSlug] = useState("");
  const [selectedAvailDevSlug, setSelectedAvailDevSlug] = useState("");
  const [bypassReviewQueue, setBypassReviewQueue] = useState(false);
  const [pastedCSVData, setPastedCSVData] = useState("");
  const [bulkStatusMsg, setBulkStatusMsg] = useState("");

  const handleCSVImport = () => {
    if (!pastedCSVData.trim()) {
      setBulkStatusMsg("Error: Please paste some tabular CSV data.");
      return;
    }

    try {
      const lines = pastedCSVData
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length < 2) {
        setBulkStatusMsg("Error: Invalid CSV format. Missing rows.");
        return;
      }

      const headers = lines[0]
        .toLowerCase()
        .split(",")
        .map((h) => h.trim());
      const typeIdx = headers.indexOf("type");
      const priceIdx =
        headers.indexOf("price") !== -1 ? headers.indexOf("price") : headers.indexOf("priceegp");
      const bedsIdx = headers.indexOf("beds");
      const areaIdx =
        headers.indexOf("area") !== -1 ? headers.indexOf("area") : headers.indexOf("areasqm");

      if (typeIdx === -1 || priceIdx === -1) {
        setBulkStatusMsg("Error: CSV must contain 'Type' and 'Price' headers.");
        return;
      }

      const breakdownMap: Record<string, any> = {};

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map((c) => c.trim());
        const type = cols[typeIdx];
        const price = parseFloat(cols[priceIdx]) || 0;
        const beds = bedsIdx !== -1 ? parseInt(cols[bedsIdx]) || 2 : 2;
        const area = areaIdx !== -1 ? parseFloat(cols[areaIdx]) || 120 : 120;

        if (!type) continue;

        const key = `${type}-${beds}`;
        if (!breakdownMap[key]) {
          breakdownMap[key] = {
            type,
            beds,
            available: 0,
            minSqm: area,
            maxSqm: area,
            minPriceM: price / 1_000_000,
            maxPriceM: price / 1_000_000,
            units: [],
          };
        }

        breakdownMap[key].available += 1;
        if (area < breakdownMap[key].minSqm) breakdownMap[key].minSqm = area;
        if (area > breakdownMap[key].maxSqm) breakdownMap[key].maxSqm = area;
        if (price / 1_000_000 < breakdownMap[key].minPriceM)
          breakdownMap[key].minPriceM = price / 1_000_000;
        if (price / 1_000_000 > breakdownMap[key].maxPriceM)
          breakdownMap[key].maxPriceM = price / 1_000_000;

        breakdownMap[key].units.push({
          id: `u_${Math.random().toString(36).slice(2, 9)}`,
          beds,
          finishing: "Finished",
          areaSqm: area,
          priceEGP: price,
          status: "Available",
        });
      }

      const breakdown = Object.values(breakdownMap);
      const totalAvailable = breakdown.reduce((acc, curr: any) => acc + curr.available, 0);

      const targetProj = compoundsList.find((c) => c.slug === selectedAvailSlug);

      const newAvail = {
        slug: selectedAvailSlug,
        developer: targetProj?.developer || "Unknown Developer",
        totalAvailable,
        breakdown,
        lastUpdated: new Date().toISOString(),
        note: "Imported via Super-Admin CSV Console",
      };

      updateAvailability(selectedAvailSlug, newAvail);
      setBulkStatusMsg(
        `Success: Imported ${totalAvailable} units across ${breakdown.length} layout types!`,
      );
      setPastedCSVData("");
    } catch (err: any) {
      setBulkStatusMsg(`Error parsing dataset: ${err.message}`);
    }
  };

  // Universal Excel File Parser (.xlsx, .xls, .csv)
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>, projSlug: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Select all non-overview sheets if multiple sheets exist
        let targetSheets = workbook.SheetNames;
        if (workbook.SheetNames.length > 1) {
          const nonOverview = workbook.SheetNames.filter(
            (sn) =>
              !["overview", "summary", "index", "instructions"].includes(sn.toLowerCase().trim()),
          );
          if (nonOverview.length > 0) targetSheets = nonOverview;
        }

        const breakdownMap: Record<string, any> = {};
        let totalParsedRowsCount = 0;
        const processedSheetNames: string[] = [];

        for (const sheetName of targetSheets) {
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) continue;
          const rawMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
          if (!rawMatrix || !rawMatrix.length) continue;

          // Universal Header Auto-Detection
          const findHeaderRow = (rows: any[][]) => {
            const keywords = [
              "type",
              "category",
              "unit",
              "bua",
              "area",
              "sqm",
              "price",
              "cost",
              "value",
              "egp",
              "beds",
              "bedroom",
              "project",
              "compound",
              "cluster",
              "view",
              "delivery",
              "status",
              "#",
            ];
            let maxScore = -1;
            let bestIdx = 0;
            for (let i = 0; i < Math.min(15, rows.length); i++) {
              const row = rows[i];
              if (!Array.isArray(row)) continue;
              let score = 0;
              row.forEach((cell) => {
                if (cell === null || cell === undefined || cell === "") return;
                const str = String(cell)
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "");
                if (keywords.some((k) => str.includes(k))) score += 2;
                else if (str.length > 0) score += 0.2;
              });
              if (score > maxScore && score >= 2) {
                maxScore = score;
                bestIdx = i;
              }
            }
            return bestIdx;
          };

          const headerIdx = findHeaderRow(rawMatrix);
          const headerRow = rawMatrix[headerIdx] || [];
          const headers = headerRow.map(
            (c: any, i: number) => String(c).trim() || `Column_${i + 1}`,
          );

          const findHeaderKey = (options: string[]) => {
            for (const opt of options) {
              const idx = headers.findIndex(
                (h) =>
                  h.toLowerCase().replace(/[^a-z0-9]+/g, "") ===
                  opt.toLowerCase().replace(/[^a-z0-9]+/g, ""),
              );
              if (idx >= 0) return headers[idx];
            }
            return null;
          };

          const typeKey =
            findHeaderKey(["type", "layout", "layouttype", "unittype", "category"]) || headers[0];
          const priceKey = findHeaderKey([
            "price",
            "priceegp",
            "unitprice",
            "egp",
            "cost",
            "value",
            "startingpriceegp",
            "pricefromegp",
            "pricesegp",
            "avgprice",
            "grandtotalpricingstructure",
            "unittotalwithfinishingprice",
          ]);
          const bedsKey = findHeaderKey(["beds", "bedrooms", "bedcount", "roomcount"]);
          const areaKey = findHeaderKey([
            "area",
            "size",
            "sqm",
            "areasqm",
            "bua",
            "unitarea",
            "aream2",
            "builtarea",
          ]);
          const unitNoKey = findHeaderKey(["unitno", "unitnumber", "unit", "no", "unitcode", "#"]);
          const viewKey = findHeaderKey(["view", "aspect", "unitview"]);
          const statusKey = findHeaderKey(["status", "availability", "unitstatus"]);

          const knownKeys = new Set(
            [typeKey, priceKey, bedsKey, areaKey, unitNoKey, viewKey, statusKey].filter(
              Boolean,
            ) as string[],
          );

          const parsePriceRange = (val: any) => {
            if (val === undefined || val === null || val === "") return { min: 0, max: 0 };
            if (typeof val === "number") return { min: val, max: val };
            let str = String(val).replace(/EGP/gi, "").replace(/,/g, "").trim();
            if (str.toLowerCase().includes("sold")) return { min: 0, max: 0 };
            let isMillion = false;
            if (str.toLowerCase().includes("m")) {
              isMillion = true;
              str = str.replace(/m/gi, "");
            }
            const parts = str
              .split(/[-–—up to to]/i)
              .map((p) => parseFloat(p.trim()))
              .filter((p) => !isNaN(p));
            if (parts.length === 0) return { min: 0, max: 0 };
            let min = parts[0];
            let max = parts.length > 1 ? parts[1] : parts[0];
            if (isMillion || (min < 1000 && min > 0)) {
              min *= 1000000;
              max *= 1000000;
            }
            return { min, max };
          };

          const parseAreaRange = (val: any) => {
            if (val === undefined || val === null || val === "") return { min: 0, max: 0 };
            if (typeof val === "number") return { min: val, max: val };
            const str = String(val)
              .replace(/m2|sqm|m/gi, "")
              .trim();
            const parts = str
              .split(/[-–—to]/i)
              .map((p) => parseFloat(p.trim()))
              .filter((p) => !isNaN(p));
            if (parts.length === 0) return { min: 0, max: 0 };
            if (parts.length === 1) return { min: parts[0], max: parts[0] };
            return { min: Math.min(...parts), max: Math.max(...parts) };
          };

          const dataMatrix = rawMatrix.slice(headerIdx + 1);

          dataMatrix.forEach((rowArray: any[], rIdx: number) => {
            if (!Array.isArray(rowArray)) return;
            const nonEmpties = rowArray.filter((c) => c !== "");
            if (nonEmpties.length === 0) return;

            const firstVal = String(rowArray[0] || "").toLowerCase();
            if (
              firstVal.startsWith("payment") ||
              firstVal.startsWith("note") ||
              firstVal.startsWith("contact") ||
              firstVal.startsWith("total")
            ) {
              return;
            }

            const rowObj: Record<string, any> = {};
            headers.forEach((h, cIdx) => {
              const v = rowArray[cIdx];
              if (v !== undefined && v !== null && v !== "") rowObj[h] = v;
            });

            const rawType =
              typeKey && rowObj[typeKey]
                ? String(rowObj[typeKey]).trim()
                : sheetName !== "Availability"
                  ? sheetName
                  : "Chalet";
            const priceRange = priceKey
              ? parsePriceRange(rowObj[priceKey])
              : { min: 5000000, max: 5000000 };
            const areaRange = areaKey ? parseAreaRange(rowObj[areaKey]) : { min: 120, max: 120 };
            const beds = bedsKey && rowObj[bedsKey] ? parseInt(String(rowObj[bedsKey])) || 2 : 2;
            const unitNo =
              unitNoKey && rowObj[unitNoKey]
                ? String(rowObj[unitNoKey]).trim()
                : `U-${totalParsedRowsCount + 1}`;
            const view =
              viewKey && rowObj[viewKey] ? String(rowObj[viewKey]).trim() : "Scenic View";
            const status =
              statusKey && rowObj[statusKey] ? String(rowObj[statusKey]).trim() : "Available";

            const extraFields: Record<string, any> = {};
            Object.keys(rowObj).forEach((k) => {
              if (!knownKeys.has(k) && rowObj[k] !== undefined && rowObj[k] !== "") {
                extraFields[k] = rowObj[k];
              }
            });

            const key = `${rawType}-${beds}`;
            if (!breakdownMap[key]) {
              breakdownMap[key] = {
                type: rawType,
                beds,
                available: 0,
                minSqm: areaRange.min || 120,
                maxSqm: areaRange.max || 120,
                minPriceM: (priceRange.min || 5000000) / 1000000,
                maxPriceM: (priceRange.max || 5000000) / 1000000,
                units: [],
              };
            }

            const bd = breakdownMap[key];
            const isSold = status.toLowerCase().includes("sold");
            bd.available += isSold ? 0 : 1;
            if (areaRange.min > 0 && areaRange.min < bd.minSqm) bd.minSqm = areaRange.min;
            if (areaRange.max > bd.maxSqm) bd.maxSqm = areaRange.max;
            if (priceRange.min > 0 && priceRange.min / 1000000 < bd.minPriceM)
              bd.minPriceM = priceRange.min / 1000000;
            if (priceRange.max / 1000000 > bd.maxPriceM) bd.maxPriceM = priceRange.max / 1000000;

            bd.units.push({
              id: `u_${Math.random().toString(36).slice(2, 9)}`,
              unitNo,
              beds,
              finishing: "Finished",
              areaSqm: areaRange.min || 120,
              view,
              priceEGP: priceRange.min || 5000000,
              status: isSold ? "Sold" : "Available",
              ...extraFields,
            });

            totalParsedRowsCount++;
          });

          processedSheetNames.push(sheetName);
        }

        const breakdown = Object.values(breakdownMap);
        const totalAvailable = breakdown.reduce((acc, curr: any) => acc + curr.available, 0);

        if (breakdown.length === 0) {
          alert("Could not parse any layout rows from the uploaded Excel file.");
          return;
        }

        const targetProj = compoundsList.find((c) => c.slug === projSlug);

        const newAvail = {
          slug: projSlug,
          developer: targetProj?.developer || "Unknown Developer",
          totalAvailable,
          breakdown,
          lastUpdated: new Date().toISOString(),
          note: `Imported ${totalParsedRowsCount} units from sheets: ${processedSheetNames.join(", ")} (${file.name})`,
        };

        if (bypassReviewQueue) {
          updateAvailability(projSlug, newAvail);
          alert(
            `Success: Excel file "${file.name}" processed across ${processedSheetNames.length} sheet(s)!\n• Parsed ${totalParsedRowsCount} rows (${totalAvailable} available units)\n• Updated live availability for project "${targetProj?.name || projSlug}". Previous units deleted.`,
          );
        } else {
          addPendingUpload({
            fileName: file.name,
            projectSlug: projSlug,
            developer: targetProj?.developer || "Unknown Developer",
            newAvail: newAvail,
            uploadedBy: user?.email || "elsayedshoeip70@gmail.com",
          });
          alert(
            `Success: Excel file "${file.name}" (${totalParsedRowsCount} rows across ${processedSheetNames.length} sheet(s)) uploaded to "Pending Review" queue for "${targetProj?.name || projSlug}".`,
          );
        }
      } catch (err: any) {
        alert(`Error parsing Excel sheet: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Universal Developer-Wide Excel File parser
  const handleDeveloperExcelImport = (e: React.ChangeEvent<HTMLInputElement>, devSlug: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetDev = developersList.find((d) => d.slug === devSlug);
    if (!targetDev) {
      alert("Error: Developer not found.");
      return;
    }
    const developerName = targetDev.name;

    // Filter compounds of this developer
    const devCompounds = compoundsList.filter(
      (c) => c.developer.toLowerCase() === developerName.toLowerCase(),
    );
    if (!devCompounds.length) {
      alert(
        `Error: There are no compounds registered for developer "${developerName}". Please link compounds to this developer first.`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        let targetSheets = workbook.SheetNames;
        if (workbook.SheetNames.length > 1) {
          const nonOverview = workbook.SheetNames.filter(
            (sn) =>
              !["overview", "summary", "index", "instructions"].includes(sn.toLowerCase().trim()),
          );
          if (nonOverview.length > 0) targetSheets = nonOverview;
        }

        const matchCompound = (val: string) => {
          if (!val) return null;
          const normalizedVal = val.toLowerCase().replace(/[^a-z0-9]+/g, "");
          let matched = devCompounds.find(
            (c) => c.name.toLowerCase().replace(/[^a-z0-9]+/g, "") === normalizedVal,
          );
          if (matched) return matched;
          matched = devCompounds.find(
            (c) => c.slug.toLowerCase().replace(/[^a-z0-9]+/g, "") === normalizedVal,
          );
          if (matched) return matched;
          matched = devCompounds.find((c) => {
            const normName = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
            const normSlug = c.slug.toLowerCase().replace(/[^a-z0-9]+/g, "");
            return (
              normName.includes(normalizedVal) ||
              normalizedVal.includes(normName) ||
              normSlug.includes(normalizedVal) ||
              normalizedVal.includes(normSlug)
            );
          });
          return matched || null;
        };

        const groupedAvailabilities: Record<string, Record<string, any>> = {}; // compoundSlug -> breakdownMap
        const unmatchedProjects = new Set<string>();
        let grandTotalRowsCount = 0;

        for (const sheetName of targetSheets) {
          const sheet = workbook.Sheets[sheetName];
          if (!sheet) continue;
          const rawMatrix = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
          if (!rawMatrix || !rawMatrix.length) continue;

          // Universal Header Auto-Detection
          const findHeaderRow = (rows: any[][]) => {
            const keywords = [
              "type",
              "category",
              "unit",
              "bua",
              "area",
              "sqm",
              "price",
              "cost",
              "value",
              "egp",
              "beds",
              "bedroom",
              "project",
              "compound",
              "cluster",
              "view",
              "delivery",
              "status",
              "#",
            ];
            let maxScore = -1;
            let bestIdx = 0;
            for (let i = 0; i < Math.min(15, rows.length); i++) {
              const row = rows[i];
              if (!Array.isArray(row)) continue;
              let score = 0;
              row.forEach((cell) => {
                if (cell === null || cell === undefined || cell === "") return;
                const str = String(cell)
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "");
                if (keywords.some((k) => str.includes(k))) score += 2;
                else if (str.length > 0) score += 0.2;
              });
              if (score > maxScore && score >= 2) {
                maxScore = score;
                bestIdx = i;
              }
            }
            return bestIdx;
          };

          const headerIdx = findHeaderRow(rawMatrix);
          const headerRow = rawMatrix[headerIdx] || [];
          const headers = headerRow.map(
            (c: any, i: number) => String(c).trim() || `Column_${i + 1}`,
          );

          const findHeaderKey = (options: string[]) => {
            for (const opt of options) {
              const idx = headers.findIndex(
                (h) =>
                  h.toLowerCase().replace(/[^a-z0-9]+/g, "") ===
                  opt.toLowerCase().replace(/[^a-z0-9]+/g, ""),
              );
              if (idx >= 0) return headers[idx];
            }
            return null;
          };

          const projectKey = findHeaderKey([
            "project",
            "compound",
            "development",
            "projectname",
            "compoundname",
            "property",
            "projectslug",
            "slug",
          ]);
          const typeKey =
            findHeaderKey(["type", "layout", "layouttype", "unittype", "category"]) || headers[0];
          const priceKey = findHeaderKey([
            "price",
            "priceegp",
            "unitprice",
            "egp",
            "cost",
            "value",
            "startingpriceegp",
            "pricefromegp",
            "pricesegp",
            "avgprice",
            "grandtotalpricingstructure",
            "unittotalwithfinishingprice",
          ]);
          const bedsKey = findHeaderKey(["beds", "bedrooms", "bedcount", "roomcount"]);
          const areaKey = findHeaderKey([
            "area",
            "size",
            "sqm",
            "areasqm",
            "bua",
            "unitarea",
            "aream2",
            "builtarea",
          ]);
          const unitNoKey = findHeaderKey(["unitno", "unitnumber", "unit", "no", "unitcode", "#"]);
          const viewKey = findHeaderKey(["view", "aspect", "unitview"]);
          const statusKey = findHeaderKey(["status", "availability", "unitstatus"]);

          const knownKeys = new Set(
            [typeKey, priceKey, bedsKey, areaKey, unitNoKey, viewKey, statusKey, projectKey].filter(
              Boolean,
            ) as string[],
          );

          const parsePriceRange = (val: any) => {
            if (val === undefined || val === null || val === "") return { min: 0, max: 0 };
            if (typeof val === "number") return { min: val, max: val };
            let str = String(val).replace(/EGP/gi, "").replace(/,/g, "").trim();
            if (str.toLowerCase().includes("sold")) return { min: 0, max: 0 };
            let isMillion = false;
            if (str.toLowerCase().includes("m")) {
              isMillion = true;
              str = str.replace(/m/gi, "");
            }
            const parts = str
              .split(/[-–—up to to]/i)
              .map((p) => parseFloat(p.trim()))
              .filter((p) => !isNaN(p));
            if (parts.length === 0) return { min: 0, max: 0 };
            let min = parts[0];
            let max = parts.length > 1 ? parts[1] : parts[0];
            if (isMillion || (min < 1000 && min > 0)) {
              min *= 1000000;
              max *= 1000000;
            }
            return { min, max };
          };

          const parseAreaRange = (val: any) => {
            if (val === undefined || val === null || val === "") return { min: 0, max: 0 };
            if (typeof val === "number") return { min: val, max: val };
            const str = String(val)
              .replace(/m2|sqm|m/gi, "")
              .trim();
            const parts = str
              .split(/[-–—to]/i)
              .map((p) => parseFloat(p.trim()))
              .filter((p) => !isNaN(p));
            if (parts.length === 0) return { min: 0, max: 0 };
            if (parts.length === 1) return { min: parts[0], max: parts[0] };
            return { min: Math.min(...parts), max: Math.max(...parts) };
          };

          const dataMatrix = rawMatrix.slice(headerIdx + 1);

          // Check if sheetName itself matches a compound
          const sheetMatchedComp = matchCompound(sheetName);

          dataMatrix.forEach((rowArray: any[], rIdx: number) => {
            if (!Array.isArray(rowArray)) return;
            const nonEmpties = rowArray.filter((c) => c !== "");
            if (nonEmpties.length === 0) return;

            const firstVal = String(rowArray[0] || "").toLowerCase();
            if (
              firstVal.startsWith("payment") ||
              firstVal.startsWith("note") ||
              firstVal.startsWith("contact") ||
              firstVal.startsWith("total")
            ) {
              return;
            }

            const rowObj: Record<string, any> = {};
            headers.forEach((h, cIdx) => {
              const v = rowArray[cIdx];
              if (v !== undefined && v !== null && v !== "") rowObj[h] = v;
            });

            // Match compound from row or sheet
            const rawProjectVal =
              projectKey && rowObj[projectKey] ? String(rowObj[projectKey]).trim() : "";
            const matchedComp = matchCompound(rawProjectVal) || sheetMatchedComp;

            if (!matchedComp) {
              if (rawProjectVal) unmatchedProjects.add(rawProjectVal);
              return;
            }

            const targetSlug = matchedComp.slug;
            if (!groupedAvailabilities[targetSlug]) {
              groupedAvailabilities[targetSlug] = {};
            }
            const breakdownMap = groupedAvailabilities[targetSlug];

            const rawType =
              typeKey && rowObj[typeKey]
                ? String(rowObj[typeKey]).trim()
                : sheetName !== "Availability"
                  ? sheetName
                  : "Chalet";
            const priceRange = priceKey
              ? parsePriceRange(rowObj[priceKey])
              : { min: 5000000, max: 5000000 };
            const areaRange = areaKey ? parseAreaRange(rowObj[areaKey]) : { min: 120, max: 120 };
            const beds = bedsKey && rowObj[bedsKey] ? parseInt(String(rowObj[bedsKey])) || 2 : 2;
            const unitNo =
              unitNoKey && rowObj[unitNoKey]
                ? String(rowObj[unitNoKey]).trim()
                : `U-${grandTotalRowsCount + 1}`;
            const view =
              viewKey && rowObj[viewKey] ? String(rowObj[viewKey]).trim() : "Scenic View";
            const status =
              statusKey && rowObj[statusKey] ? String(rowObj[statusKey]).trim() : "Available";

            const extraFields: Record<string, any> = {};
            Object.keys(rowObj).forEach((k) => {
              if (!knownKeys.has(k) && rowObj[k] !== undefined && rowObj[k] !== "") {
                extraFields[k] = rowObj[k];
              }
            });

            const key = `${rawType}-${beds}`;
            if (!breakdownMap[key]) {
              breakdownMap[key] = {
                type: rawType,
                beds,
                available: 0,
                minSqm: areaRange.min || 120,
                maxSqm: areaRange.max || 120,
                minPriceM: (priceRange.min || 5000000) / 1000000,
                maxPriceM: (priceRange.max || 5000000) / 1000000,
                units: [],
              };
            }

            const bd = breakdownMap[key];
            const isSold = status.toLowerCase().includes("sold");
            bd.available += isSold ? 0 : 1;
            if (areaRange.min > 0 && areaRange.min < bd.minSqm) bd.minSqm = areaRange.min;
            if (areaRange.max > bd.maxSqm) bd.maxSqm = areaRange.max;
            if (priceRange.min > 0 && priceRange.min / 1000000 < bd.minPriceM)
              bd.minPriceM = priceRange.min / 1000000;
            if (priceRange.max / 1000000 > bd.maxPriceM) bd.maxPriceM = priceRange.max / 1000000;

            bd.units.push({
              id: `u_${Math.random().toString(36).slice(2, 9)}`,
              unitNo,
              beds,
              finishing: "Finished",
              areaSqm: areaRange.min || 120,
              view,
              priceEGP: priceRange.min || 5000000,
              status: isSold ? "Sold" : "Available",
              ...extraFields,
            });

            grandTotalRowsCount++;
          });
        }

        const matchedSlugs = Object.keys(groupedAvailabilities);
        if (matchedSlugs.length === 0) {
          alert(
            `Error: No rows in the spreadsheet matched any registered projects for developer "${developerName}". Unmatched projects found: ${Array.from(unmatchedProjects).join(", ") || "None"}`,
          );
          return;
        }

        const importResults: string[] = [];

        for (const compoundSlug of matchedSlugs) {
          const breakdownMap = groupedAvailabilities[compoundSlug];
          const breakdown = Object.values(breakdownMap);
          const totalAvailable = breakdown.reduce((acc, curr: any) => acc + curr.available, 0);

          const targetProj = compoundsList.find((c) => c.slug === compoundSlug);
          const newAvail = {
            slug: compoundSlug,
            developer: developerName,
            totalAvailable,
            breakdown,
            lastUpdated: new Date().toISOString(),
            note: `Developer-wide Universal Excel Import (${targetDev.name}): ${file.name}`,
          };

          if (bypassReviewQueue) {
            updateAvailability(compoundSlug, newAvail);
            importResults.push(
              `${targetProj?.name || compoundSlug} (${totalAvailable} units) - Published Directly (Old units replaced)`,
            );
          } else {
            addPendingUpload({
              fileName: `${file.name} - ${targetProj?.name || compoundSlug}`,
              projectSlug: compoundSlug,
              developer: developerName,
              newAvail: newAvail,
              uploadedBy: user?.email || "elsayedshoeip70@gmail.com",
            });
            importResults.push(
              `${targetProj?.name || compoundSlug} (${totalAvailable} units) - Sent to Review Queue`,
            );
          }
        }

        const unmatchedText =
          unmatchedProjects.size > 0
            ? `\n\nUnmatched Project columns/sheets (skipped): ${Array.from(unmatchedProjects).join(", ")}`
            : "";

        alert(
          `Developer-Wide Import Complete for "${developerName}"!\n\nParsed ${grandTotalRowsCount} total rows across ${matchedSlugs.length} projects:\n${importResults.map((r) => `• ${r}`).join("\n")}${unmatchedText}`,
        );
      } catch (err: any) {
        alert(`Error parsing Excel sheet: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  // ─── Delete check / execute ───────────────────────────────────────────────
  const triggerDeleteCheck = (type: string, slug: string) => {
    if (type === "developer") {
      const linked = compoundsList.filter(
        (c) => c.developer === developersList.find((d) => d.slug === slug)?.name,
      );
      if (linked.length > 0) {
        setDependencyWarning(
          `This developer has ${linked.length} linked compounds (${linked
            .map((c) => c.name)
            .slice(0, 3)
            .join(
              ", ",
            )}${linked.length > 3 ? "..." : ""}). Deleting will also remove all associated data.`,
        );
        setDeleteTarget({ type, slug });
        return;
      }
    }
    if (type === "destination") {
      const linked = compoundsList.filter((c) => c.destination === slug);
      if (linked.length > 0) {
        setDependencyWarning(
          `This destination has ${linked.length} linked compounds. Deleting it may break those project pages.`,
        );
        setDeleteTarget({ type, slug });
        return;
      }
    }
    executeDeletion(type, slug);
  };

  const executeDeletion = (type: string, slug: string) => {
    if (type === "project") {
      deleteProject(slug);
      setSelectedProjectSlug(null);
    } else if (type === "developer") {
      deleteDeveloper(slug);
      setSelectedDeveloperSlug(null);
    } else if (type === "destination") {
      deleteDestination(slug);
      setSelectedDestinationSlug(null);
    }
    setDependencyWarning(null);
    setDeleteTarget(null);
  };

  // File upload simulator inside details pages
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "brochure" | "masterPlan" | "gallery" | "hero",
    projSlug: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result as string;

        if (field === "gallery") {
          const project = compoundsList.find((c) => c.slug === projSlug);
          if (project) {
            const gallery = [...(project.gallery || []), base64Content];
            updateProject(projSlug, { gallery });
          }
        } else if (field === "brochure") {
          const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
          const fileName = `${projSlug}.${ext}`;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "brochure");
          formData.append("fileName", fileName);

          const res = await fetch("/api/upload-asset", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Upload failed");
          }

          // Whether server upload succeeds or fails, always store the data URL so it works immediately in UI
          const updates = {
            brochureUrl: base64Content,
            brochureFileName: file.name,
            brochureType: file.type,
          };
          updateProject(projSlug, updates);
        } else if (field === "masterPlan") {
          // Store master plan as base64 data URL for instant viewing
          updateProject(projSlug, { masterPlanUrl: base64Content });
        } else if (field === "hero") {
          // Store hero cover image as base64 data URL for instant viewing
          updateProject(projSlug, { hero: base64Content });
        }

        setUploadingField(null);
        alert(`Success: "${file.name}" uploaded and synced to the main app!`);
      };
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
      setUploadingField(null);
    }
  };

  const handleAddGalleryImage = (projSlug: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    const project = compoundsList.find((c) => c.slug === projSlug);
    if (!project) return;
    const gallery = [...(project.gallery || []), imageUrl];
    updateProject(projSlug, { gallery });
  };

  const handleRemoveGalleryImage = (projSlug: string, index: number) => {
    const project = compoundsList.find((c) => c.slug === projSlug);
    if (!project) return;
    const gallery = (project.gallery || []).filter((_: any, i: number) => i !== index);
    updateProject(projSlug, { gallery });
  };

  const [newUnitNum, setNewUnitNum] = useState("");
  const [newUnitType, setNewUnitType] = useState("Apartment");
  const [newUnitBeds, setNewUnitBeds] = useState(2);
  const [newUnitArea, setNewUnitArea] = useState(120);
  const [newUnitView, setNewUnitView] = useState("Lagoon & Greenery");
  const [newUnitPrice, setNewUnitPrice] = useState(4500000);
  const [newUnitStatus, setNewUnitStatus] = useState<any>("Available");

  const handleAddUnit = (projSlug: string) => {
    const avail = availabilityList.find((a) => a.slug === projSlug) || {
      slug: projSlug,
      developer: selectedProject?.developer || "Unknown Developer",
      totalAvailable: 0,
      breakdown: [],
      lastUpdated: new Date().toISOString(),
    };
    const resolvedUnitNum = newUnitNum.trim() || `U-${avail.totalAvailable + 1}`;

    const newUnit = {
      id: `u_${Math.random().toString(36).slice(2, 9)}`,
      unitNo: resolvedUnitNum,
      type: newUnitType || "Apartment",
      beds: Number(newUnitBeds) || 2,
      areaSqm: Number(newUnitArea) || 120,
      view: newUnitView || "Garden",
      priceEGP: Number(newUnitPrice) || 5000000,
      status: newUnitStatus || "Available",
      finishing: "Finished",
    };

    const breakdown = [...avail.breakdown];
    let cat = breakdown.find((b) => b.type === (newUnitType || "Apartment"));
    if (!cat) {
      cat = {
        type: newUnitType || "Apartment",
        beds: Number(newUnitBeds) || 2,
        available: 0,
        minSqm: Number(newUnitArea) || 120,
        maxSqm: Number(newUnitArea) || 120,
        minPriceM: (Number(newUnitPrice) || 5000000) / 1_000_000,
        maxPriceM: (Number(newUnitPrice) || 5000000) / 1_000_000,
        units: [],
      };
      breakdown.push(cat);
    }

    cat.available += 1;
    cat.units = [...(cat.units || []), newUnit];

    cat.minSqm = Math.min(cat.minSqm, Number(newUnit.areaSqm));
    cat.maxSqm = Math.max(cat.maxSqm, Number(newUnit.areaSqm));
    cat.minPriceM = Math.min(cat.minPriceM, Number(newUnit.priceEGP) / 1_000_000);
    cat.maxPriceM = Math.max(cat.maxPriceM, Number(newUnit.priceEGP) / 1_000_000);

    const totalAvailable = breakdown.reduce((acc, curr) => acc + curr.available, 0);

    updateAvailability(projSlug, {
      ...avail,
      totalAvailable,
      breakdown,
      lastUpdated: new Date().toISOString(),
    });

    setNewUnitNum("");
    alert("Unit added successfully!");
  };

  const handleRemoveUnit = (projSlug: string, catType: string, unitId: string) => {
    const avail = availabilityList.find((a) => a.slug === projSlug);
    if (!avail) return;

    const breakdown = avail.breakdown
      .map((b: any) => {
        if (b.type === catType) {
          const units = (b.units || []).filter((u: any) => u.id !== unitId);
          return {
            ...b,
            available: units.length,
            units,
          };
        }
        return b;
      })
      .filter((b: any) => b.available > 0);

    const totalAvailable = breakdown.reduce((acc: number, curr: any) => acc + curr.available, 0);

    updateAvailability(projSlug, {
      ...avail,
      totalAvailable,
      breakdown,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleEditUnitSubmit = (projSlug: string) => {
    if (!editingUnit) return;
    const { bType, unit } = editingUnit;
    const avail = availabilityList.find((a) => a.slug === projSlug);
    if (!avail) return;
    const resolvedUnitNo = editUnitNo.trim() || unit.unitNo || "U-Row";

    let breakdown = avail.breakdown.map((b: any) => {
      if (b.type === bType) {
        const units = (b.units || []).map((u: any) => {
          if (u.id === unit.id) {
            return {
              ...u,
              unitNo: resolvedUnitNo,
              beds: Number(editUnitBeds) || 2,
              areaSqm: Number(editUnitArea) || 120,
              view: editUnitView || "Garden",
              priceEGP: Number(editUnitPrice) || 5000000,
              status: editUnitStatus || "Available",
            };
          }
          return u;
        });
        return {
          ...b,
          units,
        };
      }
      return b;
    });

    breakdown = breakdown
      .map((b: any) => {
        const units = b.units || [];
        if (units.length === 0) {
          return { ...b, available: 0 };
        }
        const sqms = units.map((u: any) => u.areaSqm);
        const prices = units.map((u: any) => u.priceEGP / 1_000_000);
        return {
          ...b,
          available: units.filter((u: any) => u.status === "Available").length,
          minSqm: Math.min(...sqms),
          maxSqm: Math.max(...sqms),
          minPriceM: Math.min(...prices),
          maxPriceM: Math.max(...prices),
        };
      })
      .filter((b: any) => b.units.length > 0);

    const totalAvailable = breakdown.reduce((acc: number, curr: any) => acc + curr.available, 0);

    updateAvailability(projSlug, {
      ...avail,
      totalAvailable,
      breakdown,
      lastUpdated: new Date().toISOString(),
    });
    setEditingUnit(null);
    alert("Unit updated successfully!");
  };

  const handleUpdateUnitStatus = (
    projSlug: string,
    catType: string,
    unitId: string,
    newStatus: string,
  ) => {
    const avail = availabilityList.find((a) => a.slug === projSlug);
    if (!avail) return;

    const breakdown = avail.breakdown.map((b: any) => {
      if (b.type === catType) {
        const units = (b.units || []).map((u: any) =>
          u.id === unitId ? { ...u, status: newStatus } : u,
        );
        return {
          ...b,
          units,
        };
      }
      return b;
    });

    updateAvailability(projSlug, {
      ...avail,
      breakdown,
      lastUpdated: new Date().toISOString(),
    });
  };

  // Map settings states
  const [pinnedProjectSlug, setPinnedProjectSlug] = useState("");
  const [editLat, setEditLat] = useState("31.025");
  const [editLng, setEditLng] = useState("30.015");
  const [editMapsUrl, setEditMapsUrl] = useState("");
  const [editKm, setEditKm] = useState("");

  const handleUpdatePinCoords = () => {
    const targetSlug = pinnedProjectSlug || compoundsList[0]?.slug;
    if (!targetSlug) return;
    const parsedLat = parseFloat(editLat) || 31.025;
    const parsedLng = parseFloat(editLng) || 30.015;

    updateProject(targetSlug, {
      lat: parsedLat,
      lng: parsedLng,
      km: editKm ? Number(editKm) : undefined,
      mapsUrl:
        editMapsUrl.trim() ||
        `https://www.google.com/maps/search/?api=1&query=${parsedLat},${parsedLng}`,
    });
    alert(
      `Success: GPS coordinates & Google Maps location for project "${targetSlug}" updated live!`,
    );
  };

  // Select defaults once list is populated
  useEffect(() => {
    if (compoundsList.length > 0) {
      if (!selectedAvailSlug) setSelectedAvailSlug(compoundsList[0].slug);
      if (!pinnedProjectSlug) setPinnedProjectSlug(compoundsList[0].slug);
    }
  }, [compoundsList, selectedAvailSlug, pinnedProjectSlug]);

  useEffect(() => {
    if (developersList.length > 0) {
      if (!selectedAvailDevSlug) setSelectedAvailDevSlug(developersList[0].slug);
    }
  }, [developersList, selectedAvailDevSlug]);

  useEffect(() => {
    const target = compoundsList.find((c) => c.slug === pinnedProjectSlug);
    if (target) {
      setEditLat(String(target.lat));
      setEditLng(String(target.lng));
      setEditKm(target.km !== undefined && target.km !== null ? String(target.km) : "");
      setEditMapsUrl(
        (target as any).mapsUrl ||
          projectLocations[target.slug]?.mapsUrl ||
          `https://www.google.com/maps/search/?api=1&query=${target.lat},${target.lng}`,
      );
    }
  }, [pinnedProjectSlug, compoundsList]);

  // Sidebar list of tab links
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "companies", label: "Developers CRUD", icon: Building2 },
    { id: "destinations", label: "Destinations CRUD", icon: MapPin },
    { id: "projects", label: "Projects CRUD", icon: Database },
    { id: "launches", label: "New Launches Manager", icon: Sparkles },
    { id: "availability", label: "Availability Manager", icon: LayoutGrid },
    { id: "review", label: "Pending Reviews", icon: CheckCircle },
    { id: "map", label: "Map Control", icon: Layers },
    { id: "tools", label: "Engine Tools", icon: Calculator },
    { id: "people", label: "Agents & RBAC", icon: Users },
    { id: "crm", label: "Leads", icon: Users },
    { id: "ai", label: "AI Grounding", icon: Bot },
    { id: "campaigns", label: "Broadcast Templates", icon: Send },
    { id: "audit", label: "System Audit Logs", icon: FileText },
    { id: "brochures", label: "Fuzzy brochures Linker", icon: FileText },
  ];

  return (
    <Shell>
      <div className="border-b border-border bg-zinc-950 text-white shadow-soft">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Super-Admin Console
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white mt-0.5">
                Real Estate Platform Command Center
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
            {/* Admin Global Search Bar */}
            <div className="relative w-64">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Fuzzy search admin details..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-8 py-2 text-xs text-white placeholder:text-zinc-500 focus:border-accent focus:outline-none transition-all shadow-inner"
                />
                {adminSearch && (
                  <button
                    onClick={() => setAdminSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Instant Search Results Dropdown Overlay */}
              {adminSearchResults && (
                <div className="absolute right-0 top-full z-[9999] mt-2 w-80 rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl space-y-3.5 text-xs text-left animate-in fade-in duration-150">
                  {/* Projects matches */}
                  {adminSearchResults.projects.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Database className="h-3 w-3" /> Projects (
                        {adminSearchResults.projects.length})
                      </div>
                      <div className="space-y-1">
                        {adminSearchResults.projects.map((p) => (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => {
                              setSelectedProjectSlug(p.slug);
                              setSelectedDeveloperSlug(null);
                              setSelectedDestinationSlug(null);
                              setAdminSearch("");
                            }}
                            className="w-full text-left p-2 rounded-lg bg-zinc-900/60 hover:bg-accent/15 hover:text-accent border border-transparent transition-all block truncate"
                          >
                            <span className="font-bold text-white block truncate">{p.name}</span>
                            <span className="text-[9px] text-muted-foreground block truncate mt-0.5">
                              {p.developer} · {p.destination.replace(/-/g, " ")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Developers matches */}
                  {adminSearchResults.developers.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Building2 className="h-3 w-3" /> Developers (
                        {adminSearchResults.developers.length})
                      </div>
                      <div className="space-y-1">
                        {adminSearchResults.developers.map((d) => (
                          <button
                            key={d.slug}
                            type="button"
                            onClick={() => {
                              setSelectedDeveloperSlug(d.slug);
                              setSelectedProjectSlug(null);
                              setSelectedDestinationSlug(null);
                              setAdminSearch("");
                            }}
                            className="w-full text-left p-2 rounded-lg bg-zinc-900/60 hover:bg-accent/15 hover:text-accent border border-transparent transition-all block truncate"
                          >
                            <span className="font-bold text-white block truncate">{d.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brochures matches */}
                  {adminSearchResults.brochures.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Brochures (
                        {adminSearchResults.brochures.length})
                      </div>
                      <div className="space-y-1">
                        {adminSearchResults.brochures.map((c) => (
                          <button
                            key={c.slug}
                            type="button"
                            onClick={() => {
                              setSelectedProjectSlug(c.slug);
                              setSelectedDeveloperSlug(null);
                              setSelectedDestinationSlug(null);
                              setAdminSearch("");
                            }}
                            className="w-full text-left p-2 rounded-lg bg-zinc-900/60 hover:bg-accent/15 hover:text-accent border border-transparent transition-all block truncate"
                          >
                            <span className="font-bold text-white block truncate">
                              {c.brochureFileName || `${c.name} brochure`}
                            </span>
                            <span className="text-[9px] text-muted-foreground block truncate mt-0.5">
                              Linked Project: {c.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {adminSearchResults.projects.length === 0 &&
                    adminSearchResults.developers.length === 0 &&
                    adminSearchResults.brochures.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground italic text-[11px]">
                        No fuzzy matches found.
                      </div>
                    )}
                </div>
              )}
            </div>

            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              Active Session: Admin
            </span>
            <button
              onClick={onLogout}
              className="rounded-xl border border-zinc-700 hover:border-destructive hover:text-destructive px-3.5 py-1.5 text-xs font-bold transition-colors bg-zinc-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-1.5 shrink-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setSelectedProjectSlug(null);
                    setSelectedDeveloperSlug(null);
                    setSelectedDestinationSlug(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.id &&
                    !selectedProjectSlug &&
                    !selectedDeveloperSlug &&
                    !selectedDestinationSlug
                      ? "bg-accent text-white shadow-soft"
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Core workspace content */}
          <main className="space-y-6 min-w-0">
            {/* ── DEDICATED PROJECT WEBPAGE ── */}
            {selectedProjectSlug && selectedProject ? (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6 relative overflow-hidden">
                {/* Header / Breadcrumb */}
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedProjectSlug(null)}
                      className="rounded-xl p-2.5 border border-border bg-secondary/30 hover:bg-secondary text-primary transition-all flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        Catalog &gt; Compound Page
                      </div>
                      <h2 className="font-display text-xl font-bold text-primary mt-0.5">
                        {selectedProject.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadProjectForForm(selectedProject)}
                      className="rounded-xl border border-border bg-secondary/30 hover:bg-secondary px-4 py-2 font-bold text-xs text-primary flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 text-accent" /> Edit Specs
                    </button>
                    <button
                      onClick={() => triggerDeleteCheck("project", selectedProject.slug)}
                      className="rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Project
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Specifications & Description */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="h-4.5 w-4.5 text-accent" /> Compound Specifications
                    </h3>

                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Developer (Company)</span>
                        <span className="text-primary font-bold">{selectedProject.developer}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Destination Region</span>
                        <span className="text-primary font-bold">
                          {selectedProject.destination.replace(/-/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Coordinates Pin</span>
                        <span className="text-accent font-mono font-bold">
                          {selectedProject.lat.toFixed(4)}, {selectedProject.lng.toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">RERA Permit ID</span>
                        <span className="text-primary font-bold font-mono">
                          {selectedProject.permitNumber || "RERA-23849"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Payment Plan</span>
                        <span className="text-primary font-bold">
                          {selectedProject.paymentPlan}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Price starts from</span>
                        <span className="text-primary font-bold">
                          EGP {selectedProject.priceFrom}M
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">Blurb Description</span>
                        <textarea
                          rows={4}
                          value={selectedProject.blurb}
                          onChange={(e) =>
                            updateProject(selectedProject.slug, { blurb: e.target.value })
                          }
                          className="w-full border border-border rounded-lg bg-card p-3 font-medium text-xs leading-relaxed text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Master Plan & Brochures file Upload Center */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="h-4.5 w-4.5 text-accent" /> Blueprints &amp; brochures
                      </h4>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {/* Brochure - any file type */}
                        <div className="border border-border/80 rounded-lg p-3 bg-secondary/15 flex flex-col gap-2">
                          <span className="block text-[9px] font-bold text-muted-foreground uppercase">
                            Sales Brochure (any format)
                          </span>
                          {selectedProject.brochureUrl && !selectedProject.brochureDeleted ? (
                            <div className="flex items-center justify-between gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-1.5">
                              <div className="flex items-center gap-1.5 truncate">
                                <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                                <span className="text-[9px] text-emerald-700 font-bold truncate">
                                  {selectedProject.brochureFileName || "Brochure uploaded"}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (selectedProject.brochureFileName) {
                                    removeCustomBrochure(selectedProject.brochureFileName);
                                  }
                                  updateProject(selectedProject.slug, {
                                    brochureUrl: undefined,
                                    brochureFileName: undefined,
                                    brochureType: undefined,
                                    brochureDeleted: true,
                                  });
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-500/10 p-0.5 rounded transition-all shrink-0"
                                title="Remove Brochure"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-muted-foreground italic">
                              No brochure available
                            </span>
                          )}
                          <div className="mt-auto pt-2 border-t border-border/40 text-[9px] text-muted-foreground italic leading-normal">
                            Brochure uploads are disabled from the admin panel. Map files in the
                            source code folder (
                            <code className="bg-secondary/40 px-1 py-0.5 rounded text-accent font-mono">
                              /public/brochures
                            </code>
                            ) and link them in{" "}
                            <code className="bg-secondary/40 px-1 py-0.5 rounded text-accent font-mono">
                              brochure-map.ts
                            </code>
                            .
                          </div>
                        </div>

                        {/* Cover Page (Hero Image) */}
                        <div className="border border-border/80 rounded-lg p-3 bg-secondary/15 flex flex-col gap-2">
                          <span className="block text-[9px] font-bold text-muted-foreground uppercase">
                            Cover Page (Hero Image)
                          </span>
                          {selectedProject.hero ? (
                            <div
                              className="relative rounded overflow-hidden"
                              style={{ height: 60 }}
                            >
                              <img
                                src={selectedProject.hero}
                                alt="Cover Page"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() =>
                                  updateProject(selectedProject.slug, { hero: undefined })
                                }
                                className="absolute top-1 right-1 rounded bg-black/50 text-white p-0.5 hover:bg-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-muted-foreground italic">
                              No cover page uploaded yet
                            </span>
                          )}
                          <label className="mt-auto w-full py-2 bg-accent text-white font-bold text-[10px] rounded hover:bg-accent/90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                            {uploadingField === "hero" ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            {uploadingField === "hero" ? "Uploading..." : "Upload Cover Page"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingField === "hero"}
                              onChange={(e) => handleFileUpload(e, "hero", selectedProject.slug)}
                            />
                          </label>
                        </div>

                        {/* Master Plan */}
                        <div className="border border-border/80 rounded-lg p-3 bg-secondary/15 flex flex-col gap-2">
                          <span className="block text-[9px] font-bold text-muted-foreground uppercase">
                            Master Plan Blueprint
                          </span>
                          {selectedProject.masterPlanUrl ? (
                            <div
                              className="relative rounded overflow-hidden"
                              style={{ height: 60 }}
                            >
                              <img
                                src={selectedProject.masterPlanUrl}
                                alt="Master Plan"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() =>
                                  updateProject(selectedProject.slug, { masterPlanUrl: undefined })
                                }
                                className="absolute top-1 right-1 rounded bg-black/50 text-white p-0.5 hover:bg-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-muted-foreground italic">
                              No master plan uploaded yet
                            </span>
                          )}
                          <label className="mt-auto w-full py-2 bg-accent text-white font-bold text-[10px] rounded hover:bg-accent/90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                            {uploadingField === "masterPlan" ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Upload className="h-3.5 w-3.5" />
                            )}
                            {uploadingField === "masterPlan"
                              ? "Uploading..."
                              : "Upload Master Plan"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingField === "masterPlan"}
                              onChange={(e) =>
                                handleFileUpload(e, "masterPlan", selectedProject.slug)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pictures Manager */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="h-4.5 w-4.5 text-accent" /> Photos Gallery manager
                    </h3>

                    {/* File Image Uploader */}
                    <div className="border-2 border-dashed border-border/80 bg-secondary/20 rounded-xl p-6 text-center flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-primary">
                        Upload New Gallery Photo
                      </span>
                      <span className="text-[9px] text-muted-foreground mt-0.5 mb-3">
                        Converts image to Data URL and saves to catalog
                      </span>

                      <label className="cursor-pointer rounded-lg bg-accent text-white font-semibold text-[10px] px-3.5 py-2 hover:bg-accent/90 transition-colors shadow-soft">
                        Select Photo File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "gallery", selectedProject.slug)}
                        />
                      </label>
                    </div>

                    {/* Web URL input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="newImgUrlInput"
                        placeholder="Or paste image web URL..."
                        className="flex-1 border border-border rounded-lg bg-secondary/20 px-3 py-1.5 text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(
                            "newImgUrlInput",
                          ) as HTMLInputElement;
                          if (input && input.value) {
                            handleAddGalleryImage(selectedProject.slug, input.value);
                            input.value = "";
                          }
                        }}
                        className="rounded-lg bg-accent text-white px-3 py-1.5 font-bold text-xs hover:bg-accent/90 transition-all"
                      >
                        Add URL
                      </button>
                    </div>

                    <div className="grid gap-3 grid-cols-3 max-h-96 overflow-y-auto pr-1">
                      {(selectedProject.gallery || []).map((imgUrl: string, idx: number) => (
                        <div
                          key={idx}
                          className="relative rounded-xl border border-border overflow-hidden h-24 group bg-secondary/40"
                        >
                          <img src={imgUrl} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveGalleryImage(selectedProject.slug, idx)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Units inventory worksheet */}
                <div className="border-t border-border/80 pt-6 mt-6 space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="font-display text-sm font-bold text-primary">
                        Interactive Units Inventory worksheet
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manage live units availability database records.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[250px_1fr] items-start">
                    {/* Add Unit Form */}
                    <div className="rounded-xl border border-border bg-secondary/10 p-4 space-y-3">
                      <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2 text-accent flex items-center gap-1">
                        <FileSpreadsheet className="h-4 w-4" /> Import Excel / CSV sheet
                      </span>
                      <div className="border border-dashed border-border/80 rounded-lg p-3 text-center bg-card">
                        <span className="text-[10px] text-muted-foreground block mb-2 font-medium">
                          Select Excel (.xlsx, .xls) or CSV file
                        </span>
                        <label className="cursor-pointer inline-block rounded bg-accent text-white font-bold text-[9px] px-2.5 py-1.5 hover:bg-accent/90 transition-colors shadow-soft">
                          Browse Sheet
                          <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                            onChange={(e) => handleExcelImport(e, selectedProject.slug)}
                          />
                        </label>
                      </div>

                      <div className="border-t border-border/40 pt-3">
                        <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                          + Add Single Inventory Unit
                        </span>

                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                              Unit Number
                            </label>
                            <input
                              type="text"
                              value={newUnitNum}
                              onChange={(e) => setNewUnitNum(e.target.value)}
                              placeholder="e.g. A-302"
                              className="w-full border border-border rounded-lg bg-card px-2.5 py-1.5 focus:outline-none"
                            />
                          </div>
                          <div className="grid gap-2 grid-cols-2">
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                                Type
                              </label>
                              <select
                                value={newUnitType}
                                onChange={(e) => setNewUnitType(e.target.value)}
                                className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none appearance-none"
                              >
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Chalet">Chalet</option>
                                <option value="Town House">Town House</option>
                                <option value="Twin House">Twin House</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                                Beds
                              </label>
                              <input
                                type="number"
                                value={newUnitBeds}
                                onChange={(e) => setNewUnitBeds(Number(e.target.value))}
                                className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="grid gap-2 grid-cols-2">
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                                Area (sqm)
                              </label>
                              <input
                                type="number"
                                value={newUnitArea}
                                onChange={(e) => setNewUnitArea(Number(e.target.value))}
                                className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                                Status
                              </label>
                              <select
                                value={newUnitStatus}
                                onChange={(e) => setNewUnitStatus(e.target.value)}
                                className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none appearance-none"
                              >
                                <option value="Available">Available</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Sold">Sold</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                              View Aspect
                            </label>
                            <input
                              type="text"
                              value={newUnitView}
                              onChange={(e) => setNewUnitView(e.target.value)}
                              placeholder="e.g. Sea & Lagoon"
                              className="w-full border border-border rounded-lg bg-card px-2.5 py-1.5 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground mb-1">
                              Price (EGP)
                            </label>
                            <input
                              type="number"
                              value={newUnitPrice}
                              onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                              className="w-full border border-border rounded-lg bg-card px-2.5 py-1.5 focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={() => handleAddUnit(selectedProject.slug)}
                            className="w-full py-2 bg-accent text-white font-bold text-xs rounded-lg hover:bg-accent/90 transition-all shadow-soft"
                          >
                            Add Unit
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Unit inventory table list */}
                    {(() => {
                      const avail = availabilityList.find((a) => a.slug === selectedProject.slug);
                      const allUnits = avail?.breakdown?.flatMap((b: any) => b.units || []) || [];
                      const standardKeys = [
                        "id",
                        "unitNo",
                        "type",
                        "beds",
                        "areaSqm",
                        "view",
                        "priceEGP",
                        "status",
                        "finishing",
                        "cluster",
                        "areaNote",
                        "deliveryNote",
                        "paymentPlan",
                      ];
                      const extraKeys = Array.from(
                        new Set<string>(allUnits.flatMap((u: any) => Object.keys(u))),
                      ).filter((k) => !standardKeys.includes(k));

                      return (
                        <div className="border border-border/85 rounded-xl overflow-hidden bg-card max-h-[500px] overflow-y-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-border bg-secondary/40 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                                <th className="p-3">Unit Number</th>
                                <th className="p-3">Layout Type</th>
                                <th className="p-3">Beds</th>
                                <th className="p-3">Area Size</th>
                                <th className="p-3">View Aspect</th>
                                <th className="p-3">Unit Price</th>
                                {extraKeys.map((key) => (
                                  <th key={key} className="p-3 capitalize">
                                    {key.replace(/([A-Z])/g, " $1")}
                                  </th>
                                ))}
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {!avail || !avail.breakdown?.length ? (
                                <tr>
                                  <td
                                    colSpan={8 + extraKeys.length}
                                    className="p-8 text-center text-xs text-muted-foreground italic"
                                  >
                                    No live inventory units listed. Use sheet uploader or add form.
                                  </td>
                                </tr>
                              ) : (
                                avail.breakdown.flatMap((b: any) => {
                                  const units = b.units ?? [];
                                  return units.map((u: any) => (
                                    <tr
                                      key={u.id}
                                      className="hover:bg-secondary/15 transition-colors font-medium"
                                    >
                                      <td className="p-3 font-semibold text-primary">
                                        {u.unitNo || "U-Row"}
                                      </td>
                                      <td className="p-3 text-muted-foreground">{b.type}</td>
                                      <td className="p-3 text-muted-foreground">{u.beds} Beds</td>
                                      <td className="p-3 text-muted-foreground">{u.areaSqm} sqm</td>
                                      <td className="p-3 text-muted-foreground truncate max-w-[120px]">
                                        {u.view || "Garden"}
                                      </td>
                                      <td className="p-3 text-primary font-semibold">
                                        EGP {(u.priceEGP / 1_000_000).toFixed(2)}M
                                      </td>
                                      {extraKeys.map((key) => (
                                        <td
                                          key={key}
                                          className="p-3 text-muted-foreground truncate max-w-[120px]"
                                          title={String(u[key] || "")}
                                        >
                                          {u[key] !== undefined && u[key] !== null
                                            ? String(u[key])
                                            : "—"}
                                        </td>
                                      ))}
                                      <td className="p-3">
                                        <select
                                          value={u.status}
                                          onChange={(e) =>
                                            handleUpdateUnitStatus(
                                              selectedProject.slug,
                                              b.type,
                                              u.id,
                                              e.target.value,
                                            )
                                          }
                                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border focus:outline-none ${
                                            u.status === "Available"
                                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                              : u.status === "Reserved"
                                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
                                          }`}
                                        >
                                          <option value="Available">Available</option>
                                          <option value="Reserved">Reserved</option>
                                          <option value="Sold">Sold</option>
                                        </select>
                                      </td>
                                      <td className="p-3 text-right space-x-1">
                                        <button
                                          onClick={() => loadUnitForEdit(b.type, u)}
                                          className="rounded-lg p-1 hover:bg-accent/10 text-accent border border-border"
                                        >
                                          <Edit className="h-3 w-3" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleRemoveUnit(selectedProject.slug, b.type, u.id)
                                          }
                                          className="rounded-lg p-1 hover:bg-destructive/10 text-destructive border border-border"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </td>
                                    </tr>
                                  ));
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : selectedDeveloperSlug && selectedDeveloper ? (
              // ── DEDICATED DEVELOPER WEBPAGE ──
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedDeveloperSlug(null)}
                      className="rounded-xl p-2.5 border border-border bg-secondary/30 hover:bg-secondary text-primary transition-all flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        Catalog &gt; Developer Profile Page
                      </div>
                      <h2 className="font-display text-xl font-bold text-primary mt-0.5">
                        {selectedDeveloper.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadDeveloperForForm(selectedDeveloper)}
                      className="rounded-xl border border-border bg-secondary/30 hover:bg-secondary px-4 py-2 font-bold text-xs text-primary flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 text-accent" /> Edit Profile
                    </button>
                    <button
                      onClick={() => triggerDeleteCheck("developer", selectedDeveloper.slug)}
                      className="rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Developer
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="h-4.5 w-4.5 text-accent" /> Brand Metadata
                    </h3>

                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Legal name</span>
                        <span className="text-primary font-bold">
                          {selectedDeveloper.legalName}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Hotline Support</span>
                        <span className="text-primary font-bold">{selectedDeveloper.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">HQ Address</span>
                        <span className="text-primary font-bold">{selectedDeveloper.address}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Email Contact</span>
                        <span className="text-accent font-bold font-mono">
                          {selectedDeveloper.email}
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">Corporate Summary</span>
                        <textarea
                          rows={4}
                          value={selectedDeveloper.description}
                          onChange={(e) =>
                            updateDeveloper(selectedDeveloper.slug, { description: e.target.value })
                          }
                          className="w-full border border-border rounded-lg bg-card p-3 font-medium text-xs leading-relaxed text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="h-4.5 w-4.5 text-accent" /> Linked Compounds
                    </h3>

                    <div className="border border-border/80 rounded-xl divide-y divide-border/60 bg-card overflow-hidden">
                      {compoundsList
                        .filter((c) => c.developer === selectedDeveloper.name)
                        .map((c) => (
                          <div
                            key={c.slug}
                            className="p-3 flex justify-between items-center hover:bg-secondary/10 transition-colors font-medium"
                          >
                            <div>
                              <span className="text-xs font-bold text-primary block">{c.name}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {c.destination.replace(/-/g, " ")}
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedProjectSlug(c.slug)}
                              className="rounded-lg border border-border px-3 py-1 text-[10px] font-bold text-accent bg-secondary/30 hover:bg-accent hover:text-white transition-all"
                            >
                              Manage →
                            </button>
                          </div>
                        ))}
                    </div>

                    {/* Developer-wide availability uploader */}
                    <div className="bg-secondary/15 p-4 rounded-xl border border-border space-y-3 mt-4">
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                          <FileSpreadsheet className="h-4 w-4 text-accent" /> Developer-Wide Excel
                          Import
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Upload an availability spreadsheet (.xlsx, .csv) with a 'Project' /
                          'Compound' column. This will parse and update all projects belonging to{" "}
                          {selectedDeveloper.name} that are listed in the sheet.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-card p-3 rounded-lg border border-border/60">
                        <div className="flex flex-col items-start gap-1">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-semibold text-primary">
                            <input
                              type="checkbox"
                              checked={bypassReviewQueue}
                              onChange={(e) => setBypassReviewQueue(e.target.checked)}
                              className="rounded border-zinc-700 bg-card text-accent focus:ring-accent h-3 w-3"
                            />
                            <span>Direct Publish (Bypass Review Queue)</span>
                          </label>
                          <span className="text-[9px] text-muted-foreground">
                            If unchecked, uploads go to the Admin Review Queue.
                          </span>
                        </div>

                        <label className="cursor-pointer rounded-lg bg-accent text-white font-semibold text-[10px] px-3.5 py-2 hover:bg-accent/90 transition-colors shadow-soft">
                          Upload Developer Excel
                          <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            className="hidden"
                            onChange={(e) => handleDeveloperExcelImport(e, selectedDeveloper.slug)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedDestinationSlug && selectedDestination ? (
              // ── DEDICATED DESTINATION WEBPAGE ──
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedDestinationSlug(null)}
                      className="rounded-xl p-2.5 border border-border bg-secondary/30 hover:bg-secondary text-primary transition-all flex items-center gap-1"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">
                        Catalog &gt; Destination Page
                      </div>
                      <h2 className="font-display text-xl font-bold text-primary mt-0.5">
                        {selectedDestination.name}
                      </h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadDestForForm(selectedDestination)}
                      className="rounded-xl border border-border bg-secondary/30 hover:bg-secondary px-4 py-2 font-bold text-xs text-primary flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 text-accent" /> Edit Specs
                    </button>
                    <button
                      onClick={() => triggerDeleteCheck("destination", selectedDestination.slug)}
                      className="rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Destination
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Specs */}
                  <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="h-4.5 w-4.5 text-accent" /> Geographic Specs
                    </h3>

                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Region belt</span>
                        <span className="text-primary font-bold">{selectedDestination.region}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Governorate City</span>
                        <span className="text-primary font-bold">
                          {selectedDestination.city || "Cairo"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Kilometer range</span>
                        <span className="text-primary font-bold">
                          {selectedDestination.kmRange || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Map center</span>
                        <span className="text-accent font-mono font-bold text-[10px]">
                          {selectedDestination.center ? selectedDestination.center.join(", ") : "—"}
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">
                          Lifestyle Description
                        </span>
                        <textarea
                          rows={4}
                          value={selectedDestination.blurb}
                          onChange={(e) =>
                            updateDestination(selectedDestination.slug, { blurb: e.target.value })
                          }
                          className="w-full border border-border rounded-lg bg-card p-3 font-medium text-xs leading-relaxed text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Image Manager */}
                  <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="h-4.5 w-4.5 text-accent" /> Hero Image
                    </h3>

                    <div className="rounded-xl border border-border bg-card p-3 space-y-3">
                      {/* Current hero preview */}
                      <div className="relative rounded-xl overflow-hidden" style={{ height: 140 }}>
                        <img
                          src={
                            selectedDestination.hero ||
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
                          }
                          alt="Hero"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-[9px] text-white/80 font-semibold">
                            Current hero image
                          </span>
                        </div>
                      </div>
                      {/* File uploader */}
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-border/80 rounded-lg p-3 text-center hover:border-accent/60 transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                          <span className="text-[10px] font-bold text-primary block">
                            Upload new hero image
                          </span>
                          <span className="text-[9px] text-muted-foreground">JPEG, PNG, WebP</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = () => {
                              updateDestination(selectedDestination.slug, {
                                hero: reader.result as string,
                              });
                            };
                          }}
                        />
                      </label>
                      {/* URL input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Or paste image URL..."
                          id={`destHeroUrl-${selectedDestination.slug}`}
                          className="flex-1 border border-border rounded-lg bg-secondary/20 px-2 py-1.5 text-[10px] focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const inp = document.getElementById(
                              `destHeroUrl-${selectedDestination.slug}`,
                            ) as HTMLInputElement;
                            if (inp?.value)
                              updateDestination(selectedDestination.slug, { hero: inp.value });
                          }}
                          className="rounded-lg bg-accent text-white px-2.5 py-1.5 text-[10px] font-bold hover:bg-accent/90"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Linked Compounds */}
                  <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="h-4.5 w-4.5 text-accent" /> Linked Compounds (
                      {
                        compoundsList.filter((c) => c.destination === selectedDestination.slug)
                          .length
                      }
                      )
                    </h3>

                    <div className="border border-border/80 rounded-xl divide-y divide-border/60 bg-card overflow-hidden max-h-72 overflow-y-auto">
                      {compoundsList
                        .filter((c) => c.destination === selectedDestination.slug)
                        .map((c) => (
                          <div
                            key={c.slug}
                            className="p-3 flex justify-between items-center hover:bg-secondary/10 transition-colors font-medium"
                          >
                            <div>
                              <span className="text-xs font-bold text-primary block">{c.name}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {c.developer}
                              </span>
                            </div>
                            <button
                              onClick={() => setSelectedProjectSlug(c.slug)}
                              className="rounded-lg border border-border px-3 py-1 text-[10px] font-bold text-accent bg-secondary/30 hover:bg-accent hover:text-white transition-all"
                            >
                              Manage →
                            </button>
                          </div>
                        ))}
                      {compoundsList.filter((c) => c.destination === selectedDestination.slug)
                        .length === 0 && (
                        <div className="p-6 text-center text-xs text-muted-foreground italic">
                          No compounds linked to this destination yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ── MAIN TABBED WORKSPACE CONTENT ──
              <>
                {/* overview */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-4">
                      {[
                        {
                          label: "Total Projects",
                          val: compoundsList.length,
                          color: "text-blue-500",
                          icon: Database,
                        },
                        {
                          label: "Active Units",
                          val: availabilityList.reduce((acc, curr) => acc + curr.totalAvailable, 0),
                          color: "text-emerald-500",
                          icon: LayoutGrid,
                        },
                        { label: "System Agents", val: 42, color: "text-purple-500", icon: Users },
                        {
                          label: "WhatsApp Dispatches",
                          val: 1284,
                          color: "text-green-500",
                          icon: Send,
                        },
                      ].map((k) => (
                        <div
                          key={k.label}
                          className="rounded-2xl border border-border bg-card p-5 shadow-soft flex items-center gap-4"
                        >
                          <div className={`rounded-xl p-3 bg-secondary/60 ${k.color}`}>
                            <k.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase text-muted-foreground">
                              {k.label}
                            </div>
                            <div className="font-display text-2xl font-black text-primary mt-1">
                              {k.val}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 space-y-4">
                        <h3 className="font-display text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4" /> Data Integrity Alerts
                        </h3>
                        <div className="space-y-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          <div className="p-3 bg-amber-500/10 rounded-xl flex items-center justify-between">
                            <span>⚠️ 4 compounds missing master plans uploader files</span>
                            <button
                              onClick={() => setActiveTab("projects")}
                              className="underline text-[10px]"
                            >
                              Fix
                            </button>
                          </div>
                          <div className="p-3 bg-amber-500/10 rounded-xl flex items-center justify-between">
                            <span>⚠️ 2 projects show lat/lng coordinate outliers</span>
                            <button
                              onClick={() => setActiveTab("map")}
                              className="underline text-[10px]"
                            >
                              Adjust
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                        <h3 className="font-display text-sm font-bold text-primary">
                          Command shortcuts
                        </h3>
                        <div className="grid gap-2 grid-cols-2">
                          <button
                            onClick={() => {
                              clearProjectForm();
                              setEditingItem(null);
                              setShowAddProjectModal(true);
                            }}
                            className="rounded-xl border border-border bg-secondary/30 hover:border-accent/40 p-3 text-left font-bold text-xs flex flex-col justify-between h-20 transition-all"
                          >
                            <Plus className="h-4 w-4 text-accent" />
                            <span>Add New Project</span>
                          </button>
                          <button
                            onClick={() => {
                              clearDevForm();
                              setEditingItem(null);
                              setShowAddDeveloperModal(true);
                            }}
                            className="rounded-xl border border-border bg-secondary/30 hover:border-accent/40 p-3 text-left font-bold text-xs flex flex-col justify-between h-20 transition-all"
                          >
                            <Plus className="h-4 w-4 text-accent" />
                            <span>Add Company/Dev</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* companies */}
                {activeTab === "companies" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h2 className="font-display text-lg font-bold text-primary">
                          Company &amp; Developer Directory
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Manage partner real estate development conglomerates. Click any row to
                          view its webpage profile.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          clearDevForm();
                          setEditingItem(null);
                          setShowAddDeveloperModal(true);
                        }}
                        className="rounded-xl bg-accent text-white px-3.5 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Add Developer
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Company Name</th>
                            <th className="p-3">Legal Entity</th>
                            <th className="p-3">Reputation Tier</th>
                            <th className="p-3">Verify Status</th>
                            <th className="p-3">Linked Compounds</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {developersList.map((d) => (
                            <tr
                              key={d.slug}
                              className="hover:bg-secondary/15 transition-colors font-medium cursor-pointer"
                              onClick={() => setSelectedDeveloperSlug(d.slug)}
                            >
                              <td className="p-3 font-semibold text-primary hover:text-accent transition-colors flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {d.name}
                              </td>
                              <td className="p-3 text-muted-foreground">{d.legalName}</td>
                              <td className="p-3">
                                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-600 border border-blue-500/20 font-bold">
                                  {d.tier}
                                </span>
                              </td>
                              <td className="p-3 text-emerald-600 font-bold">{d.status}</td>
                              <td className="p-3 text-muted-foreground">
                                {compoundsList.filter((c) => c.developer === d.name).length}{" "}
                                projects
                              </td>
                              <td
                                className="p-3 text-right flex justify-end gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => loadDeveloperForForm(d)}
                                  className="rounded-lg p-1.5 border border-border hover:bg-secondary text-primary"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => triggerDeleteCheck("developer", d.slug)}
                                  className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* destinations */}
                {activeTab === "destinations" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h2 className="font-display text-lg font-bold text-primary">
                          Destination regions
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Manage districts, cities, and resort ranges. Click any row to view its
                          webpage.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          clearDestForm();
                          setEditingItem(null);
                          setShowAddDestinationModal(true);
                        }}
                        className="rounded-xl bg-accent text-white px-3.5 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Add Destination
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Destination slug</th>
                            <th className="p-3">Community name</th>
                            <th className="p-3">Region Range</th>
                            <th className="p-3">Map center coords</th>
                            <th className="p-3">Overlay Pin Color</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {destinationsList.map((d) => (
                            <tr
                              key={d.slug}
                              className="hover:bg-secondary/15 transition-colors cursor-pointer"
                              onClick={() => setSelectedDestinationSlug(d.slug)}
                            >
                              <td className="p-3 text-muted-foreground font-semibold font-mono">
                                {d.slug}
                              </td>
                              <td className="p-3 font-semibold text-primary hover:text-accent transition-colors flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {d.name}
                              </td>
                              <td className="p-3">
                                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-purple-600 border border-purple-500/20 font-bold">
                                  {d.region}
                                </span>
                              </td>
                              <td className="p-3 text-muted-foreground font-mono">
                                {d.center ? d.center.join(", ") : "—"}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3.5 h-3.5 rounded-full"
                                    style={{ background: d.color }}
                                  ></span>
                                  <span className="text-[10px] font-bold font-mono">{d.color}</span>
                                </div>
                              </td>
                              <td
                                className="p-3 text-right flex justify-end gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => loadDestForForm(d)}
                                  className="rounded-lg p-1.5 border border-border hover:bg-secondary text-primary"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => triggerDeleteCheck("destination", d.slug)}
                                  className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* projects */}
                {activeTab === "projects" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h2 className="font-display text-lg font-bold text-primary">
                          Compounds database Catalog
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Manage listings, photos, and specs. Click on a project to open its
                          dedicated editor page.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          clearProjectForm();
                          setEditingItem(null);
                          setShowAddProjectModal(true);
                        }}
                        className="rounded-xl bg-accent text-white px-3.5 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Add Compound
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Compound Name</th>
                            <th className="p-3">Developer</th>
                            <th className="p-3">Region</th>
                            <th className="p-3">Handover</th>
                            <th className="p-3">RERA Permit</th>
                            <th className="p-3">Price From</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {compoundsList.map((c) => (
                            <tr
                              key={c.slug}
                              className="hover:bg-secondary/15 transition-colors cursor-pointer"
                              onClick={() => setSelectedProjectSlug(c.slug)}
                            >
                              <td className="p-3 font-semibold text-primary hover:text-accent transition-colors flex items-center gap-2">
                                <Database className="h-4 w-4 text-muted-foreground" />
                                {c.name}
                              </td>
                              <td className="p-3 text-muted-foreground">{c.developer}</td>
                              <td className="p-3 font-semibold text-accent">
                                {c.destination.replace(/-/g, " ")}
                              </td>
                              <td className="p-3 text-muted-foreground">{c.deliveryYear}</td>
                              <td className="p-3 text-muted-foreground font-mono">
                                {c.permitNumber || "RERA-90184"}
                              </td>
                              <td className="p-3 font-bold text-primary">EGP {c.priceFrom}M</td>
                              <td
                                className="p-3 text-right flex justify-end gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => loadProjectForForm(c)}
                                  className="rounded-lg p-1.5 border border-border hover:bg-secondary text-primary"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => triggerDeleteCheck("project", c.slug)}
                                  className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* launches */}
                {activeTab === "launches" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-4 border-b border-border/40 pb-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-accent animate-pulse" /> 2026 New
                          Launches Controller
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add, remove, and manage exclusive pre-market and off-plan projects in the
                          New Launches lists.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          clearProjectForm();
                          setEditingItem(null);
                          setPIsNewLaunch(true);
                          setShowAddProjectModal(true);
                        }}
                        className="rounded-xl bg-accent text-white px-4 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="h-4 w-4" /> Create Brand New Launch
                      </button>
                    </div>

                    {/* Promote Existing Project dropdown */}
                    <div className="bg-secondary/15 p-4 rounded-xl border border-border/60 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                          Promote Existing Project to Launch
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Select any standard compound in your database and push it into the New
                          Launches list.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          id="promote-project-select"
                          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold focus:outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Choose project...
                          </option>
                          {compoundsList
                            .filter((c) => !c.isNewLaunch && !c.parentSlug)
                            .map((c) => (
                              <option key={c.slug} value={c.slug}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => {
                            const sel = document.getElementById(
                              "promote-project-select",
                            ) as HTMLSelectElement;
                            if (sel && sel.value) {
                              updateProject(sel.value, { isNewLaunch: true });
                              sel.value = "";
                            }
                          }}
                          className="rounded-lg bg-accent text-white px-3 py-1.5 font-bold text-xs hover:bg-accent/90 transition-all"
                        >
                          Promote to Launch
                        </button>
                      </div>
                    </div>

                    {/* List of New Launches */}
                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Compound Name</th>
                            <th className="p-3">Developer</th>
                            <th className="p-3">Region</th>
                            <th className="p-3">Starting Price</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {compoundsList.filter((c) => c.isNewLaunch).length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-8 text-center text-muted-foreground italic"
                              >
                                No active 2026 launches. Select an existing project to promote it or
                                create a new one!
                              </td>
                            </tr>
                          ) : (
                            compoundsList
                              .filter((c) => c.isNewLaunch)
                              .map((c) => (
                                <tr
                                  key={c.slug}
                                  className="hover:bg-secondary/15 transition-colors"
                                >
                                  <td className="p-3 font-semibold text-primary">{c.name}</td>
                                  <td className="p-3 text-muted-foreground">{c.developer}</td>
                                  <td className="p-3 font-semibold text-accent">
                                    {c.destination.replace(/-/g, " ")}
                                  </td>
                                  <td className="p-3 font-bold text-primary">EGP {c.priceFrom}M</td>
                                  <td className="p-3 text-right flex justify-end gap-1.5">
                                    <button
                                      onClick={() => updateProject(c.slug, { isNewLaunch: false })}
                                      className="rounded-lg px-2.5 py-1.5 border border-border hover:bg-secondary text-xs text-primary font-bold transition-all"
                                      title="Move to standard catalog only"
                                    >
                                      Demote to Standard
                                    </button>
                                    <button
                                      onClick={() => triggerDeleteCheck("project", c.slug)}
                                      className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive"
                                      title="Permanently Delete Compound"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* availability (daily availability manager dashboard) */}
                {activeTab === "availability" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5 text-accent" /> Daily Project Availability
                        Manager
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Control live unit status databases, edit layout configurations, or bulk
                        import CSV/Excel data sheets.
                      </p>
                    </div>

                    {/* Bulk Excel sheet Uploader */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Left: Single Compound Uploader */}
                      <div className="bg-secondary/10 p-5 rounded-xl border border-border/40 space-y-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <FileSpreadsheet className="h-4.5 w-4.5 text-accent" /> Single Compound
                            Import
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Upload a compound availability sheet. Overwrites existing units of that
                            compound.
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[160px_1fr] items-center">
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                              Target Compound
                            </label>
                            <select
                              value={selectedAvailSlug}
                              onChange={(e) => setSelectedAvailSlug(e.target.value)}
                              className="w-full rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] focus:outline-none"
                            >
                              {compoundsList.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="border border-dashed border-border/80 bg-card rounded-xl p-4 text-center flex flex-col items-center justify-center relative">
                            <FileSpreadsheet className="h-5 w-5 text-accent mb-1" />
                            <span className="text-[11px] font-bold text-primary">
                              Import Single Project
                            </span>

                            <label className="mt-2 cursor-pointer rounded-lg bg-accent text-white font-semibold text-[9px] px-3 py-1.5 hover:bg-accent/90 transition-colors shadow-soft">
                              Select File
                              <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="hidden"
                                onChange={(e) => {
                                  if (selectedAvailSlug) {
                                    handleExcelImport(e, selectedAvailSlug);
                                  } else {
                                    alert("Please choose a target compound first.");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/20 flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-[10px] font-semibold text-primary">
                            <input
                              type="checkbox"
                              checked={bypassReviewQueue}
                              onChange={(e) => setBypassReviewQueue(e.target.checked)}
                              className="rounded border-zinc-700 bg-card text-accent focus:ring-accent h-3 w-3"
                            />
                            <span>Direct Publish (Bypass Review Queue)</span>
                          </label>
                        </div>
                      </div>

                      {/* Right: Developer-Wide Multi-Project Uploader */}
                      <div className="bg-secondary/10 p-5 rounded-xl border border-border/40 space-y-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 className="h-4.5 w-4.5 text-accent" /> Developer-Wide Import
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Upload a sheet with a 'Project' column to update multiple compounds of a
                            developer.
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[160px_1fr] items-center">
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                              Target Developer
                            </label>
                            <select
                              value={selectedAvailDevSlug}
                              onChange={(e) => setSelectedAvailDevSlug(e.target.value)}
                              className="w-full rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] focus:outline-none"
                            >
                              {developersList.map((d) => (
                                <option key={d.slug} value={d.slug}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="border border-dashed border-border/80 bg-card rounded-xl p-4 text-center flex flex-col items-center justify-center relative">
                            <Building2 className="h-5 w-5 text-accent mb-1" />
                            <span className="text-[11px] font-bold text-primary">
                              Import Developer Sheet
                            </span>

                            <label className="mt-2 cursor-pointer rounded-lg bg-accent text-white font-semibold text-[9px] px-3 py-1.5 hover:bg-accent/90 transition-colors shadow-soft">
                              Select File
                              <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="hidden"
                                onChange={(e) => {
                                  if (selectedAvailDevSlug) {
                                    handleDeveloperExcelImport(e, selectedAvailDevSlug);
                                  } else {
                                    alert("Please choose a target developer first.");
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/20 flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer text-[10px] font-semibold text-primary">
                            <input
                              type="checkbox"
                              checked={bypassReviewQueue}
                              onChange={(e) => setBypassReviewQueue(e.target.checked)}
                              className="rounded border-zinc-700 bg-card text-accent focus:ring-accent h-3 w-3"
                            />
                            <span>Direct Publish (Bypass Review Queue)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Compounds grid manager */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                        Compounds Availability list
                      </h3>

                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {compoundsList.map((c) => {
                          const avail = availabilityList.find((a) => a.slug === c.slug);
                          const total = avail?.totalAvailable ?? 0;
                          return (
                            <div
                              key={c.slug}
                              onClick={() => setSelectedProjectSlug(c.slug)}
                              className="rounded-xl border border-border bg-card p-4 hover:border-accent/40 cursor-pointer hover:bg-secondary/15 transition-all flex justify-between items-center shadow-soft"
                            >
                              <div>
                                <span className="text-xs font-bold text-primary block">
                                  {c.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                  {c.developer}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-accent block">
                                  {total} Units
                                </span>
                                <span className="text-[9px] text-muted-foreground block mt-0.5">
                                  Manage →
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* map */}
                {activeTab === "map" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <Layers className="h-5 w-5 text-accent" /> Geo-Coordinates Map Control
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Edit pin placements, draw communities polygons, and publish changes.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[300px_1fr] items-start">
                      <div className="rounded-xl border border-border bg-secondary/15 p-4 space-y-4">
                        <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          GPS &amp; Map Location Studio
                        </span>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                              Target Compound
                            </label>
                            <select
                              value={pinnedProjectSlug}
                              onChange={(e) => setPinnedProjectSlug(e.target.value)}
                              className="w-full appearance-none rounded-lg border border-border bg-card px-2.5 py-2 text-xs focus:outline-none"
                            >
                              {compoundsList.map((c) => (
                                <option key={c.slug} value={c.slug}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                                Latitude
                              </label>
                              <input
                                type="text"
                                value={editLat}
                                onChange={(e) => setEditLat(e.target.value)}
                                className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-mono focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                                Longitude
                              </label>
                              <input
                                type="text"
                                value={editLng}
                                onChange={(e) => setEditLng(e.target.value)}
                                className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-mono focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                              Highway Marker (Km)
                            </label>
                            <input
                              type="number"
                              step="any"
                              placeholder="e.g. 195"
                              value={editKm}
                              onChange={(e) => setEditKm(e.target.value)}
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-mono focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">
                              Google Maps Location URL (GPS Link)
                            </label>
                            <input
                              type="url"
                              value={editMapsUrl}
                              onChange={(e) => setEditMapsUrl(e.target.value)}
                              placeholder="https://maps.google.com/?q=..."
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-[11px] font-mono focus:outline-none"
                            />
                          </div>

                          {editMapsUrl && (
                            <a
                              href={editMapsUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:underline pt-1"
                            >
                              <ExternalLink className="h-3 w-3" /> Test Open Location in Google Maps
                            </a>
                          )}

                          <button
                            onClick={handleUpdatePinCoords}
                            className="w-full py-2.5 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-sm"
                          >
                            Publish Pin &amp; GPS Location
                          </button>
                        </div>
                      </div>

                      <div className="h-[480px] rounded-xl border border-border overflow-hidden relative shadow-inner">
                        <div className="absolute top-3 left-3 z-[1000] bg-card/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg text-[11px] font-semibold text-primary shadow-sm flex items-center gap-1.5 select-none pointer-events-none">
                          <MapPin className="h-3.5 w-3.5 text-accent animate-pulse" />
                          <span>Click anywhere on map to position pin</span>
                        </div>
                        <MapClient
                          compounds={compoundsList}
                          activeSlug={pinnedProjectSlug}
                          onMapClick={(lat, lng) => {
                            setEditLat(lat.toFixed(6));
                            setEditLng(lng.toFixed(6));
                          }}
                          onSelect={(slug) => {
                            setPinnedProjectSlug(slug);
                          }}
                          initialCenter={[parseFloat(editLat) || 31.0, parseFloat(editLng) || 28.5]}
                          initialZoom={12}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* tools */}
                {activeTab === "tools" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                      <h3 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                        <Calculator className="h-4.5 w-4.5 text-accent" /> Payment Calculator
                        Configurations
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Adjust platform-wide escalation, VAT parameters, and currencies.
                      </p>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-muted-foreground mb-1">
                            Standard Maintenance Fee
                          </label>
                          <input
                            type="text"
                            defaultValue="8%"
                            className="w-full border border-border rounded-lg bg-secondary/20 px-3 py-2 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-muted-foreground mb-1">
                            VAT Toggles
                          </label>
                          <select className="w-full border border-border rounded-lg bg-secondary/20 px-3 py-2 focus:outline-none">
                            <option>Exclude taxes</option>
                            <option>Include 14% VAT</option>
                          </select>
                        </div>
                        <button
                          onClick={() => alert("Calculator settings updated.")}
                          className="px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors"
                        >
                          Save Settings
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                      <h3 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                        <Sliders className="h-4.5 w-4.5 text-accent" /> Comparison Engine Weights
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Set weightings for compound matching algorithms.
                      </p>

                      <div className="space-y-3 text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center justify-between border-b border-border/40 py-2">
                          <span>Pricing Weight</span>
                          <input type="range" className="w-24 accent-accent" defaultValue="80" />
                        </div>
                        <div className="flex items-center justify-between border-b border-border/40 py-2">
                          <span>Delivery Sooner Weight</span>
                          <input type="range" className="w-24 accent-accent" defaultValue="60" />
                        </div>
                        <button
                          onClick={() => alert("Comparison weights saved.")}
                          className="px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors"
                        >
                          Save Weights
                        </button>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4 md:col-span-2">
                      <h3 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                        <Database className="h-4.5 w-4.5 text-accent" /> JSON Database Backup &amp;
                        Sync
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Export your full database configuration (compounds, developers, maps, custom
                        brochures, leads, etc.) to a backup file, or import a saved backup. This
                        ensures your admin dashboard edits are preserved across redeployments.
                      </p>

                      <div className="flex flex-wrap gap-4 items-center">
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              const dataStr = exportDatabaseBackup();
                              const blob = new Blob([dataStr], { type: "application/json" });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = `property_atlas_backup_${new Date().toISOString().split("T")[0]}.json`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            } catch (err: any) {
                              alert(`Export failed: ${err.message}`);
                            }
                          }}
                          className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" /> Export Backup JSON
                        </button>

                        <label className="cursor-pointer px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2">
                          <Upload className="h-4 w-4" /> Import Backup JSON
                          <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                try {
                                  const text = evt.target?.result as string;
                                  const success = importDatabaseBackup(text);
                                  if (success) {
                                    alert(
                                      "Database successfully restored! The page will now reload.",
                                    );
                                    window.location.reload();
                                  } else {
                                    alert("Restore failed. Invalid backup JSON structure.");
                                  }
                                } catch (err: any) {
                                  alert(`Import failed: ${err.message}`);
                                }
                              };
                              reader.readAsText(file);
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const backupStr = exportDatabaseBackup();
                              const res = await fetch("/api/save-database", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: backupStr,
                              });
                              const resData = await res.json();
                              if (resData.success) {
                                alert(
                                  "Success! Database has been persistently saved to the source code files for all types of users.",
                                );
                              } else {
                                alert(`Failed to save: ${resData.error}`);
                              }
                            } catch (err: any) {
                              alert(`Failed to save globally: ${err.message}`);
                            }
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" /> Save database to source files (Global
                          Sync)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* people */}
                {activeTab === "people" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-primary">
                          Registered Users &amp; Session Analytics
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Control registered accounts and track user sessions activity live.
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Subscription Tier</th>
                            <th className="p-3">Last Login Time</th>
                            <th className="p-3">Time Spent</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {usersDatabase.map((u, i) => {
                            const formatTime = (seconds?: number) => {
                              if (!seconds) return "0s";
                              const h = Math.floor(seconds / 3600);
                              const m = Math.floor((seconds % 3600) / 60);
                              const s = seconds % 60;
                              if (h > 0) return `${h}h ${m}m ${s}s`;
                              if (m > 0) return `${m}m ${s}s`;
                              return `${s}s`;
                            };
                            return (
                              <tr key={i} className="hover:bg-secondary/15 transition-colors">
                                <td className="p-3 font-semibold text-primary">{u.name}</td>
                                <td className="p-3 text-muted-foreground font-mono">{u.email}</td>
                                <td className="p-3 text-primary font-bold">{u.tier}</td>
                                <td className="p-3 text-accent font-mono text-[10px]">
                                  {u.lastLoginAt
                                    ? new Date(u.lastLoginAt).toLocaleString("en-US", {
                                        hour12: true,
                                      })
                                    : "Never logged in"}
                                </td>
                                <td className="p-3 text-slate-600 font-mono font-bold">
                                  {formatTime(u.timeSpent)}
                                </td>
                                <td className="p-3 text-right">
                                  <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                                    Active
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* crm */}
                {/* Leads Tab */}
                {activeTab === "crm" &&
                  (() => {
                    const filteredLeads = leads.filter((l) => {
                      const matchesSearch =
                        l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                        l.phone.includes(leadSearch);
                      const matchesStage = !leadStageFilter || l.stage === leadStageFilter;
                      return matchesSearch && matchesStage;
                    });

                    const totalLeadsCount = leads.length;
                    const newLeadsCount = leads.filter((l) => l.stage === "new").length;
                    const contactedLeadsCount = leads.filter((l) => l.stage === "contacted").length;
                    const closedLeadsCount = leads.filter((l) => l.stage === "closed").length;
                    const activeLeadsCount = totalLeadsCount - closedLeadsCount;

                    return (
                      <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Total Leads
                            </div>
                            <div className="mt-1 font-display text-2xl font-extrabold text-primary">
                              {totalLeadsCount}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs border-l-4 border-l-accent">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              New Leads
                            </div>
                            <div className="mt-1 font-display text-2xl font-extrabold text-accent">
                              {newLeadsCount}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs border-l-4 border-l-blue-500">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Contacted
                            </div>
                            <div className="mt-1 font-display text-2xl font-extrabold text-blue-600">
                              {contactedLeadsCount}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs border-l-4 border-l-amber-500">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Active Pipeline
                            </div>
                            <div className="mt-1 font-display text-2xl font-extrabold text-amber-600">
                              {activeLeadsCount}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs border-l-4 border-l-emerald-500">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Closed
                            </div>
                            <div className="mt-1 font-display text-2xl font-extrabold text-emerald-600">
                              {closedLeadsCount}
                            </div>
                          </div>
                        </div>

                        {/* Header and Filters */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h2 className="font-display text-lg font-bold text-primary">
                                Leads Manager
                              </h2>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Manage and track client registrations captured across the platform.
                              </p>
                            </div>

                            {/* Filters */}
                            <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
                              <div className="relative min-w-[160px]">
                                <input
                                  type="text"
                                  placeholder="Search by name or phone..."
                                  value={leadSearch}
                                  onChange={(e) => setLeadSearch(e.target.value)}
                                  className="w-full rounded-xl border border-border bg-background/50 pl-3.5 pr-8 py-2 text-xs font-semibold text-foreground placeholder:text-muted-foreground/60 transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent"
                                />
                                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
                              </div>

                              <div className="relative min-w-[140px]">
                                <select
                                  value={leadStageFilter}
                                  onChange={(e) => setLeadStageFilter(e.target.value)}
                                  className="w-full appearance-none rounded-xl border border-border bg-background/50 pl-3.5 pr-8 py-2 text-xs font-semibold text-foreground transition-all hover:border-accent/40 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
                                >
                                  <option value="">All Stages</option>
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="viewing">Viewing</option>
                                  <option value="negotiating">Negotiating</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Leads Table */}
                          <div className="overflow-x-auto border border-border/80 rounded-xl">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                                  <th className="p-3">Client Contact</th>
                                  <th className="p-3">Budget Preference</th>
                                  <th className="p-3">Project Interest</th>
                                  <th className="p-3">Status Stage</th>
                                  <th className="p-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/60 font-medium">
                                {filteredLeads.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={5}
                                      className="p-8 text-center text-muted-foreground"
                                    >
                                      No leads found matching the filters.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredLeads.map((l) => {
                                    const matchedProj = compoundsList.find(
                                      (c) => c.slug === l.interest,
                                    );
                                    const projName = matchedProj
                                      ? matchedProj.name
                                      : l.interest.replace(/-/g, " ");

                                    return (
                                      <tr
                                        key={l.id}
                                        className="hover:bg-secondary/15 transition-colors"
                                      >
                                        <td className="p-3 align-top">
                                          <div className="font-bold text-primary">{l.name}</div>
                                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                                            {l.phone}
                                          </div>
                                          <div className="text-[9px] text-muted-foreground/80 mt-1 font-medium">
                                            Registered: {new Date(l.createdAt).toLocaleDateString()}
                                          </div>

                                          {/* Serialized Notes/Preferences display */}
                                          {l.notes && (
                                            <div className="mt-2 text-[10px] bg-secondary/40 border border-border/50 rounded-xl p-2.5 text-muted-foreground whitespace-pre-line leading-relaxed max-w-xs shadow-3xs">
                                              {l.notes}
                                            </div>
                                          )}
                                        </td>
                                        <td className="p-3 align-top font-bold text-primary">
                                          {l.budget > 0 ? `EGP ${l.budget}M` : "On Request"}
                                        </td>
                                        <td className="p-3 align-top text-accent font-semibold">
                                          {projName}
                                        </td>
                                        <td className="p-3 align-top">
                                          <div className="relative max-w-[120px]">
                                            <select
                                              value={l.stage}
                                              onChange={(e) =>
                                                updateLeadStage(l.id, e.target.value as any)
                                              }
                                              className="w-full appearance-none rounded-lg border border-border/80 bg-background/50 px-2.5 py-1 pr-6 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent hover:border-accent/40"
                                            >
                                              <option value="new">New</option>
                                              <option value="contacted">Contacted</option>
                                              <option value="viewing">Viewing</option>
                                              <option value="negotiating">Negotiating</option>
                                              <option value="closed">Closed</option>
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
                                          </div>
                                        </td>
                                        <td className="p-3 align-top text-right">
                                          <Button
                                            onClick={() => {
                                              if (
                                                confirm(
                                                  "Are you sure you want to delete this lead?",
                                                )
                                              ) {
                                                deleteLead(l.id);
                                              }
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg cursor-pointer"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* ai */}
                {activeTab === "ai" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <Bot className="h-5 w-5 text-accent" /> AI Broker Assistant training
                        Grounding
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Control the prompts and documents the assistant references.
                      </p>
                    </div>

                    <div className="space-y-4 text-xs font-medium">
                      <div>
                        <label className="block font-bold text-primary mb-1.5">
                          System Prompt &amp; Behavioral Rules
                        </label>
                        <textarea
                          rows={5}
                          className="w-full rounded-xl border border-border bg-secondary/10 p-3 font-mono focus:outline-none"
                          defaultValue="You are Antigravity, a professional real estate broker assistant designed for Egypt. Ground your facts inside the provided compounds and availability database. Never quote unverified prices."
                        />
                      </div>
                      <button
                        onClick={() => alert("AI assistant grounding updated.")}
                        className="px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-soft"
                      >
                        Save AI Grounding
                      </button>
                    </div>
                  </div>
                )}

                {/* campaigns */}
                {activeTab === "campaigns" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <Send className="h-5 w-5 text-accent" /> WhatsApp Campaigns Templates
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Central approved templates list for messaging campaigns.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        {
                          title: "Sahel Summer Launch",
                          body: "Hi {name}! Check out the latest summer chalets in Ras El Hekma. Starting from EGP 8M with 10% down payment.",
                        },
                        {
                          title: "Budget Followup",
                          body: "Hi {name}! Based on your budget interest of {budget}M, here are the matching units with live availability.",
                        },
                      ].map((t, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2 font-medium"
                        >
                          <div className="font-bold text-primary text-xs flex justify-between items-center">
                            <span>{t.title}</span>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                              Approved
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            "{t.body}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* audit */}
                {activeTab === "audit" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" /> Platform Audit Trail Logs
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Detailed history tracking all data changes made by super-admins.
                      </p>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Actor Email</th>
                            <th className="p-3">Entity Type</th>
                            <th className="p-3">Command action</th>
                            <th className="p-3 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-mono">
                          {auditLogs.map((log) => (
                            <tr
                              key={log.id}
                              className="hover:bg-secondary/15 transition-colors font-medium"
                            >
                              <td className="p-3 text-primary text-xs font-semibold">
                                {log.actor}
                              </td>
                              <td className="p-3 text-accent font-bold text-[10px]">
                                {log.entity}
                              </td>
                              <td className="p-3 text-muted-foreground text-xs">{log.action}</td>
                              <td className="p-3 text-right text-[10px] text-muted-foreground">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "brochures" && (
                  <BrochuresMatcherTab
                    compoundsList={compoundsList}
                    updateProject={updateProject}
                  />
                )}

                {/* review */}
                {activeTab === "review" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-accent" /> Availability Review Queue
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Inspect and approve developer unit availability spreadsheets before they are
                        published to public pages.
                      </p>
                    </div>

                    {!pendingUploadsList || pendingUploadsList.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-md mx-auto space-y-4">
                        <div className="mx-auto rounded-full bg-emerald-500/10 p-4 w-fit">
                          <CheckCircle className="h-8 w-8 text-emerald-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary text-sm">All Caught Up!</h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            No spreadsheet availability updates are currently waiting in the review
                            queue.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {pendingUploadsList.map((upload: any) => {
                          const projectObj = compoundsList.find(
                            (c) => c.slug === upload.projectSlug,
                          );
                          const totalAvailable = upload.newAvail?.totalAvailable ?? 0;
                          const layouts = upload.newAvail?.breakdown ?? [];

                          return (
                            <div
                              key={upload.id}
                              className="rounded-2xl border border-border bg-card overflow-hidden shadow-soft flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border"
                            >
                              {/* Left side: Upload details */}
                              <div className="p-5 md:w-1/3 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                                    <FileText className="h-3 w-3" /> Pending Review
                                  </span>
                                  <div>
                                    <h3
                                      className="font-display font-bold text-primary text-sm truncate"
                                      title={upload.fileName}
                                    >
                                      {upload.fileName}
                                    </h3>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                      For Project:{" "}
                                      <span className="font-semibold text-primary">
                                        {projectObj?.name || upload.projectSlug}
                                      </span>
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                                      Uploaded by: {upload.uploadedBy}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-mono">
                                      Uploaded at: {new Date(upload.uploadedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Are you sure you want to approve and publish "${upload.fileName}"?`,
                                        )
                                      ) {
                                        approvePendingUpload(upload.id);
                                      }
                                    }}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold transition-all shadow-sm"
                                  >
                                    <Check className="h-3.5 w-3.5" /> Approve &amp; Publish
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `Are you sure you want to reject and delete this upload?`,
                                        )
                                      ) {
                                        rejectPendingUpload(upload.id);
                                      }
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 hover:border-destructive hover:bg-destructive/10 text-muted-foreground hover:text-destructive p-2 transition-all"
                                    title="Reject &amp; Discard"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Right side: Preview of units */}
                              <div className="p-5 flex-1 bg-secondary/10 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-primary">
                                    Sheet Contents Summary
                                  </span>
                                  <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-lg">
                                    {totalAvailable} Available Units
                                  </span>
                                </div>

                                {layouts.length === 0 ? (
                                  <p className="text-xs text-muted-foreground italic">
                                    No unit layouts detected in this sheet.
                                  </p>
                                ) : (
                                  <div className="grid gap-2 max-h-[160px] overflow-y-auto pr-1">
                                    {layouts.map((layout: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between bg-card border border-border/60 rounded-xl p-2.5 text-xs"
                                      >
                                        <div className="space-y-0.5">
                                          <div className="font-semibold text-primary">
                                            {layout.type}
                                          </div>
                                          <div className="text-[10px] text-muted-foreground">
                                            {layout.beds} Bedrooms ·{" "}
                                            {layout.minSqm === layout.maxSqm
                                              ? `${layout.minSqm} sqm`
                                              : `${layout.minSqm} – ${layout.maxSqm} sqm`}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-bold text-accent font-mono">
                                            {layout.minPriceM === layout.maxPriceM
                                              ? `${layout.minPriceM.toFixed(2)}M EGP`
                                              : `${layout.minPriceM.toFixed(2)}M – ${layout.maxPriceM.toFixed(2)}M EGP`}
                                          </div>
                                          <div className="text-[9px] text-muted-foreground">
                                            {layout.units?.length ?? 0} total units
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── Add Project Modal ── */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setShowAddProjectModal(false);
                setEditingItem(null);
                clearProjectForm();
              }}
              className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              {editingItem ? `Edit Project Specs: ${editingItem.name}` : "Create New Compound"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-medium">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    RERA Permit Number
                  </label>
                  <input
                    type="text"
                    value={pPermit}
                    onChange={(e) => setPPermit(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={pStatus}
                    onChange={(e) => setPStatus(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none"
                  >
                    <option value="Off-Plan">Off-Plan</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready">Ready</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Handover Year
                  </label>
                  <input
                    type="number"
                    value={pHandover}
                    onChange={(e) => setPHandover(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Starting Price (EGP M)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    GPS Latitude (e.g. 30.982)
                  </label>
                  <input
                    type="text"
                    value={pLat}
                    onChange={(e) => setPLat(e.target.value)}
                    placeholder="30.982"
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    GPS Longitude (e.g. 28.914)
                  </label>
                  <input
                    type="text"
                    value={pLng}
                    onChange={(e) => setPLng(e.target.value)}
                    placeholder="28.914"
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Google Maps Location URL (GPS Link)
                </label>
                <input
                  type="url"
                  value={pMapsUrl}
                  onChange={(e) => setPMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=30.982,28.914 or https://maps.app.goo.gl/..."
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 text-primary font-mono"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Developer Company (Transfer Reference)
                  </label>
                  <select
                    value={pDev}
                    onChange={(e) => setPDev(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none"
                  >
                    <option value="">Select Company...</option>
                    {developersList.map((d) => (
                      <option key={d.slug} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Destination Region (Transfer Region)
                  </label>
                  <select
                    value={pDest}
                    onChange={(e) => setPDest(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none"
                  >
                    <option value="">Select Community...</option>
                    {destinationsList.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {pDest &&
                destinationsList.find((d) => d.slug === pDest)?.region === "north-coast" && (
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                      North Coast Highway Marker (Kilo)*
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 130 or 129.5"
                      value={pKm}
                      onChange={(e) => setPKm(e.target.value)}
                      className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                    />
                  </div>
                )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Project Size (Feddan)
                  </label>
                  <input
                    type="text"
                    value={pSize}
                    onChange={(e) => setPSize(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Unit Area Range
                  </label>
                  <input
                    type="text"
                    value={pUnitSizes}
                    onChange={(e) => setPUnitSizes(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Default Payment Plan
                </label>
                <input
                  type="text"
                  value={pPaymentPlan}
                  onChange={(e) => setPPaymentPlan(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Compound Description
                </label>
                <textarea
                  rows={3}
                  value={pBlurb}
                  onChange={(e) => setPBlurb(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 p-3"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Amenities Checklist (Comma-separated)
                </label>
                <input
                  type="text"
                  value={pAmenities}
                  onChange={(e) => setPAmenities(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 border border-border rounded-lg bg-secondary/10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    id="p-is-launch-chk"
                    checked={pIsNewLaunch}
                    onChange={(e) => setPIsNewLaunch(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <label
                    htmlFor="p-is-launch-chk"
                    className="text-[10px] font-bold text-muted-foreground uppercase cursor-pointer select-none"
                  >
                    Surfaced New Launch
                  </label>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Parent Project (For Phase Only)
                  </label>
                  <select
                    value={pParentSlug}
                    onChange={(e) => setPParentSlug(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 text-xs"
                  >
                    <option value="">None (Standard primary project)</option>
                    {compoundsList
                      .filter((x) => !x.parentSlug && x.slug !== editingItem?.slug)
                      .map((x) => (
                        <option key={x.slug} value={x.slug}>
                          {x.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft"
              >
                {editingItem ? "Publish Changes" : "Create Project"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Developer Modal ── */}
      {showAddDeveloperModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setShowAddDeveloperModal(false);
                setEditingItem(null);
                clearDevForm();
              }}
              className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4">
              {editingItem ? `Edit Developer: ${editingItem.name}` : "Add Developer Company"}
            </h3>

            <form onSubmit={handleSaveDeveloper} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Company name
                </label>
                <input
                  type="text"
                  value={dName}
                  onChange={(e) => setDName(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Legal Registered Entity
                </label>
                <input
                  type="text"
                  value={dLegal}
                  onChange={(e) => setDLegal(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Reputation Tier
                  </label>
                  <select
                    value={dTier}
                    onChange={(e) => setDTier(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none"
                  >
                    <option value="Tier A">Tier A</option>
                    <option value="Tier B">Tier B</option>
                    <option value="Tier C">Tier C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Contact Hotline
                  </label>
                  <input
                    type="text"
                    value={dPhone}
                    onChange={(e) => setDPhone(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={dEmail}
                    onChange={(e) => setDEmail(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    HQ Address
                  </label>
                  <input
                    type="text"
                    value={dAddress}
                    onChange={(e) => setDAddress(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Corporate Summary
                </label>
                <textarea
                  rows={3}
                  value={dDesc}
                  onChange={(e) => setDDesc(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 p-3"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft"
              >
                {editingItem ? "Publish Changes" : "Create Developer Profile"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Destination Modal ── */}
      {showAddDestinationModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setShowAddDestinationModal(false);
                setEditingItem(null);
                clearDestForm();
              }}
              className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4">
              {editingItem
                ? `Edit Destination: ${editingItem.name}`
                : "Create New Community Destination"}
            </h3>

            <form onSubmit={handleSaveDestination} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Destination Name
                </label>
                <input
                  type="text"
                  value={destName}
                  onChange={(e) => setDestName(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Region Category
                  </label>
                  <select
                    value={destRegion}
                    onChange={(e) => setDestRegion(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none"
                  >
                    <option value="greater-cairo">Greater Cairo</option>
                    <option value="north-coast">North Coast (Sahel)</option>
                    <option value="red-sea">Red Sea</option>
                    <option value="sinai">Sinai</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Overlay color (Pin Hex)
                  </label>
                  <input
                    type="color"
                    value={destColor}
                    onChange={(e) => setDestColor(e.target.value)}
                    className="w-full h-9 border border-border rounded-lg bg-secondary/10 px-1 py-1"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Governorate / City
                  </label>
                  <input
                    type="text"
                    value={destCity}
                    onChange={(e) => setDestCity(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Road Kilometer Range
                  </label>
                  <input
                    type="text"
                    value={destKm}
                    onChange={(e) => setDestKm(e.target.value)}
                    placeholder="e.g. 120-145 km"
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Map Latitude Center
                  </label>
                  <input
                    type="text"
                    value={destLat}
                    onChange={(e) => setDestLat(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Map Longitude Center
                  </label>
                  <input
                    type="text"
                    value={destLng}
                    onChange={(e) => setDestLng(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Lifestyle Summary description
                </label>
                <textarea
                  rows={3}
                  value={destBlurb}
                  onChange={(e) => setDestBlurb(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 p-3"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft"
              >
                {editingItem ? "Publish Changes" : "Create Destination"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Unit Modal ── */}
      {editingUnit && selectedProject && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingUnit(null)}
              className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-1.5">
              <Edit className="h-5 w-5 text-accent" /> Edit Unit Availability
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUnitSubmit(selectedProject.slug);
              }}
              className="space-y-4 text-xs font-medium"
            >
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  Unit Number
                </label>
                <input
                  type="text"
                  value={editUnitNo}
                  onChange={(e) => setEditUnitNo(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Beds
                  </label>
                  <input
                    type="number"
                    value={editUnitBeds}
                    onChange={(e) => setEditUnitBeds(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Area (sqm)
                  </label>
                  <input
                    type="number"
                    value={editUnitArea}
                    onChange={(e) => setEditUnitArea(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                  View Aspect
                </label>
                <input
                  type="text"
                  value={editUnitView}
                  onChange={(e) => setEditUnitView(e.target.value)}
                  className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Price (EGP)
                  </label>
                  <input
                    type="number"
                    value={editUnitPrice}
                    onChange={(e) => setEditUnitPrice(Number(e.target.value))}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={editUnitStatus}
                    onChange={(e) => setEditUnitStatus(e.target.value)}
                    className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none text-primary focus:outline-none focus:ring-1 focus:ring-accent bg-card"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft"
              >
                Save Unit Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Safeguard Dependency Warning Modal ── */}
      {dependencyWarning && deleteTarget && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-2xl border border-destructive/20 bg-card p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-sm font-bold text-destructive flex items-center gap-1.5">
              <ShieldAlert className="h-5 w-5" /> Warning: Deleting active database entities!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{dependencyWarning}</p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => {
                  setDependencyWarning(null);
                  setDeleteTarget(null);
                }}
                className="rounded-xl border border-border bg-secondary/40 px-4 py-2 text-xs font-bold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDeletion(deleteTarget.type, deleteTarget.slug)}
                className="rounded-xl bg-destructive text-white font-bold text-xs hover:bg-destructive/95 px-4 py-2"
              >
                Cascade Delete Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
