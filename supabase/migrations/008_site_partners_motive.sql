-- Table partenaires éditoriaux (distincte des messages de demande de partenariat).
-- Ajoute le motif de partenariat affiché publiquement sur le site.

create table if not exists public.site_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  website_url text,
  notes text,
  partnership_motive text,
  active boolean not null default true,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_partners
  add column if not exists partnership_motive text,
  add column if not exists published boolean not null default true;

update public.site_partners
set published = coalesce(published, active, true)
where true;

create index if not exists site_partners_published_sort_idx
  on public.site_partners (published, sort_order);

alter table public.site_partners enable row level security;

drop policy if exists "site_partners_public_read" on public.site_partners;
create policy "site_partners_public_read"
  on public.site_partners for select
  to anon, authenticated
  using (published = true);

drop policy if exists "site_partners_admin_all" on public.site_partners;
create policy "site_partners_admin_all"
  on public.site_partners for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists tr_site_partners_updated on public.site_partners;
create trigger tr_site_partners_updated
  before update on public.site_partners
  for each row execute procedure public.set_updated_at();
