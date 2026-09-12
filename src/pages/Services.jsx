import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { PillarIcon } from '../components/PillarIcon'
import { SERVICE_ROUTES, serviceNavLabel } from '../data/servicesNav'

const PILLAR_CLASS = {
  agriculture: 'pillar-card--agriculture',
  construction: 'pillar-card--construction',
  wash: 'pillar-card--wash',
  solutionCafe: 'pillar-card--cafe',
}

const PILLAR_ICON = {
  agriculture: 'agriculture',
  construction: 'construction',
  wash: 'wash',
  solutionCafe: 'agriculture',
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

      <section className="section section--muted">
        <div className="container">
          <div className="section__head section__head--wide">
            <h2 className="section__title">{t('services.hub.chooseTitle')}</h2>
            <p>{t('services.hub.chooseLead')}</p>
          </div>
          <div className="pillar-grid">
            {SERVICE_ROUTES.map(({ slug, detailKey }) => {
              const title = serviceNavLabel(detailKey, t)
              const short =
                detailKey === 'solutionCafe'
                  ? t('services.detail.solutionCafe.intro')
                  : t(`services.${detailKey}.short`)
              const lead = String(short).length > 180 ? `${String(short).slice(0, 177)}…` : short
              return (
                <article className={`pillar-card ${PILLAR_CLASS[detailKey] || ''}`} key={slug}>
                  <div className="pillar-card__icon">
                    <PillarIcon name={PILLAR_ICON[detailKey] || 'agriculture'} />
                  </div>
                  <h3>{title}</h3>
                  <p>{lead}</p>
                  <Link className="btn btn--primary pillar-card__cta" to={`/services/${slug}`}>
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
