-- ================================================
-- SampleFactory Storage Buckets
-- Run this in the Supabase SQL Editor
-- ================================================

-- 1. Product images (public)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true);

-- 2. Audio demos (public)
insert into storage.buckets (id, name, public)
values ('audio-demos', 'audio-demos', true);

-- 3. Digital products - the actual downloadable files (PRIVATE)
insert into storage.buckets (id, name, public)
values ('digital-products', 'digital-products', false);

-- ================================================
-- Storage Policies
-- ================================================

-- PRODUCT IMAGES: Anyone can view, admins can upload/delete
create policy "Public read access for product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- AUDIO DEMOS: Anyone can listen, admins can upload/delete
create policy "Public read access for audio demos"
  on storage.objects for select
  using (bucket_id = 'audio-demos');

create policy "Admins can upload audio demos"
  on storage.objects for insert
  with check (
    bucket_id = 'audio-demos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update audio demos"
  on storage.objects for update
  using (
    bucket_id = 'audio-demos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete audio demos"
  on storage.objects for delete
  using (
    bucket_id = 'audio-demos'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- DIGITAL PRODUCTS: Only admins can manage, authenticated users with purchases can download (via signed URLs)
create policy "Admins can upload digital products"
  on storage.objects for insert
  with check (
    bucket_id = 'digital-products'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can read digital products"
  on storage.objects for select
  using (
    bucket_id = 'digital-products'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update digital products"
  on storage.objects for update
  using (
    bucket_id = 'digital-products'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete digital products"
  on storage.objects for delete
  using (
    bucket_id = 'digital-products'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
