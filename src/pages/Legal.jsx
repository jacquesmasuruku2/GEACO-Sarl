import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'

export function Legal() {
  const { t } = useI18n()
  const objectItems = t('legal.objectItems')
  const associates = t('legal.associates')
  const pillars = t('legal.adminPillars')
  const safeObject = Array.isArray(objectItems) ? objectItems : []
  const safeAssociates = Array.isArray(associates) ? associates : []
  const safePillars = Array.isArray(pillars) ? pillars : []

  const identityRows = [
    { label: t('legal.company'), value: t('legal.companyValue') },
    { label: t('legal.form'), value: t('legal.formValue') },
    { label: t('legal.capital'), value: t('legal.capitalValue') },
    { label: t('legal.duration'), value: t('legal.durationValue') },
    { label: t('legal.statutes'), value: t('legal.statutesValue') },
  ]

  return (
    <>
      <Seo title={t('legal.metaTitle')} description={t('legal.metaDesc')} path="/mentions-legales" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('legal.title') },
        ]}
        title={t('legal.title')}
        lead={t('legal.intro')}
        heroImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section legal-page" aria-labelledby="legal-identity-title">
        <div className="container legal-page__wrap">
          <header className="legal-block__head">
            <h2 id="legal-identity-title">{t('legal.identityTitle')}</h2>
            <p>{t('legal.identityLead')}</p>
          </header>

          <dl className="legal-identity">
            {identityRows.map((row) => (
              <div className="legal-identity__row" key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="legal-identity__note">{t('legal.capitalDetail')}</p>

          <header className="legal-block__head legal-block__head--spaced">
            <h2>{t('legal.associatesTitle')}</h2>
          </header>
          <ul className="legal-list">
            {safeAssociates.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <header className="legal-block__head legal-block__head--spaced">
            <h2>{t('legal.governanceTitle')}</h2>
            <p>{t('legal.governanceLead')}</p>
          </header>
          <div className="legal-prose-block">
            <p>{t('legal.governanceManager')}</p>
            <p>{t('legal.governanceAdmin')}</p>
            <p>{t('legal.governanceAg')}</p>
          </div>

          <header className="legal-block__head legal-block__head--spaced">
            <h2>{t('legal.adminPillarsTitle')}</h2>
            <p>{t('legal.adminPillarsLead')}</p>
          </header>
          <ul className="legal-pillars">
            {safePillars.map((person) => (
              <li key={person.name}>
                <h3>{person.name}</h3>
                <p className="legal-pillars__role">{person.role}</p>
                <p className="legal-prose">{person.bio}</p>
              </li>
            ))}
          </ul>

          <header className="legal-block__head legal-block__head--spaced">
            <h2>{t('legal.objectTitle')}</h2>
          </header>
          <ul className="legal-list">
            {safeObject.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <header className="legal-block__head legal-block__head--spaced">
            <h2>{t('legal.financeTitle')}</h2>
          </header>
          <p className="legal-prose">{t('legal.financeText')}</p>

          <header className="legal-block__head legal-block__head--spaced">
            <h2>{t('legal.finalTitle')}</h2>
          </header>
          <p className="legal-prose">{t('legal.finalText')}</p>

          <div className="legal-page__links">
            <Link className="btn btn--outline" to="/a-propos">
              {t('legal.aboutLink')}
            </Link>
            <Link className="btn btn--primary" to="/contact">
              {t('legal.contactLink')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
