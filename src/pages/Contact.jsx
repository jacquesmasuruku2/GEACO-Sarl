import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { LeadFormSupabase } from '../components/LeadFormSupabase'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { SocialFollowBlock } from '../components/SocialFollowBlock'
import { SITE_CONTACT } from '../data/siteContact'

export function Contact() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'

  return (
    <>
      <Seo title={t('contact.metaTitle')} description={t('contact.metaDesc')} path="/contact" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('contact.title') },
        ]}
        title={t('contact.title')}
        lead={t('contact.lead')}
        heroImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          {merci ? (
            <div style={{ marginBottom: '1.75rem' }}>
              <ContactThanksBanner />
            </div>
          ) : null}

          <div className="split split--2 contact-layout">
            <div className="card contact-form-card">
              <h2>{t('contact.formTitle')}</h2>
              <LeadFormSupabase source="contact" redirectTo="/contact?merci=1" />
            </div>

            <div className="contact-details">
              <h2 className="section__title">{t('contact.quickContactTitle')}</h2>
              <div className="contact-quick-actions">
                <a
                  className="btn btn--primary"
                  href={SITE_CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('contact.quickWhatsapp')}
                </a>
                <a className="btn btn--outline" href={`mailto:${SITE_CONTACT.email}`}>
                  {t('contact.quickEmail')}
                </a>
                <a className="btn btn--outline" href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>
                  {SITE_CONTACT.phonePrimaryDisplay}
                </a>
              </div>

              <h2 className="section__title">{t('contact.addressesTitle')}</h2>
              <div className="card contact-address-card">
                <h3>{SITE_CONTACT.offices.goma.label}</h3>
                <p style={{ margin: 0 }}>{SITE_CONTACT.offices.goma.address}</p>
              </div>
              <div className="card contact-address-card">
                <h3>{SITE_CONTACT.offices.butembo.label}</h3>
                <p style={{ margin: 0 }}>{SITE_CONTACT.offices.butembo.address}</p>
              </div>
              <div className="contact-meta" role="group" aria-label="Coordonnées de contact">
                <p className="contact-meta__line">
                  <strong>Email :</strong>{' '}
                  <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
                </p>
                <p className="contact-meta__line">
                  <strong>Tél. :</strong>{' '}
                  <a href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>{SITE_CONTACT.phonePrimaryDisplay}</a>
                </p>
                <p className="contact-meta__line">
                  <strong>WhatsApp :</strong>{' '}
                  <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
                    {SITE_CONTACT.whatsappDisplay}
                  </a>
                </p>
              </div>

              <SocialFollowBlock
                variant="card"
                title={t('contact.followTitle')}
                lead={t('contact.followLead')}
                facebookLabel={t('contact.followFacebook')}
                linkedinLabel={t('contact.followLinkedin')}
              />

              <h2 className="section__title" style={{ marginTop: '1.5rem' }}>
                {t('contact.mapTitle')}
              </h2>
              <iframe
                title="Carte OpenStreetMap — Goma"
                className="map-embed"
                src={SITE_CONTACT.map.embedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="form-note">
                <a href={SITE_CONTACT.map.link} target="_blank" rel="noreferrer">
                  OpenStreetMap — agrandir la carte
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
