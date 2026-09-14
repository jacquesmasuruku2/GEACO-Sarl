-- Formations publiables + inscriptions publiques.
-- Prérequis : 001_site_content.sql (is_app_admin, set_updated_at).

create table if not exists public.site_formations (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  title text not null,
  summary text,
  description text not null default '',
  location text,
  starts_on date,
  ends_on date,
  duration_label text,
  seats_label text,
  registration_open boolean not null default true,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale),
  constraint site_formations_title_len check (char_length(trim(title)) between 2 and 200),
  constraint site_formations_slug_len check (char_length(trim(slug)) between 2 and 120)
);

create index if not exists site_formations_pub_locale_idx
  on public.site_formations (published, locale, sort_order, starts_on nulls last);

alter table public.site_formations enable row level security;

drop policy if exists "site_formations_public_read" on public.site_formations;
create policy "site_formations_public_read"
  on public.site_formations for select
  to anon, authenticated
  using (published = true);

drop policy if exists "site_formations_admin_all" on public.site_formations;
create policy "site_formations_admin_all"
  on public.site_formations for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists tr_site_formations_updated on public.site_formations;
create trigger tr_site_formations_updated
  before update on public.site_formations
  for each row execute procedure public.set_updated_at();

create table if not exists public.site_formation_registrations (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid references public.site_formations (id) on delete set null,
  formation_title text not null,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  motivation text not null,
  created_at timestamptz not null default now(),
  constraint site_formation_reg_title_len check (char_length(trim(formation_title)) between 2 and 200),
  constraint site_formation_reg_name_len check (char_length(trim(full_name)) between 1 and 200),
  constraint site_formation_reg_email_len check (char_length(trim(email)) between 3 and 254),
  constraint site_formation_reg_motivation_len check (char_length(trim(motivation)) between 10 and 4000),
  constraint site_formation_reg_phone_len check (phone is null or char_length(phone) <= 60),
  constraint site_formation_reg_org_len check (organization is null or char_length(trim(organization)) <= 300)
);

create index if not exists site_formation_registrations_created_idx
  on public.site_formation_registrations (created_at desc);

create index if not exists site_formation_registrations_formation_idx
  on public.site_formation_registrations (formation_id);

alter table public.site_formation_registrations enable row level security;

drop policy if exists "site_formation_registrations_public_insert" on public.site_formation_registrations;
create policy "site_formation_registrations_public_insert"
  on public.site_formation_registrations for insert
  to anon, authenticated
  with check (
    char_length(trim(email)) between 3 and 254
    and char_length(trim(full_name)) between 1 and 200
    and char_length(trim(formation_title)) between 2 and 200
    and char_length(trim(motivation)) between 10 and 4000
    and (phone is null or char_length(phone) <= 60)
    and (organization is null or char_length(trim(organization)) <= 300)
  );

drop policy if exists "site_formation_registrations_admin_select" on public.site_formation_registrations;
create policy "site_formation_registrations_admin_select"
  on public.site_formation_registrations for select
  to authenticated
  using (public.is_app_admin());

drop policy if exists "site_formation_registrations_admin_delete" on public.site_formation_registrations;
create policy "site_formation_registrations_admin_delete"
  on public.site_formation_registrations for delete
  to authenticated
  using (public.is_app_admin());

grant select on public.site_formations to anon, authenticated;
grant all on public.site_formations to authenticated;

grant insert on public.site_formation_registrations to anon, authenticated;
grant select, delete on public.site_formation_registrations to authenticated;
