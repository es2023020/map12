-- ==============================================================================
-- PROPERTY ATLAS — SUPABASE PRODUCTION DATABASE SCHEMA
-- Migration: 20261124000000_property_atlas_schema.sql
-- ==============================================================================

-- 1. PROFILES & ROLES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'broker', 'developer', 'client')) DEFAULT 'broker',
  full_name TEXT,
  developer_slug TEXT,
  agency_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_developer_slug ON public.profiles(developer_slug);

-- 2. LEADS & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY DEFAULT ('lead-' || substr(md5(random()::text), 1, 12)),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  project_slug TEXT,
  project_name TEXT,
  developer_slug TEXT,
  destination TEXT,
  budget TEXT,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'archived')) DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_developer_slug ON public.leads(developer_slug);
CREATE INDEX IF NOT EXISTS idx_leads_project_slug ON public.leads(project_slug);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- 3. DEVELOPER ACCOUNTS & PORTAL REGISTRY
CREATE TABLE IF NOT EXISTS public.developer_accounts (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  phone TEXT,
  access_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'invited', 'pending')) DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_developer_accounts_status ON public.developer_accounts(status);

-- 4. DEVELOPER ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.developer_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_slug TEXT NOT NULL REFERENCES public.developer_accounts(slug) ON DELETE CASCADE,
  developer_name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('launch', 'pricing', 'policy', 'phase')) DEFAULT 'launch',
  project_slug TEXT,
  project_name TEXT,
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_developer ON public.developer_announcements(developer_slug);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.developer_announcements(created_at DESC);

-- 5. COMPOUNDS OVERRIDES & ADMIN EDITS
CREATE TABLE IF NOT EXISTS public.compounds_overrides (
  slug TEXT PRIMARY KEY,
  price_from NUMERIC(10, 2),
  payment_plan TEXT,
  status TEXT CHECK (status IN ('RTM', 'Off-Plan', 'On-Hold')),
  brochure_url TEXT,
  master_plan_url TEXT,
  updated_by TEXT NOT NULL DEFAULT 'admin',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compounds_overrides ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read/write all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Leads: Public / anon can insert inquiries; authenticated advisors & developers read assigned leads
CREATE POLICY "Public can insert lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Advisors and Developers can view assigned leads" ON public.leads
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'admin'
        OR profiles.role = 'broker'
        OR (profiles.role = 'developer' AND profiles.developer_slug = leads.developer_slug)
      )
    )
  );

CREATE POLICY "Advisors and Developers can update assigned leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'admin'
        OR profiles.role = 'broker'
        OR (profiles.role = 'developer' AND profiles.developer_slug = leads.developer_slug)
      )
    )
  )
  WITH CHECK (true);

-- Developer accounts: Public can view active developer details
CREATE POLICY "Public can view active developer accounts" ON public.developer_accounts
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Developers can update their own account" ON public.developer_accounts
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR (profiles.role = 'developer' AND profiles.developer_slug = developer_accounts.slug))
    )
  );

-- Developer announcements: Public can view announcements, developers can post their own
CREATE POLICY "Public can view announcements" ON public.developer_announcements
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Developers and Admins can create announcements" ON public.developer_announcements
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR (profiles.role = 'developer' AND profiles.developer_slug = developer_announcements.developer_slug))
    )
  );

-- Compound overrides: Public can read, authenticated developers & admins can edit
CREATE POLICY "Public can view compound overrides" ON public.compounds_overrides
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins and Developers can edit compound overrides" ON public.compounds_overrides
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'admin' OR profiles.role = 'developer')
    )
  );
