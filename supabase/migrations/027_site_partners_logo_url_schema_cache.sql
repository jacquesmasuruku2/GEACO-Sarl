-- Repair missing partner logo column and refresh the PostgREST schema cache.

alter table public.site_partners
  add column if not exists logo_url text;

notify pgrst, 'reload schema';
