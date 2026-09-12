import { Link, Navigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { useSiteProject } from '../hooks/useSiteProjects'
import { RichTextContent } from '../components/RichTextContent'
import { formatProjectDate, projectCategoryPath, projectCategoryLabel } from '../lib/projectDisplay'

const RESERVED = new Set(['construction', 'agriculture', 'agricoles', 'wash', 'solution-cafe'])

export function ProjectDetail() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const { row, loading, error } = useSiteProject(slug || '')

  if (slug && RESERVED.has(slug)) {
    const to =
      slug === 'agricoles' ? '/projets/agriculture' : slug === 'solution-cafe' ? '/projets/solution-cafe' : `/projets/${slug}`
    return <Navigate to={to} replace />
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="projects-empty">{t('projects.loading')}</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="admin-error" role="alert">
            {t('projects.loadError')}: {error.message}
          </p>
        </div>
      </section>
    )
  }

  if (!row) {
    return <Navigate to="/projets" replace />
  }

  const categoryPath = projectCategoryPath(row.project_category)
  const categoryLabel = projectCategoryLabel(row.project_category, t)
  const executedLabel = formatProjectDate(row.executed_at, locale)
  const cover = String(row.image_url ?? '').trim()

  return (
    <>
      <Seo
        title={`${row.title} — GEACO SARL`}
        description={String(row.description || row.tag || row.title).replace(/<[^>]+>/g, '').slice(0, 160)}
        path={`/projets/${row.slug}`}
      />

      <article className="project-article">
        {cover ? (
          <div className="project-article__hero">
            <img src={cover} alt="" />
            <div className="project-article__hero-veil" aria-hidden="true" />
          </div>
        ) : (
          <div className="project-article__hero project-article__hero--plain" aria-hidden="true" />
        )}

        <div className="container project-article__inner">
          <nav className="breadcrumb project-article__breadcrumb" aria-label="Fil d’Ariane">
            <Link to="/">{t('nav.home')}</Link>
            <span className="breadcrumb__sep">›</span>
            <Link to="/projets">{t('projects.title')}</Link>
            <span className="breadcrumb__sep">›</span>
            <Link to={categoryPath}>{categoryLabel}</Link>
            <span className="breadcrumb__sep">›</span>
            <span aria-current="page">{row.title}</span>
          </nav>

          <header className="project-article__header">
            <div className="project-article__meta">
              {row.tag ? <span>{row.tag}</span> : null}
              <span>{categoryLabel}</span>
              {executedLabel ? <time dateTime={row.executed_at}>{executedLabel}</time> : null}
              {row.location ? <span>{row.location}</span> : null}
            </div>
            <h1>{row.title}</h1>
          </header>

          <div className="project-article__body">
            <RichTextContent value={row.description} className="projects-rich-text project-article__content" />

            {row.impact ? (
              <section className="project-article__impact">
                <h2>{t('projects.impactLabel')}</h2>
                <RichTextContent value={row.impact} className="projects-rich-text" />
              </section>
            ) : null}
          </div>

          <footer className="project-article__footer">
            <Link className="btn btn--primary" to="/devis">
              {t('projects.ctaSimilar')}
            </Link>
            <Link className="btn btn--outline" to={categoryPath}>
              {t('projects.backToCategory')}
            </Link>
          </footer>
        </div>
      </article>
    </>
  )
}
