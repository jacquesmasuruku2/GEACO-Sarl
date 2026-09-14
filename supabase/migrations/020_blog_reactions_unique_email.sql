-- Corrige l’upsert des likes/notes blog :
-- PostgREST exige une contrainte UNIQUE réelle sur (post_id, user_email),
-- pas un index unique partiel (sinon : "no unique or exclusion constraint matching the ON CONFLICT specification").
-- Prérequis : 012_blog_comments_reactions.sql, 013_blog_public_engagement.sql

-- 1) Retirer l’ancien unique (post_id, user_id) s’il reste
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'site_blog_post_reactions_post_id_user_id_key'
  ) then
    alter table public.site_blog_post_reactions
      drop constraint site_blog_post_reactions_post_id_user_id_key;
  end if;
end $$;

-- 2) Remplacer l’index unique partiel
drop index if exists public.site_blog_post_reactions_post_email_uidx;

-- 3) Normaliser les emails
update public.site_blog_post_reactions
set user_email = lower(btrim(user_email))
where user_email is not null;

-- 4) Dédupliquer (garder la réaction la plus récente)
delete from public.site_blog_post_reactions
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by post_id, lower(user_email)
        order by coalesce(updated_at, created_at) desc, created_at desc
      ) as rn
    from public.site_blog_post_reactions
    where user_email is not null and btrim(user_email) <> ''
  ) ranked
  where rn > 1
);

-- 5) Lignes sans email inutilisables pour l’upsert public
delete from public.site_blog_post_reactions
where user_email is null or btrim(user_email) = '';

alter table public.site_blog_post_reactions
  alter column user_email set not null;

-- 6) Contrainte UNIQUE utilisable par ON CONFLICT (post_id, user_email)
alter table public.site_blog_post_reactions
  drop constraint if exists site_blog_post_reactions_post_email_key;

alter table public.site_blog_post_reactions
  add constraint site_blog_post_reactions_post_email_key unique (post_id, user_email);

comment on constraint site_blog_post_reactions_post_email_key on public.site_blog_post_reactions is
  'Une réaction (like/note) par article et adresse e-mail.';

-- 7) Droits anon (formulaire public sans connexion)
grant select, insert, update, delete on public.site_blog_post_reactions to anon, authenticated;
grant select, insert, update, delete on public.site_blog_post_comments to anon, authenticated;
