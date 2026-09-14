import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const PARTNERSHIP_SUBJECT = '[GEACO] Proposition de partenariat'

const DOMAINE_SLUG_MAP = {
  agriculture: 0,
  construction: 1,
  wash: 2,
}

function trimOrNull(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

/**
 * Contact / devis → `public.site_lead_messages` ; partenariat → `public.site_partnership_messages`.
 * @param {{ source: 'contact' | 'partnership' | 'quote', redirectTo: string }} props
 */
export function LeadFormSupabase({ source, redirectTo }) {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const domainOptions = source === 'contact' ? t('contact.domainOptions') : []
  const safeDomainOptions = Array.isArray(domainOptions) ? domainOptions : []
  const domaineParam = params.get('domaine') || ''
  const initialDomainIndex = DOMAINE_SLUG_MAP[domaineParam]
  const initialDomain =
    typeof initialDomainIndex === 'number' && safeDomainOptions[initialDomainIndex]
      ? safeDomainOptions[initialDomainIndex]
      : ''

  const [subject, setSubject] = useState('')
  const [domain, setDomain] = useState(initialDomain)
  const [quoteKind, setQuoteKind] = useState('')
  const [siteLocation, setSiteLocation] = useState('')
  const [timeline, setTimeline] = useState('')
  const [fullName, setFullName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [gotcha, setGotcha] = useState('')

  const subjectOptions = source === 'contact' ? t('contact.subjectOptions') : []
  const safeSubjectOptions = Array.isArray(subjectOptions) ? subjectOptions : []
  const quoteProjectTypes = source === 'quote' ? t('quote.projectTypes') : []
  const safeQuoteTypes = Array.isArray(quoteProjectTypes) ? quoteProjectTypes : []

  function clearForm() {
    setSubject('')
    setDomain('')
    setQuoteKind('')
    setSiteLocation('')
    setTimeline('')
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
    const name = trimOrNull(fullName)
    const mail = trimOrNull(email)
    const msg = trimOrNull(message)
    const org = trimOrNull(organization)

    if (source === 'partnership') {
      const subj = PARTNERSHIP_SUBJECT
      if (!org || !name || !mail || !msg) {
        setError(t('partnerships.formValidationError'))
        return
      }
      if (msg.length < 10) {
        setError(t('partnerships.formValidationError'))
        return
      }
      setBusy(true)
      const { error: insErr } = await supabase.from('site_partnership_messages').insert({
        locale: loc,
        subject: subj,
        full_name: name,
        organization: org,
        email: mail,
        message: msg,
      })
      setBusy(false)
      if (insErr) {
        setError(insErr.message || t('forms.formErrorSend'))
        return
      }
      clearForm()
      navigate(redirectTo, { replace: false })
      return
    }

    const tel = trimOrNull(phone)
    if (!tel) {
      setError(t(source === 'quote' ? 'quote.formValidationError' : 'contact.formValidationError'))
      return
    }

    let finalSubject = ''
    let finalMessage = ''

    if (source === 'contact') {
      const dom = trimOrNull(domain)
      finalSubject = trimOrNull(subject)
      if (!dom || !finalSubject || !name || !org || !mail || !msg) {
        setError(t('contact.formValidationError'))
        return
      }
      finalSubject = `[${dom}] ${finalSubject}`.slice(0, 400)
      finalMessage = [`Domaine: ${dom}`, '', msg].join('\n')
    } else {
      const kind = trimOrNull(quoteKind)
      if (!kind || !name || !mail || !msg) {
        setError(t('quote.formValidationError'))
        return
      }
      const prefix = String(t('quote.subjectPrefix')).trim()
      finalSubject = `${prefix} — ${kind}`.slice(0, 400)
      const locLabel = trimOrNull(siteLocation) || '—'
      const timeLabel = trimOrNull(timeline) || '—'
      finalMessage = [
        `${String(t('quote.blockProjectType')).trim()}: ${kind}`,
        `${String(t('quote.blockSite')).trim()}: ${locLabel}`,
        `${String(t('quote.blockTimeline')).trim()}: ${timeLabel}`,
        '',
        `${String(t('quote.blockDetails')).trim()}:`,
        msg,
      ].join('\n')
    }

    if (!finalMessage || finalMessage.length < 10) {
      setError(t(source === 'quote' ? 'quote.formValidationError' : 'contact.formValidationError'))
      return
    }

    setBusy(true)
    const row = {
      source: source === 'quote' ? 'quote' : 'contact',
      locale: loc,
      subject: finalSubject,
      full_name: name,
      organization: org,
      email: mail,
      phone: tel,
      message: finalMessage.slice(0, 8000),
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

  const submitLabel =
    busy
      ? t('forms.formSending')
      : source === 'contact'
        ? t('contact.formSubmit')
        : source === 'quote'
          ? t('quote.formSubmit')
          : t('partnerships.formSubmit')

  const formClassName =
    source === 'quote' ? 'form form--quote-premium' : source === 'partnership' ? 'form form--partnership' : 'form'

  return (
    <form className={formClassName} onSubmit={onSubmit} noValidate>
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
          <label htmlFor="lead-domain">{t('contact.formDomain')}</label>
          <select id="lead-domain" value={domain} onChange={(e) => setDomain(e.target.value)} required>
            <option value="" disabled>
              {t('contact.formDomainPlaceholder')}
            </option>
            {safeDomainOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label htmlFor="lead-subject">{t('contact.formSubject')}</label>
          <select id="lead-subject" value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="" disabled>
              {t('contact.formSubjectPlaceholder')}
            </option>
            {safeSubjectOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

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

          <label htmlFor="lead-org-contact">{t('contact.formOrganization')}</label>
          <input
            id="lead-org-contact"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            maxLength={300}
            autoComplete="organization"
            placeholder={t('contact.formOrganizationPlaceholder')}
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
      ) : null}

      {source === 'quote' ? (
        <>
          <div className="quote-form__section">
            <h3 className="quote-form__section-title">{t('quote.sectionProject')}</h3>
            <div className="quote-form__field">
              <label htmlFor="lead-quote-kind">{t('quote.formProjectType')}</label>
              <select id="lead-quote-kind" value={quoteKind} onChange={(e) => setQuoteKind(e.target.value)} required>
                <option value="" disabled>
                  {t('quote.formProjectPlaceholder')}
                </option>
                {safeQuoteTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="quote-form__grid quote-form__grid--2">
              <div className="quote-form__field">
                <label htmlFor="lead-quote-site">{t('quote.formSite')}</label>
                <input
                  id="lead-quote-site"
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  maxLength={400}
                  autoComplete="street-address"
                  placeholder={t('quote.formSitePlaceholder')}
                />
              </div>
              <div className="quote-form__field">
                <label htmlFor="lead-quote-timeline">{t('quote.formTimeline')}</label>
                <input
                  id="lead-quote-timeline"
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  maxLength={200}
                  autoComplete="off"
                  placeholder={t('quote.formTimelinePlaceholder')}
                />
              </div>
            </div>
          </div>

          <div className="quote-form__section">
            <h3 className="quote-form__section-title">{t('quote.sectionContact')}</h3>
            <div className="quote-form__grid quote-form__grid--2">
              <div className="quote-form__field">
                <label htmlFor="lead-quote-name">{t('quote.formName')}</label>
                <input
                  id="lead-quote-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={200}
                  autoComplete="name"
                />
              </div>
              <div className="quote-form__field">
                <label htmlFor="lead-quote-email">{t('quote.formEmail')}</label>
                <input
                  id="lead-quote-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={254}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="quote-form__field">
              <label htmlFor="lead-quote-org">{t('quote.formOrganization')}</label>
              <input
                id="lead-quote-org"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                maxLength={300}
                autoComplete="organization"
                placeholder={t('quote.formOrganizationPlaceholder')}
              />
            </div>
            <div className="quote-form__field">
              <label htmlFor="lead-quote-phone">{t('quote.formPhone')}</label>
              <input
                id="lead-quote-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={60}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="quote-form__section">
            <h3 className="quote-form__section-title">{t('quote.sectionDetails')}</h3>
            <div className="quote-form__field">
              <label htmlFor="lead-quote-message">{t('quote.formMessage')}</label>
              <textarea
                id="lead-quote-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                minLength={10}
                maxLength={8000}
                rows={6}
                autoComplete="off"
              />
            </div>
          </div>
        </>
      ) : null}

      {source === 'partnership' ? (
        <>
          <div className="partnership-form__field">
            <label htmlFor="lead-org">{t('partnerships.formOrg')}</label>
            <input
              id="lead-org"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              maxLength={300}
              autoComplete="organization"
              placeholder={t('partnerships.formOrgPlaceholder')}
            />
          </div>

          <div className="partnership-form__grid">
            <div className="partnership-form__field">
              <label htmlFor="lead-pname">{t('partnerships.formName')}</label>
              <input
                id="lead-pname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={200}
                autoComplete="name"
                placeholder={t('partnerships.formNamePlaceholder')}
              />
            </div>
            <div className="partnership-form__field">
              <label htmlFor="lead-pemail">{t('partnerships.formEmail')}</label>
              <input
                id="lead-pemail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                autoComplete="email"
                placeholder={t('partnerships.formEmailPlaceholder')}
              />
            </div>
          </div>

          <div className="partnership-form__field">
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
              placeholder={t('partnerships.formMessagePlaceholder')}
            />
          </div>
        </>
      ) : null}

      {error ? (
        <p className={source === 'quote' ? 'admin-error quote-form__error' : 'admin-error'} role="alert">
          {error}
        </p>
      ) : null}

      <button
        className={
          source === 'quote'
            ? 'btn btn--primary btn--quote-submit'
            : source === 'partnership'
              ? 'btn btn--primary partnership-form__submit'
              : 'btn btn--primary'
        }
        type="submit"
        disabled={busy}
      >
        {submitLabel}
      </button>

      {source === 'quote' ? (
        <div className="quote-form__legal">
          <p className="form-note">{t('forms.privacyNote')}</p>
          <p className="form-note">{t('forms.storedInSupabase')}</p>
        </div>
      ) : source === 'partnership' ? (
        <p className="form-note partnership-form__note">{t('forms.privacyNote')}</p>
      ) : (
        <>
          <p className="form-note">{t('forms.privacyNote')}</p>
          <p className="form-note">{t('forms.storedInSupabase')}</p>
        </>
      )}
    </form>
  )
}
