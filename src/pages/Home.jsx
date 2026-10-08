import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PillarIcon } from '../components/PillarIcon'
import { PILLAR_ROUTES } from '../data/servicesNav'
import { useSiteFormations } from '../hooks/useSiteFormations'
import { useSitePartners } from '../hooks/useSitePartners'
import { formatFormationDate, formationPath } from '../lib/formationDisplay'
import { isFormationRegistrationOpen } from '../lib/formationStatus'

const PILLAR_META = {
  agriculture: {
    icon: 'agriculture',
    className: 'pillar-card--agriculture',
    href: '/domaines/agriculture',
  },
  construction: {
    icon: 'construction',
    className: 'pillar-card--construction',
    href: '/domaines/construction',
  },
  wash: {
    icon: 'wash',
    className: 'pillar-card--wash',
    href: '/domaines/wash',
  },
}

export function Home() {
  const { t, locale } = useI18n()
  const { rows: partners } = useSitePartners()
  const { rows: formationRows, loading: formationsLoading, error: formationsError } = useSiteFormations(locale)
  const heroSlides = [
    '/media/geaco/geaco-24.jpeg',
    '/media/geaco/geaco-29.jpeg',
    '/media/geaco/geaco-25.jpeg',
    '/media/geaco/geaco-16.jpeg',
  ]
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)

  const newsItems = t('home.newsItems')
  const stats = t('home.stats')
  const methodSteps = t('home.methodSteps')
  const safeNews = Array.isArray(newsItems) ? newsItems : []
  const safeStats = Array.isArray(stats) ? stats : []
  const safeMethod = Array.isArray(methodSteps) ? methodSteps : []
  const latestFormations = formationRows
    .filter((formation) => {
      const imageUrl = String(formation.image_url ?? '').trim()
      return isFormationRegistrationOpen(formation) && /^(https?:\/\/|\/)/i.test(imageUrl)
    })
    .sort((left, right) => {
      const leftStart = String(left.starts_on ?? '')
      const rightStart = String(right.starts_on ?? '')
      if (!leftStart) return 1
      if (!rightStart) return -1
      return leftStart.localeCompare(rightStart)
    })
    .slice(0, 3)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const intervalId = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length)
    }, 4000)
    return () => window.clearInterval(intervalId)
  }, [heroSlides.length])

  useEffect(() => {
    const revealElements = document.querySelectorAll('[data-home-reveal]')
    const revealAll = () => revealElements.forEach((element) => element.classList.add('is-visible'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealAll()
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
    )
    revealElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

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

  const pillars = PILLAR_ROUTES.map(({ slug, detailKey, image, imageAlt }) => {
    const meta = PILLAR_META[detailKey] || PILLAR_META.agriculture
    return {
      slug,
      detailKey,
      title: t(`services.${detailKey}.title`),
      short: t(`services.${detailKey}.short`),
      ...meta,
      image,
      imageAlt,
      href: `/domaines/${slug}`,
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
            <Link className="btn btn--on-dark" to="/domaines">
              {t('home.ctaExpertises')}
            </Link>
            <Link className="btn btn--ghost-on-dark" to="/devis">
              {t('home.ctaQuote')}
            </Link>
          </div>
        </div>
      </section>

      <section className="home-impact" aria-labelledby="home-impact-title">
        <div className="container">
          <h2 className="visually-hidden" id="home-impact-title">
            {t('home.statsSectionTitle')}
          </h2>
          <div className="home-impact__panel">
            <div className="home-impact__metrics">
              {safeStats.map((row) => (
                <div key={row.label} className="stat-block" data-home-reveal>
                  <div className="stat-block__value">{row.value}</div>
                  <p className="stat-block__label">{row.label}</p>
                </div>
              ))}
            </div>
            <Link className="home-impact__link" to="/projets" data-home-reveal>
              <span className="home-impact__eyebrow">
                {locale === 'en' ? 'Our impact' : 'Notre impact'}
              </span>
              <strong>{t('home.trustCta')}</strong>
              <span className="home-impact__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="expertises" aria-labelledby="pillars-title">
        <div className="container">
          <div className="section__head section__head--wide" data-home-reveal>
            <p className="section-kicker">{t('nav.solutions')}</p>
            <h2 id="pillars-title" className="section__title">
              {t('home.pillarsTitle')}
            </h2>
            <p>{t('home.pillarsLead')}</p>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className={`pillar-card ${pillar.className}`} key={pillar.slug} data-home-reveal>
                <div className="pillar-card__media">
                  <img src={pillar.image} alt={pillar.imageAlt} loading="lazy" decoding="async" />
                </div>
                <div className="pillar-card__content">
                  <div className="pillar-card__icon">
                    <PillarIcon name={pillar.icon} />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.short}</p>
                  <Link className="btn btn--outline pillar-card__cta" to={pillar.href}>
                    {t('home.pillarsCta')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-trainings" aria-labelledby="home-trainings-title">
        <div className="container">
          <header className="section__head section__head--wide home-trainings__head" data-home-reveal>
            <p className="section-kicker">{t('home.trainingKicker')}</p>
            <h2 id="home-trainings-title" className="section__title">
              {t('home.trainingTitle')}
            </h2>
            <p>{t('home.trainingLead')}</p>
          </header>

          {formationsLoading ? <p className="home-trainings__message">{t('formations.loading')}</p> : null}
          {formationsError ? (
            <p className="home-trainings__message" role="alert">
              {t('formations.loadError')}
            </p>
          ) : null}
          {!formationsLoading && !formationsError && latestFormations.length ? (
            <div className="home-trainings__grid">
              {latestFormations.map((formation) => {
                const startDate = formatFormationDate(formation.starts_on, locale)
                return (
                  <article className="home-training-card" key={formation.id} data-home-reveal>
                    <Link
                      className="home-training-card__media"
                      to={formationPath(formation.slug)}
                      aria-label={`${t('formations.readOffer')}: ${formation.title}`}
                    >
                      <img src={String(formation.image_url).trim()} alt="" loading="lazy" decoding="async" />
                    </Link>
                    <div className="home-training-card__body">
                      <p className="home-training-card__status">{t('formations.statusOpen')}</p>
                      <h3>
                        <Link to={formationPath(formation.slug)}>{formation.title}</Link>
                      </h3>
                      {formation.summary ? <p className="home-training-card__summary">{formation.summary}</p> : null}
                      <ul className="home-training-card__meta">
                        {startDate ? <li>{startDate}</li> : null}
                        {formation.location ? <li>{formation.location}</li> : null}
                      </ul>
                      <Link className="home-training-card__link" to={formationPath(formation.slug)}>
                        {t('formations.readOffer')}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}
          {!formationsLoading && !formationsError && !latestFormations.length ? (
            <p className="home-trainings__message">{t('formations.registrationClosed')}</p>
          ) : null}

          <p className="home-trainings__all">
            <Link className="btn btn--outline" to="/formations">
              {t('formations.backToList')}
            </Link>
          </p>
        </div>
      </section>

      <section className="section section--muted" aria-labelledby="integrated-title">
        <div className="container home-integrated">
          <div className="section__head section__head--wide" data-home-reveal>
            <p className="section-kicker">{locale === 'en' ? 'Approach' : 'Approche'}</p>
            <h2 id="integrated-title" className="section__title">
              {t('home.integratedTitle')}
            </h2>
            <p>{t('home.integratedLead')}</p>
          </div>
          <div className="home-integrated__links">
            <Link to="/domaines/agriculture" data-home-reveal>{t('services.agriculture.title')}</Link>
            <Link to="/domaines/construction" data-home-reveal>{t('services.construction.title')}</Link>
            <Link to="/domaines/wash" data-home-reveal>{t('services.wash.title')}</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="trust-title">
        <div className="container">
          <div className="section__head section__head--wide" data-home-reveal>
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
                data-home-reveal
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
          <div className="section__head section__head--wide" data-home-reveal>
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
              <li className="method-steps__item" key={step.title} data-home-reveal>
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

      <section className="section home-vision" data-home-reveal>
        <div className="container home-vision__inner">
          <div>
            <p className="section-kicker">{t('home.visionTitle')}</p>
            <h2 className="section__title">{t('home.statsSectionTitle')}</h2>
          </div>
          <p>{t('home.visionText')}</p>
          <Link className="btn btn--outline" to="/a-propos">
            {t('home.promoCta')}
          </Link>
        </div>
      </section>

      <section className="cta-band" data-home-reveal>
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

      <section className="section section--tight section--muted" data-home-reveal>
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
