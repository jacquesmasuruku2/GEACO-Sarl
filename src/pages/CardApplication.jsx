import { useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { Seo } from '../components/Seo'
import { PageHero } from '../components/PageHero'
import { ContactThanksBanner } from '../components/ContactThanksBanner'
import { PersonnelApplicationForm } from '../components/PersonnelApplicationForm'

export function CardApplication() {
  const { t } = useI18n()
  const [params] = useSearchParams()
  const merci = params.get('merci') === '1'

  return (
    <>
      <Seo
        title={t('cardApplication.metaTitle')}
        description={t('cardApplication.metaDesc')}
        path="/candidature-carte"
      />

      <PageHero
        breadcrumbItems={[
          { href: '/', label: t('nav.home') },
          { label: t('cardApplication.title') },
        ]}
        title={t('cardApplication.title')}
        lead={t('cardApplication.lead')}
        heroImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80"
      />

      <section className="section card-application-page">
        <div className="container card-application-page__wrap">
          {merci ? (
            <div className="card-application-page__thanks">
              <ContactThanksBanner
                title={t('cardApplication.thanksTitle')}
                body={t('cardApplication.thanksBody')}
                closing={t('cardApplication.thanksClosing')}
                brand={t('cardApplication.thanksBrand')}
              />
            </div>
          ) : (
            <>
              <header className="card-application-page__head">
                <h2>{t('cardApplication.formTitle')}</h2>
                <p>{t('cardApplication.formIntro')}</p>
                <p className="form-note">{t('cardApplication.approvalNote')}</p>
              </header>
              <PersonnelApplicationForm />
            </>
          )}
        </div>
      </section>
    </>
  )
}
