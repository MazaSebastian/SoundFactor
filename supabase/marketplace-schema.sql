-- ================================================
-- Marketplace — Artist Profiles & Applications
-- Run this in the Supabase SQL Editor
-- ================================================

-- ------------------------------------------------
-- 1. Extend profiles role to include 'artist'
-- ------------------------------------------------
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'customer', 'artist'));

-- ------------------------------------------------
-- 2. ARTIST PROFILES (public-facing artist data)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artist_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  artist_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio text,
  genre text,
  avatar_url text,
  cover_image_url text,
  instagram_url text,
  spotify_url text,
  soundcloud_url text,
  youtube_url text,
  website_url text,
  is_featured boolean NOT NULL DEFAULT false,
  total_sales integer NOT NULL DEFAULT 0,
  total_followers integer NOT NULL DEFAULT 0,
  rating_avg numeric(3,2) DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_artist_profiles_user ON public.artist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_slug ON public.artist_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_genre ON public.artist_profiles(genre);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_featured ON public.artist_profiles(is_featured) WHERE is_featured = true;

-- RLS
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read artist profiles
CREATE POLICY "Artist profiles are publicly readable"
  ON public.artist_profiles FOR SELECT
  USING (true);

-- Artists can update their own profile
CREATE POLICY "Artists can update own profile"
  ON public.artist_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can insert/update/delete
CREATE POLICY "Admins can manage artist profiles"
  ON public.artist_profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ------------------------------------------------
-- 3. ARTIST APPLICATIONS (verification workflow)
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artist_applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  artist_name text NOT NULL,
  genre text NOT NULL,
  bio text NOT NULL,
  portfolio_urls text[] DEFAULT '{}',
  instagram_url text,
  spotify_url text,
  soundcloud_url text,
  motivation text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_user ON public.artist_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.artist_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created ON public.artist_applications(created_at DESC);

-- RLS
ALTER TABLE public.artist_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON public.artist_applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create applications (only customers)
CREATE POLICY "Customers can apply"
  ON public.artist_applications FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'customer')
  );

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON public.artist_applications FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications"
  ON public.artist_applications FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
