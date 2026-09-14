import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { isFormationRegistrationOpen } from '../lib/formationStatus'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

function trimOrNull(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

/**
 * Inscription à une formation publiée.
 * @param {{
 *   formations: Array<object>,
 *   redirectTo?: string,
 *   preselectId?: string,
 *   lockFormation?: boolean,
 *   onSuccess?: () => void,
 * }} props
 */
export function FormationRegistrationForm({
  formations,
  redirectTo = '/formations?merci=1',
  preselectId = '',
  lockFormation = false,
  onSuccess,
}) {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [consent, setConsent] = useState(false)
  const [gotcha, setGotcha] = useState('')
  const [formationId, setFormationId] = useState(preselectId || '')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organization, setOrganization] = useState('')
  const [motivation, setMotivation] = useState('')

  const openFormations = useMemo(
    () => (Array.isArray(formations) ? formations.filter((f) => isFormationRegistrationOpen(f)) : []),
    [formations],
  )

  useEffect(() => {
    const fromQuery = params.get('formation') || ''
    if (preselectId && openFormations.some((f) => f.id === preselectId)) {
      setFormationId(preselectId)
      return
    }
    if (fromQuery && openFormations.some((f) => f.id === fromQuery || f.slug === fromQuery)) {
      const match = openFormations.find((f) => f.id === fromQuery || f.slug === fromQuery)
      if (match) setFormationId(match.id)
    }
  }, [params, preselectId, openFormations])

  if (!isSupabaseConfigured || !supabase) {
    return (
      <p className="admin-error" role="alert">
        {t('forms.supabaseNotConfigured')}
      </p>
    )
  }

  if (!openFormations.length) {
    return <p className="form-note">{t('formations.registrationClosed')}</p>
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (gotcha.trim() !== '') {
      navigate(redirectTo, { replace: false })
      return
    }
    if (!consent) {
      setError(t('forms.consentRequired'))
      return
    }
    const selected = openFormations.find((f) => f.id === formationId)
    const name = trimOrNull(fullName)
    const mail = trimOrNull(email)
    const msg = trimOrNull(motivation)
    if (!selected || !name || !mail || !msg || msg.length < 10) {
      setError(t('formations.formValidationError'))
      return
    }

    setBusy(true)
    const { error: insErr } = await supabase.from('site_formation_registrations').insert({
      formation_id: selected.id,
      formation_title: selected.title,
      locale: locale === 'en' ? 'en' : 'fr',
      full_name: name,
      email: mail,
      phone: trimOrNull(phone),
      organization: trimOrNull(organization),
      motivation: msg,
    })
    setBusy(false)
    if (insErr) {
      setError(insErr.message || t('forms.formErrorSend'))
      return
    }
    setConsent(false)
    setGotcha('')
    setFullName('')
    setEmail('')
    setPhone('')
    setOrganization('')
    setMotivation('')
    if (typeof onSuccess === 'function') onSuccess()
    navigate(redirectTo, { replace: false })
  }

  return (
    <form className="form form--simple" onSubmit={onSubmit} noValidate>
      <label className="visually-hidden" htmlFor="formation-gotcha">
        {t('forms.honeypot')}
      </label>
      <input
        id="formation-gotcha"
        type="text"
        value={gotcha}
        onChange={(e) => setGotcha(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="visually-hidden"
        aria-hidden="true"
      />

      {lockFormation && formationId ? (
        <input type="hidden" name="formation_id" value={formationId} />
      ) : (
        <div className="simple-form__field">
          <label htmlFor="formation-pick">{t('formations.formFormation')}</label>
          <select
            id="formation-pick"
            value={formationId}
            onChange={(e) => setFormationId(e.target.value)}
            required
          >
            <option value="" disabled>
              {t('formations.formFormationPlaceholder')}
            </option>
            {openFormations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="formation-name">{t('formations.formName')}</label>
          <input
            id="formation-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={200}
            autoComplete="name"
            placeholder={t('formations.formNamePlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="formation-email">{t('formations.formEmail')}</label>
          <input
            id="formation-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            autoComplete="email"
            placeholder={t('formations.formEmailPlaceholder')}
          />
        </div>
      </div>

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="formation-phone">{t('formations.formPhone')}</label>
          <input
            id="formation-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={60}
            autoComplete="tel"
            placeholder={t('formations.formPhonePlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="formation-org">{t('formations.formOrganization')}</label>
          <input
            id="formation-org"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            maxLength={300}
            autoComplete="organization"
            placeholder={t('formations.formOrganizationPlaceholder')}
          />
        </div>
      </div>

      <div className="simple-form__field">
        <label htmlFor="formation-motivation">{t('formations.formMotivation')}</label>
        <textarea
          id="formation-motivation"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          required
          minLength={10}
          maxLength={4000}
          rows={4}
          placeholder={t('formations.formMotivationPlaceholder')}
        />
      </div>

      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="form-consent">
        <p className="form-note">{t('forms.privacyNote')}</p>
        <p className="form-note">{t('forms.storedInSupabase')}</p>
        <label className="form-consent__check" htmlFor="formation-consent">
          <input
            id="formation-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>{t('forms.consentAccept')}</span>
        </label>
      </div>

      <button className="btn btn--primary simple-form__submit" type="submit" disabled={busy || !consent}>
        {busy ? t('forms.formSending') : t('formations.formSubmit')}
      </button>
    </form>
  )
}
