-- GEACO site: contenu éditable (projets, partenaires, pages services)
-- Exécuter dans le SQL Editor Supabase ou via CLI après création du projet.

-- Admins applicatifs (lier les UUID après inscription Auth : insert into public.app_admins (user_id) values ('<uuid>');)
create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;

create policy "app_admins_select_own"
  on public.app_admins for select
  to authenticated
  using (user_id = auth.uid());

-- Aucune policy insert/update côté client : ajouter les admins via SQL (service role) ou dashboard.

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.app_admins a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_app_admin() from public;
grant execute on function public.is_app_admin() to anon, authenticated;

-- Projets publiés sur /projets
create table if not exists public.site_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tag text not null default '',
  description text not null default '',
  impact text not null default '',
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_projects_published_sort_idx
  on public.site_projects (published, sort_order);

alter table public.site_projects enable row level security;

create policy "site_projects_public_read"
  on public.site_projects for select
  to anon, authenticated
  using (published = true);

create policy "site_projects_admin_all"
  on public.site_projects for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- Partenaires actifs
create table if not exists public.site_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  website_url text,
  notes text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_partners_active_sort_idx
  on public.site_partners (active, sort_order);

alter table public.site_partners enable row level security;

create policy "site_partners_public_read"
  on public.site_partners for select
  to anon, authenticated
  using (active = true);

create policy "site_partners_admin_all"
  on public.site_partners for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- Pages services + Solution Café (clé: agronomie | civil | hydro | solution_cafe)
create table if not exists public.site_service_content (
  service_key text primary key,
  meta_title text,
  meta_description text,
  page_title text,
  intro text,
  hero_image_url text,
  sections jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_service_content enable row level security;

create policy "site_service_content_public_read"
  on public.site_service_content for select
  to anon, authenticated
  using (true);

create policy "site_service_content_admin_all"
  on public.site_service_content for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- updated_at trigger (projets & partenaires)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_site_projects_updated on public.site_projects;
create trigger tr_site_projects_updated
  before update on public.site_projects
  for each row execute procedure public.set_updated_at();

drop trigger if exists tr_site_partners_updated on public.site_partners;
create trigger tr_site_partners_updated
  before update on public.site_partners
  for each row execute procedure public.set_updated_at();

drop trigger if exists tr_site_service_content_updated on public.site_service_content;
create trigger tr_site_service_content_updated
  before update on public.site_service_content
  for each row execute procedure public.set_updated_at();
