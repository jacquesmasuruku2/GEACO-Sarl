import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { FormationRegistrationForm } from '../components/FormationRegistrationForm'
import { RichTextContent } from '../components/RichTextContent'
import { useSiteFormations } from '../hooks/useSiteFormations'
import { resolveFormationRegistrationStatus } from '../lib/formationStatus'

function formatFormationDate(value, locale) {
  if (!value) return ''
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return String(value)
  }
}

export function Formations() {
  const { t, locale } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'
  const { rows, loading, error } = useSiteFormations(locale)
  const [preselectId, setPreselectId] = useState(params.get('formation') || '')

  function scrollToRegister(formationId) {
    if (formationId) setPreselectId(formationId)
    requestAnimationFrame(() => {
      const target = document.getElementById('inscription-formation')
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <>
      <Seo title={t('formations.metaTitle')} description={t('formations.metaDesc')} path="/formations" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('formations.title') },
        ]}
        title={t('formations.title')}
        lead={t('formations.lead')}
        heroImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section formations-page">
        <div className="container formations-page__wrap">
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

          <header className="formations-page__head">
            <h2>{t('formations.listTitle')}</h2>
            <p>{t('formations.listLead')}</p>
          </header>

          {loading ? <p className="form-note">{t('formations.loading')}</p> : null}
          {error ? (
            <p className="admin-error" role="alert">
              {t('formations.loadError')}
            </p>
          ) : null}

          {!loading && !error && rows.length === 0 ? (
            <p className="form-note">{t('formations.empty')}</p>
          ) : null}

          <ul className="formations-list">
            {rows.map((formation) => {
              const start = formatFormationDate(formation.starts_on, locale)
              const end = formatFormationDate(formation.ends_on, locale)
              const status = resolveFormationRegistrationStatus(formation)
              const open = status === 'open'
              const statusLabel =
                status === 'full'
                  ? t('formations.statusFull')
                  : status === 'ended'
                    ? t('formations.statusEnded')
                    : status === 'closed'
                      ? t('formations.statusClosed')
                      : t('formations.statusOpen')
              return (
                <li className="formations-item" key={formation.id} data-status={status}>
                  {formation.image_url ? (
                    <div className="formations-item__media">
                      <img src={String(formation.image_url).trim()} alt="" loading="lazy" />
                    </div>
                  ) : null}
                  <div className="formations-item__body">
                    <div className="formations-item__title-row">
                      <h3>{formation.title}</h3>
                      <span className={`formations-item__badge formations-item__badge--${status}`}>
                        {statusLabel}
                      </span>
                    </div>
                    {formation.summary ? <p className="formations-item__summary">{formation.summary}</p> : null}
                    <ul className="formations-item__meta">
                      {formation.location ? <li>{formation.location}</li> : null}
                      {start ? <li>{end && end !== start ? `${start} — ${end}` : start}</li> : null}
                      {formation.duration_label ? <li>{formation.duration_label}</li> : null}
                      {formation.seats_label ? <li>{formation.seats_label}</li> : null}
                    </ul>
                    {formation.description ? (
                      <div className="formations-item__desc rich-text">
                        <RichTextContent value={formation.description} />
                      </div>
                    ) : null}
                  </div>
                  <div className="formations-item__actions">
                    {open ? (
                      <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => scrollToRegister(formation.id)}
                      >
                        {t('formations.registerCta')}
                      </button>
                    ) : (
                      <span className="formations-item__closed">{statusLabel}</span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          <section className="formations-register" id="inscription-formation" aria-labelledby="inscription-title">
            <header className="formations-page__head">
              <h2 id="inscription-title">{t('formations.registerTitle')}</h2>
              <p>{t('formations.registerLead')}</p>
            </header>
            <FormationRegistrationForm
              key={preselectId || 'all'}
              formations={rows}
              preselectId={preselectId}
            />
          </section>
        </div>
      </section>
    </>
  )
}
