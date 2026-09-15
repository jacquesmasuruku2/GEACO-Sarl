import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SITE_CONTACT } from '../data/siteContact'

function trimOrNull(v) {
  if (v == null) return null
  const s = String(v).trim()
  return s === '' ? null : s
}

function sanitizeName(name) {
  return String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function GformQuestion({
  id,
  label,
  required = false,
  hint = '',
  children,
}) {
  return (
    <div className={`gform-card gform-question${required ? ' is-required' : ''}`}>
      <label className="gform-question__label" htmlFor={id}>
        {label}
        {required ? <span className="gform-question__star" aria-hidden="true"> *</span> : null}
      </label>
      {hint ? <p className="gform-question__hint">{hint}</p> : null}
      <div className="gform-question__control">{children}</div>
    </div>
  )
}

/**
 * Formulaire public partageable pour candidature carte / fiche équipe.
 * @param {{ redirectTo?: string, variant?: 'simple' | 'gform' }} props
 */
export function PersonnelApplicationForm({
  redirectTo = '/candidature-carte?merci=1',
  variant = 'gform',
}) {
  const { t, locale } = useI18n()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [consent, setConsent] = useState(false)
  const [gotcha, setGotcha] = useState('')
  const [lastName, setLastName] = useState('')
  const [postName, setPostName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [sex, setSex] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const [address, setAddress] = useState(SITE_CONTACT.offices.goma.shortAddress)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [notes, setNotes] = useState('')

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="gform-card">
        <p className="admin-error" role="alert">
          {t('forms.supabaseNotConfigured')}
        </p>
      </div>
    )
  }

  async function uploadPhoto(file) {
    if (!file || !supabase) return
    setUploading(true)
    setError('')
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const fileName = sanitizeName(file.name.replace(/\.[^/.]+$/, '')) || `photo-${Date.now()}`
    const path = `applications/${Date.now()}-${fileName}.${ext}`
    const { error: uploadErr } = await supabase.storage.from('site-media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadErr) {
      setUploading(false)
      setError(t('cardApplication.uploadError'))
      return
    }
    const { data } = supabase.storage.from('site-media').getPublicUrl(path)
    setPhotoUrl(data.publicUrl)
    setUploading(false)
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
    const ln = trimOrNull(lastName)
    const fn = trimOrNull(firstName)
    const roleVal = trimOrNull(role)
    const mail = trimOrNull(email)
    if (!ln || !fn || !roleVal || !mail) {
      setError(t('cardApplication.validationError'))
      return
    }

    setBusy(true)
    const { error: insErr } = await supabase.from('site_personnel_applications').insert({
      locale: locale === 'en' ? 'en' : 'fr',
      status: 'pending',
      last_name: ln,
      post_name: trimOrNull(postName),
      first_name: fn,
      sex: trimOrNull(sex),
      birth_place: trimOrNull(birthPlace),
      birth_date: birthDate || null,
      role: roleVal,
      department: trimOrNull(department),
      address: trimOrNull(address),
      email: mail,
      phone: trimOrNull(phone),
      photo_url: trimOrNull(photoUrl),
      blood_group: trimOrNull(bloodGroup),
      notes: trimOrNull(notes),
    })
    setBusy(false)
    if (insErr) {
      setError(
        insErr.message.includes('site_personnel_applications') || insErr.message.includes('blood_group')
          ? `${insErr.message} — ${t('cardApplication.migrationHint')}`
          : insErr.message || t('forms.formErrorSend'),
      )
      return
    }
    navigate(redirectTo, { replace: false })
  }

  const isGform = variant === 'gform'

  return (
    <form
      className={isGform ? 'gform-form' : 'form form--simple card-apply-form'}
      onSubmit={onSubmit}
      noValidate
    >
      <label className="visually-hidden" htmlFor="card-apply-gotcha">
        {t('forms.honeypot')}
      </label>
      <input
        id="card-apply-gotcha"
        type="text"
        value={gotcha}
        onChange={(e) => setGotcha(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="visually-hidden"
        aria-hidden="true"
      />

      <GformQuestion id="card-apply-last" label={t('cardApplication.lastName')} required>
        <input
          id="card-apply-last"
          className="gform-input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          maxLength={120}
          autoComplete="family-name"
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-post" label={t('cardApplication.postName')}>
        <input
          id="card-apply-post"
          className="gform-input"
          value={postName}
          onChange={(e) => setPostName(e.target.value)}
          maxLength={120}
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-first" label={t('cardApplication.firstName')} required>
        <input
          id="card-apply-first"
          className="gform-input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          maxLength={120}
          autoComplete="given-name"
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-sex" label={t('cardApplication.sex')}>
        <div className="gform-radio-group" role="radiogroup" aria-labelledby="card-apply-sex-label">
          <span id="card-apply-sex-label" className="visually-hidden">
            {t('cardApplication.sex')}
          </span>
          <label className="gform-radio">
            <input
              type="radio"
              name="card-apply-sex"
              value="Masculin"
              checked={sex === 'Masculin'}
              onChange={(e) => setSex(e.target.value)}
            />
            <span>{t('cardApplication.sexMale')}</span>
          </label>
          <label className="gform-radio">
            <input
              type="radio"
              name="card-apply-sex"
              value="Féminin"
              checked={sex === 'Féminin'}
              onChange={(e) => setSex(e.target.value)}
            />
            <span>{t('cardApplication.sexFemale')}</span>
          </label>
        </div>
      </GformQuestion>

      <GformQuestion id="card-apply-birth-place" label={t('cardApplication.birthPlace')}>
        <input
          id="card-apply-birth-place"
          className="gform-input"
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
          maxLength={200}
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-birth-date" label={t('cardApplication.birthDate')}>
        <input
          id="card-apply-birth-date"
          className="gform-input gform-input--date"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-role" label={t('cardApplication.role')} required>
        <input
          id="card-apply-role"
          className="gform-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          maxLength={200}
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-dept" label={t('cardApplication.department')}>
        <input
          id="card-apply-dept"
          className="gform-input"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          maxLength={200}
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-address" label={t('cardApplication.address')}>
        <input
          id="card-apply-address"
          className="gform-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={400}
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-email" label={t('cardApplication.email')} required>
        <input
          id="card-apply-email"
          className="gform-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
          autoComplete="email"
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-phone" label={t('cardApplication.phone')}>
        <input
          id="card-apply-phone"
          className="gform-input"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={60}
          autoComplete="tel"
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <GformQuestion id="card-apply-blood" label={t('cardApplication.bloodGroup')}>
        <input
          id="card-apply-blood"
          className="gform-input"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          maxLength={20}
          placeholder={t('cardApplication.bloodGroupPlaceholder')}
        />
      </GformQuestion>

      <GformQuestion
        id="card-apply-photo"
        label={t('cardApplication.photo')}
        hint={uploading ? t('cardApplication.uploading') : t('cardApplication.photoHint')}
      >
        <label className="gform-file">
          <span className="gform-file__btn">{t('cardApplication.addFile')}</span>
          <input
            id="card-apply-photo"
            type="file"
            accept="image/*"
            disabled={uploading || busy}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadPhoto(file)
              e.target.value = ''
            }}
          />
        </label>
        {photoUrl ? (
          <div className="gform-photo-preview">
            <img src={photoUrl} alt="" />
          </div>
        ) : null}
      </GformQuestion>

      <GformQuestion id="card-apply-notes" label={t('cardApplication.notes')}>
        <textarea
          id="card-apply-notes"
          className="gform-input gform-input--area"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder={t('cardApplication.yourAnswer')}
        />
      </GformQuestion>

      <div className="gform-card gform-question">
        <p className="gform-question__hint">{t('forms.privacyNote')}</p>
        <label className="gform-check" htmlFor="card-apply-consent">
          <input
            id="card-apply-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>{t('forms.consentAccept')}</span>
        </label>
      </div>

      {error ? (
        <div className="gform-card gform-card--error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="gform-actions">
        <button className="gform-submit" type="submit" disabled={busy || uploading || !consent}>
          {busy ? t('forms.formSending') : t('cardApplication.submit')}
        </button>
        <button
          type="button"
          className="gform-clear"
          onClick={() => {
            setLastName('')
            setPostName('')
            setFirstName('')
            setSex('')
            setBirthPlace('')
            setBirthDate('')
            setRole('')
            setDepartment('')
            setAddress(SITE_CONTACT.offices.goma.shortAddress)
            setEmail('')
            setPhone('')
            setPhotoUrl('')
            setBloodGroup('')
            setNotes('')
            setConsent(false)
            setError('')
          }}
        >
          {t('cardApplication.clearForm')}
        </button>
      </div>
    </form>
  )
}
