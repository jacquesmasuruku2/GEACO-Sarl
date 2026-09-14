-- Image de couverture pour les offres de formation.
-- Prérequis : 021_site_formations.sql

alter table public.site_formations
  add column if not exists image_url text;

alter table public.site_formations
  drop constraint if exists site_formations_image_url_len;

alter table public.site_formations
  add constraint site_formations_image_url_len
  check (image_url is null or char_length(trim(image_url)) between 8 and 2000);
