-- Articles de blog (routes /blog, gérés depuis le panel admin).
-- Prérequis : migration 001_site_content.sql (fonction public.set_updated_at).


create table if not exists public.site_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  title text not null,
  excerpt text,
  body text not null default '',
  hero_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, locale)
);

create index if not exists site_blog_posts_pub_locale_idx
  on public.site_blog_posts (published, locale, published_at desc nulls last);

alter table public.site_blog_posts enable row level security;

create policy "site_blog_posts_public_read"
  on public.site_blog_posts for select
  to anon, authenticated
  using (published = true);

create policy "site_blog_posts_admin_all"
  on public.site_blog_posts for all
  to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists tr_site_blog_posts_updated on public.site_blog_posts;
create trigger tr_site_blog_posts_updated
  before update on public.site_blog_posts
  for each row execute procedure public.set_updated_at();
