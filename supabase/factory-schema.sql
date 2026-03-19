-- ================================================
-- Factory — Samples Schema
-- ================================================

-- Table for individual audio samples
create table if not exists public.samples (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique,
  bpm integer,
  musical_key text,
  genre text,
  instrument_type text,
  mood text,
  duration_ms integer,
  file_size integer,
  file_url text not null,
  preview_url text,
  waveform_data jsonb,
  credit_cost integer not null default 1,
  download_count integer not null default 0,
  tags text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Indexes for fast filtering on 10k+ rows
create index if not exists idx_samples_genre on public.samples(genre);
create index if not exists idx_samples_instrument on public.samples(instrument_type);
create index if not exists idx_samples_bpm on public.samples(bpm);
create index if not exists idx_samples_key on public.samples(musical_key);
create index if not exists idx_samples_mood on public.samples(mood);
create index if not exists idx_samples_active on public.samples(is_active);
create index if not exists idx_samples_created on public.samples(created_at desc);

-- RLS
alter table public.samples enable row level security;

-- Everyone can read active samples
create policy "Samples are publicly readable"
  on public.samples for select
  using (true);

-- Admin CRUD
create policy "Admins can insert samples"
  on public.samples for insert
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update samples"
  on public.samples for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete samples"
  on public.samples for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
