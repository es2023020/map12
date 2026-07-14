import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { compounds } from "@/data/compounds";
import { availability } from "@/data/availability";
import { destinations } from "@/data/destinations";

export const normalizeDeveloperName = (name: string): string => {
  if (!name) return "";
  const lower = name.trim().toLowerCase();
  if (lower === "mountain view developments" || lower === "mountain view development" || lower === "mountain view") {
    return "Mountain View";
  }
  if (
    lower === "orascom" ||
    lower === "orascom development" ||
    lower === "orascom developments" ||
    lower === "orascom development egypt" ||
    lower === "orascom hotels & development"
  ) {
    return "Orascom Development";
  }
  return name.trim();
};


// Session-scoped login: on every page load we check if a browser session is still active.
// sessionStorage is cleared when the browser tab/window is fully closed, so this
// guarantees the user must re-login after closing the app.
const SESSION_KEY = "proptrack-session-active";
const isSessionActive = () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
const markSessionActive = () => { if (typeof sessionStorage !== "undefined") sessionStorage.setItem(SESSION_KEY, "1"); };
const clearSession = () => { if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(SESSION_KEY); };

export type LeadStage = "new" | "contacted" | "viewing" | "negotiating" | "closed";
export type ActivityType = "note" | "whatsapp" | "stage" | "meeting" | "system";
export type ActivityLogItem = {
  id: string;
  type: ActivityType;
  text: string;
  timestamp: number;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  budget: number; // EGP M
  interest: string; // compound slug or destination
  notes?: string;
  stage: LeadStage;
  createdAt: number;
  assignedUnits: string[]; // unit descriptors
  lastContacted: number; // timestamp
  priority: "high" | "medium" | "low";
  activityLog: ActivityLogItem[];
};

export type BrokerUser = { email: string; name: string; tier: "Starter" | "Pro" | "Agency"; avatar?: string };
export type AgentTask = { id: string; text: string; completed: boolean };
export type CustomShortcut = { id: string; label: string; url: string };
export type RegisteredUser = { email: string; name: string; password?: string; tier: "Starter" | "Pro" | "Agency"; avatar?: string };

type UserData = {
  favorites: string[];
  compareList: string[];
  leads: Lead[];
  recentlyViewed: string[];
  agentNotes: string;
  agentTasks: AgentTask[];
  customShortcuts: CustomShortcut[];
  customBrochures: Array<{ name: string; type: string; category: string; file: string; path: string; size_mb?: number }>;
  customProfiles: Array<{ clean_name: string; filename: string; path: string; size_mb: number }>;
  salesTarget: number;
};

