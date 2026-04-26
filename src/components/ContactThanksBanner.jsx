import { useI18n } from '../i18n/useI18n'

/** Message de confirmation après envoi d’un formulaire (contact, devis ou partenariat). */
export function ContactThanksBanner({ variant = 'contact' }) {
  const { t } = useI18n()
  const isQuote = variant === 'quote'

  return (
    <div className="contact-thanks card" role="status" aria-live="polite">
      <h2 className="contact-thanks__title">{isQuote ? t('quote.thanksTitle') : t('contact.thanksTitle')}</h2>
      <p className="contact-thanks__body">{isQuote ? t('quote.thanksBody') : t('contact.thanksBody')}</p>
      <p className="contact-thanks__closing">{isQuote ? t('quote.thanksClosing') : t('contact.thanksClosing')}</p>
      <p className="contact-thanks__brand">{isQuote ? t('quote.thanksBrand') : t('contact.thanksBrand')}</p>
    </div>
  )
}
