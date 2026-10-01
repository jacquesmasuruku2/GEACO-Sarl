import { Link, useSearchParams } from 'react-router-dom'
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
        heroImage="/media/geaco/contact.jpg"
      />

      <section className="section contact-page">
        <div className="container contact-page__wrap">
          {merci ? (
            <div className="contact-page__thanks">
              <ContactThanksBanner />
            </div>
          ) : null}

          <header className="contact-page__head">
            <h2>{t('contact.formTitle')}</h2>
            <p>{t('contact.formIntro')}</p>
          </header>

          <LeadFormSupabase source="contact" redirectTo="/contact?merci=1" />

          <div className="contact-page__quick">
            <p className="contact-page__quick-label">{t('contact.quickContactTitle')}</p>
            <div className="contact-quick-actions">
              <a
                className="btn btn--outline"
                href={SITE_CONTACT.whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                {t('contact.quickWhatsapp')}
              </a>
              <a className="btn btn--outline" href={`mailto:${SITE_CONTACT.email}`}>
                {SITE_CONTACT.email}
              </a>
              <a className="btn btn--outline" href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>
                {SITE_CONTACT.phonePrimaryDisplay}
              </a>
            </div>
            <p className="contact-page__offices-note">
              {t('contact.officesNote')}{' '}
              <Link to="/a-propos">{t('contact.officesLink')}</Link>
            </p>
            <SocialFollowBlock
              variant="iconsOnly"
              navLabel={t('contact.followTitle')}
              facebookLabel={t('contact.followFacebook')}
              linkedinLabel={t('contact.followLinkedin')}
            />
          </div>
        </div>
      </section>
    </>
  )
}
