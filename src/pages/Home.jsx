import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { ExpertiseAccordion } from '../components/ExpertiseAccordion'
import { useSitePartners } from '../hooks/useSitePartners'

export function Home() {
  const { t } = useI18n()
  const { rows: partners } = useSitePartners()
  const homeGalleryImages = Array.from({ length: 8 }, (_, index) => ({
    src: `/media/geaco/geaco-${String(index + 1).padStart(2, '0')}.jpeg`,
    alt: `GEACO terrain ${index + 1}`,
  }))

  const cafeSpot = t('home.solutionCafeSpotlight')
  const hasCafeSpot =
    cafeSpot &&
    typeof cafeSpot === 'object' &&
    typeof cafeSpot.title === 'string' &&
    Array.isArray(cafeSpot.bullets)

  const missionItems = t('home.missionItems')
  const strengths = t('home.strengths')
  const newsItems = t('home.newsItems')
  const stats = t('home.stats')

  function getInitials(name) {
    return String(name ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0] ?? '')
      .join('')
      .toUpperCase()
  }

  function hasLogoUrl(partner) {
    return String(partner?.logo_url ?? '').trim().length > 0
  }

  const expertisePanels = [
    {
      id: 'ag',
      kicker: t('home.panelAgKicker'),
      title: t('services.agronomy.title'),
      summary: t('home.panelAgLead'),
      bullets: t('services.agronomy.items'),
    },
    {
      id: 'civil',
      kicker: t('home.panelCivilKicker'),
      title: t('services.civil.title'),
      summary: t('home.panelCivilLead'),
      bullets: t('services.civil.items'),
    },
    {
      id: 'hydro',
      kicker: t('home.panelHydroKicker'),
      title: t('services.hydro.title'),
      summary: t('home.panelHydroLead'),
      bullets: t('services.hydro.items'),
    },
  ]

  return (
    <>
      <Seo title={t('home.metaTitle')} description={t('home.metaDesc')} path="/" />

      <section
        className="page-hero page-hero--immersive"
        style={{
          ['--hero-image']: 'url("/media/geaco/geaco-01.jpeg")',
        }}
      >
        <div className="page-hero__media" aria-hidden="true" />
        <div className="page-hero__inner">
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link to="/">{t('home.breadcrumbParent')}</Link>
            <span className="breadcrumb__sep">›</span>
            <span aria-current="page">{t('home.breadcrumbCurrent')}</span>
          </nav>
          <h1>{t('home.heroTitle')}</h1>
          <p className="page-hero__lead">{t('home.heroLead')}</p>
          <div className="page-hero__actions">
            <Link className="btn btn--primary" to="/contact">
              {t('home.ctaQuote')}
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              {t('home.ctaContact')}
            </Link>
            <Link className="btn btn--dark" to="/projets">
              {t('home.ctaProjects')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">{t('home.expertiseSectionTitle')}</h2>
            <p>{t('home.expertiseSectionIntro')}</p>
          </div>
          <ExpertiseAccordion items={expertisePanels} sectionLabel={t('home.expertiseSectionTitle')} />
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn--outline" to="/services/solution-cafe">
              {t('services.solutionCafe.navTitle')} — {t('services.hub.cardCta')}
            </Link>
          </p>
        </div>
      </section>

      {hasCafeSpot ? (
        <section className="section section--muted" aria-labelledby="cafe-spotlight-title">
          <div className="container split split--2">
            <div>
              <p className="tag" style={{ marginBottom: '0.75rem' }}>
                {cafeSpot.badge}
              </p>
              <h2 id="cafe-spotlight-title" className="section__title">
                {cafeSpot.title}
              </h2>
              <p style={{ color: 'var(--color-text-muted)' }}>{cafeSpot.lead}</p>
              <p style={{ marginTop: '1rem' }}>
                <Link className="btn btn--primary" to="/services/solution-cafe">
                  {cafeSpot.cta}
                </Link>
              </p>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
              {cafeSpot.bullets.map((line) => (
                <li key={line} style={{ marginBottom: '0.45rem' }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="section section--muted">
        <div className="container split split--2">
          <div>
            <h2 className="section__title">{t('home.visionTitle')}</h2>
            <p>{t('home.visionText')}</p>
            <h3 style={{ marginTop: '1.25rem' }}>{t('home.missionTitle')}</h3>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
              {missionItems.map((item) => (
                <li key={item} style={{ marginBottom: '0.35rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="section__title">{t('home.strengthsTitle')}</h2>
            <div className="card-grid" style={{ gridTemplateColumns: '1fr' }}>
              {strengths.map((s) => (
                <div className="card" key={s.title}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section__title">{t('home.newsSectionTitle')}</h2>
          <div className="news-list">
            {newsItems.map((item) => (
              <Link key={item.title} to="/projets" className="news-row">
                <span className="news-row__date">{item.date}</span>
                <div className="news-row__body">
                  <div className="news-row__cats">{item.cats.join(' · ')}</div>
                  <p className="news-row__title">{item.title}</p>
                </div>
                <span className="news-row__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
          <div className="news-footer">
            <Link className="btn btn--outline" to="/projets">
              {t('home.newsMore')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">{t('gallery.title')}</h2>
            <p>{t('gallery.lead')}</p>
          </div>
          <div className="home-gallery-grid">
            {homeGalleryImages.map((image) => (
              <Link key={image.src} to="/galerie" className="home-gallery-card" aria-label={t('nav.gallery')}>
                <img src={image.src} alt={image.alt} loading="lazy" />
              </Link>
            ))}
          </div>
          <p style={{ marginTop: '1.2rem' }}>
            <Link className="btn btn--outline" to="/galerie">
              {t('nav.gallery')}
            </Link>
          </p>
        </div>
      </section>

      <section className="promo-split" aria-labelledby="promo-heading">
        <div
          className="promo-split__visual"
          role="presentation"
          style={{
            backgroundImage:
              'linear-gradient(105deg, rgba(0, 47, 92, 0.9) 0%, rgba(226, 0, 37, 0.35) 100%), url("/media/geaco/geaco-09.jpeg")',
          }}
        />
        <div className="promo-split__content">
          <p className="promo-split__eyebrow" id="promo-eyebrow">
            {t('home.promoEyebrow')}
          </p>
          <h2 id="promo-heading">{t('home.promoTitle')}</h2>
          <p>{t('home.promoText')}</p>
          <p style={{ marginTop: '1rem' }}>
            <Link className="btn btn--on-dark" to="/a-propos">
              {t('home.promoCta')}
            </Link>
          </p>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container">
          <h2 className="section__title">{t('home.statsSectionTitle')}</h2>
          <div className="stats-strip__grid">
            {stats.map((row) => (
              <div key={row.label} className="stat-block">
                <div className="stat-block__value">{row.value}</div>
                <p className="stat-block__label">{row.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band__inner">
          <div>
            <h2>{t('home.ctaBandTitle')}</h2>
            <p>{t('home.ctaBandText')}</p>
          </div>
          <Link className="btn btn--on-dark" to="/contact">
            {t('home.ctaBandBtn')}
          </Link>
        </div>
      </section>

      <section className="section section--tight section--muted">
        <div className="container">
          <div className="partners-showcase__head">
            <h2 className="partners-showcase__title">
              <span>Nos </span>
              <span className="is-accent">Partenaires</span>
            </h2>
          </div>
          <p className="partners-showcase__lead">{t('home.partnersTeaser')}</p>
          {partners.length ? (
            <div className="partners-carousel" role="region" aria-label={t('home.partnersTeaserTitle')}>
              <div className="partners-carousel__track">
                {[...partners, ...partners].map((p, index) => (
                  <article className="partners-logo-card" key={`${p.id}-${index}`}>
                    <div className="partners-logo-card__logo" aria-hidden="true">
                      {hasLogoUrl(p) ? (
                        <img src={String(p.logo_url).trim()} alt="" loading="lazy" decoding="async" />
                      ) : (
                        getInitials(p.name)
                      )}
                    </div>
                    <h3>{p.name}</h3>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          <div className="partners-showcase__footer">
            <Link className="btn btn--primary partners-showcase__cta" to="/partenariats">
              {t('home.partnersCta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
