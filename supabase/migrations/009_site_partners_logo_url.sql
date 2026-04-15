-- Ajoute le logo public des partenaires (affiché dans le carrousel).

alter table public.site_partners
  add column if not exists logo_url text;
