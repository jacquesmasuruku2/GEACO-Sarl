import { useI18n } from '../i18n/useI18n'

const FORMSUBMIT_ACTION = 'https://formsubmit.co/geacosarl@gmail.com'

/**
 * Enveloppe formulaire pour hébergement statique (Vercel) — envoi via FormSubmit.
 * Inclure un champ `name="_subject"` (visible ou caché) dans `children` pour l’objet du mail.
 */
export function ExternalLeadForm({ redirectPath = '/contact?merci=1', children }) {
  const { t } = useI18n()
  const base = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const next = base ? `${base}${redirectPath}` : null

  return (
    <form action={FORMSUBMIT_ACTION} method="POST" className="form">
      {next ? <input type="hidden" name="_next" value={next} /> : null}
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />

      <label className="visually-hidden" htmlFor="_gotcha">
        {t('forms.honeypot')}
      </label>
      <input
        type="text"
        id="_gotcha"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="visually-hidden"
        aria-hidden="true"
      />

      {children}

      <p className="form-note">{t('forms.privacyNote')}</p>
      <p className="form-note">{t('forms.poweredBy')}</p>
    </form>
  )
}
