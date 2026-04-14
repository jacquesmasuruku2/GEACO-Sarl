import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const PARTNERSHIP_SUBJECT = '[GEACO] Proposition de partenariat'

function trimOrNull(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

/**
 * Formulaire contact ou partenariat : enregistrement dans `public.site_lead_messages`.
 * @param {{ source: 'contact' | 'partnership', redirectTo: string }} props
 */
export function LeadFormSupabase({ source, redirectTo }) {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [subject, setSubject] = useState('')
  const [fullName, setFullName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [gotcha, setGotcha] = useState('')

  function clearForm() {
    setSubject('')
    setFullName('')
    setOrganization('')
    setEmail('')
    setPhone('')
    setMessage('')
    setGotcha('')
    setError('')
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="admin-card" style={{ padding: '1rem' }}>
        <p className="admin-error" style={{ margin: 0 }}>
          {t('forms.supabaseNotConfigured')}
        </p>
      </div>
    )
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (gotcha.trim() !== '') {
      clearForm()
      navigate(redirectTo, { replace: false })
      return
    }
    const loc = locale === 'en' ? 'en' : 'fr'
    const subj = source === 'partnership' ? PARTNERSHIP_SUBJECT : trimOrNull(subject)
    const name = trimOrNull(fullName)
    const mail = trimOrNull(email)
    const msg = trimOrNull(message)
    const org = source === 'partnership' ? trimOrNull(organization) : null
    const tel = source === 'contact' ? trimOrNull(phone) : null

    if (!subj || !name || !mail || !msg) {
      setError(t(source === 'contact' ? 'contact.formValidationError' : 'partnerships.formValidationError'))
      return
    }
    if (source === 'contact' && !tel) {
      setError(t('contact.formValidationError'))
      return
    }
    if (source === 'partnership' && !org) {
      setError(t('partnerships.formValidationError'))
      return
    }
    if (msg.length < 10) {
      setError(t(source === 'contact' ? 'contact.formValidationError' : 'partnerships.formValidationError'))
      return
    }

    setBusy(true)
    const row = {
      source,
      locale: loc,
      subject: subj,
      full_name: name,
      organization: org,
      email: mail,
      phone: tel,
      message: msg,
    }
    const { error: insErr } = await supabase.from('site_lead_messages').insert(row)
    setBusy(false)
    if (insErr) {
      setError(insErr.message || t('forms.formErrorSend'))
      return
    }
    clearForm()
    navigate(redirectTo, { replace: false })
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label className="visually-hidden" htmlFor="lead-gotcha">
        {t('forms.honeypot')}
      </label>
      <input
        type="text"
        id="lead-gotcha"
        value={gotcha}
        onChange={(e) => setGotcha(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="visually-hidden"
        aria-hidden="true"
      />

      {source === 'contact' ? (
        <>
          <label htmlFor="lead-subject">{t('contact.formSubject')}</label>
          <input
            id="lead-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={400}
            autoComplete="off"
          />

          <label htmlFor="lead-name">{t('contact.formName')}</label>
          <input
            id="lead-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={200}
            autoComplete="name"
          />

          <label htmlFor="lead-email">{t('contact.formEmail')}</label>
          <input
            id="lead-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            autoComplete="email"
          />

          <label htmlFor="lead-phone">{t('contact.formPhone')}</label>
          <input
            id="lead-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={60}
            autoComplete="tel"
          />

          <label htmlFor="lead-message">{t('contact.formMessage')}</label>
          <textarea
            id="lead-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            maxLength={8000}
            rows={5}
            autoComplete="off"
          />
        </>
      ) : (
        <>
          <label htmlFor="lead-org">{t('partnerships.formOrg')}</label>
          <input
            id="lead-org"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            maxLength={300}
            autoComplete="organization"
            aria-describedby="lead-org-hint"
          />
          <p id="lead-org-hint" className="form-note" style={{ marginTop: '0.35rem' }}>
            {t('partnerships.formOrgHint')}
          </p>

          <label htmlFor="lead-pname">{t('partnerships.formName')}</label>
          <input
            id="lead-pname"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={200}
            autoComplete="name"
          />

          <label htmlFor="lead-pemail">{t('partnerships.formEmail')}</label>
          <input
            id="lead-pemail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            autoComplete="email"
          />

          <label htmlFor="lead-pmsg">{t('partnerships.formMessage')}</label>
          <textarea
            id="lead-pmsg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            maxLength={8000}
            rows={5}
            autoComplete="off"
          />
        </>
      )}

      {error ? <p className="admin-error">{error}</p> : null}

      <button className="btn btn--primary" type="submit" disabled={busy}>
        {busy ? t('forms.formSending') : source === 'contact' ? t('contact.formSubmit') : t('partnerships.formSubmit')}
      </button>

      <p className="form-note">{t('forms.privacyNote')}</p>
      <p className="form-note">{t('forms.storedInSupabase')}</p>
    </form>
  )
}
