import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=80'

function trimPath(path) {
  if (!path || path.length <= 120) return path || '/'
  return `${path.slice(0, 117)}…`
}

export function NotFound() {
  const { t, locale } = useI18n()
  const { pathname } = useLocation()
  const displayPath = trimPath(pathname)

  const tiles = [
    { to: '/services', title: t('notFound.tileServicesTitle'), desc: t('notFound.tileServicesDesc') },
    { to: '/projets', title: t('notFound.tileProjectsTitle'), desc: t('notFound.tileProjectsDesc') },
    { to: '/blog', title: t('notFound.tileBlogTitle'), desc: t('notFound.tileBlogDesc') },
    { to: '/partenariats', title: t('notFound.tilePartnersTitle'), desc: t('notFound.tilePartnersDesc') },
  ]

  return (
    <>
      <Seo
        title={t('notFound.metaTitle')}
        description={t('notFound.metaDesc')}
        path={pathname}
        noindex
      />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { label: t('notFound.breadcrumb') },
        ]}
        title={t('notFound.title')}
        lead={t('notFound.lead')}
        heroImage={HERO_IMAGE}
        actions={
          <>
            <Link className="btn btn--primary" to="/">
              {t('notFound.homeCta')}
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              {t('notFound.contactCta')}
            </Link>
          </>
        }
      />

      <section className="section section--muted not-found" aria-labelledby="not-found-quick">
        <div className="container">
          <div className="not-found__layout">
            <div className="not-found__visual" aria-hidden="true">
              <span className="not-found__orbit" />
              <span className="not-found__code">404</span>
            </div>

            <div className="not-found__panel card">
              <p className="not-found__path-label">{t('notFound.pathLabel')}</p>
              <p className="not-found__path-wrap">
                <code className="not-found__path">{displayPath}</code>
              </p>
              <p className="not-found__hint">{t('notFound.hint')}</p>
            </div>
          </div>

          <h2 id="not-found-quick" className="not-found__quick-title section__title">
            {t('notFound.quickTitle')}
          </h2>
          <div className="card-grid not-found__tiles">
            {tiles.map((item) => (
              <Link key={item.to} to={item.to} className="card not-found__tile">
                <h3>{formatNavLabel(item.title, locale)}</h3>
                <p>{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
