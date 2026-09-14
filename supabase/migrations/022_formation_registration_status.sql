-- Statut d’inscription des formations : ouverte / complète / terminée / fermée.
-- Prérequis : 021_site_formations.sql

alter table public.site_formations
  add column if not exists registration_status text;

update public.site_formations
set registration_status = case
  when coalesce(registration_open, true) = false then 'closed'
  else 'open'
end
where registration_status is null;

alter table public.site_formations
  alter column registration_status set default 'open';

alter table public.site_formations
  alter column registration_status set not null;

alter table public.site_formations
  drop constraint if exists site_formations_registration_status_check;

alter table public.site_formations
  add constraint site_formations_registration_status_check
  check (registration_status in ('open', 'full', 'ended', 'closed'));

-- Garder registration_open aligné pour compatibilité éventuelle.
create or replace function public.sync_formation_registration_open()
returns trigger
language plpgsql
as $$
begin
  new.registration_open := (new.registration_status = 'open');
  return new;
end;
$$;

drop trigger if exists tr_site_formations_sync_open on public.site_formations;
create trigger tr_site_formations_sync_open
  before insert or update of registration_status on public.site_formations
  for each row execute procedure public.sync_formation_registration_open();

update public.site_formations
set registration_open = (registration_status = 'open');
