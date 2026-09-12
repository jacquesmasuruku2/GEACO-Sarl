-- Autoriser la catégorie WASH pour les projets (domaine de 1er niveau).

alter table public.site_projects
  drop constraint if exists site_projects_category_check;

alter table public.site_projects
  add constraint site_projects_category_check
  check (project_category in ('construction', 'agricole', 'wash'));