type State = {
  user: BrokerUser | null;
  favorites: string[]; // compound slugs
  compareList: string[];
  leads: Lead[];
  recentlyViewed: string[];
  agentNotes: string;
  agentTasks: AgentTask[];
  salesTarget: number; // in EGP Millions
  customShortcuts: CustomShortcut[];
  usersDatabase: RegisteredUser[];
  customBrochures: Array<{ name: string; type: string; category: string; file: string; path: string; size_mb?: number }>;
  customProfiles: Array<{ clean_name: string; filename: string; path: string; size_mb: number }>;
  userData?: Record<string, UserData>;
  
  // Platform Admin Data
  compoundsList: any[];
  availabilityList: any[];
  destinationsList: any[];
  developersList: any[];
  newLaunchesList: string[];
  auditLogs: any[];

  // Actions
  signIn: (email: string, password?: string) => boolean;
  signUp: (email: string, name: string, password?: string, tier?: "Starter" | "Pro" | "Agency") => boolean;
  signOut: () => void;
  toggleFavorite: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  addRecent: (slug: string) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "assignedUnits" | "lastContacted" | "priority" | "activityLog">) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  deleteLead: (id: string) => void;
  updateNotes: (notes: string) => void;
  setSalesTarget: (target: number) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addCustomShortcut: (label: string, url: string) => void;
  deleteCustomShortcut: (id: string) => void;
  assignUnitToLead: (leadId: string, unitStr: string) => void;
  removeUnitFromLead: (leadId: string, unitStr: string) => void;
  updateLeadPriority: (id: string, priority: "high" | "medium" | "low") => void;
  updateLeadNotesAndBudget: (id: string, notes: string, budget: number) => void;
  updateLeadContacted: (id: string) => void;
  addLeadActivity: (leadId: string, type: ActivityType, text: string) => void;
  updateLeadDetails: (id: string, updates: Partial<Lead>) => void;
  addCustomBrochure: (brochure: { name: string; type: string; category: string; file: string; path: string; size_mb?: number }) => void;
  addCustomProfile: (profile: { clean_name: string; filename: string; path: string; size_mb: number }) => void;

  // Admin Actions
  addProject: (p: any) => void;
  updateProject: (slug: string, updates: any) => void;
  deleteProject: (slug: string) => void;
  addDestination: (d: any) => void;
  updateDestination: (slug: string, updates: any) => void;
  deleteDestination: (slug: string) => void;
  addDeveloper: (dev: any) => void;
  updateDeveloper: (slug: string, updates: any) => void;
  deleteDeveloper: (slug: string) => void;
  updateAvailability: (slug: string, data: any) => void;
  bulkUpdateAvailability: (data: any[]) => void;
  addNewLaunchSlug: (slug: string) => void;
  removeNewLaunchSlug: (slug: string) => void;
  addAuditLog: (log: { actor: string; entity: string; action: string; before?: string; after?: string }) => void;
};

const seedLeads: Lead[] = [
  { 
    id: "l1", 
    name: "Ahmed Hassan", 
    phone: "+20 100 111 2233", 
    budget: 14, 
    interest: "marassi", 
    stage: "viewing", 
    createdAt: Date.now() - 86400000 * 2, 
    notes: "Looking for 3BR chalet, beachfront", 
    assignedUnits: ["Marassi - Entry Layout (EGP 14.5M+)"], 
    lastContacted: Date.now() - 86400000 * 4, 
    priority: "high",
    activityLog: [
      { id: "a1", type: "system", text: "Prospect registered in system", timestamp: Date.now() - 86400000 * 5 },
      { id: "a2", type: "whatsapp", text: "Welcome brochure sent via WhatsApp Web", timestamp: Date.now() - 86400000 * 4 },
      { id: "a3", type: "stage", text: "Stage updated to Contacted", timestamp: Date.now() - 86400000 * 3 },
      { id: "a4", type: "system", text: "Assigned compound: Marassi - Entry Layout (EGP 14.5M+)", timestamp: Date.now() - 86400000 * 2 },
      { id: "a5", type: "stage", text: "Stage updated to Viewing Site", timestamp: Date.now() - 86400000 * 2 }
    ]
  },
  { 
    id: "l2", 
    name: "Salma Adel", 
    phone: "+20 122 555 8899", 
    budget: 8, 
    interest: "fouka-bay", 
    stage: "contacted", 
    createdAt: Date.now() - 86400000 * 5, 
    assignedUnits: [], 
    lastContacted: Date.now() - 86400000 * 5, 
    priority: "medium",
    activityLog: [
      { id: "a6", type: "system", text: "Prospect registered in system", timestamp: Date.now() - 86400000 * 5 },
      { id: "a7", type: "whatsapp", text: "Followup call: shared Solare brochure link", timestamp: Date.now() - 86400000 * 5 }
    ]
  },
  { 
    id: "l3", 
    name: "Karim Nabil", 
    phone: "+20 111 222 3344", 
    budget: 22, 
    interest: "soul", 
    stage: "new", 
    createdAt: Date.now() - 86400000, 
    assignedUnits: [], 
    lastContacted: Date.now() - 86400000, 
    priority: "high",
    activityLog: [
      { id: "a8", type: "system", text: "Prospect registered in system", timestamp: Date.now() - 86400000 * 1 }
    ]
  },
  { 
    id: "l4", 
    name: "Mona Sherif", 
    phone: "+20 100 988 7766", 
    budget: 18, 
    interest: "mivida", 
    stage: "negotiating", 
    createdAt: Date.now() - 86400000 * 8, 
    assignedUnits: [], 
    lastContacted: Date.now() - 86400000 * 8, 
    priority: "low",
    activityLog: [
      { id: "a9", type: "system", text: "Prospect registered in system", timestamp: Date.now() - 86400000 * 8 },
      { id: "a10", type: "stage", text: "Stage updated to Contacted", timestamp: Date.now() - 86400000 * 6 },
      { id: "a11", type: "note", text: "Wants a payment plan spread over 8 years with equal installments", timestamp: Date.now() - 86400000 * 4 },
      { id: "a12", type: "stage", text: "Stage updated to Negotiating", timestamp: Date.now() - 86400000 * 2 }
    ]
  },
];

