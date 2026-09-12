import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { PillarIcon } from '../components/PillarIcon'
import { SERVICE_ROUTES, serviceNavLabel } from '../data/servicesNav'

const PILLAR_ICON = {
  agriculture: 'agriculture',
  construction: 'construction',
  wash: 'wash',
}

const PILLAR_TONE = {
  agriculture: 'service-hub-row--agriculture',
  construction: 'service-hub-row--construction',
  wash: 'service-hub-row--wash',
}

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

      <section className="section">
        <div className="container">
          <div className="section__head section__head--wide">
            <h2 className="section__title">{t('services.hub.chooseTitle')}</h2>
            <p>{t('services.hub.chooseLead')}</p>
          </div>

          <div className="service-hub-list">
            {SERVICE_ROUTES.map(({ slug, detailKey }) => {
              const title = serviceNavLabel(detailKey, t)
              const short = t(`services.${detailKey}.short`)
              const lead = String(short).length > 200 ? `${String(short).slice(0, 197)}…` : short
              return (
                <article className={`service-hub-row ${PILLAR_TONE[detailKey] || ''}`} key={slug}>
                  <div className="service-hub-row__icon" aria-hidden="true">
                    <PillarIcon name={PILLAR_ICON[detailKey] || 'agriculture'} />
                  </div>
                  <div className="service-hub-row__body">
                    <h3>{title}</h3>
                    <p>{lead}</p>
                    <Link className="service-hub-row__link" to={`/services/${slug}`}>
                      {t('services.hub.cardCta')}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="service-hub-commerce">
            <h2 className="service-section__title">{t('services.commerce.title')}</h2>
            <p>{t('services.commerce.text')}</p>
            <p style={{ marginTop: '1rem' }}>
              <Link className="service-hub-row__link" to="/projets/solution-cafe">
                {t('nav.projectsSolutionCafe')} →
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
