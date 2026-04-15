import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'
import { useSiteGalleryPhotos } from '../hooks/useSiteGalleryPhotos'

function isImageUrl(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

export function Gallery() {
  const { t, locale } = useI18n()
  const { rows, loading, error } = useSiteGalleryPhotos()

  return (
    <>
      <Seo title={t('gallery.metaTitle')} description={t('gallery.metaDesc')} path="/galerie" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { label: t('gallery.title') },
        ]}
        title={t('gallery.title')}
        lead={t('gallery.lead')}
        heroImage="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          {loading ? <p className="admin-muted">{t('gallery.loading')}</p> : null}
          {error ? (
            <p className="admin-error" role="alert">
              {t('gallery.loadError')}: {error.message}
            </p>
          ) : null}

          {!loading && !rows.length ? <p className="admin-muted">{t('gallery.empty')}</p> : null}

          {rows.length ? (
            <div className="gallery-grid">
              {rows.map((item) => (
                <article className="gallery-card" key={item.id}>
                  {isImageUrl(item.image_url) ? (
                    <div className="gallery-card__media">
                      <img src={item.image_url} alt={item.title || 'Photo galerie'} loading="lazy" decoding="async" />
                    </div>
                  ) : null}
                  <div className="gallery-card__body">
                    <h2>{item.title || t('gallery.untitled')}</h2>
                    {item.caption ? <p>{item.caption}</p> : null}
                    {item.album ? <span className="gallery-card__tag">{item.album}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
