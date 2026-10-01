import { Navigate, useParams, Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { detailKeyFromSlug, isValidServiceSlug, SERVICE_ROUTES, SERVICE_SLUG_REDIRECTS } from '../data/servicesNav'
import { serviceKeyFromDetailKey } from '../lib/serviceDbKeys'
import { useSiteServiceContent } from '../hooks/useSiteServiceContent'
import { pickNonEmptyString, pickSections } from '../lib/mergePublishedContent'
import { PillarIcon } from '../components/PillarIcon'
import { SITE_CONTACT } from '../data/siteContact'

function SectionBlock({ section }) {
  const hasTitle = Boolean(section.title?.trim())
  return (
    <section className="service-section">
      {hasTitle ? <h2 className="service-section__title">{section.title}</h2> : null}
      {section.text ? <p className="service-section__text">{section.text}</p> : null}
      {section.items?.length ? (
        <ul className="service-section__list">
          {section.items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
    </section>
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
    return <Navigate to={`/domaines/${redirectSlug}`} replace />
  }

  if (!valid || !dk) {
    return <Navigate to="/domaines" replace />
  }

  const base = `services.detail.${dk}`
  const metaTitle = pickNonEmptyString(contentRow?.meta_title, t(`${base}.metaTitle`))
  const metaDesc = pickNonEmptyString(contentRow?.meta_description, t(`${base}.metaDesc`))
  const title = pickNonEmptyString(contentRow?.page_title, t(`${base}.title`))
  const intro = pickNonEmptyString(contentRow?.intro, t(`${base}.intro`))
  const i18nSections = t(`${base}.sections`)
  const sections = pickSections(contentRow?.sections, Array.isArray(i18nSections) ? i18nSections : [])
  const heroFromDb = pickNonEmptyString(contentRow?.hero_image_url, '')
  const domainImage = SERVICE_ROUTES.find((route) => route.detailKey === dk)?.image
  const heroRaw = heroFromDb || domainImage || t(`${base}.heroImage`)
  const heroImage = typeof heroRaw === 'string' && /^(https?:\/\/|\/)/i.test(heroRaw) ? heroRaw : undefined
  const deliverables = t(`${base}.deliverables`)
  const safeDeliverables = Array.isArray(deliverables) ? deliverables : []
  const approachTitle = t(`${base}.approachTitle`)
  const approachText = t(`${base}.approachText`)
  const hasApproach =
    typeof approachTitle === 'string' &&
    !approachTitle.includes('approachTitle') &&
    approachTitle.trim().length > 0
  const hasApproachText =
    typeof approachText === 'string' &&
    !approachText.includes('approachText') &&
    approachText.trim().length > 0

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

  const projectsHref =
    dk === 'agriculture'
      ? '/projets/agriculture'
      : dk === 'construction'
        ? '/projets/construction'
        : dk === 'wash'
          ? '/projets/wash'
          : '/projets'

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} path={`/domaines/${slug}`} />

      <PageHero
        className={`page-hero--domain${dk === 'agriculture' ? ' page-hero--agriculture' : ''}`}
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { href: '/domaines', label: t('nav.solutions') },
          { label: title },
        ]}
        title={title}
        lead={intro}
        heroImage={heroImage || undefined}
        actions={
          <>
            <Link className="btn btn--on-dark" to={`/devis?domaine=${encodeURIComponent(slug)}`}>
              {t('services.hub.quoteCta')}
            </Link>
            <Link className="btn btn--ghost-on-dark" to={projectsHref}>
              {t('nav.projects')}
            </Link>
          </>
        }
      />

      <section className={`section service-detail-page${dk === 'agriculture' ? ' service-detail-page--agriculture' : ''}`}>
        <div className="container service-detail-layout">
          <div className="service-detail-main">
            {hasApproach ? (
              <section className="service-section service-section--approach">
                <div className={`service-pillar-badge ${pillarClass}`}>
                  <PillarIcon name={iconName} className="pillar-icon pillar-icon--sm" />
                  <span>{approachTitle}</span>
                </div>
                {hasApproachText ? <p className="service-section__text">{approachText}</p> : null}
              </section>
            ) : null}

            {Array.isArray(sections) && sections.map((section, i) => <SectionBlock key={i} section={section} />)}

            {safeDeliverables.length ? (
              <section className="service-section service-section--deliverables">
                <h2 className="service-section__title">{t('services.hub.deliverablesTitle')}</h2>
                <ul className="service-section__list">
                  {safeDeliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <aside className="service-closing">
              <h2 className="service-section__title">{t('services.hub.contextualCtaTitle')}</h2>
              <p>{t('services.hub.contextualCtaLead')}</p>
              <div className="service-closing__actions">
                <Link className="btn btn--primary" to={`/devis?domaine=${encodeURIComponent(slug)}`}>
                  {t('services.hub.quoteCta')}
                </Link>
                <Link className="btn btn--outline" to={`/contact?domaine=${encodeURIComponent(slug)}`}>
                  {t('services.hub.contactCta')}
                </Link>
                <Link className="btn btn--ghost" to="/domaines">
                  {t('services.hub.backToHub')}
                </Link>
              </div>
              <div className="service-closing__direct">
                <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
                  WhatsApp {SITE_CONTACT.whatsappDisplay}
                </a>
                <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
                <a href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>{SITE_CONTACT.phonePrimaryDisplay}</a>
              </div>
            </aside>
          </div>

          <aside className="service-detail-aside" aria-label={t('services.hub.contextualCtaTitle')}>
            <p className="service-aside__kicker">{t('nav.solutions')}</p>
            <p className="service-aside__lead">{t('services.hub.contextualCtaLead')}</p>
            <Link className="service-aside__link" to={`/devis?domaine=${encodeURIComponent(slug)}`}>
              {t('services.hub.quoteCta')}
            </Link>
            <Link className="service-aside__link" to={`/contact?domaine=${encodeURIComponent(slug)}`}>
              {t('services.hub.contactCta')}
            </Link>
            <Link className="service-aside__link" to={projectsHref}>
              {t('nav.projects')}
            </Link>
            <Link className="service-aside__link" to="/domaines">
              {t('services.hub.backToHub')}
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
