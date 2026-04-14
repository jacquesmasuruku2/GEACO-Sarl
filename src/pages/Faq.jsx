import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { formatNavLabel } from '../lib/formatNavLabel'

export function Faq() {
  const { t, locale } = useI18n()
  const rawItems = t('faq.items')
  const items = Array.isArray(rawItems) ? rawItems : []

  return (
    <>
      <Seo title={t('faq.metaTitle')} description={t('faq.metaDesc')} path="/faq" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { href: '/a-propos', label: formatNavLabel(t('nav.about'), locale) },
          { label: t('faq.title') },
        ]}
        title={t('faq.title')}
        lead={t('faq.lead')}
        heroImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="faq-list">
            {items.map((item, i) => (
              <details className="faq-list__item" key={i}>
                <summary className="faq-list__summary">{item.q}</summary>
                <div className="faq-list__answer">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
