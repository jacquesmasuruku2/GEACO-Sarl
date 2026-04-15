-- Commentaires + likes/cotation (1-5) pour les articles du blog.

create table if not exists public.site_blog_post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.site_blog_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_display_name text not null default '',
  user_email text,
  liked boolean not null default true,
  rating int not null default 5 check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.site_blog_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.site_blog_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_display_name text not null default '',
  user_email text,
  comment text not null check (char_length(trim(comment)) between 2 and 3000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_blog_post_reactions_post_idx
  on public.site_blog_post_reactions (post_id, created_at desc);

create index if not exists site_blog_post_comments_post_idx
  on public.site_blog_post_comments (post_id, created_at desc);

alter table public.site_blog_post_reactions enable row level security;
alter table public.site_blog_post_comments enable row level security;

drop policy if exists "site_blog_post_reactions_public_read" on public.site_blog_post_reactions;
create policy "site_blog_post_reactions_public_read"
  on public.site_blog_post_reactions for select
  to anon, authenticated
  using (true);

drop policy if exists "site_blog_post_reactions_member_insert" on public.site_blog_post_reactions;
create policy "site_blog_post_reactions_member_insert"
  on public.site_blog_post_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "site_blog_post_reactions_member_update" on public.site_blog_post_reactions;
create policy "site_blog_post_reactions_member_update"
  on public.site_blog_post_reactions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "site_blog_post_reactions_member_delete" on public.site_blog_post_reactions;
create policy "site_blog_post_reactions_member_delete"
  on public.site_blog_post_reactions for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "site_blog_post_comments_public_read" on public.site_blog_post_comments;
create policy "site_blog_post_comments_public_read"
  on public.site_blog_post_comments for select
  to anon, authenticated
  using (true);

drop policy if exists "site_blog_post_comments_member_insert" on public.site_blog_post_comments;
create policy "site_blog_post_comments_member_insert"
  on public.site_blog_post_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "site_blog_post_comments_member_update" on public.site_blog_post_comments;
create policy "site_blog_post_comments_member_update"
  on public.site_blog_post_comments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "site_blog_post_comments_member_delete" on public.site_blog_post_comments;
create policy "site_blog_post_comments_member_delete"
  on public.site_blog_post_comments for delete
  to authenticated
  using (auth.uid() = user_id);

drop trigger if exists tr_site_blog_post_reactions_updated on public.site_blog_post_reactions;
create trigger tr_site_blog_post_reactions_updated
  before update on public.site_blog_post_reactions
  for each row execute procedure public.set_updated_at();

drop trigger if exists tr_site_blog_post_comments_updated on public.site_blog_post_comments;
create trigger tr_site_blog_post_comments_updated
  before update on public.site_blog_post_comments
  for each row execute procedure public.set_updated_at();

grant select on public.site_blog_post_reactions to anon, authenticated;
grant select on public.site_blog_post_comments to anon, authenticated;
grant insert, update, delete on public.site_blog_post_reactions to authenticated;
grant insert, update, delete on public.site_blog_post_comments to authenticated;
