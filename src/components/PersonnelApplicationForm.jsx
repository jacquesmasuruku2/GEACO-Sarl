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

/**
 * Formulaire public partageable pour candidature carte / fiche équipe.
 */
export function PersonnelApplicationForm({ redirectTo = '/candidature-carte?merci=1' }) {
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
  const [notes, setNotes] = useState('')

  if (!isSupabaseConfigured || !supabase) {
    return (
      <p className="admin-error" role="alert">
        {t('forms.supabaseNotConfigured')}
      </p>
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
      notes: trimOrNull(notes),
    })
    setBusy(false)
    if (insErr) {
      setError(
        insErr.message.includes('site_personnel_applications')
          ? `${insErr.message} — ${t('cardApplication.migrationHint')}`
          : insErr.message || t('forms.formErrorSend'),
      )
      return
    }
    navigate(redirectTo, { replace: false })
  }

  return (
    <form className="form form--simple card-apply-form" onSubmit={onSubmit} noValidate>
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

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="card-apply-last">{t('cardApplication.lastName')}</label>
          <input
            id="card-apply-last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            maxLength={120}
            autoComplete="family-name"
            placeholder={t('cardApplication.lastNamePlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="card-apply-post">{t('cardApplication.postName')}</label>
          <input
            id="card-apply-post"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            maxLength={120}
            placeholder={t('cardApplication.postNamePlaceholder')}
          />
        </div>
      </div>

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="card-apply-first">{t('cardApplication.firstName')}</label>
          <input
            id="card-apply-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            maxLength={120}
            autoComplete="given-name"
            placeholder={t('cardApplication.firstNamePlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="card-apply-sex">{t('cardApplication.sex')}</label>
          <select id="card-apply-sex" value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="">{t('cardApplication.sexPlaceholder')}</option>
            <option value="Masculin">{t('cardApplication.sexMale')}</option>
            <option value="Féminin">{t('cardApplication.sexFemale')}</option>
          </select>
        </div>
      </div>

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="card-apply-birth-place">{t('cardApplication.birthPlace')}</label>
          <input
            id="card-apply-birth-place"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            maxLength={200}
            placeholder={t('cardApplication.birthPlacePlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="card-apply-birth-date">{t('cardApplication.birthDate')}</label>
          <input
            id="card-apply-birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="card-apply-role">{t('cardApplication.role')}</label>
          <input
            id="card-apply-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            maxLength={200}
            placeholder={t('cardApplication.rolePlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="card-apply-dept">{t('cardApplication.department')}</label>
          <input
            id="card-apply-dept"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            maxLength={200}
            placeholder={t('cardApplication.departmentPlaceholder')}
          />
        </div>
      </div>

      <div className="simple-form__field">
        <label htmlFor="card-apply-address">{t('cardApplication.address')}</label>
        <input
          id="card-apply-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={400}
          placeholder={t('cardApplication.addressPlaceholder')}
        />
      </div>

      <div className="simple-form__grid">
        <div className="simple-form__field">
          <label htmlFor="card-apply-email">{t('cardApplication.email')}</label>
          <input
            id="card-apply-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            autoComplete="email"
            placeholder={t('cardApplication.emailPlaceholder')}
          />
        </div>
        <div className="simple-form__field">
          <label htmlFor="card-apply-phone">{t('cardApplication.phone')}</label>
          <input
            id="card-apply-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={60}
            autoComplete="tel"
            placeholder={t('cardApplication.phonePlaceholder')}
          />
        </div>
      </div>

      <div className="simple-form__field">
        <label htmlFor="card-apply-photo">{t('cardApplication.photo')}</label>
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
        <span className="form-note">
          {uploading ? t('cardApplication.uploading') : t('cardApplication.photoHint')}
        </span>
        {photoUrl ? (
          <div className="card-application-page__photo-preview">
            <img src={photoUrl} alt="" />
          </div>
        ) : null}
      </div>

      <div className="simple-form__field">
        <label htmlFor="card-apply-notes">{t('cardApplication.notes')}</label>
        <textarea
          id="card-apply-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder={t('cardApplication.notesPlaceholder')}
        />
      </div>

      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="form-consent">
        <p className="form-note">{t('forms.privacyNote')}</p>
        <label className="form-consent__check" htmlFor="card-apply-consent">
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

      <button className="btn btn--primary simple-form__submit" type="submit" disabled={busy || uploading || !consent}>
        {busy ? t('forms.formSending') : t('cardApplication.submit')}
      </button>
    </form>
  )
}
