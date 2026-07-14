import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import { compounds } from "@/data/compounds";
import { availability } from "@/data/availability";
import { destinations } from "@/data/destinations";
import * as XLSX from "xlsx";
import {
  ShieldCheck, Users, CreditCard, TrendingUp, Check, ExternalLink,
  Building2, MapPin, Layers, LayoutGrid, Calculator, Sliders, ShieldAlert,
  Send, Bot, Settings, Plus, Edit, Trash2, Save, FileText, HelpCircle,
  Database, Upload, AlertCircle, RefreshCw, Star, ArrowLeftRight, CheckCircle, Info, X, Image as ImageIcon, ArrowLeft, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Super-Admin Command Center — PropTrack" },
      { name: "description", content: "Platform control layer for managing projects, companies, map coordinates, pricing logic, and user roles." },
    ],
  }),
  component: AdminPage,
});

type TabType = 
  | "overview" | "companies" | "destinations" | "projects" 
  | "availability" | "map" | "tools" | "people" | "crm" 
  | "ai" | "campaigns" | "audit";

function AdminPage() {
  const user = useStore((s) => s.user);
  const signIn = useStore((s) => s.signIn);
  const signOut = useStore((s) => s.signOut);
  
  // Admin credentials checking
  const isAdmin = user?.email.toLowerCase() === "elsayedshoeip70@gmail.com";
  
  // Form states for login
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.toLowerCase() === "elsayedshoeip70@gmail.com" && passwordInput === "Sayed@shoeip8") {
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
    return (
      <Shell>
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-transparent to-accent/5 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="text-center relative">
              <div className="mx-auto h-12 w-12 bg-accent/15 rounded-2xl flex items-center justify-center text-accent shadow-soft mb-3">
                <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">PropTrack Admin Gate</h2>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                Super-Admin Control layer access panel. Please enter credentials to proceed.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Email Address</label>
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
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Password</label>
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
  
  // Read database state collections with fallback to empty arrays
  const rawCompounds = useStore((s) => s.compoundsList);
  const rawDestinations = useStore((s) => s.destinationsList);
  const rawDevelopers = useStore((s) => s.developersList);
  const rawAvailability = useStore((s) => s.availabilityList);
  const rawAuditLogs = useStore((s) => s.auditLogs);
  const rawLeads = useStore((s) => s.leads);

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
      const derivedDevs = Array.from(new Set(compounds.map(c => c.developer))).map((name) => ({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        legalName: `${name} S.A.E.`,
        description: `${name} is a leading real estate developer in Egypt, renowned for high-quality builds and luxury communities.`,
        phone: "+20 19688",
        email: `info@${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
        address: "Cairo, Egypt",
        tier: "Tier A",
        status: "Verified",
        projects: compounds.filter(c => c.developer === name).map(c => c.name)
      }));

      useStore.setState({
        compoundsList: compounds,
        availabilityList: availability,
        destinationsList: destinations,
        developersList: derivedDevs,
        auditLogs: [
          { id: "a1", actor: "System", entity: "Database", action: "Initialized PropTrack Command Center databases", timestamp: Date.now() }
        ]
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

  // Selected Detail workspaces (Dedicated Webpages)
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedDeveloperSlug, setSelectedDeveloperSlug] = useState<string | null>(null);
  const [selectedDestinationSlug, setSelectedDestinationSlug] = useState<string | null>(null);

  const selectedProject = useMemo(() => {
    return compoundsList.find(c => c.slug === selectedProjectSlug) || null;
  }, [selectedProjectSlug, compoundsList]);

  const selectedDeveloper = useMemo(() => {
    return developersList.find(d => d.slug === selectedDeveloperSlug) || null;
  }, [selectedDeveloperSlug, developersList]);

  const selectedDestination = useMemo(() => {
    return destinationsList.find(d => d.slug === selectedDestinationSlug) || null;
  }, [selectedDestinationSlug, destinationsList]);

  // Form states for adding/editing items
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddDeveloperModal, setShowAddDeveloperModal] = useState(false);
  const [showAddDestinationModal, setShowAddDestinationModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Dependency Safeguard states
  const [dependencyWarning, setDependencyWarning] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; slug: string } | null>(null);

  // Project forms inputs
  const [pName, setPName] = useState("");
  const [pStatus, setPStatus] = useState("Off-Plan");
  const [pHandover, setPHandover] = useState(2028);
  const [pPermit, setPPermit] = useState("Permit-98231");
  const [pLat, setPLat] = useState(30.02);
  const [pLng, setPLng] = useState(31.45);
  const [pDev, setPDev] = useState("");
  const [pDest, setPDest] = useState("");
  const [pPrice, setPPrice] = useState(12);
  const [pSize, setPSize] = useState("50 feddan");
  const [pUnitSizes, setPUnitSizes] = useState("120-300 sqm");
  const [pPaymentPlan, setPPaymentPlan] = useState("10% down · 8 years installments");
  const [pBlurb, setPBlurb] = useState("");
  const [pAmenities, setPAmenities] = useState("Clubhouse, Pool, Gym, Security");

  // Load project for edit form
  const loadProjectForForm = (proj: any) => {
    setEditingItem(proj);
    setPName(proj.name);
    setPStatus(proj.status);
    setPHandover(proj.deliveryYear);
    setPPermit(proj.permitNumber || "RERA-23849");
    setPLat(proj.lat);
    setPLng(proj.lng);
    setPDev(proj.developer);
    setPDest(proj.destination);
    setPPrice(proj.priceFrom);
    setPSize(proj.areaSize || "—");
    setPUnitSizes(proj.unitSizes || "—");
    setPPaymentPlan(proj.paymentPlan);
    setPBlurb(proj.blurb);
    setPAmenities(proj.amenities ? proj.amenities.join(", ") : "");
    setShowAddProjectModal(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = editingItem ? editingItem.slug : pName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const amenitiesArr = pAmenities.split(",").map(s => s.trim()).filter(Boolean);
    
    const projData = {
      slug,
      name: pName,
      status: pStatus,
      deliveryYear: Number(pHandover),
      permitNumber: pPermit,
      lat: Number(pLat),
      lng: Number(pLng),
      developer: pDev || developersList[0]?.name || "SODIC",
      developerSlug: (pDev || developersList[0]?.name || "SODIC").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      destination: pDest || destinationsList[0]?.slug || "new-cairo",
      priceFrom: Number(pPrice),
      areaSize: pSize,
      unitSizes: pUnitSizes,
      paymentPlan: pPaymentPlan,
      blurb: pBlurb,
      amenities: amenitiesArr,
      hero: editingItem?.hero || "/projects/vea-new-cairo/1.jpg",
      gallery: editingItem?.gallery || ["/projects/vea-new-cairo/1.jpg"],
      types: editingItem?.types || ["Chalet", "Apartment"]
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
    setPLat(30.02);
    setPLng(31.45);
    setPDev("");
    setPDest("");
    setPPrice(12);
    setPSize("50 feddan");
    setPUnitSizes("120-300 sqm");
    setPPaymentPlan("10% down · 8 years installments");
    setPBlurb("");
    setPAmenities("Clubhouse, Pool, Gym, Security");
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
    const slug = editingItem ? editingItem.slug : dName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const devData = {
      slug,
      name: dName,
      legalName: dLegal,
      description: dDesc,
      phone: dPhone,
      email: dEmail,
      address: dAddress,
      tier: dTier,
      status: "Verified",
      projects: editingItem?.projects || []
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
    const slug = editingItem ? editingItem.slug : destName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const destData = {
      slug,
      name: destName,
      region: destRegion,
      color: destColor,
      city: destCity,
      kmRange: destKm || undefined,
      blurb: destBlurb,
      center: [Number(destLat), Number(destLng)] as [number, number],
      zoom: 12,
      hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"
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
  const [pastedCSVData, setPastedCSVData] = useState("");
  const [bulkStatusMsg, setBulkStatusMsg] = useState("");

  const handleCSVImport = () => {
    if (!pastedCSVData.trim()) {
      setBulkStatusMsg("Error: Please paste some tabular CSV data.");
      return;
    }

    try {
      const lines = pastedCSVData.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        setBulkStatusMsg("Error: Invalid CSV format. Missing rows.");
        return;
      }

      const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
      const typeIdx = headers.indexOf("type");
      const priceIdx = headers.indexOf("price") !== -1 ? headers.indexOf("price") : headers.indexOf("priceegp");
      const bedsIdx = headers.indexOf("beds");
      const areaIdx = headers.indexOf("area") !== -1 ? headers.indexOf("area") : headers.indexOf("areasqm");
      
      if (typeIdx === -1 || priceIdx === -1) {
        setBulkStatusMsg("Error: CSV must contain 'Type' and 'Price' headers.");
        return;
      }

      const breakdownMap: Record<string, any> = {};

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
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
            units: []
          };
        }

        breakdownMap[key].available += 1;
        if (area < breakdownMap[key].minSqm) breakdownMap[key].minSqm = area;
        if (area > breakdownMap[key].maxSqm) breakdownMap[key].maxSqm = area;
        if (price / 1_000_000 < breakdownMap[key].minPriceM) breakdownMap[key].minPriceM = price / 1_000_000;
        if (price / 1_000_000 > breakdownMap[key].maxPriceM) breakdownMap[key].maxPriceM = price / 1_000_000;

        breakdownMap[key].units.push({
          id: `u_${Math.random().toString(36).slice(2, 9)}`,
          beds,
          finishing: "Finished",
          areaSqm: area,
          priceEGP: price,
          status: "Available"
        });
      }

      const breakdown = Object.values(breakdownMap);
      const totalAvailable = breakdown.reduce((acc, curr: any) => acc + curr.available, 0);

      const targetProj = compoundsList.find(c => c.slug === selectedAvailSlug);
      
      const newAvail = {
        slug: selectedAvailSlug,
        developer: targetProj?.developer || "Unknown Developer",
        totalAvailable,
        breakdown,
        lastUpdated: new Date().toISOString(),
        note: "Imported via Super-Admin CSV Console"
      };

      updateAvailability(selectedAvailSlug, newAvail);
      setBulkStatusMsg(`Success: Imported ${totalAvailable} units across ${breakdown.length} layout types!`);
      setPastedCSVData("");
    } catch (err: any) {
      setBulkStatusMsg(`Error parsing dataset: ${err.message}`);
    }
  };

  // Real Excel File parser (.xlsx, .xls, .csv)
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>, projSlug: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];

        if (!rows.length) {
          alert("Excel sheet is empty.");
          return;
        }

        // Smart column header mapping
        const findHeader = (row: Record<string, any>, options: string[]) => {
          const keys = Object.keys(row);
          for (const opt of options) {
            const match = keys.find(k => k.toLowerCase().replace(/[^a-z0-9]+/g, "") === opt.toLowerCase().replace(/[^a-z0-9]+/g, ""));
            if (match) return match;
          }
          return null;
        };

        const firstRow = rows[0];
        const typeKey = findHeader(firstRow, ["type", "layout", "layouttype", "unittype"]) || Object.keys(firstRow)[0];
        const priceKey = findHeader(firstRow, ["price", "priceegp", "unitprice", "egp", "cost", "value"]);
        const bedsKey = findHeader(firstRow, ["beds", "bedrooms", "bedcount", "roomcount"]);
        const areaKey = findHeader(firstRow, ["area", "size", "sqm", "areasqm"]);
        const unitNoKey = findHeader(firstRow, ["unitno", "unitnumber", "unit", "no"]);
        const viewKey = findHeader(firstRow, ["view", "aspect", "unitview"]);
        const statusKey = findHeader(firstRow, ["status", "availability"]);

        if (!priceKey) {
          alert("Error: Excel must contain a 'Price' or 'Cost' column.");
          return;
        }

        // Detect extra/dynamic columns not in the known set
        const knownKeys = new Set([typeKey, priceKey, bedsKey, areaKey, unitNoKey, viewKey, statusKey].filter(Boolean) as string[]);
        const allKeys = Object.keys(rows[0]);
        const extraKeys = allKeys.filter(k => !knownKeys.has(k));

        const breakdownMap: Record<string, any> = {};

        for (const row of rows) {
          const rawType = String(row[typeKey] || "Chalet").trim();
          const rawPrice = parseFloat(String(row[priceKey])) || 0;
          const beds = bedsKey ? parseInt(String(row[bedsKey])) || 2 : 2;
          const area = areaKey ? parseFloat(String(row[areaKey])) || 120 : 120;
          const unitNo = unitNoKey ? String(row[unitNoKey]).trim() : `U-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
          const view = viewKey ? String(row[viewKey]).trim() : "Scenic View";
          const status = statusKey ? String(row[statusKey]).trim() : "Available";

          // Capture any extra dynamic columns
          const extraFields: Record<string, any> = {};
          for (const k of extraKeys) {
            if (row[k] !== undefined && row[k] !== null && row[k] !== "") {
              extraFields[k] = row[k];
            }
          }

          const key = `${rawType}-${beds}`;
          if (!breakdownMap[key]) {
            breakdownMap[key] = {
              type: rawType,
              beds,
              available: 0,
              minSqm: area,
              maxSqm: area,
              minPriceM: rawPrice / 1_000_000,
              maxPriceM: rawPrice / 1_000_000,
              units: []
            };
          }

          const resolvedStatus = ["available", "reserved", "sold"].includes(status.toLowerCase())
            ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())
            : "Available";

          breakdownMap[key].available += resolvedStatus === "Available" ? 1 : 0;
          if (area < breakdownMap[key].minSqm) breakdownMap[key].minSqm = area;
          if (area > breakdownMap[key].maxSqm) breakdownMap[key].maxSqm = area;
          if (rawPrice / 1_000_000 < breakdownMap[key].minPriceM) breakdownMap[key].minPriceM = rawPrice / 1_000_000;
          if (rawPrice / 1_000_000 > breakdownMap[key].maxPriceM) breakdownMap[key].maxPriceM = rawPrice / 1_000_000;

          breakdownMap[key].units.push({
            id: `u_${Math.random().toString(36).slice(2, 9)}`,
            unitNo,
            beds,
            finishing: "Finished",
            areaSqm: area,
            view,
            priceEGP: rawPrice,
            status: resolvedStatus,
            ...extraFields
          });
        }

        const breakdown = Object.values(breakdownMap);
        const totalAvailable = breakdown.reduce((acc, curr: any) => acc + curr.available, 0);

        const targetProj = compoundsList.find(c => c.slug === projSlug);
        
        const newAvail = {
          slug: projSlug,
          developer: targetProj?.developer || "Unknown Developer",
          totalAvailable,
          breakdown,
          lastUpdated: new Date().toISOString(),
          note: `Imported from Excel sheet: ${file.name}`
        };

        updateAvailability(projSlug, newAvail);
        alert(`Success: Imported ${rows.length} units from ${file.name} successfully!`);
      } catch (err: any) {
        alert(`Error parsing Excel sheet: ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  // ─── Delete check / execute ───────────────────────────────────────────────
  const triggerDeleteCheck = (type: string, slug: string) => {
    if (type === "developer") {
      const linked = compoundsList.filter(c => c.developer === developersList.find(d => d.slug === slug)?.name);
      if (linked.length > 0) {
        setDependencyWarning(`This developer has ${linked.length} linked compounds (${linked.map(c => c.name).slice(0, 3).join(", ")}${linked.length > 3 ? "..." : ""}). Deleting will also remove all associated data.`);
        setDeleteTarget({ type, slug });
        return;
      }
    }
    if (type === "destination") {
      const linked = compoundsList.filter(c => c.destination === slug);
      if (linked.length > 0) {
        setDependencyWarning(`This destination has ${linked.length} linked compounds. Deleting it may break those project pages.`);
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
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "brochure" | "masterPlan" | "gallery", projSlug: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Content = reader.result as string;

        if (field === "gallery") {
          const project = compoundsList.find(c => c.slug === projSlug);
          if (project) {
            const gallery = [...(project.gallery || []), base64Content];
            updateProject(projSlug, { gallery });
          }
        } else if (field === "brochure") {
          // Accept any file type for brochures - store as base64 data URL
          const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
          const res = await fetch("/api/upload-asset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: `${projSlug}-brochure.${ext}`,
              fileContent: base64Content,
              type: "brochure"
            })
          });
          // Whether server upload succeeds or fails, always store the data URL so it works immediately
          const updates = { brochureUrl: base64Content, brochureFileName: file.name, brochureType: file.type };
          updateProject(projSlug, updates);
        } else if (field === "masterPlan") {
          // Store master plan as base64 data URL for instant viewing
          updateProject(projSlug, { masterPlanUrl: base64Content });
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
    const project = compoundsList.find(c => c.slug === projSlug);
    if (!project) return;
    const gallery = [...(project.gallery || []), imageUrl];
    updateProject(projSlug, { gallery });
  };

  const handleRemoveGalleryImage = (projSlug: string, index: number) => {
    const project = compoundsList.find(c => c.slug === projSlug);
    if (!project) return;
    const gallery = (project.gallery || []).filter((_: any, i: number) => i !== index);
    updateProject(projSlug, { gallery });
  };

  // Add individual Unit form state
  const [newUnitNum, setNewUnitNum] = useState("");
  const [newUnitType, setNewUnitType] = useState("Apartment");
  const [newUnitBeds, setNewUnitBeds] = useState(2);
  const [newUnitArea, setNewUnitArea] = useState(120);
  const [newUnitView, setNewUnitView] = useState("Lagoon & Greenery");
  const [newUnitPrice, setNewUnitPrice] = useState(4500000);
  const [newUnitStatus, setNewUnitStatus] = useState<any>("Available");

  const handleAddUnit = (projSlug: string) => {
    if (!newUnitNum.trim()) return;
    const avail = availabilityList.find(a => a.slug === projSlug) || {
      slug: projSlug,
      developer: selectedProject?.developer || "Unknown Developer",
      totalAvailable: 0,
      breakdown: [],
      lastUpdated: new Date().toISOString()
    };

    const newUnit = {
      id: `u_${Math.random().toString(36).slice(2, 9)}`,
      unitNo: newUnitNum,
      type: newUnitType,
      beds: Number(newUnitBeds),
      areaSqm: Number(newUnitArea),
      view: newUnitView,
      priceEGP: Number(newUnitPrice),
      status: newUnitStatus,
      finishing: "Finished"
    };

    const breakdown = [...avail.breakdown];
    let cat = breakdown.find(b => b.type === newUnitType);
    if (!cat) {
      cat = {
        type: newUnitType,
        beds: Number(newUnitBeds),
        available: 0,
        minSqm: Number(newUnitArea),
        maxSqm: Number(newUnitArea),
        minPriceM: Number(newUnitPrice) / 1_000_000,
        maxPriceM: Number(newUnitPrice) / 1_000_000,
        units: []
      };
      breakdown.push(cat);
    }

    cat.available += 1;
    cat.units = [...(cat.units || []), newUnit];
    
    cat.minSqm = Math.min(cat.minSqm, Number(newUnitArea));
    cat.maxSqm = Math.max(cat.maxSqm, Number(newUnitArea));
    cat.minPriceM = Math.min(cat.minPriceM, Number(newUnitPrice) / 1_000_000);
    cat.maxPriceM = Math.max(cat.maxPriceM, Number(newUnitPrice) / 1_000_000);

    const totalAvailable = breakdown.reduce((acc, curr) => acc + curr.available, 0);

    updateAvailability(projSlug, {
      ...avail,
      totalAvailable,
      breakdown,
      lastUpdated: new Date().toISOString()
    });

    setNewUnitNum("");
    alert("Unit added successfully!");
  };

  const handleRemoveUnit = (projSlug: string, catType: string, unitId: string) => {
    const avail = availabilityList.find(a => a.slug === projSlug);
    if (!avail) return;

    const breakdown = avail.breakdown.map(b => {
      if (b.type === catType) {
        const units = (b.units || []).filter((u: any) => u.id !== unitId);
        return {
          ...b,
          available: units.length,
          units
        };
      }
      return b;
    }).filter(b => b.available > 0);

    const totalAvailable = breakdown.reduce((acc, curr) => acc + curr.available, 0);

    updateAvailability(projSlug, {
      ...avail,
      totalAvailable,
      breakdown,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleUpdateUnitStatus = (projSlug: string, catType: string, unitId: string, newStatus: string) => {
    const avail = availabilityList.find(a => a.slug === projSlug);
    if (!avail) return;

    const breakdown = avail.breakdown.map(b => {
      if (b.type === catType) {
        const units = (b.units || []).map((u: any) => u.id === unitId ? { ...u, status: newStatus } : u);
        return {
          ...b,
          units
        };
      }
      return b;
    });

    updateAvailability(projSlug, {
      ...avail,
      breakdown,
      lastUpdated: new Date().toISOString()
    });
  };

  // Map settings states
  const [pinnedProjectSlug, setPinnedProjectSlug] = useState("");
  const [editLat, setEditLat] = useState("31.025");
  const [editLng, setEditLng] = useState("30.015");

  const handleUpdatePinCoords = () => {
    const parsedLat = parseFloat(editLat);
    const parsedLng = parseFloat(editLng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) return;

    updateProject(pinnedProjectSlug, {
      lat: parsedLat,
      lng: parsedLng
    });
    alert(`Success: Pin coordinates for project ${pinnedProjectSlug} updated live!`);
  };

  // Select defaults once list is populated
  useEffect(() => {
    if (compoundsList.length > 0) {
      if (!selectedAvailSlug) setSelectedAvailSlug(compoundsList[0].slug);
      if (!pinnedProjectSlug) setPinnedProjectSlug(compoundsList[0].slug);
    }
  }, [compoundsList, selectedAvailSlug, pinnedProjectSlug]);

  useEffect(() => {
    const target = compoundsList.find(c => c.slug === pinnedProjectSlug);
    if (target) {
      setEditLat(String(target.lat));
      setEditLng(String(target.lng));
    }
  }, [pinnedProjectSlug, compoundsList]);

  // Sidebar list of tab links
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "companies", label: "Developers CRUD", icon: Building2 },
    { id: "destinations", label: "Destinations CRUD", icon: MapPin },
    { id: "projects", label: "Projects CRUD", icon: Database },
    { id: "availability", label: "Availability Manager", icon: LayoutGrid },
    { id: "map", label: "Map Control", icon: Layers },
    { id: "tools", label: "Engine Tools", icon: Calculator },
    { id: "people", label: "Agents & RBAC", icon: Users },
    { id: "crm", label: "CRM Oversight", icon: ShieldAlert },
    { id: "ai", label: "AI Grounding", icon: Bot },
    { id: "campaigns", label: "Broadcast Templates", icon: Send },
    { id: "audit", label: "System Audit Logs", icon: FileText }
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
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent">Super-Admin Console</div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white mt-0.5">Real Estate Platform Command Center</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
              Active Session: Admin
            </span>
            <button onClick={onLogout} className="rounded-xl border border-zinc-700 hover:border-destructive hover:text-destructive px-3.5 py-1.5 text-xs font-bold transition-colors bg-zinc-900">
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
                    activeTab === item.id && !selectedProjectSlug && !selectedDeveloperSlug && !selectedDestinationSlug
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
                    <button onClick={() => setSelectedProjectSlug(null)} className="rounded-xl p-2.5 border border-border bg-secondary/30 hover:bg-secondary text-primary transition-all flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">Catalog &gt; Compound Page</div>
                      <h2 className="font-display text-xl font-bold text-primary mt-0.5">{selectedProject.name}</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadProjectForForm(selectedProject)} className="rounded-xl border border-border bg-secondary/30 hover:bg-secondary px-4 py-2 font-bold text-xs text-primary flex items-center gap-1.5 transition-colors">
                      <Edit className="h-3.5 w-3.5 text-accent" /> Edit Specs
                    </button>
                    <button onClick={() => triggerDeleteCheck("project", selectedProject.slug)} className="rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all">
                      <Trash2 className="h-3.5 w-3.5" /> Delete Project
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  
                  {/* Specifications & Description */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><Info className="h-4.5 w-4.5 text-accent" /> Compound Specifications</h3>
                    
                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Developer (Company)</span>
                        <span className="text-primary font-bold">{selectedProject.developer}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Destination Region</span>
                        <span className="text-primary font-bold">{selectedProject.destination.replace(/-/g, " ")}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Coordinates Pin</span>
                        <span className="text-accent font-mono font-bold">{selectedProject.lat.toFixed(4)}, {selectedProject.lng.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">RERA Permit ID</span>
                        <span className="text-primary font-bold font-mono">{selectedProject.permitNumber || "RERA-23849"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Payment Plan</span>
                        <span className="text-primary font-bold">{selectedProject.paymentPlan}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Price starts from</span>
                        <span className="text-primary font-bold">EGP {selectedProject.priceFrom}M</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">Blurb Description</span>
                        <textarea
                          rows={4}
                          value={selectedProject.blurb}
                          onChange={(e) => updateProject(selectedProject.slug, { blurb: e.target.value })}
                          className="w-full border border-border rounded-lg bg-card p-3 font-medium text-xs leading-relaxed text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Master Plan & Brochures file Upload Center */}
                    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><FileText className="h-4.5 w-4.5 text-accent" /> Blueprints &amp; brochures</h4>
                      
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Brochure - any file type */}
                        <div className="border border-border/80 rounded-lg p-3 bg-secondary/15 flex flex-col gap-2">
                          <span className="block text-[9px] font-bold text-muted-foreground uppercase">Sales Brochure (any format)</span>
                          {selectedProject.brochureUrl ? (
                            <div className="flex items-center gap-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-1.5">
                              <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                              <span className="text-[9px] text-emerald-700 font-bold truncate">{selectedProject.brochureFileName || "Brochure uploaded"}</span>
                            </div>
                          ) : (
                            <span className="text-[9px] text-muted-foreground italic">No brochure uploaded yet</span>
                          )}
                          <label className="mt-auto w-full py-2 bg-accent text-white font-bold text-[10px] rounded hover:bg-accent/90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                            {uploadingField === "brochure" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            {uploadingField === "brochure" ? "Uploading..." : "Upload Brochure"}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                              className="hidden"
                              disabled={uploadingField === "brochure"}
                              onChange={(e) => handleFileUpload(e, "brochure", selectedProject.slug)}
                            />
                          </label>
                        </div>

                        {/* Master Plan */}
                        <div className="border border-border/80 rounded-lg p-3 bg-secondary/15 flex flex-col gap-2">
                          <span className="block text-[9px] font-bold text-muted-foreground uppercase">Master Plan Blueprint</span>
                          {selectedProject.masterPlanUrl ? (
                            <div className="relative rounded overflow-hidden" style={{ height: 60 }}>
                              <img src={selectedProject.masterPlanUrl} alt="Master Plan" className="w-full h-full object-cover" />
                              <button
                                onClick={() => updateProject(selectedProject.slug, { masterPlanUrl: undefined })}
                                className="absolute top-1 right-1 rounded bg-black/50 text-white p-0.5 hover:bg-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[9px] text-muted-foreground italic">No master plan uploaded yet</span>
                          )}
                          <label className="mt-auto w-full py-2 bg-accent text-white font-bold text-[10px] rounded hover:bg-accent/90 transition-all flex items-center justify-center gap-1 cursor-pointer">
                            {uploadingField === "masterPlan" ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            {uploadingField === "masterPlan" ? "Uploading..." : "Upload Master Plan"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingField === "masterPlan"}
                              onChange={(e) => handleFileUpload(e, "masterPlan", selectedProject.slug)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pictures Manager */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="h-4.5 w-4.5 text-accent" /> Photos Gallery manager</h3>
                    
                    {/* File Image Uploader */}
                    <div className="border-2 border-dashed border-border/80 bg-secondary/20 rounded-xl p-6 text-center flex flex-col items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-primary">Upload New Gallery Photo</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5 mb-3">Converts image to Data URL and saves to catalog</span>
                      
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
                          const input = document.getElementById("newImgUrlInput") as HTMLInputElement;
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
                        <div key={idx} className="relative rounded-xl border border-border overflow-hidden h-24 group bg-secondary/40">
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
                      <h3 className="font-display text-sm font-bold text-primary">Interactive Units Inventory worksheet</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Manage live units availability database records.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[250px_1fr] items-start">
                    
                    {/* Add Unit Form */}
                    <div className="rounded-xl border border-border bg-secondary/10 p-4 space-y-3">
                      <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2 text-accent flex items-center gap-1">
                        <FileSpreadsheet className="h-4 w-4" /> Import Excel / CSV sheet
                      </span>
                      <div className="border border-dashed border-border/80 rounded-lg p-3 text-center bg-card">
                        <span className="text-[10px] text-muted-foreground block mb-2 font-medium">Select Excel (.xlsx, .xls) or CSV file</span>
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
                        <span className="block text-[10px] font-bold text-primary uppercase tracking-wider mb-2">+ Add Single Inventory Unit</span>
                        
                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground mb-1">Unit Number</label>
                            <input type="text" value={newUnitNum} onChange={(e) => setNewUnitNum(e.target.value)} placeholder="e.g. A-302" className="w-full border border-border rounded-lg bg-card px-2.5 py-1.5 focus:outline-none" />
                          </div>
                          <div className="grid gap-2 grid-cols-2">
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">Type</label>
                              <select value={newUnitType} onChange={(e) => setNewUnitType(e.target.value)} className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none appearance-none">
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Chalet">Chalet</option>
                                <option value="Town House">Town House</option>
                                <option value="Twin House">Twin House</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">Beds</label>
                              <input type="number" value={newUnitBeds} onChange={(e) => setNewUnitBeds(Number(e.target.value))} className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none" />
                            </div>
                          </div>
                          <div className="grid gap-2 grid-cols-2">
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">Area (sqm)</label>
                              <input type="number" value={newUnitArea} onChange={(e) => setNewUnitArea(Number(e.target.value))} className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-muted-foreground mb-1">Status</label>
                              <select value={newUnitStatus} onChange={(e) => setNewUnitStatus(e.target.value)} className="w-full border border-border rounded-lg bg-card px-2 py-1.5 focus:outline-none appearance-none">
                                <option value="Available">Available</option>
                                <option value="Reserved">Reserved</option>
                                <option value="Sold">Sold</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground mb-1">View Aspect</label>
                            <input type="text" value={newUnitView} onChange={(e) => setNewUnitView(e.target.value)} placeholder="e.g. Sea & Lagoon" className="w-full border border-border rounded-lg bg-card px-2.5 py-1.5 focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground mb-1">Price (EGP)</label>
                            <input type="number" value={newUnitPrice} onChange={(e) => setNewUnitPrice(Number(e.target.value))} className="w-full border border-border rounded-lg bg-card px-2.5 py-1.5 focus:outline-none" />
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
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {(() => {
                            const avail = availabilityList.find(a => a.slug === selectedProject.slug);
                            if (!avail || !avail.breakdown?.length) {
                              return (
                                <tr>
                                  <td colSpan={8} className="p-8 text-center text-xs text-muted-foreground italic">No live inventory units listed. Use sheet uploader or add form.</td>
                                </tr>
                              );
                            }

                            return avail.breakdown.flatMap(b => {
                              const units = b.units ?? [];
                              return units.map((u: any) => (
                                <tr key={u.id} className="hover:bg-secondary/15 transition-colors font-medium">
                                  <td className="p-3 font-semibold text-primary">{u.unitNo || "U-Row"}</td>
                                  <td className="p-3 text-muted-foreground">{b.type}</td>
                                  <td className="p-3 text-muted-foreground">{u.beds} Beds</td>
                                  <td className="p-3 text-muted-foreground">{u.areaSqm} sqm</td>
                                  <td className="p-3 text-muted-foreground truncate max-w-[120px]">{u.view || "Garden"}</td>
                                  <td className="p-3 text-primary font-semibold">EGP {(u.priceEGP / 1_000_000).toFixed(2)}M</td>
                                  <td className="p-3">
                                    <select
                                      value={u.status}
                                      onChange={(e) => handleUpdateUnitStatus(selectedProject.slug, b.type, u.id, e.target.value)}
                                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold border focus:outline-none ${
                                        u.status === "Available" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                        u.status === "Reserved" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                        "bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
                                      }`}
                                    >
                                      <option value="Available">Available</option>
                                      <option value="Reserved">Reserved</option>
                                      <option value="Sold">Sold</option>
                                    </select>
                                  </td>
                                  <td className="p-3 text-right">
                                    <button 
                                      onClick={() => handleRemoveUnit(selectedProject.slug, b.type, u.id)}
                                      className="rounded-lg p-1 hover:bg-destructive/10 text-destructive border border-border"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </td>
                                </tr>
                              ));
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>

              </div>
            ) : selectedDeveloperSlug && selectedDeveloper ? (
              // ── DEDICATED DEVELOPER WEBPAGE ──
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedDeveloperSlug(null)} className="rounded-xl p-2.5 border border-border bg-secondary/30 hover:bg-secondary text-primary transition-all flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">Catalog &gt; Developer Profile Page</div>
                      <h2 className="font-display text-xl font-bold text-primary mt-0.5">{selectedDeveloper.name}</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadDeveloperForForm(selectedDeveloper)} className="rounded-xl border border-border bg-secondary/30 hover:bg-secondary px-4 py-2 font-bold text-xs text-primary flex items-center gap-1.5 transition-colors">
                      <Edit className="h-3.5 w-3.5 text-accent" /> Edit Profile
                    </button>
                    <button onClick={() => triggerDeleteCheck("developer", selectedDeveloper.slug)} className="rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all">
                      <Trash2 className="h-3.5 w-3.5" /> Delete Developer
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><Info className="h-4.5 w-4.5 text-accent" /> Brand Metadata</h3>
                    
                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Legal name</span>
                        <span className="text-primary font-bold">{selectedDeveloper.legalName}</span>
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
                        <span className="text-accent font-bold font-mono">{selectedDeveloper.email}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">Corporate Summary</span>
                        <textarea
                          rows={4}
                          value={selectedDeveloper.description}
                          onChange={(e) => updateDeveloper(selectedDeveloper.slug, { description: e.target.value })}
                          className="w-full border border-border rounded-lg bg-card p-3 font-medium text-xs leading-relaxed text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><Database className="h-4.5 w-4.5 text-accent" /> Linked Compounds</h3>
                    
                    <div className="border border-border/80 rounded-xl divide-y divide-border/60 bg-card overflow-hidden">
                      {compoundsList.filter(c => c.developer === selectedDeveloper.name).map(c => (
                        <div key={c.slug} className="p-3 flex justify-between items-center hover:bg-secondary/10 transition-colors font-medium">
                          <div>
                            <span className="text-xs font-bold text-primary block">{c.name}</span>
                            <span className="text-[10px] text-muted-foreground">{c.destination.replace(/-/g, " ")}</span>
                          </div>
                          <button onClick={() => setSelectedProjectSlug(c.slug)} className="rounded-lg border border-border px-3 py-1 text-[10px] font-bold text-accent bg-secondary/30 hover:bg-accent hover:text-white transition-all">Manage →</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedDestinationSlug && selectedDestination ? (
              // ── DEDICATED DESTINATION WEBPAGE ──
              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-3 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedDestinationSlug(null)} className="rounded-xl p-2.5 border border-border bg-secondary/30 hover:bg-secondary text-primary transition-all flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-accent uppercase tracking-wider">Catalog &gt; Destination Page</div>
                      <h2 className="font-display text-xl font-bold text-primary mt-0.5">{selectedDestination.name}</h2>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadDestForForm(selectedDestination)} className="rounded-xl border border-border bg-secondary/30 hover:bg-secondary px-4 py-2 font-bold text-xs text-primary flex items-center gap-1.5 transition-colors">
                      <Edit className="h-3.5 w-3.5 text-accent" /> Edit Specs
                    </button>
                    <button onClick={() => triggerDeleteCheck("destination", selectedDestination.slug)} className="rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition-all">
                      <Trash2 className="h-3.5 w-3.5" /> Delete Destination
                    </button>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Specs */}
                  <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><Info className="h-4.5 w-4.5 text-accent" /> Geographic Specs</h3>
                    
                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3 text-xs font-semibold">
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Region belt</span>
                        <span className="text-primary font-bold">{selectedDestination.region}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Governorate City</span>
                        <span className="text-primary font-bold">{selectedDestination.city || "Cairo"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Kilometer range</span>
                        <span className="text-primary font-bold">{selectedDestination.kmRange || "N/A"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border/40 pb-2">
                        <span className="text-muted-foreground">Map center</span>
                        <span className="text-accent font-mono font-bold text-[10px]">{selectedDestination.center ? selectedDestination.center.join(", ") : "—"}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-muted-foreground block mb-1">Lifestyle Description</span>
                        <textarea
                          rows={4}
                          value={selectedDestination.blurb}
                          onChange={(e) => updateDestination(selectedDestination.slug, { blurb: e.target.value })}
                          className="w-full border border-border rounded-lg bg-card p-3 font-medium text-xs leading-relaxed text-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero Image Manager */}
                  <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="h-4.5 w-4.5 text-accent" /> Hero Image</h3>
                    
                    <div className="rounded-xl border border-border bg-card p-3 space-y-3">
                      {/* Current hero preview */}
                      <div className="relative rounded-xl overflow-hidden" style={{ height: 140 }}>
                        <img src={selectedDestination.hero || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-[9px] text-white/80 font-semibold">Current hero image</span>
                        </div>
                      </div>
                      {/* File uploader */}
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-border/80 rounded-lg p-3 text-center hover:border-accent/60 transition-colors">
                          <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                          <span className="text-[10px] font-bold text-primary block">Upload new hero image</span>
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
                              updateDestination(selectedDestination.slug, { hero: reader.result as string });
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
                            const inp = document.getElementById(`destHeroUrl-${selectedDestination.slug}`) as HTMLInputElement;
                            if (inp?.value) updateDestination(selectedDestination.slug, { hero: inp.value });
                          }}
                          className="rounded-lg bg-accent text-white px-2.5 py-1.5 text-[10px] font-bold hover:bg-accent/90"
                        >Set</button>
                      </div>
                    </div>
                  </div>

                  {/* Linked Compounds */}
                  <div className="space-y-4 lg:col-span-1">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><Database className="h-4.5 w-4.5 text-accent" /> Linked Compounds ({compoundsList.filter(c => c.destination === selectedDestination.slug).length})</h3>
                    
                    <div className="border border-border/80 rounded-xl divide-y divide-border/60 bg-card overflow-hidden max-h-72 overflow-y-auto">
                      {compoundsList.filter(c => c.destination === selectedDestination.slug).map(c => (
                        <div key={c.slug} className="p-3 flex justify-between items-center hover:bg-secondary/10 transition-colors font-medium">
                          <div>
                            <span className="text-xs font-bold text-primary block">{c.name}</span>
                            <span className="text-[10px] text-muted-foreground">{c.developer}</span>
                          </div>
                          <button onClick={() => setSelectedProjectSlug(c.slug)} className="rounded-lg border border-border px-3 py-1 text-[10px] font-bold text-accent bg-secondary/30 hover:bg-accent hover:text-white transition-all">Manage →</button>
                        </div>
                      ))}
                      {compoundsList.filter(c => c.destination === selectedDestination.slug).length === 0 && (
                        <div className="p-6 text-center text-xs text-muted-foreground italic">No compounds linked to this destination yet.</div>
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
                        { label: "Total Projects", val: compoundsList.length, color: "text-blue-500", icon: Database },
                        { label: "Active Units", val: availabilityList.reduce((acc, curr) => acc + curr.totalAvailable, 0), color: "text-emerald-500", icon: LayoutGrid },
                        { label: "System Agents", val: 42, color: "text-purple-500", icon: Users },
                        { label: "WhatsApp Dispatches", val: 1284, color: "text-green-500", icon: Send }
                      ].map((k) => (
                        <div key={k.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft flex items-center gap-4">
                          <div className={`rounded-xl p-3 bg-secondary/60 ${k.color}`}>
                            <k.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase text-muted-foreground">{k.label}</div>
                            <div className="font-display text-2xl font-black text-primary mt-1">{k.val}</div>
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
                            <button onClick={() => setActiveTab("projects")} className="underline text-[10px]">Fix</button>
                          </div>
                          <div className="p-3 bg-amber-500/10 rounded-xl flex items-center justify-between">
                            <span>⚠️ 2 projects show lat/lng coordinate outliers</span>
                            <button onClick={() => setActiveTab("map")} className="underline text-[10px]">Adjust</button>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                        <h3 className="font-display text-sm font-bold text-primary">Command shortcuts</h3>
                        <div className="grid gap-2 grid-cols-2">
                          <button onClick={() => { clearProjectForm(); setEditingItem(null); setShowAddProjectModal(true); }} className="rounded-xl border border-border bg-secondary/30 hover:border-accent/40 p-3 text-left font-bold text-xs flex flex-col justify-between h-20 transition-all">
                            <Plus className="h-4 w-4 text-accent" />
                            <span>Add New Project</span>
                          </button>
                          <button onClick={() => { clearDevForm(); setEditingItem(null); setShowAddDeveloperModal(true); }} className="rounded-xl border border-border bg-secondary/30 hover:border-accent/40 p-3 text-left font-bold text-xs flex flex-col justify-between h-20 transition-all">
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
                        <h2 className="font-display text-lg font-bold text-primary">Company &amp; Developer Directory</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage partner real estate development conglomerates. Click any row to view its webpage profile.</p>
                      </div>
                      <button onClick={() => { clearDevForm(); setEditingItem(null); setShowAddDeveloperModal(true); }} className="rounded-xl bg-accent text-white px-3.5 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5">
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
                            <tr key={d.slug} className="hover:bg-secondary/15 transition-colors font-medium cursor-pointer" onClick={() => setSelectedDeveloperSlug(d.slug)}>
                              <td className="p-3 font-semibold text-primary hover:text-accent transition-colors flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {d.name}
                              </td>
                              <td className="p-3 text-muted-foreground">{d.legalName}</td>
                              <td className="p-3">
                                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-600 border border-blue-500/20 font-bold">{d.tier}</span>
                              </td>
                              <td className="p-3 text-emerald-600 font-bold">{d.status}</td>
                              <td className="p-3 text-muted-foreground">{compoundsList.filter(c => c.developer === d.name).length} projects</td>
                              <td className="p-3 text-right flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => loadDeveloperForForm(d)} className="rounded-lg p-1.5 border border-border hover:bg-secondary text-primary">
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => triggerDeleteCheck("developer", d.slug)} className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive">
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
                        <h2 className="font-display text-lg font-bold text-primary">Destination regions</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage districts, cities, and resort ranges. Click any row to view its webpage.</p>
                      </div>
                      <button onClick={() => { clearDestForm(); setEditingItem(null); setShowAddDestinationModal(true); }} className="rounded-xl bg-accent text-white px-3.5 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5">
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
                            <tr key={d.slug} className="hover:bg-secondary/15 transition-colors cursor-pointer" onClick={() => setSelectedDestinationSlug(d.slug)}>
                              <td className="p-3 text-muted-foreground font-semibold font-mono">{d.slug}</td>
                              <td className="p-3 font-semibold text-primary hover:text-accent transition-colors flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {d.name}
                              </td>
                              <td className="p-3">
                                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-purple-600 border border-purple-500/20 font-bold">{d.region}</span>
                              </td>
                              <td className="p-3 text-muted-foreground font-mono">{d.center ? d.center.join(", ") : "—"}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 rounded-full" style={{ background: d.color }}></span>
                                  <span className="text-[10px] font-bold font-mono">{d.color}</span>
                                </div>
                              </td>
                              <td className="p-3 text-right flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => loadDestForForm(d)} className="rounded-lg p-1.5 border border-border hover:bg-secondary text-primary">
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => triggerDeleteCheck("destination", d.slug)} className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive">
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
                        <h2 className="font-display text-lg font-bold text-primary">Compounds database Catalog</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Manage listings, photos, and specs. Click on a project to open its dedicated editor page.</p>
                      </div>
                      <button onClick={() => { clearProjectForm(); setEditingItem(null); setShowAddProjectModal(true); }} className="rounded-xl bg-accent text-white px-3.5 py-2 font-bold text-xs hover:bg-accent/90 transition-colors flex items-center gap-1.5">
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
                            <tr key={c.slug} className="hover:bg-secondary/15 transition-colors cursor-pointer" onClick={() => setSelectedProjectSlug(c.slug)}>
                              <td className="p-3 font-semibold text-primary hover:text-accent transition-colors flex items-center gap-2">
                                <Database className="h-4 w-4 text-muted-foreground" />
                                {c.name}
                              </td>
                              <td className="p-3 text-muted-foreground">{c.developer}</td>
                              <td className="p-3 font-semibold text-accent">{c.destination.replace(/-/g, " ")}</td>
                              <td className="p-3 text-muted-foreground">{c.deliveryYear}</td>
                              <td className="p-3 text-muted-foreground font-mono">{c.permitNumber || "RERA-90184"}</td>
                              <td className="p-3 font-bold text-primary">EGP {c.priceFrom}M</td>
                              <td className="p-3 text-right flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => loadProjectForForm(c)} className="rounded-lg p-1.5 border border-border hover:bg-secondary text-primary">
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => triggerDeleteCheck("project", c.slug)} className="rounded-lg p-1.5 border border-border hover:bg-destructive/10 text-destructive">
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

                {/* availability (daily availability manager dashboard) */}
                {activeTab === "availability" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <LayoutGrid className="h-5 w-5 text-accent" /> Daily Project Availability Manager
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Control live unit status databases, edit layout configurations, or bulk import CSV/Excel data sheets.</p>
                    </div>

                    {/* Bulk Excel sheet Uploader */}
                    <div className="bg-secondary/10 p-5 rounded-xl border border-border/40 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5"><FileSpreadsheet className="h-4.5 w-4.5 text-accent" /> Upload Excel or CSV Sheet</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5">Upload a developer spreadsheet (.xlsx, .xls, .csv) with columns: Type, Price, Beds, Area, Unit Number, View, and Status.</p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-[200px_1fr] items-center">
                        <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Target Compound</label>
                          <select 
                            value={selectedAvailSlug}
                            onChange={(e) => setSelectedAvailSlug(e.target.value)}
                            className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-xs focus:outline-none"
                          >
                            {compoundsList.map(c => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="border-2 border-dashed border-border/80 bg-card rounded-xl p-6 text-center flex flex-col items-center justify-center relative">
                          <FileSpreadsheet className="h-6 w-6 text-accent mb-1.5" />
                          <span className="text-xs font-bold text-primary">Import Spreadsheet file</span>
                          <span className="text-[9px] text-muted-foreground mt-0.5 mb-3">Supports XLSX, XLS and CSV sheets</span>
                          
                          <label className="cursor-pointer rounded-lg bg-accent text-white font-semibold text-[10px] px-3.5 py-2 hover:bg-accent/90 transition-colors shadow-soft">
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
                    </div>

                    {/* Compounds grid manager */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Compounds Availability list</h3>
                      
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {compoundsList.map(c => {
                          const avail = availabilityList.find(a => a.slug === c.slug);
                          const total = avail?.totalAvailable ?? 0;
                          return (
                            <div 
                              key={c.slug} 
                              onClick={() => setSelectedProjectSlug(c.slug)}
                              className="rounded-xl border border-border bg-card p-4 hover:border-accent/40 cursor-pointer hover:bg-secondary/15 transition-all flex justify-between items-center shadow-soft"
                            >
                              <div>
                                <span className="text-xs font-bold text-primary block">{c.name}</span>
                                <span className="text-[10px] text-muted-foreground mt-0.5">{c.developer}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-accent block">{total} Units</span>
                                <span className="text-[9px] text-muted-foreground block mt-0.5">Manage →</span>
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
                      <p className="text-xs text-muted-foreground mt-0.5">Edit pin placements, draw communities polygons, and publish changes.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-[250px_1fr] items-start">
                      <div className="rounded-xl border border-border bg-secondary/15 p-4 space-y-4">
                        <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pin Coordinates Manager</span>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Target Compound</label>
                            <select 
                              value={pinnedProjectSlug}
                              onChange={(e) => setPinnedProjectSlug(e.target.value)}
                              className="w-full appearance-none rounded-lg border border-border bg-card px-2.5 py-2 text-xs focus:outline-none"
                            >
                              {compoundsList.map(c => (
                                <option key={c.slug} value={c.slug}>{c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Latitude</label>
                            <input
                              type="text"
                              value={editLat}
                              onChange={(e) => setEditLat(e.target.value)}
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-mono focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Longitude</label>
                            <input
                              type="text"
                              value={editLng}
                              onChange={(e) => setEditLng(e.target.value)}
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-mono focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={handleUpdatePinCoords}
                            className="w-full py-2 bg-accent text-white font-bold text-xs rounded-lg hover:bg-accent/90 transition-colors"
                          >
                            Publish Pin Coordinate
                          </button>
                        </div>
                      </div>

                      <div className="h-80 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        <MapPin className="h-10 w-10 text-accent animate-bounce relative z-10" />
                        <h4 className="font-bold text-white text-sm mt-3 relative z-10">Staging Map Viewer</h4>
                        <p className="text-[11px] text-zinc-400 max-w-xs mt-1 relative z-10 leading-relaxed">
                          Coordinates calibrated: Lat <strong>{parseFloat(editLat).toFixed(4)}</strong>, Lng <strong>{parseFloat(editLng).toFixed(4)}</strong>. Live pins synchronized inside PropTrack Map module.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* tools */}
                {activeTab === "tools" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                      <h3 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                        <Calculator className="h-4.5 w-4.5 text-accent" /> Payment Calculator Configurations
                      </h3>
                      <p className="text-xs text-muted-foreground">Adjust platform-wide escalation, VAT parameters, and currencies.</p>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-muted-foreground mb-1">Standard Maintenance Fee</label>
                          <input type="text" defaultValue="8%" className="w-full border border-border rounded-lg bg-secondary/20 px-3 py-2 focus:outline-none" />
                        </div>
                        <div>
                          <label className="block font-bold text-muted-foreground mb-1">VAT Toggles</label>
                          <select className="w-full border border-border rounded-lg bg-secondary/20 px-3 py-2 focus:outline-none">
                            <option>Exclude taxes</option>
                            <option>Include 14% VAT</option>
                          </select>
                        </div>
                        <button onClick={() => alert("Calculator settings updated.")} className="px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors">
                          Save Settings
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                      <h3 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                        <Sliders className="h-4.5 w-4.5 text-accent" /> Comparison Engine Weights
                      </h3>
                      <p className="text-xs text-muted-foreground">Set weightings for compound matching algorithms.</p>
                      
                      <div className="space-y-3 text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center justify-between border-b border-border/40 py-2">
                          <span>Pricing Weight</span>
                          <input type="range" className="w-24 accent-accent" defaultValue="80" />
                        </div>
                        <div className="flex items-center justify-between border-b border-border/40 py-2">
                          <span>Delivery Sooner Weight</span>
                          <input type="range" className="w-24 accent-accent" defaultValue="60" />
                        </div>
                        <button onClick={() => alert("Comparison weights saved.")} className="px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition-colors">
                          Save Weights
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* people */}
                {activeTab === "people" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary">Broker agent credentials &amp; RBAC</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Control registered agent access accounts and permissions.</p>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Subscription Tier</th>
                            <th className="p-3">Actions Permission</th>
                            <th className="p-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {[
                            { name: "Ahmed Khaled", email: "ahmed@nawy-broker.com", tier: "Pro", role: "Agent (Full Write)" },
                            { name: "Salma Adel", email: "salma@coldwell-eg.com", tier: "Agency", role: "Manager (Full Edit)" },
                            { name: "Yara Mostafa", email: "yara@vintage-eg.com", tier: "Starter", role: "Agent (Read Only)" },
                            { name: "Elsayed Shoeip (Admin)", email: "elsayedshoeip70@gmail.com", tier: "Agency", role: "Super-Admin" }
                          ].map((a, i) => (
                            <tr key={i} className="hover:bg-secondary/15 transition-colors">
                              <td className="p-3 font-semibold text-primary">{a.name}</td>
                              <td className="p-3 text-muted-foreground font-mono">{a.email}</td>
                              <td className="p-3 text-primary font-bold">{a.tier}</td>
                              <td className="p-3 text-accent font-mono">{a.role}</td>
                              <td className="p-3 text-right">
                                <span className="inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Active</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* crm */}
                {activeTab === "crm" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary">CRM Oversight &amp; Leads Router</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Global pool of leads captured across the platform.</p>
                    </div>

                    <div className="overflow-x-auto border border-border/80 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50 font-bold text-[10px] uppercase text-muted-foreground tracking-wider">
                            <th className="p-3">Client Contact</th>
                            <th className="p-3">Budget Preference</th>
                            <th className="p-3">Project Interest</th>
                            <th className="p-3">Status Stage</th>
                            <th className="p-3 text-right">Auto-Assigned Agent</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60 font-medium">
                          {leads.map((l) => (
                            <tr key={l.id} className="hover:bg-secondary/15 transition-colors">
                              <td className="p-3">
                                <div className="font-bold text-primary">{l.name}</div>
                                <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{l.phone}</div>
                              </td>
                              <td className="p-3 font-bold text-primary">EGP {l.budget}M</td>
                              <td className="p-3 text-accent font-semibold">{l.interest.replace(/-/g, " ")}</td>
                              <td className="p-3">
                                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-600 font-bold border border-blue-500/20">{l.stage}</span>
                              </td>
                              <td className="p-3 text-right text-muted-foreground">Ahmed Khaled</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ai */}
                {activeTab === "ai" && (
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
                    <div>
                      <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                        <Bot className="h-5 w-5 text-accent" /> AI Broker Assistant training Grounding
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Control the prompts and documents the assistant references.</p>
                    </div>

                    <div className="space-y-4 text-xs font-medium">
                      <div>
                        <label className="block font-bold text-primary mb-1.5">System Prompt &amp; Behavioral Rules</label>
                        <textarea 
                          rows={5}
                          className="w-full rounded-xl border border-border bg-secondary/10 p-3 font-mono focus:outline-none"
                          defaultValue="You are Antigravity, a professional real estate broker assistant designed for Egypt. Ground your facts inside the provided compounds and availability database. Never quote unverified prices."
                        />
                      </div>
                      <button onClick={() => alert("AI assistant grounding updated.")} className="px-4 py-2.5 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-colors shadow-soft">
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
                      <p className="text-xs text-muted-foreground mt-0.5">Central approved templates list for messaging campaigns.</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { title: "Sahel Summer Launch", body: "Hi {name}! Check out the latest summer chalets in Ras El Hekma. Starting from EGP 8M with 10% down payment." },
                        { title: "Budget Followup", body: "Hi {name}! Based on your budget interest of {budget}M, here are the matching units with live availability." }
                      ].map((t, i) => (
                        <div key={i} className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2 font-medium">
                          <div className="font-bold text-primary text-xs flex justify-between items-center">
                            <span>{t.title}</span>
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600">Approved</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-relaxed italic">"{t.body}"</p>
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
                      <p className="text-xs text-muted-foreground mt-0.5">Detailed history tracking all data changes made by super-admins.</p>
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
                            <tr key={log.id} className="hover:bg-secondary/15 transition-colors font-medium">
                              <td className="p-3 text-primary text-xs font-semibold">{log.actor}</td>
                              <td className="p-3 text-accent font-bold text-[10px]">{log.entity}</td>
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

              </>
            )}

          </main>
        </div>
      </div>

      {/* ── Add Project Modal ── */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => { setShowAddProjectModal(false); setEditingItem(null); clearProjectForm(); }} className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              {editingItem ? `Edit Project Specs: ${editingItem.name}` : "Create New Compound"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-medium">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Project Name</label>
                  <input type="text" required value={pName} onChange={(e) => setPName(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">RERA Permit Number</label>
                  <input type="text" required value={pPermit} onChange={(e) => setPPermit(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Status</label>
                  <select value={pStatus} onChange={(e) => setPStatus(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none">
                    <option value="Off-Plan">Off-Plan</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready">Ready</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Handover Year</label>
                  <input type="number" required value={pHandover} onChange={(e) => setPHandover(Number(e.target.value))} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Starting Price (EGP M)</label>
                  <input type="number" step="0.1" required value={pPrice} onChange={(e) => setPPrice(Number(e.target.value))} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Latitude</label>
                  <input type="text" required value={pLat} onChange={(e) => setPLat(Number(e.target.value))} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Longitude</label>
                  <input type="text" required value={pLng} onChange={(e) => setPLng(Number(e.target.value))} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Developer Company (Transfer Reference)</label>
                  <select value={pDev} onChange={(e) => setPDev(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none">
                    <option value="">Select Company...</option>
                    {developersList.map(d => (
                      <option key={d.slug} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Destination Region (Transfer Region)</label>
                  <select value={pDest} onChange={(e) => setPDest(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none">
                    <option value="">Select Community...</option>
                    {destinationsList.map(d => (
                      <option key={d.slug} value={d.slug}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Project Size (Feddan)</label>
                  <input type="text" value={pSize} onChange={(e) => setPSize(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Unit Area Range</label>
                  <input type="text" value={pUnitSizes} onChange={(e) => setPUnitSizes(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Default Payment Plan</label>
                <input type="text" value={pPaymentPlan} onChange={(e) => setPPaymentPlan(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Compound Description</label>
                <textarea rows={3} required value={pBlurb} onChange={(e) => setPBlurb(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 p-3" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Amenities Checklist (Comma-separated)</label>
                <input type="text" value={pAmenities} onChange={(e) => setPAmenities(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
              </div>

              <button type="submit" className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft">
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
            <button onClick={() => { setShowAddDeveloperModal(false); setEditingItem(null); clearDevForm(); }} className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4">
              {editingItem ? `Edit Developer: ${editingItem.name}` : "Add Developer Company"}
            </h3>

            <form onSubmit={handleSaveDeveloper} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Company name</label>
                <input type="text" required value={dName} onChange={(e) => setDName(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Legal Registered Entity</label>
                <input type="text" required value={dLegal} onChange={(e) => setDLegal(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Reputation Tier</label>
                  <select value={dTier} onChange={(e) => setDTier(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none">
                    <option value="Tier A">Tier A</option>
                    <option value="Tier B">Tier B</option>
                    <option value="Tier C">Tier C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Contact Hotline</label>
                  <input type="text" required value={dPhone} onChange={(e) => setDPhone(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Email</label>
                  <input type="email" required value={dEmail} onChange={(e) => setDEmail(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">HQ Address</label>
                  <input type="text" required value={dAddress} onChange={(e) => setDAddress(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Corporate Summary</label>
                <textarea rows={3} required value={dDesc} onChange={(e) => setDDesc(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 p-3" />
              </div>

              <button type="submit" className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft">
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
            <button onClick={() => { setShowAddDestinationModal(false); setEditingItem(null); clearDestForm(); }} className="absolute right-4 top-4 rounded-xl border border-border p-1 hover:bg-secondary transition-colors">
              <X className="h-4 w-4" />
            </button>
            <h3 className="font-display text-lg font-bold text-primary mb-4">
              {editingItem ? `Edit Destination: ${editingItem.name}` : "Create New Community Destination"}
            </h3>

            <form onSubmit={handleSaveDestination} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Destination Name</label>
                <input type="text" required value={destName} onChange={(e) => setDestName(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Region Category</label>
                  <select value={destRegion} onChange={(e) => setDestRegion(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 appearance-none">
                    <option value="greater-cairo">Greater Cairo</option>
                    <option value="north-coast">North Coast (Sahel)</option>
                    <option value="red-sea">Red Sea</option>
                    <option value="sinai">Sinai</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Overlay color (Pin Hex)</label>
                  <input type="color" value={destColor} onChange={(e) => setDestColor(e.target.value)} className="w-full h-9 border border-border rounded-lg bg-secondary/10 px-1 py-1" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Governorate / City</label>
                  <input type="text" required value={destCity} onChange={(e) => setDestCity(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Road Kilometer Range</label>
                  <input type="text" value={destKm} onChange={(e) => setDestKm(e.target.value)} placeholder="e.g. 120-145 km" className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Map Latitude Center</label>
                  <input type="text" required value={destLat} onChange={(e) => setDestLat(Number(e.target.value))} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Map Longitude Center</label>
                  <input type="text" required value={destLng} onChange={(e) => setDestLng(Number(e.target.value))} className="w-full border border-border rounded-lg bg-secondary/10 px-3 py-2 font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Lifestyle Summary description</label>
                <textarea rows={3} required value={destBlurb} onChange={(e) => setDestBlurb(e.target.value)} className="w-full border border-border rounded-lg bg-secondary/10 p-3" />
              </div>

              <button type="submit" className="w-full py-3 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent/90 transition-colors shadow-soft">
                {editingItem ? "Publish Changes" : "Create Destination"}
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
              <button onClick={() => { setDependencyWarning(null); setDeleteTarget(null); }} className="rounded-xl border border-border bg-secondary/40 px-4 py-2 text-xs font-bold hover:bg-secondary">
                Cancel
              </button>
              <button onClick={() => executeDeletion(deleteTarget.type, deleteTarget.slug)} className="rounded-xl bg-destructive text-white font-bold text-xs hover:bg-destructive/95 px-4 py-2">
                Cascade Delete Anyway
              </button>
            </div>
          </div>
        </div>
      )}

    </Shell>
  );
}
