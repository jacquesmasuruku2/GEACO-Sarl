-- Autorise commentaires et notes publiques sans connexion obligatoire.
-- Les contributions restent identifiées par nom/email saisi.

alter table if exists public.site_blog_post_reactions
  alter column user_id drop not null;

alter table if exists public.site_blog_post_comments
  alter column user_id drop not null;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'site_blog_post_reactions_post_id_user_id_key'
  ) then
    alter table public.site_blog_post_reactions
      drop constraint site_blog_post_reactions_post_id_user_id_key;
  end if;
end $$;

create unique index if not exists site_blog_post_reactions_post_email_uidx
  on public.site_blog_post_reactions (post_id, user_email)
  where user_email is not null;

drop policy if exists "site_blog_post_reactions_member_insert" on public.site_blog_post_reactions;
drop policy if exists "site_blog_post_reactions_member_update" on public.site_blog_post_reactions;
drop policy if exists "site_blog_post_reactions_member_delete" on public.site_blog_post_reactions;

create policy "site_blog_post_reactions_public_insert"
  on public.site_blog_post_reactions for insert
  to anon, authenticated
  with check (
    char_length(trim(coalesce(user_display_name, ''))) between 2 and 120
    and char_length(trim(coalesce(user_email, ''))) between 3 and 254
  );

create policy "site_blog_post_reactions_public_update"
  on public.site_blog_post_reactions for update
  to anon, authenticated
  using (true)
  with check (
    char_length(trim(coalesce(user_display_name, ''))) between 2 and 120
    and char_length(trim(coalesce(user_email, ''))) between 3 and 254
  );

create policy "site_blog_post_reactions_public_delete"
  on public.site_blog_post_reactions for delete
  to anon, authenticated
  using (true);

drop policy if exists "site_blog_post_comments_member_insert" on public.site_blog_post_comments;
drop policy if exists "site_blog_post_comments_member_update" on public.site_blog_post_comments;
drop policy if exists "site_blog_post_comments_member_delete" on public.site_blog_post_comments;

create policy "site_blog_post_comments_public_insert"
  on public.site_blog_post_comments for insert
  to anon, authenticated
  with check (
    char_length(trim(coalesce(user_display_name, ''))) between 2 and 120
    and char_length(trim(coalesce(user_email, ''))) between 3 and 254
    and char_length(trim(coalesce(comment, ''))) between 2 and 3000
  );

create policy "site_blog_post_comments_public_update"
  on public.site_blog_post_comments for update
  to anon, authenticated
  using (true)
  with check (
    char_length(trim(coalesce(user_display_name, ''))) between 2 and 120
    and char_length(trim(coalesce(user_email, ''))) between 3 and 254
    and char_length(trim(coalesce(comment, ''))) between 2 and 3000
  );

create policy "site_blog_post_comments_public_delete"
  on public.site_blog_post_comments for delete
  to anon, authenticated
  using (true);
