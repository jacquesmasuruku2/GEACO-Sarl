-- Champs identité étendus pour carte de service.
-- Prérequis : 017_site_personnel_service_card.sql

alter table public.site_personnel
  add column if not exists card_post_name text,
  add column if not exists card_sex text,
  add column if not exists card_birth_place text,
  add column if not exists card_birth_date date,
  add column if not exists card_department text;

comment on column public.site_personnel.card_last_name is 'Nom (carte de service)';
comment on column public.site_personnel.card_post_name is 'Post-nom (carte de service)';
comment on column public.site_personnel.card_first_name is 'Prénom (carte de service)';
comment on column public.site_personnel.card_sex is 'Sexe (carte de service)';
comment on column public.site_personnel.card_birth_place is 'Lieu de naissance';
comment on column public.site_personnel.card_birth_date is 'Date de naissance';
comment on column public.site_personnel.card_department is 'Département';
