import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeadStage = "new" | "contacted" | "viewing" | "negotiating" | "closed";
export type Lead = {
  id: string;
  name: string;
  phone: string;
  budget: number; // EGP M
  interest: string; // compound slug or area
  notes?: string;
  stage: LeadStage;
  createdAt: number;
};

export type BrokerUser = { email: string; name: string; tier: "Starter" | "Pro" | "Agency" };

type State = {
  user: BrokerUser | null;
  favorites: string[]; // compound slugs
  compareList: string[];
  leads: Lead[];
  recentlyViewed: string[];
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  toggleFavorite: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  addRecent: (slug: string) => void;
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  deleteLead: (id: string) => void;
};

const seedLeads: Lead[] = [
  { id: "l1", name: "Ahmed Hassan", phone: "+20 100 111 2233", budget: 14, interest: "marassi", stage: "viewing", createdAt: Date.now() - 86400000 * 2, notes: "Looking for 3BR chalet, beachfront" },
  { id: "l2", name: "Salma Adel", phone: "+20 122 555 8899", budget: 8, interest: "fouka-bay", stage: "contacted", createdAt: Date.now() - 86400000 * 5 },
  { id: "l3", name: "Karim Nabil", phone: "+20 111 222 3344", budget: 22, interest: "soul", stage: "new", createdAt: Date.now() - 86400000 },
  { id: "l4", name: "Mona Sherif", phone: "+20 100 988 7766", budget: 18, interest: "mivida", stage: "negotiating", createdAt: Date.now() - 86400000 * 8 },
];

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      favorites: [],
      compareList: [],
      leads: seedLeads,
      recentlyViewed: [],
      signIn: (email, name) =>
        set({ user: { email, name: name || email.split("@")[0], tier: "Pro" } }),
      signOut: () => set({ user: null }),
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
            { ...lead, id: Math.random().toString(36).slice(2, 9), createdAt: Date.now() },
            ...s.leads,
          ],
        })),
      updateLeadStage: (id, stage) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, stage } : l)) })),
      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
    }),
    { name: "proptrack-broker" },
  ),
);