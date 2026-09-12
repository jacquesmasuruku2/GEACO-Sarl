-- Champs carte de service (impression admin) pour site_personnel.
-- Prérequis : 003_site_personnel.sql

alter table public.site_personnel
  add column if not exists card_last_name text,
  add column if not exists card_first_name text,
  add column if not exists card_matricule text,
  add column if not exists card_address text,
  add column if not exists card_signature_url text,
  add column if not exists card_valid_until date;

comment on column public.site_personnel.card_last_name is 'Noms (carte de service)';
comment on column public.site_personnel.card_first_name is 'Prénom (carte de service)';
comment on column public.site_personnel.card_matricule is 'Matricule interne';
comment on column public.site_personnel.card_address is 'Adresse affichée sur la carte';
comment on column public.site_personnel.card_signature_url is 'URL image signature autorisée';
comment on column public.site_personnel.card_valid_until is 'Date de validité de la carte';
