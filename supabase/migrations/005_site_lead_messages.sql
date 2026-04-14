-- Messages des formulaires Contact et Partenariats (stockage Supabase, sans service tiers).
-- Prérequis : 001_site_content.sql (public.is_app_admin).

create table if not exists public.site_lead_messages (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('contact', 'partnership')),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  subject text not null,
  full_name text not null,
  organization text,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  constraint site_lead_messages_subject_len check (char_length(trim(subject)) between 1 and 400),
  constraint site_lead_messages_name_len check (char_length(trim(full_name)) between 1 and 200),
  constraint site_lead_messages_email_len check (char_length(trim(email)) between 3 and 254),
  constraint site_lead_messages_message_len check (char_length(trim(message)) between 10 and 8000),
  constraint site_lead_messages_phone_len check (phone is null or char_length(phone) <= 60),
  constraint site_lead_messages_org_partnership check (
    source <> 'partnership'
    or (organization is not null and char_length(trim(organization)) between 2 and 300)
  )
);

create index if not exists site_lead_messages_created_idx
  on public.site_lead_messages (created_at desc);

alter table public.site_lead_messages enable row level security;

-- Insertion anonyme (site public) : contrôles renforcés côté WITH CHECK
create policy "site_lead_messages_public_insert"
  on public.site_lead_messages for insert
  to anon, authenticated
  with check (
    char_length(trim(email)) between 3 and 254
    and char_length(trim(message)) between 10 and 8000
    and char_length(trim(full_name)) between 1 and 200
    and char_length(trim(subject)) between 1 and 400
    and (
      source = 'contact'
      or (
        source = 'partnership'
        and organization is not null
        and char_length(trim(organization)) between 2 and 300
      )
    )
    and (phone is null or char_length(phone) <= 60)
  );

-- Lecture réservée aux administrateurs applicatifs (tableau de bord / SQL)
create policy "site_lead_messages_admin_select"
  on public.site_lead_messages for select
  to authenticated
  using (public.is_app_admin());

create policy "site_lead_messages_admin_delete"
  on public.site_lead_messages for delete
  to authenticated
  using (public.is_app_admin());

grant insert on public.site_lead_messages to anon, authenticated;
grant select, delete on public.site_lead_messages to authenticated;
