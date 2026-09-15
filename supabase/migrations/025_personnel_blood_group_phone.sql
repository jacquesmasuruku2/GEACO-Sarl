-- Groupe sanguin + téléphone carte (import/export XLS + fiches).
-- Prérequis : 003_site_personnel.sql, 018_…, 024_site_personnel_applications.sql.

alter table public.site_personnel_applications
  add column if not exists blood_group text;

alter table public.site_personnel
  add column if not exists card_blood_group text,
  add column if not exists card_phone text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'site_personnel_app_blood_group_len'
  ) then
    alter table public.site_personnel_applications
      add constraint site_personnel_app_blood_group_len
      check (blood_group is null or char_length(trim(blood_group)) <= 20);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'site_personnel_card_blood_group_len'
  ) then
    alter table public.site_personnel
      add constraint site_personnel_card_blood_group_len
      check (card_blood_group is null or char_length(trim(card_blood_group)) <= 20);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'site_personnel_card_phone_len'
  ) then
    alter table public.site_personnel
      add constraint site_personnel_card_phone_len
      check (card_phone is null or char_length(trim(card_phone)) <= 60);
  end if;
end $$;

-- Autoriser blood_group à l’insert public (candidature).
drop policy if exists "site_personnel_applications_public_insert" on public.site_personnel_applications;
create policy "site_personnel_applications_public_insert"
  on public.site_personnel_applications for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and char_length(trim(last_name)) between 1 and 120
    and char_length(trim(first_name)) between 1 and 120
    and char_length(trim(role)) between 2 and 200
    and char_length(trim(email)) between 3 and 254
    and (phone is null or char_length(phone) <= 60)
    and (post_name is null or char_length(trim(post_name)) between 1 and 120)
    and (department is null or char_length(trim(department)) <= 200)
    and (address is null or char_length(trim(address)) <= 400)
    and (notes is null or char_length(trim(notes)) <= 2000)
    and (photo_url is null or char_length(trim(photo_url)) between 8 and 2000)
    and (blood_group is null or char_length(trim(blood_group)) <= 20)
  );
