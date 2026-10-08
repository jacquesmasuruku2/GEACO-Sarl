import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { SITE_OFFICES } from '../data/siteContact'
import { slugifyPersonnel } from '../lib/personnelSlug'
import { useSitePersonnel } from '../hooks/useSitePersonnel'
import { useSitePartners } from '../hooks/useSitePartners'
import { normalizeExternalUrl } from '../lib/externalUrl'

function isPhotoUrl(value) {
  return typeof value === 'string' && /^(https?:\/\/|\/)/i.test(value.trim())
}

function memberInitials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function About() {
  const { t, locale } = useI18n()
  const { groups: personnelGroups, error: personnelError } = useSitePersonnel(locale)
  const { rows: partners, loading: partnersLoading, error: partnersError } = useSitePartners()
  const team = t('about.team')
  const values = t('about.values')
  const objectItems = t('about.objectItems')
  const safeTeam = Array.isArray(team) ? team : []
  const safeValues = Array.isArray(values) ? values : []
  const safeObject = Array.isArray(objectItems) ? objectItems : []
  const databaseMembers = personnelGroups.flatMap((group) => group.members ?? [])
  const hasDatabaseMembers = databaseMembers.length > 0
  const displayedMembers = hasDatabaseMembers
    ? databaseMembers
    : safeTeam.map((member) => ({ ...member, photo_url: '' }))

  const identityRows = [
    { label: t('about.legalNameLabel'), value: t('about.legalNameValue') },
    { label: t('about.formLabel'), value: t('about.formValue') },
    { label: t('about.capitalLabel'), value: t('about.capitalValue') },
    { label: t('about.durationLabel'), value: t('about.durationValue') },
    { label: t('about.statutesLabel'), value: t('about.statutesValue') },
    { label: t('about.managerLabel'), value: t('about.managerValue') },
  ]

  return (
    <>
      <Seo title={t('about.metaTitle')} description={t('about.metaDesc')} path="/a-propos" />

      <PageHero
        className="page-hero--brand"
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('about.title') },
        ]}
        title={t('about.title')}
        lead={t('about.intro')}
        heroImage="/media/geaco/about-us.webp"
      />

      <section className="section about-page" aria-labelledby="about-identity-title">
        <div className="container about-page__wrap">
          <header className="about-block__head">
            <h2 id="about-identity-title">{t('about.identityTitle')}</h2>
            <p>{t('about.identityLead')}</p>
          </header>

          <dl className="about-identity">
            {identityRows.map((row) => (
              <div className="about-identity__row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="about-identity__note">{t('about.registrationNote')}</p>

          <header className="about-block__head about-block__head--spaced about-team__head">
            <h2>{t('about.officesTitle')}</h2>
            <p>{t('about.officesLead')}</p>
          </header>
          <ul className="about-offices">
            {SITE_OFFICES.map((office) => (
              <li key={office.city}>
                <strong>{locale === 'en' && office.labelEn ? office.labelEn : office.label}</strong>
                <span>{office.address}</span>
              </li>
            ))}
          </ul>

          <header className="about-block__head about-block__head--spaced">
            <h2>{t('about.objectTitle')}</h2>
          </header>
          <ul className="about-list">
            {safeObject.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="about-split about-block__head--spaced">
            <div>
              <h2>{t('about.valuesTitle')}</h2>
              <ul className="about-list">
                {safeValues.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{t('about.approachTitle')}</h2>
              <p className="about-prose">{t('about.approachText')}</p>
            </div>
          </div>

          <header className="about-block__head about-block__head--spaced">
            <h2>{hasDatabaseMembers ? t('personnel.expertsTitle') : t('about.teamTitle')}</h2>
            <p>{hasDatabaseMembers ? t('personnel.expertsLead') : t('about.teamLead')}</p>
          </header>
          {personnelError ? (
            <p className="about-prose" role="alert">
              {t('personnel.loadError')}: {personnelError.message}
            </p>
          ) : null}
          <div className="personnel-grid personnel-grid--compact">
            {displayedMembers.map((member) => {
              const profileSlug = String(member.slug || '').trim() || slugifyPersonnel(member.name)
              return (
                <article className="personnel-profile" key={member.id || profileSlug}>
                  <div className="personnel-profile__media" aria-hidden="true">
                    {isPhotoUrl(member.photo_url) ? (
                      <img src={member.photo_url.trim()} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="personnel-profile__initials">{memberInitials(member.name)}</span>
                    )}
                  </div>
                  <div className="personnel-profile__body">
                    <h3 className="personnel-profile__name">
                      <Link className="personnel-profile__name-btn" to={`/personnel/${profileSlug}`}>
                        {member.name}
                      </Link>
                    </h3>
                    {member.role ? <p className="personnel-profile__role">{member.role}</p> : null}
                  </div>
                </article>
              )
            })}
          </div>

          <section className="about-partners" aria-labelledby="about-partners-title">
            <header className="about-block__head about-block__head--spaced">
              <h2 id="about-partners-title">{t('about.partnersTitle')}</h2>
              <p>{t('about.partnersLead')}</p>
            </header>

            {partnersError ? (
              <p className="about-prose" role="alert">
                {t('partnerships.loadError')}: {partnersError.message}
              </p>
            ) : null}
            {partnersLoading ? <p className="about-prose">{t('partnerships.loading')}</p> : null}
            {!partnersLoading && !partnersError && partners.length ? (
              <div className="about-partners__grid">
                {partners.map((partner) => {
                  const website = normalizeExternalUrl(partner.website_url)
                  const initials = String(partner.name ?? '')
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0] ?? '')
                    .join('')
                    .toUpperCase()
                  const description = String(
                    partner.partnership_motive || partner.notes || partner.subtitle || '',
                  ).trim()

                  return (
                    <article className="about-partner-card" key={partner.id}>
                      <div className="about-partner-card__logo" aria-hidden="true">
                        {partner.logo_url ? (
                          <img src={String(partner.logo_url).trim()} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="about-partner-card__body">
                        <h3>{partner.name}</h3>
                        {partner.subtitle ? <p className="about-partner-card__subtitle">{partner.subtitle}</p> : null}
                        {description ? <p>{description}</p> : null}
                        {website ? (
                          <a href={website} target="_blank" rel="noreferrer noopener">
                            {t('partnerships.visitWebsite')}
                          </a>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : null}
            {!partnersLoading && !partnersError && !partners.length ? (
              <p className="about-prose">{t('partnerships.activeEmpty')}</p>
            ) : null}
            <div className="about-partners__footer">
              <Link className="btn btn--primary" to="/partenariats">
                {t('about.partnersCta')}
              </Link>
            </div>
          </section>

          <div className="about-page__links">
            <Link className="btn btn--outline" to="/mentions-legales">
              {t('about.legalLink')}
            </Link>
            <Link className="btn btn--primary" to="/contact">
              {t('about.contactLink')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
