-- Galerie photos + bucket media pour upload depuis l'admin.
-- Prérequis : 001_site_content.sql (public.is_app_admin / set_updated_at).

create table if not exists public.site_gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text,
  album text not null default 'general',
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_gallery_photos_pub_idx
  on public.site_gallery_photos (published, album, sort_order);

alter table public.site_gallery_photos enable row level security;

drop policy if exists "site_gallery_public_read" on public.site_gallery_photos;
create policy "site_gallery_public_read"
  on public.site_gallery_photos for select
  to anon, authenticated
  using (published = true);

drop policy if exists "site_gallery_admin_all" on public.site_gallery_photos;
create policy "site_gallery_admin_all"
  on public.site_gallery_photos for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists tr_site_gallery_photos_updated on public.site_gallery_photos;
create trigger tr_site_gallery_photos_updated
  before update on public.site_gallery_photos
  for each row execute procedure public.set_updated_at();

-- Bucket public pour les médias du site (images personnel/blog/galerie).
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "site_media_public_read" on storage.objects;
create policy "site_media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "site_media_admin_insert" on storage.objects;
create policy "site_media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_app_admin());

drop policy if exists "site_media_admin_update" on storage.objects;
create policy "site_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_app_admin())
  with check (bucket_id = 'site-media' and public.is_app_admin());

drop policy if exists "site_media_admin_delete" on storage.objects;
create policy "site_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_app_admin());
