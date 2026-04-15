import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useSiteProjects } from '../hooks/useSiteProjects'
import { RichTextContent } from '../components/RichTextContent'

export function Projects() {
  const { t } = useI18n()
  const location = useLocation()
  const { rows } = useSiteProjects()
  const fallback = t('projects.items')
  const fallbackList = Array.isArray(fallback) ? fallback : []
  const items =
    rows.length > 0
      ? rows.map((r) => ({
          key: r.slug,
          title: r.title,
          tag: r.tag,
          projectCategory: r.project_category ?? 'construction',
          imageUrl: r.image_url ?? '',
          desc: r.description,
          impact: r.impact,
        }))
      : fallbackList.map((p, i) => ({
          key: p.title + String(i),
          title: p.title,
          tag: p.tag,
          projectCategory: /agron|agri|hydro/i.test(String(p.tag ?? '')) ? 'agricole' : 'construction',
          imageUrl: '',
          desc: p.desc,
          impact: p.impact,
        }))

  const categorized = {
    construction: items.filter((project) => (project.projectCategory ?? 'construction') === 'construction'),
    agricole: items.filter((project) => project.projectCategory === 'agricole'),
  }

  const onlyConstruction = location.pathname.startsWith('/projets/construction')
  const onlyAgricole = location.pathname.startsWith('/projets/agricoles')
  const showConstruction = !onlyAgricole
  const showAgricole = !onlyConstruction
  const heroImage = onlyAgricole
    ? 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=80'
    : 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1800&q=80'

  function renderProjectCard(project) {
    const imageUrl = String(project.imageUrl ?? '').trim()
    return (
      <article className="card" key={project.key}>
        {imageUrl ? (
          <div className="project-card__media">
            <img src={imageUrl} alt={project.title} loading="lazy" decoding="async" />
          </div>
        ) : null}
        <span className="tag">{project.tag}</span>
        <h2 style={{ fontSize: '1.2rem' }}>{project.title}</h2>
        <RichTextContent value={project.desc} className="projects-rich-text" />
        {project.impact ? (
          <>
            <p className="projects-impact-label">
              <strong style={{ color: 'var(--color-vinci-blue)' }}>{t('projects.impactLabel')} :</strong>
            </p>
            <RichTextContent value={project.impact} className="projects-rich-text" />
          </>
        ) : null}
      </article>
    )
  }

  return (
    <>
      <Seo title={t('projects.metaTitle')} description={t('projects.metaDesc')} path="/projets" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('projects.title') },
        ]}
        title={t('projects.title')}
        lead={t('projects.lead')}
        heroImage={heroImage}
      />

      <section className="section">
        <div className="container">
          {showConstruction ? (
            <>
              <div className="section__head">
                <h2 className="section__title">{t('projects.constructionTitle')}</h2>
              </div>
              <div className="card-grid">{categorized.construction.map((project) => renderProjectCard(project))}</div>
            </>
          ) : null}

          {showAgricole ? (
            <>
              <div className="section__head" style={{ marginTop: showConstruction ? '1.6rem' : 0 }}>
                <h2 className="section__title">{t('projects.agricultureTitle')}</h2>
              </div>
              <div className="card-grid">{categorized.agricole.map((project) => renderProjectCard(project))}</div>
            </>
          ) : null}

          <p style={{ marginTop: '2rem' }}>{t('projects.note')}</p>
          <Link className="btn btn--primary" to="/contact" style={{ marginTop: '0.75rem' }}>
            {t('home.ctaContact')}
          </Link>
        </div>
      </section>
    </>
  )
}
