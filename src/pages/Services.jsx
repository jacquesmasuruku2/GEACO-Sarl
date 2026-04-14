import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { SERVICE_ROUTES, serviceNavLabel } from '../data/servicesNav'

export function Services() {
  const { t } = useI18n()

  return (
    <>
      <Seo title={t('services.metaTitle')} description={t('services.metaDesc')} path="/services" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('services.title') },
        ]}
        title={t('services.title')}
        lead={t('services.lead')}
        heroImage="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section section--muted">
        <div className="container">
          <div className="section__head">
            <h2 className="section__title">{t('services.hub.chooseTitle')}</h2>
            <p>{t('services.hub.chooseLead')}</p>
          </div>
          <div className="card-grid">
            {SERVICE_ROUTES.map(({ slug, detailKey }) => {
              const title = serviceNavLabel(detailKey, t)
              const intro = t(`services.detail.${detailKey}.intro`)
              const lead = intro.length > 200 ? `${intro.slice(0, 197)}…` : intro
              return (
                <article className="card" key={slug}>
                  <h2 style={{ fontSize: '1.2rem' }}>{title}</h2>
                  <p>{lead}</p>
                  <Link className="btn btn--primary" to={`/services/${slug}`}>
                    {t('services.hub.cardCta')}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card">
            <h2 className="section__title">{t('services.commerce.title')}</h2>
            <p>{t('services.commerce.text')}</p>
          </div>
        </div>
      </section>
    </>
  )
}
