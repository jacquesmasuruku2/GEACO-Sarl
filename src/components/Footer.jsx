import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { formatNavLabel } from '../lib/formatNavLabel'
import { SocialFollowBlock } from './SocialFollowBlock'
import { SITE_CONTACT, SITE_OFFICES } from '../data/siteContact'
import { PILLAR_ROUTES, serviceNavLabel } from '../data/servicesNav'

export function Footer() {
  const { t, locale } = useI18n()
  const nav = (key) => formatNavLabel(t(key), locale)
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__brand-link">
            <img className="site-footer__logo" src="/geaco-logo-transparent.png" alt={t('brand.long')} />
          </Link>
          <p className="site-footer__tagline">{t('footer.tagline')}</p>

          <ul className="site-footer__places">
            {SITE_OFFICES.map((office) => (
              <li key={office.city}>
                <strong>{office.city}</strong>
                <span>{office.shortAddress}</span>
              </li>
            ))}
          </ul>

          <Link className="site-footer__addresses-link" to="/contact">
            {t('footer.fullAddresses')}
          </Link>

          <SocialFollowBlock
            variant="iconsOnly"
            navLabel={t('footer.socialNav')}
            facebookLabel={t('footer.followFacebook')}
            linkedinLabel={t('footer.followLinkedin')}
          />
        </div>

        <nav className="site-footer__col" aria-label={t('footer.expertiseTitle')}>
          <h3>{t('footer.expertiseTitle')}</h3>
          <ul>
            {PILLAR_ROUTES.map(({ slug, detailKey }) => (
              <li key={slug}>
                <Link to={`/services/${slug}`}>
                  {formatNavLabel(serviceNavLabel(detailKey, t), locale)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/projets/solution-cafe">
                {formatNavLabel(t('nav.projectsSolutionCafe'), locale)}
              </Link>
            </li>
            <li>
              <Link to="/projets">{nav('nav.projects')}</Link>
            </li>
          </ul>
        </nav>

        <nav className="site-footer__col" aria-label={t('footer.exploreTitle')}>
          <h3>{t('footer.exploreTitle')}</h3>
          <ul>
            <li>
              <Link to="/a-propos">{nav('nav.about')}</Link>
            </li>
            <li>
              <Link to="/personnel">{nav('nav.personnel')}</Link>
            </li>
            <li>
              <Link to="/partenariats">{nav('nav.partnerships')}</Link>
            </li>
            <li>
              <Link to="/blog">{nav('nav.blog')}</Link>
            </li>
            <li>
              <Link to="/formations">{nav('nav.formations')}</Link>
            </li>
            <li>
              <Link to="/galerie">{nav('nav.gallery')}</Link>
            </li>
            <li>
              <Link to="/faq">{nav('nav.faq')}</Link>
            </li>
          </ul>
        </nav>

        <div className="site-footer__col site-footer__col--contact">
          <h3>{t('footer.contactTitle')}</h3>
          <ul className="site-footer__contact-list">
            <li>
              <span className="site-footer__contact-label">{t('footer.labelEmail')}</span>
              <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
            </li>
            <li>
              <span className="site-footer__contact-label">{t('footer.labelPhone')}</span>
              <a href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>{SITE_CONTACT.phonePrimaryDisplay}</a>
            </li>
            <li>
              <span className="site-footer__contact-label">{t('footer.labelWhatsapp')}</span>
              <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
                {SITE_CONTACT.whatsappDisplay}
              </a>
            </li>
          </ul>

          <div className="site-footer__cta-row">
            <Link className="btn btn--on-dark site-footer__cta" to="/devis">
              {nav('nav.quote')}
            </Link>
            <Link className="btn btn--ghost-on-dark site-footer__cta" to="/contact">
              {nav('nav.contact')}
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom__inner">
          <p className="footer-bottom__copy">
            © {year} {SITE_CONTACT.legalName}. {t('footer.rights')}
          </p>
          <nav className="footer-bottom__links" aria-label={t('footer.legalNav')}>
            <Link to="/mentions-legales">{nav('nav.legal')}</Link>
            <Link to="/contact">{nav('nav.contact')}</Link>
            <a href={SITE_CONTACT.map.link} target="_blank" rel="noreferrer">
              {t('footer.mapLink')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
