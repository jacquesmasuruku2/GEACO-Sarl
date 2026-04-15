import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { useSiteProjects } from '../hooks/useSiteProjects'
import { RichTextContent } from '../components/RichTextContent'

export function Projects() {
  const { t } = useI18n()
  const { rows } = useSiteProjects()
  const fallback = t('projects.items')
  const fallbackList = Array.isArray(fallback) ? fallback : []
  const items =
    rows.length > 0
      ? rows.map((r) => ({
          key: r.slug,
          title: r.title,
          tag: r.tag,
          desc: r.description,
          impact: r.impact,
        }))
      : fallbackList.map((p, i) => ({
          key: p.title + String(i),
          title: p.title,
          tag: p.tag,
          desc: p.desc,
          impact: p.impact,
        }))

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
        heroImage="https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {items.map((project) => (
              <article className="card" key={project.key}>
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
            ))}
          </div>

          <p style={{ marginTop: '2rem' }}>{t('projects.note')}</p>
          <Link className="btn btn--primary" to="/contact" style={{ marginTop: '0.75rem' }}>
            {t('home.ctaContact')}
          </Link>
        </div>
      </section>
    </>
  )
}
