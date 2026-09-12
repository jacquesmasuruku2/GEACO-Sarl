import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { formatNavLabel } from '../lib/formatNavLabel'
import { SocialFollowBlock } from './SocialFollowBlock'
import { SITE_CONTACT } from '../data/siteContact'
import { PILLAR_ROUTES, serviceNavLabel } from '../data/servicesNav'

export function Footer() {
  const { t, locale } = useI18n()
  const nav = (key) => formatNavLabel(t(key), locale)

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img className="site-footer__logo" src="/geaco-logo-transparent.png" alt={t('brand.long')} />
          <p>{t('footer.tagline')}</p>
          <SocialFollowBlock
            variant="iconsOnly"
            navLabel={t('footer.socialNav')}
            facebookLabel={t('footer.followFacebook')}
            linkedinLabel={t('footer.followLinkedin')}
          />
        </div>
        <div>
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
              <Link to="/services/solution-cafe">
                {formatNavLabel(t('services.solutionCafe.navTitle'), locale)}
              </Link>
            </li>
            <li>
              <Link to="/projets">{nav('nav.projects')}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t('footer.contactTitle')}</h3>
          <ul>
            <li>
              <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
            </li>
            <li>
              <a href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>{SITE_CONTACT.phonePrimaryDisplay}</a>
            </li>
            <li>
              <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp {SITE_CONTACT.whatsappDisplay}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t('footer.exploreTitle')}</h3>
          <ul>
            <li>
              <Link to="/a-propos">{nav('nav.about')}</Link>
            </li>
            <li>
              <Link to="/faq">{nav('nav.faq')}</Link>
            </li>
            <li>
              <Link to="/blog">{nav('nav.blog')}</Link>
            </li>
            <li>
              <Link to="/galerie">{nav('nav.gallery')}</Link>
            </li>
            <li>
              <Link to="/mentions-legales">{nav('nav.legal')}</Link>
            </li>
            <li>
              <Link to="/devis">{nav('nav.quote')}</Link>
            </li>
            <li>
              <Link to="/contact">{nav('nav.contact')}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} {SITE_CONTACT.legalName} — Nord-Kivu, RDC
      </div>
    </footer>
  )
}
