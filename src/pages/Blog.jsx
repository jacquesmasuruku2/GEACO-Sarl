import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { formatNavLabel } from '../lib/formatNavLabel'
import { supabase } from '../lib/supabase'

export function Blog() {
  const { t, locale } = useI18n()
  const { rows, loading } = useBlogPosts(locale)
  const [session, setSession] = useState(null)
  const fallbackCover =
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80'

  useEffect(() => {
    if (!supabase) return
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data?.session ?? null)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })
    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function loginWithFacebook() {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: window.location.href },
    })
  }

  return (
    <>
      <Seo title={t('blog.metaTitle')} description={t('blog.metaDesc')} path="/blog" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { label: t('blog.title') },
        ]}
        title={t('blog.title')}
        lead={t('blog.lead')}
        heroImage="https://images.unsplash.com/photo-1455849318747-b3291b98f1b0?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          {!session ? (
            <div className="card" style={{ marginBottom: '1rem' }}>
              <p className="admin-muted" style={{ marginTop: 0 }}>
                {t('blog.memberPrompt')}
              </p>
              <button type="button" className="btn btn--primary" onClick={loginWithFacebook}>
                {t('blog.connectGoogle')}
              </button>
            </div>
          ) : null}
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.loading')}</p>
          ) : rows.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.empty')}</p>
          ) : (
            <div className="blog-cards-grid">
              {rows.map((post) => (
                <article className="blog-list-card" key={`${post.slug}-${locale}`}>
                  <Link className="blog-list-card__media" to={`/blog/${post.slug}`}>
                    <img
                      src={post.hero_image_url && String(post.hero_image_url).startsWith('http') ? post.hero_image_url : fallbackCover}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="blog-list-card__body">
                    <h2 className="blog-list-card__title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.published_at ? (
                      <p className="blog-list-card__meta">
                        {new Date(post.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')}
                      </p>
                    ) : (
                      <p className="blog-list-card__meta">Brouillon</p>
                    )}
                    {post.excerpt ? <p className="blog-list-card__excerpt">{post.excerpt}</p> : null}
                    <Link className="btn btn--dark blog-list-card__cta" to={`/blog/${post.slug}`}>
                      {t('blog.readMore')}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
