-- Candidatures externes pour fiches équipe / cartes de service (approbation admin).
-- Prérequis : 001_site_content.sql (is_app_admin), 003_site_personnel.sql, 007_site_media.

create table if not exists public.site_personnel_applications (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  last_name text not null,
  post_name text,
  first_name text not null,
  sex text,
  birth_place text,
  birth_date date,
  role text not null,
  department text,
  address text,
  email text not null,
  phone text,
  photo_url text,
  notes text,
  personnel_id uuid references public.site_personnel (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint site_personnel_app_last_name_len check (char_length(trim(last_name)) between 1 and 120),
  constraint site_personnel_app_first_name_len check (char_length(trim(first_name)) between 1 and 120),
  constraint site_personnel_app_post_name_len check (post_name is null or char_length(trim(post_name)) between 1 and 120),
  constraint site_personnel_app_role_len check (char_length(trim(role)) between 2 and 200),
  constraint site_personnel_app_email_len check (char_length(trim(email)) between 3 and 254),
  constraint site_personnel_app_phone_len check (phone is null or char_length(phone) <= 60),
  constraint site_personnel_app_dept_len check (department is null or char_length(trim(department)) <= 200),
  constraint site_personnel_app_address_len check (address is null or char_length(trim(address)) <= 400),
  constraint site_personnel_app_birth_place_len check (birth_place is null or char_length(trim(birth_place)) <= 200),
  constraint site_personnel_app_sex_len check (sex is null or char_length(trim(sex)) <= 40),
  constraint site_personnel_app_photo_url_len check (photo_url is null or char_length(trim(photo_url)) between 8 and 2000),
  constraint site_personnel_app_notes_len check (notes is null or char_length(trim(notes)) <= 2000)
);

create index if not exists site_personnel_applications_created_idx
  on public.site_personnel_applications (created_at desc);

create index if not exists site_personnel_applications_status_idx
  on public.site_personnel_applications (status, created_at desc);

alter table public.site_personnel_applications enable row level security;

drop policy if exists "site_personnel_applications_public_insert" on public.site_personnel_applications;
create policy "site_personnel_applications_public_insert"
  on public.site_personnel_applications for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and char_length(trim(last_name)) between 1 and 120
    and char_length(trim(first_name)) between 1 and 120
    and char_length(trim(role)) between 2 and 200
    and char_length(trim(email)) between 3 and 254
    and (phone is null or char_length(phone) <= 60)
    and (post_name is null or char_length(trim(post_name)) between 1 and 120)
    and (department is null or char_length(trim(department)) <= 200)
    and (address is null or char_length(trim(address)) <= 400)
    and (notes is null or char_length(trim(notes)) <= 2000)
    and (photo_url is null or char_length(trim(photo_url)) between 8 and 2000)
  );

drop policy if exists "site_personnel_applications_admin_select" on public.site_personnel_applications;
create policy "site_personnel_applications_admin_select"
  on public.site_personnel_applications for select
  to authenticated
  using (public.is_app_admin());

drop policy if exists "site_personnel_applications_admin_update" on public.site_personnel_applications;
create policy "site_personnel_applications_admin_update"
  on public.site_personnel_applications for update
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop policy if exists "site_personnel_applications_admin_delete" on public.site_personnel_applications;
create policy "site_personnel_applications_admin_delete"
  on public.site_personnel_applications for delete
  to authenticated
  using (public.is_app_admin());

grant insert on public.site_personnel_applications to anon, authenticated;
grant select, update, delete on public.site_personnel_applications to authenticated;

-- Upload photo candidature (dossier applications/ uniquement).
drop policy if exists "site_media_anon_insert_applications" on storage.objects;
create policy "site_media_anon_insert_applications"
  on storage.objects for insert
  to anon, authenticated
  with check (
    bucket_id = 'site-media'
    and (storage.foldername(name))[1] = 'applications'
  );
