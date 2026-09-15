import { useSearchParams, Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { PersonnelApplicationForm } from '../components/PersonnelApplicationForm'

/**
 * Page partageable type Google Form pour candidature carte de service.
 */
export function CardApplication() {
  const { t, locale, setLocale } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'

  return (
    <>
      <Seo
        title={t('cardApplication.metaTitle')}
        description={t('cardApplication.metaDesc')}
        path="/candidature-carte"
      />

      <div className="gform-page">
        <div className="gform-page__banner" aria-hidden="true" />
        <div className="gform-page__inner">
          <header className="gform-card gform-card--header">
            <div className="gform-card__accent" aria-hidden="true" />
            <div className="gform-card__top">
              <p className="gform-card__brand">GEACO SARL</p>
              <div className="gform-lang" role="group" aria-label="Language">
                <button type="button" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')}>
                  FR
                </button>
                <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>
                  EN
                </button>
              </div>
            </div>
            <h1 className="gform-card__title">{t('cardApplication.title')}</h1>
            <p className="gform-card__desc">{t('cardApplication.lead')}</p>
            <p className="gform-card__note">{t('cardApplication.approvalNote')}</p>
            <p className="gform-card__required-hint">{t('cardApplication.requiredHint')}</p>
          </header>

          {merci ? (
            <div className="gform-card gform-card--thanks">
              <ContactThanksBanner
                title={t('cardApplication.thanksTitle')}
                body={t('cardApplication.thanksBody')}
                closing={t('cardApplication.thanksClosing')}
                brand={t('cardApplication.thanksBrand')}
              />
              <p className="gform-card__back">
                <Link to="/">{t('cardApplication.backHome')}</Link>
              </p>
            </div>
          ) : (
            <PersonnelApplicationForm variant="gform" />
          )}

          <footer className="gform-page__footer">
            <p>{t('cardApplication.formFooter')}</p>
            <Link to="/">{t('cardApplication.backHome')}</Link>
          </footer>
        </div>
      </div>
    </>
  )
}
