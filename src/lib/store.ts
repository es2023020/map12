import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  agentNotes: string;
  agentTasks: AgentTask[];
  customShortcuts: CustomShortcut[];
  customBrochures: Array<{ name: string; type: string; category: string; file: string; path: string; size_mb?: number }>;
  customProfiles: Array<{ clean_name: string; filename: string; path: string; size_mb: number }>;
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
  { email: "admin@proptrack.com", name: "PropTrack Admin", password: "Team1", tier: "Agency" }
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
                agentNotes: merged.agentNotes,
                agentTasks: merged.agentTasks,
                customShortcuts: merged.customShortcuts,
                customBrochures: merged.customBrochures,
                customProfiles: merged.customProfiles,
              }
            };
          }
          return merged;
        });
      };

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
                    agentNotes: state.agentNotes,
                    agentTasks: state.agentTasks,
                    customShortcuts: state.customShortcuts,
                    customBrochures: state.customBrochures,
                    customProfiles: state.customProfiles,
                  }
                }
              }));
            }

            // Load target user data
            const savedData = get().userData?.[email.toLowerCase()];

            originalSet({
              user: { email: user.email, name: user.name, tier: user.tier, avatar: user.avatar },
              favorites: savedData?.favorites || [],
              compareList: savedData?.compareList || [],
              leads: savedData?.leads || seedLeads,
              agentNotes: savedData?.agentNotes || "### Agent Scratchpad\n- Follow up with Ahmed Hassan on Marassi chalets\n- Review new Sodics June brochure\n- Call new leads from Facebook Ads",
              agentTasks: savedData?.agentTasks || [
                { id: "t1", text: "Call back Karim Nabil about Soul villa", completed: false },
                { id: "t2", text: "Prepare compare sheet for Azha vs Seashore", completed: true },
                { id: "t3", text: "Open WhatsApp Web and sync leads", completed: false }
              ],
              customShortcuts: savedData?.customShortcuts || [
                { id: "s1", label: "Developer Portals", url: "https://www.nawy.com/developers" }
              ],
              customBrochures: savedData?.customBrochures || [],
              customProfiles: savedData?.customProfiles || []
            });
            markSessionActive();
            return true;
          }
          return false;
        },

        signUp: (email, name, password, tier) => {
          const exists = get().usersDatabase.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (exists) return false;
          
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
                  agentNotes: state.agentNotes,
                  agentTasks: state.agentTasks,
                  customShortcuts: state.customShortcuts,
                  customBrochures: state.customBrochures,
                  customProfiles: state.customProfiles,
                }
              }
            }));
          }

          const newUser: RegisteredUser = { email, name, password, tier: tier || "Pro", avatar: "" };
          
          originalSet((state: any) => {
            const nextUserData = {
              ...(state.userData || {}),
              [email.toLowerCase()]: {
                favorites: [],
                compareList: [],
                leads: seedLeads,
                agentNotes: "### Agent Scratchpad\n- Follow up with Ahmed Hassan on Marassi chalets\n- Review new Sodics June brochure\n- Call new leads from Facebook Ads",
                agentTasks: [
                  { id: "t1", text: "Call back Karim Nabil about Soul villa", completed: false },
                  { id: "t2", text: "Prepare compare sheet for Azha vs Seashore", completed: true },
                  { id: "t3", text: "Open WhatsApp Web and sync leads", completed: false }
                ],
                customShortcuts: [
                  { id: "s1", label: "Developer Portals", url: "https://www.nawy.com/developers" }
                ],
                customBrochures: [],
                customProfiles: []
              }
            };
            return {
              usersDatabase: [...state.usersDatabase, newUser],
              user: { email: newUser.email, name: newUser.name, tier: newUser.tier, avatar: "" },
              favorites: [],
              compareList: [],
              leads: seedLeads,
              agentNotes: "### Agent Scratchpad\n- Follow up with Ahmed Hassan on Marassi chalets\n- Review new Sodics June brochure\n- Call new leads from Facebook Ads",
              agentTasks: [
                { id: "t1", text: "Call back Karim Nabil about Soul villa", completed: false },
                { id: "t2", text: "Prepare compare sheet for Azha vs Seashore", completed: true },
                { id: "t3", text: "Open WhatsApp Web and sync leads", completed: false }
              ],
              customShortcuts: [
                { id: "s1", label: "Developer Portals", url: "https://www.nawy.com/developers" }
              ],
              customBrochures: [],
              customProfiles: [],
              userData: nextUserData
            };
          });
          markSessionActive();
          return true;
        },

        signOut: () => {
          const currentUser = get().user;
          if (currentUser) {
            const email = currentUser.email.toLowerCase();
            originalSet((state: any) => ({
              userData: {
                ...(state.userData || {}),
                [email]: {
                  favorites: state.favorites,
                  compareList: state.compareList,
                  leads: state.leads,
                  agentNotes: state.agentNotes,
                  agentTasks: state.agentTasks,
                  customShortcuts: state.customShortcuts,
                  customBrochures: state.customBrochures,
                  customProfiles: state.customProfiles,
                }
              }
            }));
          }
          originalSet({
            user: null,
            favorites: [],
            compareList: [],
            leads: [],
            agentNotes: "### Agent Scratchpad\n",
            agentTasks: [],
            customShortcuts: [],
            customBrochures: [],
            customProfiles: []
          });
          clearSession();
        },

        toggleFavorite: (slug) =>
          set((s) => ({
            favorites: s.favorites.includes(slug)
              ? s.favorites.filter((x) => x !== slug)
              : [...s.favorites, slug],
          })),

        toggleCompare: (slug) =>
          set((s) => ({
            compareList: s.compareList.includes(slug)
              ? s.compareList.filter((x) => x !== slug)
              : s.compareList.length >= 4
              ? s.compareList
              : [...s.compareList, slug],
          })),

        addRecent: (slug) =>
          set((s) => ({
            recentlyViewed: [slug, ...s.recentlyViewed.filter((x) => x !== slug)].slice(0, 10),
          })),

        addLead: (lead) =>
          set((s) => ({
            leads: [
              { 
                ...lead, 
                id: Math.random().toString(36).slice(2, 9), 
                createdAt: Date.now(),
                assignedUnits: [],
                lastContacted: Date.now(),
                priority: "medium",
                activityLog: [
                  { id: Math.random().toString(36).slice(2, 9), type: "system", text: "Client profile created", timestamp: Date.now() }
                ]
              },
              ...s.leads,
            ],
          })),

        updateLeadStage: (id, stage) => {
          const lead = get().leads.find(l => l.id === id);
          const oldStage = lead ? lead.stage : "unknown";
          set((s) => ({
            leads: s.leads.map((l) => {
              if (l.id === id) {
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "stage",
                  text: `Pipeline stage shifted from ${oldStage.toUpperCase()} to ${stage.toUpperCase()}`,
                  timestamp: Date.now()
                };
                return { ...l, stage, activityLog: [logItem, ...l.activityLog] };
              }
              return l;
            })
          }));
        },

        deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
        
        updateNotes: (agentNotes) => set({ agentNotes }),
        
        setSalesTarget: (salesTarget) => set({ salesTarget }),
        
        addTask: (text) =>
          set((s) => ({
            agentTasks: [
              ...s.agentTasks,
              { id: Math.random().toString(36).slice(2, 9), text, completed: false },
            ],
          })),

        toggleTask: (id) =>
          set((s) => ({
            agentTasks: s.agentTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
          })),

        deleteTask: (id) =>
          set((s) => ({
            agentTasks: s.agentTasks.filter((t) => t.id !== id),
          })),

        addCustomShortcut: (label, url) => {
          const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;
          set((s) => ({
            customShortcuts: [
              ...(s.customShortcuts || []),
              { id: Math.random().toString(36).slice(2, 9), label, url: fullUrl }
            ]
          }));
        },

        deleteCustomShortcut: (id) => {
          set((s) => ({
            customShortcuts: (s.customShortcuts || []).filter(x => x.id !== id)
          }));
        },

        assignUnitToLead: (leadId, unitStr) => {
          set((s) => ({
            leads: s.leads.map(l => {
              if (l.id === leadId) {
                const alreadyAssigned = l.assignedUnits.includes(unitStr);
                if (alreadyAssigned) return l;
                
                const logItem: ActivityLogItem = {
                  id: Math.random().toString(36).slice(2, 9),
                  type: "system",
                  text: `Linked compound unit: ${unitStr}`,
                  timestamp: Date.now()
                };
                return {
                  ...l,
                  assignedUnits: [...l.assignedUnits, unitStr],
                  activityLog: [logItem, ...l.activityLog]
                };
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
                  text: `Removed linked unit: ${unitStr}`,
                  timestamp: Date.now()
                };
                return {
                  ...l,
                  assignedUnits: l.assignedUnits.filter(u => u !== unitStr),
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
                  text: `Priority flag set to ${priority.toUpperCase()}`,
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
                    text: `Target budget revised from EGP ${l.budget}M to EGP ${budget}M`,
                    timestamp: Date.now()
                  });
                }
                if (l.notes !== notes) {
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
        }
      };
    },
    {
      name: "proptrack-broker",
      onRehydrateStorage: () => (state) => {
        // If the browser session was closed (sessionStorage cleared), wipe the user
        // field from the rehydrated state so the user must log in again.
        if (state && state.user && !isSessionActive()) {
          state.user = null;
          state.favorites = [];
          state.compareList = [];
          state.leads = [];
          state.agentNotes = "### Agent Scratchpad\n";
          state.agentTasks = [];
          state.customShortcuts = [];
          state.customBrochures = [];
          state.customProfiles = [];
        }
      },
    },
  ),
);
