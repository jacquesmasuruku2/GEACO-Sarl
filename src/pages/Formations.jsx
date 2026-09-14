import { Link, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { useSiteFormations } from '../hooks/useSiteFormations'
import {
  formatFormationDate,
  formationPath,
  formationStatusLabel,
  resolveFormationRegistrationStatus,
} from '../lib/formationDisplay'

export function Formations() {
  const { t, locale } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'
  const { rows, loading, error } = useSiteFormations(locale)

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
              const statusLabel = formationStatusLabel(status, t)
              const imageUrl = String(formation.image_url ?? '').trim()
              const href = formationPath(formation.slug)
              return (
                <li className="formations-item" key={formation.id} data-status={status}>
                  {imageUrl ? (
                    <Link
                      className="formations-item__media formations-item__media--button"
                      to={href}
                      aria-label={`${t('formations.readOffer')}: ${formation.title}`}
                    >
                      <img src={imageUrl} alt="" loading="lazy" />
                    </Link>
                  ) : null}
                  <div className="formations-item__body">
                    <div className="formations-item__title-row">
                      <h3>
                        <Link className="formations-item__title-btn" to={href}>
                          {formation.title}
                        </Link>
                      </h3>
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
                  </div>
                  <div className="formations-item__actions">
                    <Link className="btn btn--outline" to={href}>
                      {t('formations.readOffer')}
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
