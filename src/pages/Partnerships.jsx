import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { LeadFormSupabase } from '../components/LeadFormSupabase'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { useSitePartners } from '../hooks/useSitePartners'

export function Partnerships() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'
  const types = t('partnerships.types')
  const typesList = Array.isArray(types) ? types : []
  const { rows: partners } = useSitePartners()
  const carouselItems = partners.length ? [...partners, ...partners] : []

  function getInitials(name) {
    return String(name ?? '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0] ?? '')
      .join('')
      .toUpperCase()
  }

  function hasLogoUrl(partner) {
    return String(partner?.logo_url ?? '').trim().length > 0
  }

  function scrollToPartnershipForm() {
    const target = document.getElementById('formulaire-partenariat')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <Seo title={t('partnerships.metaTitle')} description={t('partnerships.metaDesc')} path="/partenariats" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('partnerships.title') },
        ]}
        title={t('partnerships.title')}
        lead={t('partnerships.lead')}
        heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section section--muted partners-showcase">
        <div className="container">
          <div className="partners-showcase__head">
            <h2 className="partners-showcase__title">
              <span>Nos </span>
              <span className="is-accent">Partenaires</span>
            </h2>
          </div>
          <p className="partners-showcase__lead">{t('partnerships.activeLead')}</p>
          {partners.length ? (
            <div className="partners-carousel" role="region" aria-label={t('partnerships.activeTitle')}>
              <div className="partners-carousel__track">
                {carouselItems.map((p, index) => (
                  <article className="partners-logo-card" key={`${p.id}-${index}`}>
                    <div className="partners-logo-card__logo" aria-hidden="true">
                      {hasLogoUrl(p) ? (
                        <img src={String(p.logo_url).trim()} alt="" loading="lazy" decoding="async" />
                      ) : (
                        getInitials(p.name)
                      )}
                    </div>
                    <h3>{p.name}</h3>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('partnerships.activeEmpty')}</p>
          )}
          <div className="partners-showcase__footer">
            <button
              type="button"
              className="btn btn--primary partners-showcase__cta"
              onClick={scrollToPartnershipForm}
            >
              {t('partnerships.becomePartner')}
            </button>
          </div>
        </div>
      </section>

      <section className="section partners-form-section" id="formulaire-partenariat" aria-labelledby="partenariat-form-title">
        <div className="container partners-form-wrap">
          {merci ? (
            <div className="partners-form-thanks">
              <ContactThanksBanner />
            </div>
          ) : null}

          <header className="partners-form-head">
            <h2 id="partenariat-form-title">{t('partnerships.formTitle')}</h2>
            <p>{t('partnerships.formIntro')}</p>
          </header>

          {typesList.length ? (
            <div className="partners-form-types">
              <p className="partners-form-types__label">{t('partnerships.typesTitle')}</p>
              <ul>
                {typesList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <LeadFormSupabase source="partnership" redirectTo="/partenariats?merci=1" />
        </div>
      </section>
    </>
  )
}
