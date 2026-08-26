import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TrackableOffer {
  id: string;
  clientName: string;
  projectName: string;
  projectSlug: string;
  developerName: string;
  location?: string;
  unitType: string;
  areaSqm: number;
  totalPriceEgp: number;
  dpPct: number;
  durationYrs: number;
  deliveryNote: string;
  finishingStatus: string;
  maintenanceFee: string;
  otherFees: string;
  projectDescription: string;
  amenities: string[];
  photoPaths: string[];
  agentName: string;
  agentTitle: string;
  agentPhone: string;
  agentEmail: string;
  agencyName: string;
  createdAt: string;
  viewCount: number;
  lastViewedAt?: string;
}

interface OfferState {
  offers: Record<string, TrackableOffer>;
  createOffer: (data: Omit<TrackableOffer, "id" | "createdAt" | "viewCount">) => TrackableOffer;
  recordOfferView: (id: string) => void;
  getOffer: (id: string) => TrackableOffer | undefined;
}

export const useOfferStore = create<OfferState>()(
  persist(
    (set, get) => ({
      offers: {},

      createOffer: (data) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newOffer: TrackableOffer = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          viewCount: 0,
        };
        set((state) => ({
          offers: { ...state.offers, [id]: newOffer },
        }));
        return newOffer;
      },

      recordOfferView: (id) => {
        set((state) => {
          const offer = state.offers[id];
          if (!offer) return state;
          const updatedOffer: TrackableOffer = {
            ...offer,
            viewCount: offer.viewCount + 1,
            lastViewedAt: new Date().toISOString(),
          };
          return {
            offers: { ...state.offers, [id]: updatedOffer },
          };
        });
      },

      getOffer: (id) => {
        return get().offers[id];
      },
    }),
    {
      name: "property-atlas-offers-storage",
    }
  )
);
