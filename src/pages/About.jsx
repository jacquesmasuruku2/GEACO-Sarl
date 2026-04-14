import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'

export function About() {
  const { t } = useI18n()
  const team = t('about.team')
  const values = t('about.values')

  return (
    <>
      <Seo title={t('about.metaTitle')} description={t('about.metaDesc')} path="/a-propos" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('about.title') },
        ]}
        title={t('about.title')}
        lead={t('about.intro')}
        heroImage="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="split split--2">
            <div className="card">
              <h2>{t('about.valuesTitle')}</h2>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
                {values.map((v) => (
                  <li key={v} style={{ marginBottom: '0.5rem' }}>
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2>{t('about.approachTitle')}</h2>
              <p>{t('about.approachText')}</p>
            </div>
          </div>

          <h2 className="section__title" style={{ marginTop: '2.5rem' }}>
            {t('about.teamTitle')}
          </h2>
          <div className="card-grid">
            {team.map((member) => (
              <div className="card" key={member.name}>
                <h3>{member.name}</h3>
                <p className="tag" style={{ display: 'inline-block' }}>
                  {member.role}
                </p>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
