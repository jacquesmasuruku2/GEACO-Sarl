-- Fiches personnel (page /personnel) : textes + photo (URL).
-- Même `section_order` + même langue = un bloc sous le même titre de section (première ligne du groupe).
-- Prérequis : 001_site_content.sql (public.set_updated_at, public.is_app_admin).

create table if not exists public.site_personnel (
  id uuid primary key default gen_random_uuid(),
  section_order int not null default 0,
  section_title text not null,
  name text not null,
  role text not null,
  focus text,
  bio text,
  photo_url text,
  email text,
  facebook_url text,
  linkedin_url text,
  sort_order int not null default 0,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_personnel_pub_locale_idx
  on public.site_personnel (published, locale, section_order, sort_order);

alter table public.site_personnel enable row level security;

create policy "site_personnel_public_read"
  on public.site_personnel for select
  to anon, authenticated
  using (published = true);

create policy "site_personnel_admin_all"
  on public.site_personnel for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists tr_site_personnel_updated on public.site_personnel;
create trigger tr_site_personnel_updated
  before update on public.site_personnel
  for each row execute procedure public.set_updated_at();

-- Exemple d’insertion (à adapter puis exécuter dans le SQL Editor après publication des lignes) :
-- insert into public.site_personnel
--   (section_order, section_title, name, role, focus, bio, photo_url, email, facebook_url, linkedin_url, sort_order, locale, published)
-- values
--   (0, 'Direction & associés fondateurs', 'Baraka Musa Eric', 'Gérant', 'Génie civil & infrastructures', '…', 'https://…/photo.jpg', 0, 'fr', true),
--   (0, 'Direction & associés fondateurs', 'Naomi Mukobelwa Sifa', 'Associée', 'Agronomie & filières', '…', null, 1, 'fr', true),
--   (1, 'Secrétariat général', 'Jacques MASURUKU', 'Secrétaire général', 'Coordination administrative…', '…', null, 0, 'fr', true);
