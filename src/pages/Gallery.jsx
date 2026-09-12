import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'
import { useSiteGalleryPhotos } from '../hooks/useSiteGalleryPhotos'

function isImageUrl(url) {
  return typeof url === 'string' && /^(https?:\/\/|\/)/i.test(url.trim())
}

function normalizeImageUrl(url) {
  return String(url || '').trim().toLowerCase()
}

/** Légendes descriptives sans inventer de faits de projet. */
function describeStaticMedia(imageUrl, index) {
  const file = String(imageUrl).split('/').pop() || ''
  if (file.includes('home-hero')) {
    return {
      title: 'Terrain GEACO — vue d’ensemble',
      caption: 'Visuel d’accueil · Nord-Kivu',
      album: 'Accueil',
    }
  }
  if (file.includes('construction-hero') || file.startsWith('construction-project')) {
    return {
      title: `Chantier / construction — vue ${index + 1}`,
      caption: 'Activité construction & infrastructures · droits de publication à confirmer',
      album: 'Construction',
    }
  }
  if (/geaco-\d+\.jpeg$/i.test(file)) {
    const n = Number(file.match(/(\d+)/)?.[1] || index + 1)
    const domain =
      n % 3 === 1 ? 'Agriculture / terrain' : n % 3 === 2 ? 'Construction / chantier' : 'Eau / hydraulique'
    return {
      title: `${domain} — photo ${String(n).padStart(2, '0')}`,
      caption: 'Archive visuelle GEACO · légende et droits à préciser via l’admin',
      album: 'Terrain GEACO',
    }
  }
  return {
    title: `Photo terrain GEACO ${index + 1}`,
    caption: 'Archive visuelle · légende à enrichir',
    album: 'Terrain GEACO',
  }
}

export function Gallery() {
  const { t, locale } = useI18n()
  const { rows, loading, error } = useSiteGalleryPhotos()
  const siteMediaImages = [
    ...Array.from({ length: 36 }, (_, index) => `/media/geaco/geaco-${String(index + 1).padStart(2, '0')}.jpeg`),
    '/media/geaco/geaco-home-hero-02.png',
    '/media/geaco/geaco-construction-hero.png',
    ...Array.from({ length: 5 }, (_, index) => `/media/geaco/construction-project-${String(index + 1).padStart(2, '0')}.png`),
  ]
  const staticRows = siteMediaImages.map((imageUrl, index) => {
    const meta = describeStaticMedia(imageUrl, index)
    return {
      id: `static-${index}`,
      title: meta.title,
      caption: meta.caption,
      image_url: imageUrl,
      album: meta.album,
      source: 'static',
    }
  })
  const publishedRows = rows
    .filter((item) => isImageUrl(item.image_url))
    .map((item) => ({ ...item, source: 'cms' }))

  const mergedRows = [...staticRows, ...publishedRows].filter((item, index, list) => {
    const url = normalizeImageUrl(item.image_url)
    return url && list.findIndex((candidate) => normalizeImageUrl(candidate.image_url) === url) === index
  })
  const groupedAlbums = mergedRows.reduce((acc, item) => {
    const albumName = String(item.album || t('gallery.untitled')).trim()
    const currentGroup = acc.get(albumName) ?? []
    currentGroup.push(item)
    acc.set(albumName, currentGroup)
    return acc
  }, new Map())
  const albumSections = Array.from(groupedAlbums.entries())

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

          {!loading && !mergedRows.length ? <p className="admin-muted">{t('gallery.empty')}</p> : null}

          {albumSections.length ? (
            <div className="gallery-albums">
              {albumSections.map(([albumName, photos], albumIndex) => (
                <section
                  className="gallery-album-section gallery-album-section--wada"
                  key={albumName}
                  aria-label={albumName}
                >
                  <header className="gallery-album-section__head">
                    <p className="gallery-album-section__kicker">{albumName}</p>
                    <h2>{albumName}</h2>
                    <p>{`${photos.length} ${photos.length > 1 ? 'photos' : 'photo'}`}</p>
                  </header>

                  <div className="gallery-wada-grid">
                    {photos.map((item, index) => (
                      <figure
                        className={`gallery-wada-figure ${index === 0 && albumIndex === 0 ? 'is-spotlight' : ''}`}
                        key={`${item.source}-${item.id}-${normalizeImageUrl(item.image_url)}`}
                      >
                        {isImageUrl(item.image_url) ? (
                          <div className="gallery-wada-figure__media">
                            <img
                              src={item.image_url}
                              alt={item.title || item.caption || 'Photo galerie GEACO'}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        ) : null}
                        <figcaption className="gallery-wada-figure__caption">
                          <strong>{item.title || t('gallery.untitled')}</strong>
                          {item.caption ? <span>{item.caption}</span> : null}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
