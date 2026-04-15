-- Propositions de partenariat : table séparée de `site_lead_messages` (contact uniquement).
-- Prérequis : 001_site_content.sql (public.is_app_admin), 005_site_lead_messages.sql.

create table public.site_partnership_messages (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  subject text not null,
  full_name text not null,
  organization text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint site_partnership_messages_subject_len check (char_length(trim(subject)) between 1 and 400),
  constraint site_partnership_messages_name_len check (char_length(trim(full_name)) between 1 and 200),
  constraint site_partnership_messages_email_len check (char_length(trim(email)) between 3 and 254),
  constraint site_partnership_messages_message_len check (char_length(trim(message)) between 10 and 8000),
  constraint site_partnership_messages_org_len check (char_length(trim(organization)) between 2 and 300)
);

create index site_partnership_messages_created_idx
  on public.site_partnership_messages (created_at desc);

-- Anciennes lignes « partnership » vers la nouvelle table
insert into public.site_partnership_messages (locale, subject, full_name, organization, email, message, created_at)
select locale, subject, full_name, organization, email, message, created_at
from public.site_lead_messages
where source = 'partnership';

delete from public.site_lead_messages where source = 'partnership';

-- Contact seul dans site_lead_messages
alter table public.site_lead_messages drop constraint site_lead_messages_org_partnership;
alter table public.site_lead_messages drop constraint site_lead_messages_source_check;
alter table public.site_lead_messages add constraint site_lead_messages_source_check check (source = 'contact');

drop policy if exists "site_lead_messages_public_insert" on public.site_lead_messages;

create policy "site_lead_messages_public_insert"
  on public.site_lead_messages for insert
  to anon, authenticated
  with check (
    source = 'contact'
    and char_length(trim(email)) between 3 and 254
    and char_length(trim(message)) between 10 and 8000
    and char_length(trim(full_name)) between 1 and 200
    and char_length(trim(subject)) between 1 and 400
    and (phone is null or char_length(phone) <= 60)
  );

alter table public.site_partnership_messages enable row level security;

create policy "site_partnership_messages_public_insert"
  on public.site_partnership_messages for insert
  to anon, authenticated
  with check (
    char_length(trim(email)) between 3 and 254
    and char_length(trim(message)) between 10 and 8000
    and char_length(trim(full_name)) between 1 and 200
    and char_length(trim(subject)) between 1 and 400
    and organization is not null
    and char_length(trim(organization)) between 2 and 300
  );

create policy "site_partnership_messages_admin_select"
  on public.site_partnership_messages for select
  to authenticated
  using (public.is_app_admin());

create policy "site_partnership_messages_admin_delete"
  on public.site_partnership_messages for delete
  to authenticated
  using (public.is_app_admin());

grant insert on public.site_partnership_messages to anon, authenticated;
grant select, delete on public.site_partnership_messages to authenticated;
