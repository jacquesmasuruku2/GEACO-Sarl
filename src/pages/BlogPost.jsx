import { Link, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useBlogPost } from '../hooks/useBlogPost'
import { formatNavLabel } from '../lib/formatNavLabel'

export function BlogPost() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const { row, loading } = useBlogPost(slug || '', locale)

  if (!slug) {
    return <Navigate to="/blog" replace />
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.loading')}</p>
        </div>
      </div>
    )
  }

  if (!row) {
    return <Navigate to="/blog" replace />
  }

  const paragraphs = (row.body || '').split(/\n\n+/).filter(Boolean)

  return (
    <>
      <Seo title={row.title} description={row.excerpt || row.title} path={`/blog/${slug}`} />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { href: '/blog', label: t('blog.title') },
          { label: row.title },
        ]}
        title={row.title}
        lead={row.excerpt || ''}
        heroImage={
          row.hero_image_url && String(row.hero_image_url).startsWith('http')
            ? row.hero_image_url
            : undefined
        }
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 'var(--max-text)' }}>
          {row.published_at ? (
            <p className="tag" style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
              {new Date(row.published_at).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')}
            </p>
          ) : null}
          {paragraphs.map((block, i) => (
            <p key={i} style={{ marginBottom: '1rem', lineHeight: 1.65 }}>
              {block}
            </p>
          ))}
          <p style={{ marginTop: '2rem' }}>
            <Link className="btn btn--outline" to="/blog">
              {t('blog.backToList')}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
