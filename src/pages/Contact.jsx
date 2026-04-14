import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { ExternalLeadForm } from '../components/ExternalLeadForm'
import { SocialFollowBlock } from '../components/SocialFollowBlock'

const GOMA_MAP_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=29.165%2C-1.705%2C29.295%2C-1.625&layer=mapnik'
const GOMA_LINK = 'https://www.openstreetmap.org/?mlat=-1.665&mlon=29.23#map=13/-1.665/29.23'

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
            <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--color-green-bright)' }}>
              <p style={{ margin: 0, color: 'var(--color-green)' }}>{t('contact.thanks')}</p>
            </div>
          ) : null}

          <div className="split split--2">
            <div className="card">
              <h2>{t('contact.formTitle')}</h2>
              <ExternalLeadForm redirectPath="/contact?merci=1">
                <label htmlFor="subject">{t('contact.formSubject')}</label>
                <input id="subject" name="_subject" type="text" required />

                <label htmlFor="cname">{t('contact.formName')}</label>
                <input id="cname" name="Nom" type="text" required />

                <label htmlFor="cemail">{t('contact.formEmail')}</label>
                <input id="cemail" name="Email" type="email" required />

                <label htmlFor="cphone">{t('contact.formPhone')}</label>
                <input id="cphone" name="Téléphone" type="tel" />

                <label htmlFor="cmsg">{t('contact.formMessage')}</label>
                <textarea id="cmsg" name="Message" required />

                <button className="btn btn--primary" type="submit">
                  {t('contact.formSubmit')}
                </button>
              </ExternalLeadForm>
            </div>

            <div>
              <h2 className="section__title">{t('contact.addressesTitle')}</h2>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3>{t('contact.goma')}</h3>
                <p style={{ margin: 0 }}>
                  46, Avenue Erengeti, Quartier Kyeshero, Commune de Goma, Ville de Goma, Nord-Kivu, RDC.
                </p>
              </div>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3>{t('contact.butembo')}</h3>
                <p style={{ margin: 0 }}>
                  275, Cellule MIHAKE, Quartier KAMESI MBONZO, Commune de Bulengera, Ville de Butembo, Nord-Kivu,
                  RDC.
                </p>
              </div>
              <p>
                <strong>Email :</strong>{' '}
                <a href="mailto:geacosarl@gmail.com">geacosarl@gmail.com</a>
                <br />
                <strong>Tél. :</strong> <a href="tel:+243808368955">+243 808 368 955</a> ·{' '}
                <a href="tel:+243977472158">097 747 2158</a>
              </p>

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
                src={GOMA_MAP_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="form-note">
                <a href={GOMA_LINK} target="_blank" rel="noreferrer">
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
