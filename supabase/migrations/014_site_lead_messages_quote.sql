-- Demandes de devis : même table que le contact public, avec source = 'quote'.
-- Prérequis : 006_site_partnership_messages.sql (contact seul avec source = 'contact').

alter table public.site_lead_messages drop constraint if exists site_lead_messages_source_check;

alter table public.site_lead_messages add constraint site_lead_messages_source_check
  check (source in ('contact', 'quote'));

drop policy if exists "site_lead_messages_public_insert" on public.site_lead_messages;

create policy "site_lead_messages_public_insert"
  on public.site_lead_messages for insert
  to anon, authenticated
  with check (
    source in ('contact', 'quote')
    and char_length(trim(email)) between 3 and 254
    and char_length(trim(message)) between 10 and 8000
    and char_length(trim(full_name)) between 1 and 200
    and char_length(trim(subject)) between 1 and 400
    and (phone is null or char_length(phone) <= 60)
  );
