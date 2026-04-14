import { useI18n } from '../i18n/useI18n'

/** Message de confirmation après envoi d’un formulaire (contact ou partenariat). */
export function ContactThanksBanner() {
  const { t } = useI18n()

  return (
    <div className="contact-thanks card" role="status" aria-live="polite">
      <h2 className="contact-thanks__title">{t('contact.thanksTitle')}</h2>
      <p className="contact-thanks__body">{t('contact.thanksBody')}</p>
      <p className="contact-thanks__closing">{t('contact.thanksClosing')}</p>
      <p className="contact-thanks__brand">{t('contact.thanksBrand')}</p>
    </div>
  )
}
