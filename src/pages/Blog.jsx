import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { formatNavLabel } from '../lib/formatNavLabel'

function blogCoverUrl(post) {
  const url = String(post?.hero_image_url ?? '').trim()
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('/')) return url
  return ''
}

export function Blog() {
  const { t, locale } = useI18n()
  const { rows, loading } = useBlogPosts(locale)
  const recentPosts = rows.slice(0, 5)

  function formatDate(dateValue) {
    if (!dateValue) return 'Brouillon'
    return new Date(dateValue).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')
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
        heroImage="/media/geaco/blog.jpg"
      />

      <section className="section">
        <div className="container">
          {loading ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.loading')}</p>
          ) : rows.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('blog.empty')}</p>
          ) : (
            <div className="blog-wada-shell">
              <div className="blog-wada-main">
                {rows.map((post) => {
                  const cover = blogCoverUrl(post)
                  return (
                    <article className="blog-wada-item" key={`${post.slug}-${locale}`}>
                      {cover ? (
                        <Link
                          className="blog-wada-item__media"
                          to={`/blog/${post.slug}`}
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <img src={cover} alt="" loading="lazy" decoding="async" />
                        </Link>
                      ) : null}
                      <div className="blog-wada-item__content">
                        <h2 className="blog-wada-item__title">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="blog-wada-item__meta">{formatDate(post.published_at)} · GEACO Sarl</p>
                        {post.excerpt ? <p className="blog-wada-item__excerpt">{post.excerpt}</p> : null}
                        <Link className="blog-wada-item__cta" to={`/blog/${post.slug}`}>
                          {t('blog.readMore')}
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>

              <aside className="blog-wada-sidebar">
                <section className="blog-wada-widget">
                  <h3>Articles recents</h3>
                  <ul className="blog-wada-widget__list">
                    {recentPosts.map((post) => {
                      const cover = blogCoverUrl(post)
                      return (
                        <li key={`${post.slug}-recent`}>
                          <Link
                            to={`/blog/${post.slug}`}
                            className={`blog-wada-widget__link${cover ? '' : ' blog-wada-widget__link--plain'}`}
                          >
                            {cover ? (
                              <span className="blog-wada-widget__thumb" aria-hidden="true">
                                <img src={cover} alt="" loading="lazy" decoding="async" />
                              </span>
                            ) : null}
                            <span className="blog-wada-widget__text">
                              <span>{formatDate(post.published_at)}</span>
                              <strong>{post.title}</strong>
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>

                <section className="blog-wada-widget blog-wada-widget--contact">
                  <h3>Contact</h3>
                  <p>
                    GEACO collabore avec ses partenaires pour partager des analyses de terrain et des innovations
                    techniques.
                  </p>
                  <Link className="btn btn--primary" to="/contact">
                    Nous contacter
                  </Link>
                </section>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
