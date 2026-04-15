import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { formatNavLabel } from '../lib/formatNavLabel'
import { SocialFollowBlock } from './SocialFollowBlock'

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
            <li>
              <Link to="/services">{nav('nav.services')}</Link>
            </li>
            <li>
              <Link to="/projets">{nav('nav.projects')}</Link>
            </li>
            <li>
              <Link to="/blog">{nav('nav.blog')}</Link>
            </li>
            <li>
              <Link to="/partenariats">{nav('nav.partnerships')}</Link>
            </li>
            <li>
              <Link to="/galerie">{nav('nav.gallery')}</Link>
            </li>
            <li>
              <Link to="/services/solution-cafe">
                {formatNavLabel(t('services.solutionCafe.navTitle'), locale)}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t('footer.contactTitle')}</h3>
          <ul>
            <li>
              <a href="mailto:geacosarl@gmail.com">geacosarl@gmail.com</a>
            </li>
            <li>
              <a href="tel:+243808368955">+243 808 368 955</a>
            </li>
            <li>
              <a href="tel:+243977472158">097 747 2158</a>
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
              <Link to="/personnel">{nav('nav.personnel')}</Link>
            </li>
            <li>
              <Link to="/mentions-legales">{nav('nav.legal')}</Link>
            </li>
            <li>
              <Link to="/contact">{nav('nav.contact')}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} GEACO SARL — Nord-Kivu, RDC</div>
    </footer>
  )
}
