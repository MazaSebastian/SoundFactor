-- ================================================
-- SampleFactory Database Schema
-- ================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- ------------------------------------------------
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on user signup
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  color text default '#00FFB2',
  icon text default 'Music',
  product_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Everyone can read categories
create policy "Categories are publicly readable"
  on public.categories for select
  using (true);

-- Only admins can modify categories
create policy "Admins can insert categories"
  on public.categories for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update categories"
  on public.categories for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete categories"
  on public.categories for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------
-- 3. PRODUCTS
-- ------------------------------------------------
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null default 0,
  original_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  feature_image_url text,
  audio_demo_url text,
  file_url text,
  bpm integer,
  key text,
  tags text[] default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Everyone can read active products
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- Only admins CRUD
create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------
-- 4. ORDERS
-- ------------------------------------------------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  total_amount numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled', 'refunded')),
  payment_intent_id text,
  customer_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Users can see their own orders
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Admins can see all orders
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Admins can update orders
create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------
-- 5. ORDER ITEMS
-- ------------------------------------------------
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_title text not null,
  price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

-- Users can see their own order items (via order relationship)
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

-- Admins can see all order items
create policy "Admins can view all order items"
  on public.order_items for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------
-- SEED DATA: Categories
-- ------------------------------------------------
insert into public.categories (name, slug, color, icon) values
  ('Sample Packs', 'sample-packs', '#00FFB2', 'Music'),
  ('Proyectos FL', 'proyectos-fl', '#5227FF', 'Layers'),
  ('Presets', 'presets', '#FF9FFC', 'Sliders'),
  ('Drum Kits', 'drum-kits', '#ff6b35', 'Drum'),
  ('MIDI Packs', 'midi-packs', '#00d4ff', 'Piano');
