import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type UserRole = "admin" | "broker" | "developer" | "client";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  developerSlug?: string;
  agencyName?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectSlug?: string;
  projectName?: string;
  developerSlug?: string;
  destination?: string;
  budget?: string;
  notes?: string;
  status: "new" | "contacted" | "qualified" | "closed" | "archived";
  createdAt: string;
}

export interface DeveloperAccount {
  slug: string;
  name: string;
  email: string;
  logo?: string;
  website?: string;
  phone?: string;
  accessCode: string;
  status: "active" | "invited" | "pending";
  createdAt: string;
}

export interface DeveloperAnnouncement {
  id: string;
  developerSlug: string;
  developerName: string;
  title: string;
  content: string;
  category: "launch" | "pricing" | "policy" | "phase";
  projectSlug?: string;
  projectName?: string;
  badge?: string;
  createdAt: string;
}

export interface CompoundOverride {
  slug: string;
  priceFrom?: number;
  paymentPlan?: string;
  status?: "RTM" | "Off-Plan" | "On-Hold";
  brochureUrl?: string;
  masterPlanUrl?: string;
  updatedBy: string;
  updatedAt: string;
}

// Environment variables for client & server
const supabaseUrl =
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.SUPABASE_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  "";

const supabaseAnonKey =
  (typeof process !== "undefined" && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.SUPABASE_ANON_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let _supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
      },
    });
  }
  return _supabaseClient;
}

export const supabase = getSupabaseClient();
