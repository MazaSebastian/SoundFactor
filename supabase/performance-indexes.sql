-- ================================================
-- Performance Indexes — Products & Orders
-- Run this in Supabase SQL Editor
-- ================================================

-- PRODUCTS indexes
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active_created ON public.products(is_active, created_at DESC);

-- ORDERS indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- ORDER_ITEMS indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- PROFILES index for role checks (RLS + middleware)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role) WHERE role = 'admin';

-- ================================================
-- is_admin() helper function for RLS policies
-- Cached per transaction, avoids repeated subqueries
-- ================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ================================================
-- Optimized getSampleFilterOptions — single RPC
-- Returns all distinct filter values in one call
-- ================================================
CREATE OR REPLACE FUNCTION public.get_sample_filter_options()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT json_build_object(
    'genres', (
      SELECT COALESCE(json_agg(DISTINCT genre ORDER BY genre), '[]'::json)
      FROM public.samples WHERE is_active = true AND genre IS NOT NULL
    ),
    'instruments', (
      SELECT COALESCE(json_agg(DISTINCT instrument_type ORDER BY instrument_type), '[]'::json)
      FROM public.samples WHERE is_active = true AND instrument_type IS NOT NULL
    ),
    'keys', (
      SELECT COALESCE(json_agg(DISTINCT musical_key ORDER BY musical_key), '[]'::json)
      FROM public.samples WHERE is_active = true AND musical_key IS NOT NULL
    ),
    'moods', (
      SELECT COALESCE(json_agg(DISTINCT mood ORDER BY mood), '[]'::json)
      FROM public.samples WHERE is_active = true AND mood IS NOT NULL
    )
  );
$$;
