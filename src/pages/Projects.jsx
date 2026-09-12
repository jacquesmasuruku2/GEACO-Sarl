import { Link, Navigate, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useSiteProjects } from '../hooks/useSiteProjects'
import {
  formatProjectDate,
  plainExcerpt,
} from '../lib/projectDisplay'

function categoryFromPath(pathname) {
  if (pathname.startsWith('/projets/agriculture') || pathname.startsWith('/projets/agricoles')) return 'agricole'
  if (pathname.startsWith('/projets/wash')) return 'wash'
  if (pathname.startsWith('/projets/construction')) return 'construction'
  return null
}

export function Projects() {
  const { t, locale } = useI18n()
  const location = useLocation()

  if (location.pathname === '/projets/agricoles') {
    return <Navigate to="/projets/agriculture" replace />
  }

  const category = categoryFromPath(location.pathname)
  const { rows, loading, error } = useSiteProjects(category)
  const onlyConstruction = category === 'construction'
  const onlyAgricole = category === 'agricole'
  const onlyWash = category === 'wash'
  const isDomainPage = Boolean(category)

  const pageTitle = onlyConstruction
    ? t('projects.constructionTitle')
    : onlyAgricole
      ? t('projects.agricultureTitle')
      : onlyWash
        ? t('projects.washTitle')
        : t('projects.title')

  const pageLead = onlyConstruction
    ? t('projects.constructionHeroLead')
    : onlyAgricole
      ? t('projects.agricultureLead')
      : onlyWash
        ? t('projects.washLead')
        : t('projects.lead')

  const heroImage = onlyAgricole
    ? 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80'
    : onlyWash
      ? 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=1800&q=80'
      : '/media/geaco/geaco-construction-hero.png'

  const seoPath = onlyConstruction
    ? '/projets/construction'
    : onlyAgricole
      ? '/projets/agriculture'
      : onlyWash
        ? '/projets/wash'
        : '/projets'

  const filterLinks = [
    { to: '/projets', label: t('projects.filterAll') },
    { to: '/projets/agriculture', label: t('projects.agricultureTitle') },
    { to: '/projets/construction', label: t('projects.constructionTitle') },
    { to: '/projets/wash', label: t('projects.washTitle') },
  ]

  const grouped = {
    agricole: rows.filter((r) => r.project_category === 'agricole'),
    construction: rows.filter((r) => (r.project_category ?? 'construction') === 'construction'),
    wash: rows.filter((r) => r.project_category === 'wash'),
  }

  function renderArticleCard(project) {
    const cover = String(project.image_url ?? '').trim()
    const dateLabel = formatProjectDate(project.executed_at, locale)
    const excerpt = plainExcerpt(project.description, 200)
    return (
      <article className="project-blog-card" key={project.slug}>
        <Link to={`/projets/${project.slug}`} className="project-blog-card__link">
          <div className={`project-blog-card__media${!cover ? ' is-empty' : ''}`}>
            {cover ? <img src={cover} alt="" loading="lazy" decoding="async" /> : null}
          </div>
          <div className="project-blog-card__body">
            <div className="project-blog-card__meta">
              {project.tag ? <span>{project.tag}</span> : null}
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
  }

  function renderDomainSection(id, list, title, lead, showHeading) {
    return (
      <section className="projects-domain" id={id}>
        {showHeading ? (
          <header className="projects-domain__head">
            <h2 className="section__title">{title}</h2>
            {lead ? <p>{lead}</p> : null}
          </header>
        ) : null}
        {list.length ? (
          <div className="project-blog-grid">{list.map((project) => renderArticleCard(project))}</div>
        ) : (
          <p className="projects-empty">{t(`projects.empty${id === 'agricole' ? 'Agriculture' : id === 'wash' ? 'Wash' : 'Construction'}`)}</p>
        )}
      </section>
    )
  }

  return (
    <>
      <Seo title={`${pageTitle} — GEACO SARL`} description={pageLead} path={seoPath} />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { href: isDomainPage ? '/projets' : undefined, label: t('projects.title') },
          ...(isDomainPage ? [{ label: pageTitle }] : []),
        ]}
        title={pageTitle}
        lead={pageLead}
        heroImage={heroImage}
        actions={
          <>
            <Link className="btn btn--on-dark" to="/devis">
              {t('home.ctaQuote')}
            </Link>
            {onlyAgricole ? (
              <Link className="btn btn--ghost-on-dark" to="/projets/solution-cafe">
                {t('nav.projectsSolutionCafe')}
              </Link>
            ) : (
              <Link className="btn btn--ghost-on-dark" to="/services">
                {t('home.ctaExpertises')}
              </Link>
            )}
          </>
        }
      />

      <section className="section projects-page">
        <div className="container">
          <nav className="projects-filter-nav" aria-label={t('projects.filterLabel')}>
            {filterLinks.map((link) => {
              const active =
                location.pathname === link.to ||
                (link.to !== '/projets' && location.pathname.startsWith(link.to))
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={active ? 'is-active' : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {loading ? <p className="projects-empty">{t('projects.loading')}</p> : null}
          {error ? (
            <p className="admin-error" role="alert">
              {t('projects.loadError')}: {error.message}
            </p>
          ) : null}

          {!loading && !error && onlyAgricole ? (
            <aside className="project-featured-note">
              <p className="project-featured-note__kicker">{t('projects.agricultureTitle')}</p>
              <h2>{t('projects.solutionCafe.title')}</h2>
              <p>{t('projects.solutionCafe.lead')}</p>
              <Link className="projects-entry__link" to="/projets/solution-cafe">
                {t('projects.viewProject')}
              </Link>
            </aside>
          ) : null}

          {!loading && !error && !isDomainPage ? (
            <>
              {renderDomainSection(
                'agricole',
                grouped.agricole,
                t('projects.agricultureTitle'),
                t('projects.agricultureLead'),
                true,
              )}
              {renderDomainSection(
                'construction',
                grouped.construction,
                t('projects.constructionTitle'),
                t('projects.constructionHeroLead'),
                true,
              )}
              {renderDomainSection('wash', grouped.wash, t('projects.washTitle'), t('projects.washLead'), true)}
            </>
          ) : null}

          {!loading && !error && onlyAgricole
            ? renderDomainSection('agricole', grouped.agricole, pageTitle, null, false)
            : null}
          {!loading && !error && onlyConstruction
            ? renderDomainSection('construction', grouped.construction, pageTitle, null, false)
            : null}
          {!loading && !error && onlyWash
            ? renderDomainSection('wash', grouped.wash, pageTitle, null, false)
            : null}

          <aside className="projects-closing">
            <p>{t('projects.note')}</p>
            <div className="projects-closing__actions">
              <Link className="btn btn--primary" to="/devis">
                {t('home.ctaQuote')}
              </Link>
              <Link className="btn btn--outline" to="/contact">
                {t('home.ctaContact')}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
