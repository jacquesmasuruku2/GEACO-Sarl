import { useEffect, useId, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { FormationRegistrationForm } from '../components/FormationRegistrationForm'
import { RichTextContent } from '../components/RichTextContent'
import { useSiteFormation } from '../hooks/useSiteFormations'
import {
  formatFormationDate,
  formationPath,
  formationSeoDescription,
  formationStatusLabel,
  resolveFormationRegistrationStatus,
} from '../lib/formationDisplay'

export function FormationDetail() {
  const { slug } = useParams()
  const { t, locale } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'
  const { row, loading, error } = useSiteFormation(slug || '', locale)
  const [registerOpen, setRegisterOpen] = useState(false)
  const registerTitleId = useId()

  useEffect(() => {
    if (!registerOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e) {
      if (e.key === 'Escape') setRegisterOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [registerOpen])

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="form-note">{t('formations.loading')}</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="admin-error" role="alert">
            {t('formations.loadError')}
          </p>
          <p>
            <Link to="/formations">{t('formations.backToList')}</Link>
          </p>
        </div>
      </section>
    )
  }

  if (!row) {
    return <Navigate to="/formations" replace />
  }

  const status = resolveFormationRegistrationStatus(row)
  const open = status === 'open'
  const statusLabel = formationStatusLabel(status, t)
  const start = formatFormationDate(row.starts_on, locale)
  const end = formatFormationDate(row.ends_on, locale)
  const cover = String(row.image_url ?? '').trim()
  const path = formationPath(row.slug)
  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${path}` : path

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      // ignore
    }
  }

  return (
    <>
      <Seo
        title={`${row.title} — GEACO SARL`}
        description={formationSeoDescription(row) || t('formations.metaDesc')}
        path={path}
      />

      <article className="formation-article">
        {cover ? (
          <div className="formation-article__hero">
            <img src={cover} alt="" />
          </div>
        ) : null}

        <div className="container formation-article__inner">
          {merci ? (
            <div className="formations-page__thanks">
              <ContactThanksBanner
                title={t('formations.thanksTitle')}
                body={t('formations.thanksBody')}
                closing={t('formations.thanksClosing')}
                brand={t('formations.thanksBrand')}
              />
            </div>
          ) : null}

          <nav className="breadcrumb formation-article__breadcrumb" aria-label="Fil d’Ariane">
            <Link to="/">{t('nav.home')}</Link>
            <span className="breadcrumb__sep">›</span>
            <Link to="/formations">{t('formations.title')}</Link>
            <span className="breadcrumb__sep">›</span>
            <span aria-current="page">{row.title}</span>
          </nav>

          <header className="formation-article__header">
            <p className={`formation-article__badge formation-article__badge--${status}`}>{statusLabel}</p>
            <h1>{row.title}</h1>
            {row.summary ? <p className="formation-article__summary">{row.summary}</p> : null}
            <ul className="formation-article__meta">
              {row.location ? <li>{row.location}</li> : null}
              {start ? <li>{end && end !== start ? `${start} — ${end}` : start}</li> : null}
              {row.duration_label ? <li>{row.duration_label}</li> : null}
              {row.seats_label ? <li>{row.seats_label}</li> : null}
            </ul>
          </header>

          {row.description ? (
            <div className="formation-article__body">
              <RichTextContent value={row.description} />
            </div>
          ) : (
            <p className="form-note">{t('formations.noDescription')}</p>
          )}

          <footer className="formation-article__footer">
            {open ? (
              <button type="button" className="btn btn--primary" onClick={() => setRegisterOpen(true)}>
                {t('formations.registerCta')}
              </button>
            ) : (
              <span className="formations-item__closed">{statusLabel}</span>
            )}
            <button type="button" className="btn btn--outline" onClick={copyShareLink}>
              {t('formations.copyLink')}
            </button>
            <Link className="btn btn--ghost" to="/formations">
              {t('formations.backToList')}
            </Link>
          </footer>
        </div>
      </article>

      {registerOpen ? (
        <div className="formation-modal formation-modal--register" role="presentation">
          <button
            type="button"
            className="formation-modal__backdrop"
            aria-label={t('formations.closeRegister')}
            onClick={() => setRegisterOpen(false)}
          />
          <div
            className="formation-modal__dialog formation-modal__dialog--register"
            role="dialog"
            aria-modal="true"
            aria-labelledby={registerTitleId}
          >
            <button
              type="button"
              className="formation-modal__close"
              onClick={() => setRegisterOpen(false)}
              aria-label={t('formations.closeRegister')}
            >
              ×
            </button>
            <div className="formation-modal__content formation-modal__content--register">
              <h2 id={registerTitleId} className="formation-modal__title">
                {t('formations.registerTitle')}
              </h2>
              <p className="formation-modal__summary">{row.title}</p>
              <p className="formation-modal__lead">{t('formations.registerLead')}</p>
              <FormationRegistrationForm
                key={row.id}
                formations={[row]}
                preselectId={row.id}
                lockFormation
                redirectTo={`${path}?merci=1`}
                onSuccess={() => setRegisterOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
