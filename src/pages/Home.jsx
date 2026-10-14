import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PillarIcon } from '../components/PillarIcon'
import { PILLAR_ROUTES } from '../data/servicesNav'
import { useSiteFormations } from '../hooks/useSiteFormations'
import { useSitePartners } from '../hooks/useSitePartners'
import { useSitePersonnel } from '../hooks/useSitePersonnel'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { useSiteProjects } from '../hooks/useSiteProjects'
import { formatFormationDate, formationPath } from '../lib/formationDisplay'
import { formatProjectDate, plainExcerpt, projectCategoryLabel } from '../lib/projectDisplay'
import { resolveFormationRegistrationStatus } from '../lib/formationStatus'
import { slugifyPersonnel } from '../lib/personnelSlug'

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
  const { rows: blogPosts, loading: blogLoading, error: blogError } = useBlogPosts(locale, 3, true, true)
  const { groups: personnelGroups, loading: personnelLoading } = useSitePersonnel(locale)
  const { rows: projectRows, loading: projectsLoading, error: projectsError } = useSiteProjects()
  const heroSlides = [
    '/media/geaco/geaco-24.jpeg',
    '/media/geaco/geaco-29.jpeg',
    '/media/geaco/equipe.jpg',
    '/media/geaco/geaco-25.jpeg',
    '/media/geaco/geaco-16.jpeg',
  ]
  const [activeHeroSlide, setActiveHeroSlide] = useState(0)

  const stats = t('home.stats')
  const safeStats = Array.isArray(stats) ? stats : []
  const partnersWithLogos = partners.filter((partner) => String(partner.logo_url ?? '').trim())
  const fallbackPersonnelGroups = t('personnel.staffGroups')
  const latestImageBlogPosts = blogPosts.filter((post) => {
    const imageUrl = String(post.hero_image_url ?? '').trim()
    return imageUrl.startsWith('https://') || imageUrl.startsWith('http://') || imageUrl.startsWith('/')
  })
  const personnelMembers = (
    personnelGroups.length
      ? personnelGroups.flatMap((group) => group.members ?? [])
      : Array.isArray(fallbackPersonnelGroups)
        ? fallbackPersonnelGroups.flatMap((group) => group.members ?? [])
        : []
  ).slice(0, 4)
  const recentProjects = [...projectRows]
    .sort((left, right) => {
      const leftDate = Date.parse(String(left.executed_at ?? ''))
      const rightDate = Date.parse(String(right.executed_at ?? ''))
      const leftHasDate = Number.isFinite(leftDate)
      const rightHasDate = Number.isFinite(rightDate)
      if (leftHasDate && rightHasDate && leftDate !== rightDate) return rightDate - leftDate
      if (leftHasDate !== rightHasDate) return leftHasDate ? -1 : 1
      return Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0)
    })
    .slice(0, 3)
  const latestFormations = formationRows
    .slice()
    .sort((left, right) => {
      const createdDifference =
        Date.parse(String(right.created_at ?? '')) - Date.parse(String(left.created_at ?? ''))
      if (Number.isFinite(createdDifference) && createdDifference !== 0) return createdDifference
      return String(right.starts_on ?? '').localeCompare(String(left.starts_on ?? ''))
    })
    .slice(0, 4)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timeoutId = window.setTimeout(() => {
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length)
    }, 6500)
    return () => window.clearTimeout(timeoutId)
  }, [activeHeroSlide, heroSlides.length])

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
  }, [
    formationRows,
    formationsLoading,
    blogPosts,
    blogLoading,
    personnelGroups,
    personnelLoading,
    projectRows,
    projectsLoading,
    projectsError,
  ])

  function getPersonnelInitials(name) {
    const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean)
    if (!parts.length) return '?'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
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

      <section
        className="home-hero-immersive"
        aria-label={locale === 'en' ? 'GEACO presentation' : 'Présentation de GEACO'}
        aria-roledescription="carousel"
      >
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
          <div className="home-hero-immersive__controls">
              <div
                className="home-hero-immersive__indicators"
                role="group"
                aria-label={locale === 'en' ? 'Choose a slide' : 'Choisir une diapositive'}
              >
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide}
                    type="button"
                    className={`home-hero-immersive__indicator${index === activeHeroSlide ? ' is-active' : ''}`}
                    aria-label={
                      locale === 'en'
                        ? `Go to slide ${index + 1} of ${heroSlides.length}`
                        : `Aller à la diapositive ${index + 1} sur ${heroSlides.length}`
                    }
                    aria-pressed={index === activeHeroSlide}
                    onClick={() => setActiveHeroSlide(index)}
                  >
                    <span className="home-hero-immersive__indicator-track" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <span className="home-hero-immersive__counter" aria-live="polite" aria-atomic="true">
                {String(activeHeroSlide + 1).padStart(2, '0')}
                <span aria-hidden="true"> / </span>
                {String(heroSlides.length).padStart(2, '0')}
              </span>
              <div className="home-hero-immersive__arrows">
                <button
                  type="button"
                  className="home-hero-immersive__arrow"
                  aria-label={locale === 'en' ? 'Previous slide' : 'Diapositive précédente'}
                  onClick={() =>
                    setActiveHeroSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)
                  }
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  className="home-hero-immersive__arrow"
                  aria-label={locale === 'en' ? 'Next slide' : 'Diapositive suivante'}
                  onClick={() => setActiveHeroSlide((current) => (current + 1) % heroSlides.length)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
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
                const status = resolveFormationRegistrationStatus(formation)
                const imageUrl = String(formation.image_url ?? '').trim()
                return (
                  <article className="home-training-card" key={formation.id} data-home-reveal>
                    {imageUrl ? (
                      <Link
                        className="home-training-card__media"
                        to={formationPath(formation.slug)}
                        aria-label={`${t('formations.readOffer')}: ${formation.title}`}
                      >
                        <img src={imageUrl} alt="" loading="lazy" decoding="async" />
                      </Link>
                    ) : null}
                    <div className="home-training-card__body">
                      <p className={`home-training-card__status home-training-card__status--${status}`}>
                        {t(`formations.status${status[0].toUpperCase()}${status.slice(1)}`)}
                      </p>
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
            <p className="home-trainings__message">{t('formations.empty')}</p>
          ) : null}

          <p className="home-trainings__all">
            <Link className="btn btn--outline" to="/formations">
              {t('formations.backToList')}
            </Link>
          </p>
        </div>
      </section>

      {blogError ? (
        <p className="home-blog__error" role="alert">
          {t('blog.loadError')}
        </p>
      ) : null}
      {!blogLoading && !blogError && latestImageBlogPosts.length ? (
        <section className="section home-blog" aria-labelledby="home-blog-title">
          <div className="container">
            <header className="section__head section__head--wide home-blog__head" data-home-reveal>
              <h2 id="home-blog-title" className="section__title">
                {t('home.blogSectionTitle')}
              </h2>
            </header>
            <div className="home-blog__grid">
              {latestImageBlogPosts.map((post) => {
                const imageUrl = String(post.hero_image_url ?? '').trim()
                return (
                  <article className="home-blog-card" key={post.slug} data-home-reveal>
                    <Link
                      className="home-blog-card__link"
                      to={`/blog/${post.slug}`}
                      aria-label={post.title}
                    >
                      <span className="home-blog-card__media">
                        <img src={imageUrl} alt="" loading="lazy" decoding="async" />
                      </span>
                      <span className="home-blog-card__title">{post.title}</span>
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {personnelMembers.length ? (
        <section className="section home-personnel" aria-labelledby="home-personnel-title">
          <div className="container">
            <header className="personnel-page__intro home-personnel__intro" data-home-reveal>
              <p className="personnel-page__kicker">{t('personnel.expertsKicker')}</p>
              <h2 className="personnel-page__title" id="home-personnel-title">
                {t('personnel.expertsTitle')}
              </h2>
              <p className="personnel-page__lead">{t('personnel.expertsLead')}</p>
            </header>
            <div className="personnel-grid personnel-grid--compact home-personnel__grid">
              {personnelMembers.map((member, index) => {
                const photoUrl = String(member.photo_url ?? '').trim()
                const hasPhoto = /^(https?:\/\/|\/)/i.test(photoUrl)
                const profileSlug = String(member.slug ?? '').trim() || slugifyPersonnel(member.name)
                const profileHref = member.slug ? `/personnel/${profileSlug}` : '/personnel'
                return (
                  <article className="personnel-profile" key={member.id ?? `${member.name}-${index}`} data-home-reveal>
                    <Link
                      to={profileHref}
                      className="personnel-profile__media personnel-profile__media--button"
                      aria-label={`${t('personnel.openProfile')} — ${member.name}`}
                    >
                      {hasPhoto ? (
                        <img src={photoUrl} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className="personnel-profile__initials" aria-hidden="true">
                          {getPersonnelInitials(member.name)}
                        </span>
                      )}
                    </Link>
                    <div className="personnel-profile__body">
                      <h3 className="personnel-profile__name">
                        <Link className="personnel-profile__name-btn" to={profileHref}>
                          {member.name}
                        </Link>
                      </h3>
                      {member.role ? <p className="personnel-profile__role">{member.role}</p> : null}
                      {member.focus ? <p className="personnel-profile__focus">{member.focus}</p> : null}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

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

      <section className="section home-projects" aria-labelledby="trust-title">
        <div className="container">
          <div className="section__head section__head--wide" data-home-reveal>
            <p className="section-kicker">{t('nav.projects')}</p>
            <h2 id="trust-title" className="section__title">
              {t('home.trustTitle')}
            </h2>
            <p>{t('home.trustLead')}</p>
          </div>
          {projectsLoading ? <p className="projects-empty">{t('projects.loading')}</p> : null}
          {projectsError ? (
            <p className="admin-error" role="alert">
              {t('projects.loadError')}: {projectsError.message}
            </p>
          ) : null}
          {!projectsLoading && !projectsError && recentProjects.length ? (
            <div className="project-blog-grid home-projects__grid">
              {recentProjects.map((project) => {
                const cover = String(project.image_url ?? '').trim()
                const dateLabel = formatProjectDate(project.executed_at, locale)
                const excerpt = plainExcerpt(project.description, 150)
                return (
                  <article className="project-blog-card" key={project.slug} data-home-reveal>
                    <Link to={`/projets/${project.slug}`} className="project-blog-card__link">
                      <div className={`project-blog-card__media${cover ? '' : ' is-empty'}`}>
                        {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : null}
                      </div>
                      <div className="project-blog-card__body">
                        <div className="project-blog-card__meta">
                          <span>{projectCategoryLabel(project.project_category, t)}</span>
                          {dateLabel ? <time dateTime={project.executed_at}>{dateLabel}</time> : null}
                          {project.location ? <span>{project.location}</span> : null}
                        </div>
                        <h2>{project.title}</h2>
                        {excerpt ? <p>{excerpt}</p> : null}
                        <span className="project-blog-card__cta">{t('projects.readArticle')}</span>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          ) : null}
          {!projectsLoading && !projectsError && !recentProjects.length ? (
            <p className="projects-empty">{t('home.projectsEmpty')}</p>
          ) : null}
          <p style={{ marginTop: '1.25rem' }}>
            <Link className="btn btn--outline" to="/projets">
              {t('home.trustCta')}
            </Link>
          </p>
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

      <section className="section section--tight section--muted" data-home-reveal>
        <div className="container">
          <div className="partners-showcase__head">
            <h2 className="partners-showcase__title">
              <span>Nos </span>
              <span className="is-accent">Partenaires</span>
            </h2>
          </div>
          <p className="partners-showcase__lead">{t('home.partnersTeaser')}</p>
          {partnersWithLogos.length ? (
            <div className="home-partner-logos" aria-label={t('home.partnersTeaserTitle')}>
              {partnersWithLogos.map((partner) => (
                <img
                  key={partner.id}
                  src={String(partner.logo_url).trim()}
                  alt={partner.name}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          ) : (
            <p className="admin-muted">{partners.length ? t('home.partnerLogosEmpty') : t('home.partnersEmpty')}</p>
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
