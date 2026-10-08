-- Images privées jointes aux demandes de partenariat.
-- Prérequis : 006_site_partnership_messages.sql et 007_site_gallery_and_media_bucket.sql.

alter table public.site_partnership_messages
  add column if not exists attachment_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'partnership-uploads',
  'partnership-uploads',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "partnership_upload_public_insert" on storage.objects;
create policy "partnership_upload_public_insert"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'partnership-uploads'
    and (storage.foldername(name))[1] = 'requests'
  );

drop policy if exists "partnership_upload_admin_read" on storage.objects;
create policy "partnership_upload_admin_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'partnership-uploads'
    and public.is_app_admin()
  );

drop policy if exists "partnership_upload_admin_delete" on storage.objects;
create policy "partnership_upload_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'partnership-uploads'
    and public.is_app_admin()
  );
