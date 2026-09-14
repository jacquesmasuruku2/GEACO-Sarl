-- Slug public pour fiches équipe (/personnel/:slug) — QR cartes de service.
-- Prérequis : 003_site_personnel.sql

alter table public.site_personnel
  add column if not exists slug text;

comment on column public.site_personnel.slug is
  'Identifiant URL public (/personnel/:slug). Unique par langue.';

create unique index if not exists site_personnel_locale_slug_uidx
  on public.site_personnel (locale, slug)
  where slug is not null and btrim(slug) <> '';
