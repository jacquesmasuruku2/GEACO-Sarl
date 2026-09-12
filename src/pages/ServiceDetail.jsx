import { Navigate, useParams, Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { detailKeyFromSlug, isValidServiceSlug, SERVICE_SLUG_REDIRECTS } from '../data/servicesNav'
import { serviceKeyFromDetailKey } from '../lib/serviceDbKeys'
import { useSiteServiceContent } from '../hooks/useSiteServiceContent'
import { pickNonEmptyString, pickSections } from '../lib/mergePublishedContent'
import { PillarIcon } from '../components/PillarIcon'

function SectionBlock({ section }) {
  const hasTitle = Boolean(section.title?.trim())
  return (
    <div className="service-block">
      {hasTitle ? <h2 className="section__title">{section.title}</h2> : null}
      {section.text ? (
        <p
          style={{
            marginBottom: section.items?.length ? '1rem' : 0,
            fontStyle: hasTitle ? 'normal' : 'italic',
          }}
        >
          {section.text}
        </p>
      ) : null}
      {section.items?.length ? (
        <ul className="plain-list">
          {section.items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function ServiceDetail() {
  const { slug } = useParams()
  const { t } = useI18n()

  const redirectSlug = slug ? SERVICE_SLUG_REDIRECTS[slug] : null
  const valid = Boolean(slug && !redirectSlug && isValidServiceSlug(slug))
  const dk = valid && slug ? detailKeyFromSlug(slug) : null
  const dbKey = dk ? serviceKeyFromDetailKey(dk) : ''
  const { row: contentRow } = useSiteServiceContent(dbKey)

  if (redirectSlug) {
    return <Navigate to={`/services/${redirectSlug}`} replace />
  }

  if (!valid || !dk) {
    return <Navigate to="/services" replace />
  }

  const base = `services.detail.${dk}`
  const metaTitle = pickNonEmptyString(contentRow?.meta_title, t(`${base}.metaTitle`))
  const metaDesc = pickNonEmptyString(contentRow?.meta_description, t(`${base}.metaDesc`))
  const title = pickNonEmptyString(contentRow?.page_title, t(`${base}.title`))
  const intro = pickNonEmptyString(contentRow?.intro, t(`${base}.intro`))
  const i18nSections = t(`${base}.sections`)
  const sections = pickSections(contentRow?.sections, Array.isArray(i18nSections) ? i18nSections : [])
  const heroFromDb = pickNonEmptyString(contentRow?.hero_image_url, '')
  const heroRaw = heroFromDb || t(`${base}.heroImage`)
  const heroImage = typeof heroRaw === 'string' && heroRaw.startsWith('http') ? heroRaw : undefined
  const projectBadge = dk === 'solutionCafe' ? t(`${base}.projectBadge`) : null
  const deliverables = t(`${base}.deliverables`)
  const safeDeliverables = Array.isArray(deliverables) ? deliverables : []
  const approachTitle = t(`${base}.approachTitle`)
  const approachText = t(`${base}.approachText`)
  const iconName =
    dk === 'agriculture' ? 'agriculture' : dk === 'construction' ? 'construction' : dk === 'wash' ? 'wash' : 'agriculture'
  const pillarClass =
    dk === 'agriculture'
      ? 'service-pillar-badge--agriculture'
      : dk === 'construction'
        ? 'service-pillar-badge--construction'
        : dk === 'wash'
          ? 'service-pillar-badge--wash'
          : 'service-pillar-badge--cafe'

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} path={`/services/${slug}`} />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { href: '/services', label: t('nav.services') },
          { label: title },
        ]}
        title={title}
        lead={intro}
        heroImage={heroImage || undefined}
      />

      <section className="section">
        <div className="container service-detail-layout">
          <div className="service-detail-main">
            {projectBadge ? <p className={`service-pillar-badge ${pillarClass}`}>{projectBadge}</p> : null}

            {approachTitle && typeof approachTitle === 'string' && !approachTitle.includes('approachTitle') ? (
              <div className="service-block">
                <div className={`service-pillar-badge ${pillarClass}`}>
                  <PillarIcon name={iconName} className="pillar-icon pillar-icon--sm" />
                  <span>{approachTitle}</span>
                </div>
                {approachText && typeof approachText === 'string' && !approachText.includes('approachText') ? (
                  <p>{approachText}</p>
                ) : null}
              </div>
            ) : null}

            {Array.isArray(sections) && sections.map((section, i) => <SectionBlock key={i} section={section} />)}

            {safeDeliverables.length ? (
              <div className="service-block service-block--deliverables">
                <h2 className="section__title">{t('services.hub.deliverablesTitle')}</h2>
                <ul className="plain-list">
                  {safeDeliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="service-detail-aside">
            <div className="service-cta-card">
              <h2>{t('services.hub.contextualCtaTitle')}</h2>
              <p>{t('services.hub.contextualCtaLead')}</p>
              <Link className="btn btn--primary" to={`/devis?domaine=${encodeURIComponent(slug)}`}>
                {t('services.hub.quoteCta')}
              </Link>
              <Link className="btn btn--outline" to={`/contact?domaine=${encodeURIComponent(slug)}`}>
                {t('services.hub.contactCta')}
              </Link>
              <Link className="btn btn--ghost" to="/services">
                {t('services.hub.backToHub')}
              </Link>
              <div className="service-cta-card__quick">
                <a className="btn btn--on-dark" href="https://wa.me/243977472158" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
                <a className="btn btn--ghost" href="mailto:geacosarl@gmail.com">
                  Email
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
