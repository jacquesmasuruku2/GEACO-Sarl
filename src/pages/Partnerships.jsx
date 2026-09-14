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
  const { rows: partners, loading } = useSitePartners()

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

  function partnerBlurb(partner) {
    return (
      String(partner?.partnership_motive ?? '').trim() ||
      String(partner?.notes ?? '').trim() ||
      String(partner?.subtitle ?? '').trim()
    )
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

      <section className="section partners-directory" aria-labelledby="partenaires-liste-title">
        <div className="container partners-directory__wrap">
          <header className="partners-directory__head">
            <h2 id="partenaires-liste-title">{t('partnerships.activeTitle')}</h2>
            <p>{t('partnerships.activeLead')}</p>
          </header>

          {loading ? <p className="form-note">{t('partnerships.loading')}</p> : null}

          {!loading && partners.length === 0 ? (
            <p className="form-note">{t('partnerships.activeEmpty')}</p>
          ) : null}

          {partners.length ? (
            <ul className="partners-directory__list">
              {partners.map((partner) => {
                const website = String(partner.website_url ?? '').trim()
                const blurb = partnerBlurb(partner)
                const subtitle = String(partner.subtitle ?? '').trim()
                return (
                  <li className="partners-directory__item" key={partner.id}>
                    <div className="partners-directory__logo" aria-hidden="true">
                      {hasLogoUrl(partner) ? (
                        <img src={String(partner.logo_url).trim()} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span>{getInitials(partner.name)}</span>
                      )}
                    </div>
                    <div className="partners-directory__body">
                      <h3>{partner.name}</h3>
                      {subtitle && subtitle !== blurb ? (
                        <p className="partners-directory__subtitle">{subtitle}</p>
                      ) : null}
                      {blurb ? <p className="partners-directory__blurb">{blurb}</p> : null}
                    </div>
                    <div className="partners-directory__actions">
                      {website ? (
                        <a
                          className="btn btn--outline"
                          href={website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t('partnerships.visitWebsite')}
                        </a>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}

          <div className="partners-directory__footer">
            <button type="button" className="btn btn--primary" onClick={scrollToPartnershipForm}>
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
