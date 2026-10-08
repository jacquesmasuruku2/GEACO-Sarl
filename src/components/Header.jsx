import { useState, useLayoutEffect, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { SERVICE_ROUTES, serviceNavLabel } from '../data/servicesNav'
import { formatNavLabel } from '../lib/formatNavLabel'
import { SITE_CONTACT } from '../data/siteContact'

/** Au-delà de ce décalage vertical, la topbar (ligne RDC + email/tél.) se replie. */
const TOPBAR_HIDE_SCROLL_Y = 36

function IconMail() {
  return (
    <svg className="site-topbar__icon" viewBox="0 0 24 24" aria-hidden="true" width="15" height="15">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"
      />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg className="site-topbar__icon" viewBox="0 0 24 24" aria-hidden="true" width="15" height="15">
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.02l-2.2 2.19Z"
      />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg className="site-topbar__icon" viewBox="0 0 24 24" aria-hidden="true" width="15" height="15">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  )
}

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const location = useLocation()

  const servicesActive = location.pathname.startsWith('/services') || location.pathname.startsWith('/domaines')
  const projectsActive = location.pathname.startsWith('/projets')
  const aboutActive =
    location.pathname.startsWith('/a-propos') ||
    location.pathname.startsWith('/personnel') ||
    location.pathname.startsWith('/partenariats')
  const resourcesActive =
    location.pathname.startsWith('/blog') ||
    location.pathname.startsWith('/formations') ||
    location.pathname.startsWith('/galerie') ||
    location.pathname.startsWith('/gallery') ||
    location.pathname === '/faq'

  useLayoutEffect(() => {
    const sync = () => {
      document.documentElement.classList.toggle(
        'site-header-topbar-hidden',
        window.scrollY > TOPBAR_HIDE_SCROLL_Y,
      )
    }
    sync()
    window.addEventListener('scroll', sync, { passive: true })
    return () => {
      window.removeEventListener('scroll', sync)
    }
  }, [location.pathname])

  useEffect(() => {
    setMobileServicesOpen(false)
    setMobileResourcesOpen(false)
  }, [location.pathname])

  const closeAll = () => {
    setOpen(false)
    setMobileAboutOpen(false)
    setMobileProjectsOpen(false)
    setMobileServicesOpen(false)
    setMobileResourcesOpen(false)
  }

  const navLabel = (key) => formatNavLabel(t(key), locale)

  return (
    <header className="site-header">
      <div className="site-topbar">
        <div className="site-topbar__inner">
          <span className="site-topbar__region">{t('header.regionLine')}</span>
          <div className="site-topbar__actions" role="group" aria-label="Contact rapide">
            <a
              className="site-topbar__btn site-topbar__btn--mail"
              href={`mailto:${SITE_CONTACT.email}`}
              title={SITE_CONTACT.email}
            >
              <IconMail />
              <span>{SITE_CONTACT.email}</span>
            </a>
            <a
              className="site-topbar__btn site-topbar__btn--phone"
              href={`tel:${SITE_CONTACT.phonePrimaryTel}`}
              title={SITE_CONTACT.phonePrimaryDisplay}
            >
              <IconPhone />
              <span>{SITE_CONTACT.phonePrimaryDisplay}</span>
            </a>
            <a
              className="site-topbar__btn site-topbar__btn--whatsapp"
              href={SITE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={`WhatsApp ${SITE_CONTACT.whatsappDisplay}`}
            >
              <IconWhatsApp />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" onClick={closeAll}>
          <img className="site-logo__image" src="/banniere.png" alt={t('brand.long')} />
        </NavLink>

        <nav className="nav-desktop" aria-label="Principal">
          <NavLink to="/" end>
            {navLabel('nav.home')}
          </NavLink>

          <div className={`nav-dropdown${aboutActive ? ' nav-dropdown--active' : ''}`}>
            <NavLink className="nav-dropdown__trigger" to="/a-propos" end={false}>
              {navLabel('nav.about')}
              <span className="nav-dropdown__caret" aria-hidden="true">
                ▾
              </span>
            </NavLink>
            <div className="nav-dropdown__panel" role="menu">
              <Link className="nav-dropdown__link" to="/a-propos" role="menuitem">
                {navLabel('nav.aboutOverview')}
              </Link>
              <Link className="nav-dropdown__link" to="/personnel" role="menuitem">
                {navLabel('nav.personnel')}
              </Link>
              <Link className="nav-dropdown__link" to="/partenariats" role="menuitem">
                {navLabel('nav.partnerships')}
              </Link>
            </div>
          </div>

          <div className={`nav-dropdown${servicesActive ? ' nav-dropdown--active' : ''}`}>
            <NavLink className="nav-dropdown__trigger" to="/domaines" end={false}>
              {navLabel('nav.solutions')}
              <span className="nav-dropdown__caret" aria-hidden="true">
                ▾
              </span>
            </NavLink>
            <div className="nav-dropdown__panel" role="menu">
              {SERVICE_ROUTES.map(({ slug, detailKey }) => (
                <Link
                  key={slug}
                  className="nav-dropdown__link"
                  to={`/domaines/${slug}`}
                  role="menuitem"
                >
                  {formatNavLabel(serviceNavLabel(detailKey, t), locale)}
                </Link>
              ))}
            </div>
          </div>

          <div className={`nav-dropdown${projectsActive ? ' nav-dropdown--active' : ''}`}>
            <NavLink className="nav-dropdown__trigger" to="/projets" end={false}>
              {navLabel('nav.projects')}
              <span className="nav-dropdown__caret" aria-hidden="true">
                ▾
              </span>
            </NavLink>
            <div className="nav-dropdown__panel" role="menu">
              <Link className="nav-dropdown__link" to="/projets/agriculture" role="menuitem">
                {navLabel('nav.projectsAgriculture')}
              </Link>
              <Link className="nav-dropdown__link" to="/projets/solution-cafe" role="menuitem">
                {navLabel('nav.projectsSolutionCafe')}
              </Link>
              <Link className="nav-dropdown__link" to="/projets/construction" role="menuitem">
                {navLabel('nav.projectsConstruction')}
              </Link>
              <Link className="nav-dropdown__link" to="/projets/wash" role="menuitem">
                {navLabel('nav.projectsWash')}
              </Link>
            </div>
          </div>

          <div className={`nav-dropdown${resourcesActive ? ' nav-dropdown--active' : ''}`}>
            <button type="button" className="nav-dropdown__trigger" aria-haspopup="true">
              {navLabel('nav.resources')}
              <span className="nav-dropdown__caret" aria-hidden="true">
                ▾
              </span>
            </button>
            <div className="nav-dropdown__panel" role="menu">
              <Link className="nav-dropdown__link" to="/blog" role="menuitem">
                {navLabel('nav.blog')}
              </Link>
              <Link className="nav-dropdown__link" to="/formations" role="menuitem">
                {navLabel('nav.formations')}
              </Link>
              <Link className="nav-dropdown__link" to="/galerie" role="menuitem">
                {navLabel('nav.gallery')}
              </Link>
              <Link className="nav-dropdown__link" to="/faq" role="menuitem">
                {navLabel('nav.faq')}
              </Link>
            </div>
          </div>

          <NavLink to="/contact">{navLabel('nav.contact')}</NavLink>

          <Link className="nav-desktop__cta" to="/devis">
            {navLabel('nav.quote')}
          </Link>

          <div className="lang-switch" role="group" aria-label="Langue">
            <button type="button" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')}>
              FR
            </button>
            <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>
              EN
            </button>
          </div>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-mobile"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open ? '×' : '☰'}
        </button>
      </div>

      <nav id="nav-mobile" className={`nav-mobile${open ? ' is-open' : ''}`} aria-label="Mobile">
        <NavLink to="/" end onClick={closeAll}>
          {navLabel('nav.home')}
        </NavLink>

        <div className="nav-mobile__group">
          <button
            type="button"
            className="nav-mobile__group-toggle"
            aria-expanded={mobileAboutOpen}
            onClick={() => setMobileAboutOpen((v) => !v)}
          >
            {navLabel('nav.about')} {mobileAboutOpen ? '▴' : '▾'}
          </button>
          {mobileAboutOpen ? (
            <div className="nav-mobile__sub">
              <NavLink to="/a-propos" onClick={closeAll}>
                {navLabel('nav.aboutOverview')}
              </NavLink>
              <NavLink to="/personnel" onClick={closeAll}>
                {navLabel('nav.personnel')}
              </NavLink>
              <NavLink to="/partenariats" onClick={closeAll}>
                {navLabel('nav.partnerships')}
              </NavLink>
            </div>
          ) : null}
        </div>

        <div className="nav-mobile__group">
          <button
            type="button"
            className="nav-mobile__group-toggle"
            aria-expanded={mobileServicesOpen}
            onClick={() => setMobileServicesOpen((v) => !v)}
          >
            {navLabel('nav.solutions')} {mobileServicesOpen ? '▴' : '▾'}
          </button>
          {mobileServicesOpen ? (
            <div className="nav-mobile__sub">
              <NavLink to="/domaines" onClick={closeAll}>
                {navLabel('nav.solutions')}
              </NavLink>
              {SERVICE_ROUTES.map(({ slug, detailKey }) => (
                <NavLink key={slug} to={`/domaines/${slug}`} onClick={closeAll}>
                  {formatNavLabel(serviceNavLabel(detailKey, t), locale)}
                </NavLink>
              ))}
            </div>
          ) : null}
        </div>

        <div className="nav-mobile__group">
          <button
            type="button"
            className="nav-mobile__group-toggle"
            aria-expanded={mobileProjectsOpen}
            onClick={() => setMobileProjectsOpen((v) => !v)}
          >
            {navLabel('nav.projects')} {mobileProjectsOpen ? '▴' : '▾'}
          </button>
          {mobileProjectsOpen ? (
            <div className="nav-mobile__sub">
              <NavLink to="/projets/agriculture" onClick={closeAll}>
                {navLabel('nav.projectsAgriculture')}
              </NavLink>
              <NavLink to="/projets/solution-cafe" onClick={closeAll}>
                {navLabel('nav.projectsSolutionCafe')}
              </NavLink>
              <NavLink to="/projets/construction" onClick={closeAll}>
                {navLabel('nav.projectsConstruction')}
              </NavLink>
              <NavLink to="/projets/wash" onClick={closeAll}>
                {navLabel('nav.projectsWash')}
              </NavLink>
            </div>
          ) : null}
        </div>

        <div className="nav-mobile__group">
          <button
            type="button"
            className="nav-mobile__group-toggle"
            aria-expanded={mobileResourcesOpen}
            onClick={() => setMobileResourcesOpen((v) => !v)}
          >
            {navLabel('nav.resources')} {mobileResourcesOpen ? '▴' : '▾'}
          </button>
          {mobileResourcesOpen ? (
            <div className="nav-mobile__sub">
              <NavLink to="/blog" onClick={closeAll}>
                {navLabel('nav.blog')}
              </NavLink>
              <NavLink to="/formations" onClick={closeAll}>
                {navLabel('nav.formations')}
              </NavLink>
              <NavLink to="/galerie" onClick={closeAll}>
                {navLabel('nav.gallery')}
              </NavLink>
              <NavLink to="/faq" onClick={closeAll}>
                {navLabel('nav.faq')}
              </NavLink>
            </div>
          ) : null}
        </div>

        <NavLink to="/contact" onClick={closeAll}>
          {navLabel('nav.contact')}
        </NavLink>
        <NavLink to="/devis" onClick={closeAll}>
          {navLabel('nav.quote')}
        </NavLink>

        <div className="lang-switch" role="group" aria-label="Langue" style={{ marginTop: '0.5rem' }}>
          <button type="button" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')}>
            FR
          </button>
          <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>
            EN
          </button>
        </div>
      </nav>
    </header>
  )
}
