-- Ajoute la photo de couverture des projets (admin + page publique).

alter table public.site_projects
  add column if not exists image_url text;
