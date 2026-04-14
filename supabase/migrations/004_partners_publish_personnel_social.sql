-- Partenaires : colonne « published » (publication explicite) + synchro avec l’ancien « active ».
-- Personnel : email + liens réseaux.

alter table public.site_partners
  add column if not exists published boolean not null default true;

update public.site_partners set published = coalesce(active, true) where true;

create index if not exists site_partners_published_sort_idx
  on public.site_partners (published, sort_order);

drop policy if exists "site_partners_public_read" on public.site_partners;

create policy "site_partners_public_read"
  on public.site_partners for select
  to anon, authenticated
  using (published = true);

alter table public.site_personnel
  add column if not exists email text,
  add column if not exists facebook_url text,
  add column if not exists linkedin_url text;
