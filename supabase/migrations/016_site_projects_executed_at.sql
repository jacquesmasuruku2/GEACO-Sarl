-- Date d’exécution et lieu pour fiches projet type article.

alter table public.site_projects
  add column if not exists executed_at date;

alter table public.site_projects
  add column if not exists location text not null default '';

comment on column public.site_projects.executed_at is 'Date ou période de début d’exécution affichée sur la fiche projet';
comment on column public.site_projects.location is 'Lieu d’intervention publiable (ville, territoire…)';
