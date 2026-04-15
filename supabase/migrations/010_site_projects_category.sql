-- Ajoute une catégorie de projet pour le tri public (construction / agricole).

alter table public.site_projects
  add column if not exists project_category text not null default 'construction';

update public.site_projects
set project_category = case
  when lower(coalesce(tag, '')) similar to '%(agri|agron|hydro|irrig|sol)%' then 'agricole'
  else 'construction'
end
where project_category is null or project_category not in ('construction', 'agricole');

alter table public.site_projects
  drop constraint if exists site_projects_category_check;

alter table public.site_projects
  add constraint site_projects_category_check check (project_category in ('construction', 'agricole'));

create index if not exists site_projects_published_category_sort_idx
  on public.site_projects (published, project_category, sort_order);