const seedUsers: RegisteredUser[] = [
  { email: "admin@proptrack.com", name: "PropTrack Admin", password: "Team1", tier: "Agency" },
  { email: "elsayedshoeip70@gmail.com", name: "Elsayed Shoeip (Admin)", password: "Sayed@shoeip8", tier: "Agency" }
];

export const useStore = create<State>()(
  persist(
    (originalSet, get) => {
      // Define a custom set function that intercepts and saves state to userData
      const set = (nextStateOrFn: Partial<State> | ((state: State) => Partial<State>)) => {
        originalSet((state: State) => {
          const next = typeof nextStateOrFn === "function" ? nextStateOrFn(state) : nextStateOrFn;
          const merged = { ...state, ...next };
          if (merged.user) {
            const email = merged.user.email.toLowerCase();
            merged.userData = {
              ...(merged.userData || {}),
              [email]: {
                favorites: merged.favorites,
                compareList: merged.compareList,
                leads: merged.leads,
                recentlyViewed: merged.recentlyViewed,
                agentNotes: merged.agentNotes,
                agentTasks: merged.agentTasks,
                customShortcuts: merged.customShortcuts,
                customBrochures: merged.customBrochures,
                customProfiles: merged.customProfiles,
                salesTarget: merged.salesTarget,
              }
            };
          }
          return merged;
        });
      };

      // Initial derived developer list from seed compounds
      const seedDevelopers = Array.from(new Set(compounds.map(c => normalizeDeveloperName(c.developer)))).map((name, i) => ({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        legalName: `${name} S.A.E.`,
        description: `${name} is a leading real estate developer in Egypt, renowned for high-quality builds and luxury communities.`,
        phone: "+20 19688",
        email: `info@${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
        address: "Cairo, Egypt",
        tier: "Tier A",
        status: "Verified",
        projects: compounds.filter(c => normalizeDeveloperName(c.developer) === name).map(c => c.name)
      }));

      const initialNewLaunches = [
        "creekview", "elea-azha-north", "aqua-lagoons-june", "sadaf", 
        "commonhaus", "the-lynks", "park-sight", "silvertown-lagoon-cabanas", 
        "marresidence", "chapters-residence", "vea-new-cairo", "vie-collective", 
        "vie-halo", "coral-coves", "menorca", "the-commons", "covaya", 
        "olive-oasis", "sealine-seashore",
        "hacienda-ras-el-hekma", "direction-white", "hap-town", "seazen"
      ];

      return {
        user: null,
        favorites: [],
        compareList: [],
        leads: seedLeads,
        recentlyViewed: [],
        agentNotes: "### Agent Scratchpad\n- Follow up with Ahmed Hassan on Marassi chalets\n- Review new Sodics June brochure\n- Call new leads from Facebook Ads",
        agentTasks: [
          { id: "t1", text: "Call back Karim Nabil about Soul villa", completed: false },
          { id: "t2", text: "Prepare compare sheet for Azha vs Seashore", completed: true },
          { id: "t3", text: "Open WhatsApp Web and sync leads", completed: false }
        ],
        salesTarget: 50,
        customShortcuts: [
          { id: "s1", label: "Developer Portals", url: "https://www.nawy.com/developers" }
        ],
        usersDatabase: seedUsers,
        customBrochures: [],
        customProfiles: [],
        userData: {},

        // Platform Admin Data
        compoundsList: compounds.map((c) => ({
          ...c,
          developer: normalizeDeveloperName(c.developer),
          developerSlug: normalizeDeveloperName(c.developer).toLowerCase().replace(/[^a-z0-9]+/g, "-")
        })),
        availabilityList: availability,
        destinationsList: destinations,
        developersList: seedDevelopers,
        newLaunchesList: initialNewLaunches,
        auditLogs: [
          { id: "a1", actor: "System", entity: "Database", action: "Initialized PropTrack Command Center databases", timestamp: Date.now() - 3600000 * 2 }
        ],

        signIn: (email, password) => {
          const user = get().usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (user && (!user.password || user.password === password)) {
            // Sync current session first if there's any active user
            const currentUser = get().user;
            if (currentUser) {
              const currentEmail = currentUser.email.toLowerCase();
              originalSet((state: any) => ({
                userData: {
                  ...(state.userData || {}),
                  [currentEmail]: {
                    favorites: state.favorites,
                    compareList: state.compareList,
                    leads: state.leads,
                    recentlyViewed: state.recentlyViewed,
                    agentNotes: state.agentNotes,
                    agentTasks: state.agentTasks,
                    customShortcuts: state.customShortcuts,
                    customBrochures: state.customBrochures,
                    customProfiles: state.customProfiles,
                    salesTarget: state.salesTarget,
                  }
                }
              }));
            }

            // Load target user data
            const savedData = get().userData?.[email.toLowerCase()];

            // Check if this is a seed admin account (pre-populated with demo data only on first ever login)
            const isSeedAdmin = ["admin@proptrack.com", "elsayedshoeip70@gmail.com"].includes(email.toLowerCase());
            const isFirstLogin = !savedData;

            originalSet({
              user: { email: user.email, name: user.name, tier: user.tier, avatar: user.avatar },
              favorites: savedData?.favorites || [],
              compareList: savedData?.compareList || [],
              recentlyViewed: savedData?.recentlyViewed || [],
              leads: savedData?.leads || (isSeedAdmin && isFirstLogin ? seedLeads : []),
              agentNotes: savedData?.agentNotes || (isSeedAdmin && isFirstLogin
                ? "### Agent Scratchpad\n- Follow up with Ahmed Hassan on Marassi chalets\n- Review new Sodics June brochure\n- Call new leads from Facebook Ads"
                : "### Agent Scratchpad\n"),
              agentTasks: savedData?.agentTasks || (isSeedAdmin && isFirstLogin
                ? [
                    { id: "t1", text: "Call back Karim Nabil about Soul villa", completed: false },
                    { id: "t2", text: "Prepare compare sheet for Azha vs Seashore", completed: true },
                    { id: "t3", text: "Open WhatsApp Web and sync leads", completed: false }
                  ]
                : []),
              customShortcuts: savedData?.customShortcuts || [],
              customBrochures: savedData?.customBrochures || [],
              customProfiles: savedData?.customProfiles || [],
              salesTarget: savedData?.salesTarget ?? (isSeedAdmin && isFirstLogin ? 50 : 0),
            });
            markSessionActive();
            return true;
          }
          return false;
        },

        signUp: (email, name, password, tier) => {
          const exists = get().usersDatabase.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (exists) return false;
          const newUser: RegisteredUser = { email, name, password, tier: tier || "Starter" };
          originalSet((s) => ({
            usersDatabase: [...s.usersDatabase, newUser]
          }));
          // Auto sign-in after signup — the new user gets a clean blank slate
          const success = get().signIn(email, password);
          return success;
        },

        signOut: () => {
          const currentUser = get().user;
          if (currentUser) {
            const currentEmail = currentUser.email.toLowerCase();
            originalSet((state: any) => ({
              userData: {
                ...(state.userData || {}),
                [currentEmail]: {
                  favorites: state.favorites,
                  compareList: state.compareList,
                  leads: state.leads,
                  recentlyViewed: state.recentlyViewed,
                  agentNotes: state.agentNotes,
                  agentTasks: state.agentTasks,
                  customShortcuts: state.customShortcuts,
                  customBrochures: state.customBrochures,
                  customProfiles: state.customProfiles,
                  salesTarget: state.salesTarget,
                }
              }
            }));
          }
          originalSet({
            user: null,
            favorites: [],
            compareList: [],
            leads: [],
            recentlyViewed: [],
            agentNotes: "### Agent Scratchpad\n",
            agentTasks: [],
            customShortcuts: [],
            customBrochures: [],
            customProfiles: [],
            salesTarget: 0,
          });
          clearSession();
        },

        toggleFavorite: (slug) => {
          set((s) => {
            const favorites = s.favorites.includes(slug)
              ? s.favorites.filter((x) => x !== slug)
              : [...s.favorites, slug];
            return { favorites };
          });
        },

        toggleCompare: (slug) => {
          set((s) => {
            const compareList = s.compareList.includes(slug)
              ? s.compareList.filter((x) => x !== slug)
              : [...s.compareList, slug];
            return { compareList };
          });
        },

        addRecent: (slug) => {
          set((s) => {
            const filtered = s.recentlyViewed.filter((x) => x !== slug);
            return { recentlyViewed: [slug, ...filtered].slice(0, 6) };
          });
        },

        addLead: (lead) => {
          set((s) => {
            const newLead: Lead = {
              ...lead,
              id: "l_" + Math.random().toString(36).slice(2, 9),
              createdAt: Date.now(),
              assignedUnits: [],
              lastContacted: Date.now(),
              priority: "medium",
              activityLog: [
                { id: Math.random().toString(36).slice(2, 9), type: "system", text: "Lead captured / entered manually", timestamp: Date.now() }
              ]
            };
            return { leads: [newLead, ...s.leads] };
          });
        },

        updateLeadStage: (id, stage) => {
          set((s) => ({
            leads: s.leads.map((l) => {
              if (l.id === id) {
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "stage",
                  text: `Stage updated to ${stage.toUpperCase()}`,
                  timestamp: Date.now()
                };
                return { ...l, stage, activityLog: [logItem, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        deleteLead: (id) => {
          set((s) => ({
            leads: s.leads.filter((l) => l.id !== id)
          }));
        },

        updateNotes: (agentNotes) => {
          set({ agentNotes });
        },

        setSalesTarget: (salesTarget) => {
          set({ salesTarget });
        },

        addTask: (text) => {
          set((s) => ({
            agentTasks: [...s.agentTasks, { id: "task_" + Math.random().toString(36).slice(2, 9), text, completed: false }]
          }));
        },

        toggleTask: (id) => {
          set((s) => ({
            agentTasks: s.agentTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
          }));
        },

        deleteTask: (id) => {
          set((s) => ({
            agentTasks: s.agentTasks.filter((t) => t.id !== id)
          }));
        },

        addCustomShortcut: (label, url) => {
          set((s) => ({
            customShortcuts: [...s.customShortcuts, { id: "sc_" + Math.random().toString(36).slice(2, 9), label, url }]
          }));
        },

        deleteCustomShortcut: (id) => {
          set((s) => ({
            customShortcuts: s.customShortcuts.filter((x) => x.id !== id)
          }));
        },

        assignUnitToLead: (leadId, unitStr) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === leadId) {
                const units = l.assignedUnits.includes(unitStr) ? l.assignedUnits : [...l.assignedUnits, unitStr];
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "system",
                  text: `Assigned unit: ${unitStr}`,
                  timestamp: Date.now()
                };
                return { ...l, assignedUnits: units, activityLog: [logItem, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        removeUnitFromLead: (leadId, unitStr) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === leadId) {
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "system",
                  text: `Removed unit assignment: ${unitStr}`,
                  timestamp: Date.now()
                };
                return {
                  ...l,
                  assignedUnits: l.assignedUnits.filter(x => x !== unitStr),
                  activityLog: [logItem, ...l.activityLog]
                };
              }
              return l;
            })
          }));
        },

        updateLeadPriority: (id, priority) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === id) {
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "system",
                  text: `Priority updated to ${priority.toUpperCase()}`,
                  timestamp: Date.now()
                };
                return { ...l, priority, activityLog: [logItem, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        updateLeadNotesAndBudget: (id, notes, budget) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === id) {
                const logs: ActivityLogItem[] = [];
                if (l.budget !== budget) {
                  logs.push({
                    id: Math.random().toString(36).slice(2, 9),
                    type: "system",
                    text: `Budget updated from EGP ${l.budget}M to EGP ${budget}M`,
                    timestamp: Date.now()
                  });
                }
                if (notes && l.notes !== notes) {
                  logs.push({
                    id: Math.random().toString(36).slice(2, 9),
                    type: "note",
                    text: `Client notes updated: "${notes}"`,
                    timestamp: Date.now()
                  });
                }
                return { ...l, notes, budget, activityLog: [...logs, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        updateLeadContacted: (id) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === id) {
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "whatsapp",
                  text: "Opened WhatsApp chat thread",
                  timestamp: Date.now()
                };
                return { ...l, lastContacted: Date.now(), activityLog: [logItem, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        addLeadActivity: (leadId, type, text) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === leadId) {
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type,
                  text,
                  timestamp: Date.now()
                };
                return { ...l, activityLog: [logItem, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        updateLeadDetails: (id, updates) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === id) {
                const logs: ActivityLogItem[] = [];
                for (const [key, value] of Object.entries(updates)) {
                  const oldVal = (l as any)[key];
                  if (oldVal !== value) {
                    logs.push({
                      id: Math.random().toString(36).slice(2, 9),
                      type: "system",
                      text: `Field "${key}" updated from "${oldVal}" to "${value}"`,
                      timestamp: Date.now()
                    });
                  }
                }
                return { 
                  ...l, 
                  ...updates, 
                  activityLog: [...logs, ...l.activityLog] 
                };
              }
              return l;
            })
          }));
        },

        addCustomBrochure: (brochure) => {
          set((s) => ({
            customBrochures: [...(s.customBrochures || []), brochure]
          }));
        },

        addCustomProfile: (profile) => {
          set((s) => ({
            customProfiles: [...(s.customProfiles || []), profile]
          }));
        },

        // Platform Super-Admin CRUD Actions
        addProject: (p) => {
          const devName = normalizeDeveloperName(p.developer);
          const normalizedProj = {
            ...p,
            developer: devName,
            developerSlug: devName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          };
          set((s) => {
            const compoundsList = [...s.compoundsList, normalizedProj];
            return { compoundsList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Project", action: `Added new project: ${p.name}` });
        },

        updateProject: (slug, updates) => {
          if (updates.developer) {
            const devName = normalizeDeveloperName(updates.developer);
            updates.developer = devName;
            updates.developerSlug = devName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          }
          set((s) => {
            const before = JSON.stringify(s.compoundsList.find(c => c.slug === slug));
            const compoundsList = s.compoundsList.map(c => c.slug === slug ? { ...c, ...updates } : c);
            const after = JSON.stringify(compoundsList.find(c => c.slug === slug));
            get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Project", action: `Updated project: ${slug}`, before, after });
            return { compoundsList };
          });
        },

        deleteProject: (slug) => {
          set((s) => {
            const compoundsList = s.compoundsList.filter(c => c.slug !== slug);
            const newLaunchesList = s.newLaunchesList.filter(x => x !== slug);
            return { compoundsList, newLaunchesList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Project", action: `Deleted project: ${slug}` });
        },

        addDestination: (d) => {
          set((s) => {
            const destinationsList = [...s.destinationsList, d];
            return { destinationsList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Destination", action: `Added new destination: ${d.name}` });
        },

        updateDestination: (slug, updates) => {
          set((s) => {
            const before = JSON.stringify(s.destinationsList.find(d => d.slug === slug));
            const destinationsList = s.destinationsList.map(d => d.slug === slug ? { ...d, ...updates } : d);
            const after = JSON.stringify(destinationsList.find(d => d.slug === slug));
            get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Destination", action: `Updated destination: ${slug}`, before, after });
            return { destinationsList };
          });
        },

        deleteDestination: (slug) => {
          set((s) => {
            const destinationsList = s.destinationsList.filter(d => d.slug !== slug);
            return { destinationsList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Destination", action: `Deleted destination: ${slug}` });
        },

        addDeveloper: (dev) => {
          const devName = normalizeDeveloperName(dev.name);
          const normalizedDev = {
            ...dev,
            name: devName,
            slug: devName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
          };
          set((s) => {
            const developersList = [...s.developersList, normalizedDev];
            return { developersList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Developer", action: `Added new developer: ${devName}` });
        },

        updateDeveloper: (slug, updates) => {
          if (updates.name) {
            const devName = normalizeDeveloperName(updates.name);
            updates.name = devName;
            updates.slug = devName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          }
          set((s) => {
            const before = JSON.stringify(s.developersList.find(d => d.slug === slug));
            const developersList = s.developersList.map(d => d.slug === slug ? { ...d, ...updates } : d);
            const after = JSON.stringify(developersList.find(d => d.slug === slug));
            get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Developer", action: `Updated developer: ${slug}`, before, after });
            return { developersList };
          });
        },

        deleteDeveloper: (slug) => {
          set((s) => {
            const developersList = s.developersList.filter(d => d.slug !== slug);
            return { developersList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Developer", action: `Deleted developer: ${slug}` });
        },

        updateAvailability: (slug, data) => {
          set((s) => {
            const exists = s.availabilityList.some(a => a.slug === slug);
            const availabilityList = exists
              ? s.availabilityList.map(a => a.slug === slug ? data : a)
              : [...s.availabilityList, data];
            return { availabilityList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Availability", action: `Updated availability inventory for project: ${slug}` });
        },

        bulkUpdateAvailability: (data) => {
          set({ availabilityList: data });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Availability", action: `Bulk imported global availability database` });
        },

        addNewLaunchSlug: (slug) => {
          set((s) => {
            const newLaunchesList = s.newLaunchesList.includes(slug) ? s.newLaunchesList : [...s.newLaunchesList, slug];
            return { newLaunchesList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Launches", action: `Promoted project to New Launches: ${slug}` });
        },

        removeNewLaunchSlug: (slug) => {
          set((s) => {
            const newLaunchesList = s.newLaunchesList.filter(x => x !== slug);
            return { newLaunchesList };
          });
          get().addAuditLog({ actor: "elsayedshoeip70@gmail.com", entity: "Launches", action: `Removed project from New Launches: ${slug}` });
        },

        addAuditLog: (log) => {
          set((s) => {
            const newItem = {
              ...log,
              id: "audit_" + Math.random().toString(36).slice(2, 9),
              timestamp: Date.now()
            };
            return { auditLogs: [newItem, ...s.auditLogs].slice(0, 150) };
          });
        }
      };
    },
    {
      name: "proptrack-broker",
      onRehydrateStorage: () => (state) => {
        // If the browser session was closed (sessionStorage cleared), wipe the user
        // field from the rehydrated state so the user must log in again.
        // But keep userData intact so their data is available on next sign-in.
        if (state && state.user && !isSessionActive()) {
          state.user = null;
          state.favorites = [];
          state.compareList = [];
          state.leads = [];
          state.recentlyViewed = [];
          state.agentNotes = "### Agent Scratchpad\n";
          state.agentTasks = [];
          state.customShortcuts = [];
          state.customBrochures = [];
          state.customProfiles = [];
          state.salesTarget = 0;
        }
      },
    },
  ),
);
