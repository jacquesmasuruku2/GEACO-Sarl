import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PillarIcon } from '../components/PillarIcon'
import { PILLAR_ROUTES } from '../data/servicesNav'
import { useSitePartners } from '../hooks/useSitePartners'

const PILLAR_META = {
  agriculture: { icon: 'agriculture', className: 'pillar-card--agriculture', href: '/services/agriculture' },
  construction: { icon: 'construction', className: 'pillar-card--construction', href: '/services/construction' },
  wash: { icon: 'wash', className: 'pillar-card--wash', href: '/services/wash' },
}

export function Home() {
  const { t, locale } = useI18n()
  const { rows: partners } = useSitePartners()
  const heroSlides = [
    '/media/geaco/geaco-24.jpeg',
    '/media/geaco/geaco-29.jpeg',
    '/media/geaco/geaco-25.jpeg',
    '/media/geaco/geaco-16.jpeg',
  ]
  const fieldPhotos = [
    { src: '/media/geaco/geaco-24.jpeg', featured: true },
    { src: '/media/geaco/geaco-29.jpeg', featured: false },
    { src: '/media/geaco/geaco-09.jpeg', featured: false },
    { src: '/media/geaco/geaco-16.jpeg', featured: false },
    { src: '/media/geaco/geaco-25.jpeg', featured: false },
  ]
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)

  const newsItems = t('home.newsItems')
  const stats = t('home.stats')
  const methodSteps = t('home.methodSteps')
  const safeNews = Array.isArray(newsItems) ? newsItems : []
  const safeStats = Array.isArray(stats) ? stats : []
  const safeMethod = Array.isArray(methodSteps) ? methodSteps : []

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length)
    }, 4000)
    return () => window.clearInterval(intervalId)
  }, [heroSlides.length])

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

  const pillars = PILLAR_ROUTES.map(({ slug, detailKey }) => {
    const meta = PILLAR_META[detailKey] || PILLAR_META.agriculture
    return {
      slug,
      detailKey,
      title: t(`services.${detailKey}.title`),
      short: t(`services.${detailKey}.short`),
      items: t(`services.${detailKey}.items`),
      ...meta,
      href: `/services/${slug}`,
    }
  })

  return (
    <>
      <Seo title={t('home.metaTitle')} description={t('home.metaDesc')} path="/" />

      <section className="home-hero-immersive">
        <div className="home-hero-immersive__media" aria-hidden="true">
          {heroSlides.map((slide, index) => (
            <img
              key={slide}
              src={slide}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              className={index === activeHeroSlide ? 'is-active' : ''}
            />
          ))}
          <div className="home-hero-immersive__veil" />
        </div>
        <div className="container home-hero-immersive__inner">
          <p className="home-hero-immersive__eyebrow">{t('brand.short')}</p>
          <h1>{t('home.heroTitle')}</h1>
          <p className="home-hero-immersive__lead">{t('home.heroLead')}</p>
          <div className="page-hero__actions">
            <Link className="btn btn--on-dark" to="/services">
              {t('home.ctaExpertises')}
            </Link>
            <Link className="btn btn--ghost-on-dark" to="/devis">
              {t('home.ctaQuote')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="expertises" aria-labelledby="pillars-title">
        <div className="container">
          <div className="section__head section__head--wide">
            <p className="section-kicker">{t('nav.solutions')}</p>
            <h2 id="pillars-title" className="section__title">
              {t('home.pillarsTitle')}
            </h2>
            <p>{t('home.pillarsLead')}</p>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className={`pillar-card ${pillar.className}`} key={pillar.slug}>
                <div className="pillar-card__icon">
                  <PillarIcon name={pillar.icon} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.short}</p>
                {Array.isArray(pillar.items) ? (
                  <ul>
                    {pillar.items.slice(0, 4).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                <Link className="btn btn--outline pillar-card__cta" to={pillar.href}>
                  {t('home.pillarsCta')}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="home-field-title">
        <div className="container">
          <div className="section__head section__head--wide">
            <p className="section-kicker">{t('home.fieldKicker')}</p>
            <h2 id="home-field-title" className="section__title">
              {t('home.fieldTitle')}
            </h2>
            <p>{t('home.fieldLead')}</p>
          </div>
          <div className="home-gallery-grid">
            {fieldPhotos.map((photo) => (
              <Link
                key={photo.src}
                to="/galerie"
                className={`home-gallery-card${photo.featured ? ' is-featured' : ''}`}
              >
                <img src={photo.src} alt="" loading="lazy" decoding="async" />
              </Link>
            ))}
          </div>
          <p style={{ marginTop: '1.1rem' }}>
            <Link className="btn btn--outline" to="/galerie">
              {t('home.fieldCta')}
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--muted" aria-labelledby="integrated-title">
        <div className="container home-integrated">
          <div className="section__head section__head--wide">
            <p className="section-kicker">{locale === 'en' ? 'Approach' : 'Approche'}</p>
            <h2 id="integrated-title" className="section__title">
              {t('home.integratedTitle')}
            </h2>
            <p>{t('home.integratedLead')}</p>
          </div>
          <div className="home-integrated__links">
            <Link to="/services/agriculture">{t('services.agriculture.title')}</Link>
            <Link to="/services/construction">{t('services.construction.title')}</Link>
            <Link to="/services/wash">{t('services.wash.title')}</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="trust-title">
        <div className="container">
          <div className="section__head section__head--wide">
            <p className="section-kicker">{t('nav.projects')}</p>
            <h2 id="trust-title" className="section__title">
              {t('home.trustTitle')}
            </h2>
            <p>{t('home.trustLead')}</p>
          </div>
          <div className="trust-list">
            {safeNews.map((item) => (
              <Link
                key={item.title}
                to={`/projets/${item.pillar === 'agriculture' ? 'agriculture' : item.pillar === 'wash' ? 'wash' : 'construction'}`}
                className={`trust-row trust-row--${item.pillar || 'default'}`}
              >
                <span className="trust-row__date">{item.date}</span>
                <div className="trust-row__body">
                  <div className="trust-row__cats">{(item.cats || []).join(' · ')}</div>
                  <p className="trust-row__title">{item.title}</p>
                  <p className="trust-row__note">{t('home.trustStatusNote')}</p>
                </div>
                <span className="trust-row__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn--outline" to="/projets">
              {t('home.trustCta')}
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="method-title">
        <div className="container">
          <div className="section__head section__head--wide">
            <p className="section-kicker" style={{ color: '#7dd3fc' }}>
              {locale === 'en' ? 'Method' : 'Méthode'}
            </p>
            <h2 id="method-title" className="section__title">
              {t('home.methodTitle')}
            </h2>
            <p>{t('home.methodLead')}</p>
          </div>
          <ol className="method-steps">
            {safeMethod.map((step, index) => (
              <li className="method-steps__item" key={step.title}>
                <span className="method-steps__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head section__head--wide">
            <h2 className="section__title">{t('home.statsSectionTitle')}</h2>
            <p>{t('home.visionText')}</p>
          </div>
          <div className="stats-strip__grid stats-strip__grid--compact">
            {safeStats.map((row) => (
              <div key={row.label} className="stat-block">
                <div className="stat-block__value">{row.value}</div>
                <p className="stat-block__label">{row.label}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn--outline" to="/a-propos">
              {t('home.promoCta')}
            </Link>
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-band__inner">
          <div>
            <h2>{t('home.ctaBandTitle')}</h2>
            <p>{t('home.ctaBandText')}</p>
          </div>
          <div className="cta-band__actions">
            <Link className="btn btn--on-dark" to="/devis">
              {t('home.ctaQuote')}
            </Link>
            <Link className="btn btn--ghost-on-dark" to="/contact">
              {t('home.ctaVisit')}
            </Link>
            <Link className="btn btn--ghost-on-dark" to="/partenariats">
              {t('home.ctaPartner')}
            </Link>
          </div>
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
          ) : (
            <p className="admin-muted">{t('home.partnersEmpty')}</p>
          )}
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
