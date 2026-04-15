import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { LeadFormSupabase } from '../components/LeadFormSupabase'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { useSitePartners } from '../hooks/useSitePartners'

export function Partnerships() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'
  const types = t('partnerships.types')
  const typesList = Array.isArray(types) ? types : []
  const { rows: partners } = useSitePartners()

  return (
    <>
      <Seo title={t('partnerships.metaTitle')} description={t('partnerships.metaDesc')} path="/partenariats" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('partnerships.title') },
        ]}
        title={t('partnerships.title')}
        lead={t('partnerships.lead')}
        heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section section--muted">
        <div className="container">
          <h2 className="section__title">{t('partnerships.activeTitle')}</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            {t('partnerships.activeLead')}
          </p>
          {partners.length ? (
            <>
              <p className="partners-scroller__hint">{t('partnerships.partnersScrollHint')}</p>
              <div className="partners-scroller" role="region" aria-label={t('partnerships.activeTitle')}>
                {partners.map((p) => (
                  <article
                    className="card partners-scroller__card"
                    key={p.id}
                    style={{ borderTop: '3px solid var(--color-vinci-blue)' }}
                  >
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-vinci-blue)' }}>{p.name}</h3>
                    {p.subtitle ? <p className="tag">{p.subtitle}</p> : null}
                    {p.notes ? <p style={{ marginTop: '0.75rem' }}>{p.notes}</p> : null}
                    {p.partnership_motive ? (
                      <p style={{ marginTop: '0.75rem' }}>
                        <strong>Motif du partenariat :</strong> {p.partnership_motive}
                      </p>
                    ) : null}
                    {p.website_url ? (
                      <p style={{ marginTop: '0.75rem' }}>
                        <a href={p.website_url} target="_blank" rel="noreferrer noopener">
                          {p.website_url}
                        </a>
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>{t('partnerships.activeEmpty')}</p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container split split--2">
          <div>
            {merci ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <ContactThanksBanner />
              </div>
            ) : null}
            <h2 className="section__title">{t('partnerships.typesTitle')}</h2>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--color-text-muted)' }}>
              {typesList.map((item) => (
                <li key={item} style={{ marginBottom: '0.45rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2>{t('partnerships.formTitle')}</h2>
            <LeadFormSupabase source="partnership" redirectTo="/partenariats?merci=1" />
          </div>
        </div>
      </section>
    </>
  )
}
