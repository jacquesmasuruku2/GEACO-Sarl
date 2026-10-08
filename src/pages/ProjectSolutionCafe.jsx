import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'
import { SITE_CONTACT } from '../data/siteContact'

export function ProjectSolutionCafe() {
  const { t, locale } = useI18n()
  const steps = t('projects.solutionCafe.steps')
  const safeSteps = Array.isArray(steps) ? steps : []

  return (
    <>
      <Seo
        title={t('projects.solutionCafe.metaTitle')}
        description={t('projects.solutionCafe.metaDesc')}
        path="/projets/solution-cafe"
      />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { href: '/projets', label: t('projects.title') },
          { href: '/projets/agriculture', label: t('projects.agricultureTitle') },
          { label: t('projects.solutionCafe.title') },
        ]}
        title={t('projects.solutionCafe.title')}
        lead={t('projects.solutionCafe.lead')}
        heroImage="https://images.unsplash.com/photo-1447933601408-4c668d815b56?auto=format&fit=crop&w=1800&q=80"
        actions={
          <>
            <Link className="btn btn--on-dark" to="/devis?domaine=agriculture">
              {t('home.ctaQuote')}
            </Link>
            <Link className="btn btn--ghost-on-dark" to="/projets/agriculture">
              {t('projects.agricultureTitle')}
            </Link>
          </>
        }
      />

      <section className="section service-detail-page">
        <div className="container" style={{ maxWidth: '46rem' }}>
          <p className="projects-entry__meta">
            <span>{t('projects.agricultureTitle')}</span>
            <span>{t('projects.solutionCafe.status')}</span>
          </p>

          <section className="service-section service-section--approach">
            <h2 className="service-section__title">{t('projects.solutionCafe.activityTitle')}</h2>
            <p className="service-section__text">{t('projects.solutionCafe.activityText')}</p>
          </section>

          <section className="service-section">
            <h2 className="service-section__title">{t('projects.solutionCafe.chainTitle')}</h2>
            <ol className="service-section__list" style={{ listStyle: 'decimal' }}>
              {safeSteps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  {step.text ? <> — {step.text}</> : null}
                </li>
              ))}
            </ol>
          </section>

          <section className="service-section">
            <h2 className="service-section__title">{t('projects.solutionCafe.offerTitle')}</h2>
            <ul className="service-section__list">
              {(Array.isArray(t('projects.solutionCafe.offerItems'))
                ? t('projects.solutionCafe.offerItems')
                : []
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <aside className="service-closing">
            <h2 className="service-section__title">{t('projects.solutionCafe.ctaTitle')}</h2>
            <p>{t('projects.solutionCafe.ctaLead')}</p>
            <div className="service-closing__actions">
              <Link className="btn btn--primary" to="/devis?domaine=agriculture">
                {t('projects.ctaSimilar')}
              </Link>
              <Link className="btn btn--outline" to="/contact?domaine=agriculture">
                {t('home.ctaContact')}
              </Link>
            </div>
            <div className="service-closing__direct">
              <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp {SITE_CONTACT.whatsappDisplay}
              </a>
              {SITE_CONTACT.emails.map((email) => (
                <a key={email} href={`mailto:${email}`}>
                  {email}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
