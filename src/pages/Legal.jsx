import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'

export function Legal() {
  const { t } = useI18n()
  const objectItems = t('legal.objectItems')
  const associates = t('legal.associates')

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

      <section className="section">
        <div className="container">
          <div className="card-grid">
            <div className="card">
              <h2>{t('legal.company')}</h2>
              <p>{t('legal.companyValue')}</p>
            </div>
            <div className="card">
              <h2>{t('legal.form')}</h2>
              <p>{t('legal.formValue')}</p>
            </div>
            <div className="card">
              <h2>{t('legal.capital')}</h2>
              <p>{t('legal.capitalValue')}</p>
              <p>{t('legal.capitalDetail')}</p>
            </div>
            <div className="card">
              <h2>{t('legal.duration')}</h2>
              <p>{t('legal.durationValue')}</p>
            </div>
            <div className="card">
              <h2>{t('legal.statutes')}</h2>
              <p>{t('legal.statutesValue')}</p>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="section__title">{t('legal.associatesTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
              {associates.map((line) => (
                <li key={line} style={{ marginBottom: '0.45rem' }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="section__title">{t('legal.governanceTitle')}</h2>
            <p>{t('legal.governanceManager')}</p>
            <p>{t('legal.governanceAg')}</p>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="section__title">{t('legal.financeTitle')}</h2>
            <p>{t('legal.financeText')}</p>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="section__title">{t('legal.finalTitle')}</h2>
            <p>{t('legal.finalText')}</p>
          </div>

          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h2 className="section__title">{t('legal.objectTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
              {objectItems.map((line) => (
                <li key={line} style={{ marginBottom: '0.45rem' }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
