import { Link, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { LeadFormSupabase } from '../components/LeadFormSupabase'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { formatNavLabel } from '../lib/formatNavLabel'

export function QuoteRequest() {
  const { t, locale } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'

  return (
    <>
      <Seo title={t('quote.metaTitle')} description={t('quote.metaDesc')} path="/devis" />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: formatNavLabel(t('nav.home'), locale) },
          { label: t('quote.title') },
        ]}
        title={t('quote.title')}
        lead={t('quote.lead')}
        heroImage="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section section--quote-premium">
        <div className="container">
          {merci ? (
            <div className="quote-thanks-wrap">
              <ContactThanksBanner variant="quote" />
            </div>
          ) : null}

          <div className="quote-page-layout">
            <div className="quote-form-shell">
              <span className="quote-form-shell__accent" aria-hidden="true" />
              <header className="quote-form-shell__head">
                <p className="quote-form-shell__eyebrow">{t('brand.short')}</p>
                <h2 className="quote-form-shell__title">{t('quote.formTitle')}</h2>
                <p className="quote-form-shell__intro">{t('quote.formIntro')}</p>
              </header>
              <LeadFormSupabase source="quote" redirectTo="/devis?merci=1" />
            </div>

            <aside className="quote-aside-premium" aria-labelledby="quote-aside-title">
              <p className="quote-aside-premium__eyebrow" id="quote-aside-title">
                {t('quote.asideTitle')}
              </p>
              <p className="quote-aside-premium__text">{t('quote.asideLead')}</p>
              <Link className="btn btn--on-dark quote-aside-premium__cta" to="/contact">
                {t('quote.linkContact')}
              </Link>
              <ul className="quote-aside-premium__bullets">
                <li>{t('quote.asidePoint1')}</li>
                <li>{t('quote.asidePoint2')}</li>
                <li>{t('quote.asidePoint3')}</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
