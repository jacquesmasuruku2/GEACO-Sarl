import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { formatNavLabel } from '../lib/formatNavLabel'

export function Blog() {
  const { t, locale } = useI18n()
  const { rows, loading } = useBlogPosts(locale)

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
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.loading')}</p>
          ) : rows.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.empty')}</p>
          ) : (
            <div className="card-grid">
              {rows.map((post) => (
                <article className="card" key={`${post.slug}-${locale}`}>
                  <h2 style={{ fontSize: '1.15rem', color: 'var(--color-vinci-blue)' }}>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  {post.published_at ? (
                    <p className="tag" style={{ display: 'inline-block', marginTop: '0.35rem' }}>
                      {new Date(post.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')}
                    </p>
                  ) : null}
                  {post.excerpt ? (
                    <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>{post.excerpt}</p>
                  ) : null}
                  <p style={{ marginTop: '1rem' }}>
                    <Link className="btn btn--outline" to={`/blog/${post.slug}`}>
                      {t('blog.readMore')}
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
