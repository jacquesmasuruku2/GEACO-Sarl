import { useState, useLayoutEffect, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { SERVICE_ROUTES, serviceNavLabel } from '../data/servicesNav'
import { formatNavLabel } from '../lib/formatNavLabel'
import { SITE_CONTACT } from '../data/siteContact'

/** Au-delà de ce décalage vertical, la topbar (ligne RDC + email/tél.) se replie. */
const TOPBAR_HIDE_SCROLL_Y = 36

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const location = useLocation()

  const servicesActive = location.pathname.startsWith('/services')
  const projectsActive = location.pathname.startsWith('/projets')
  const aboutActive =
    location.pathname.startsWith('/a-propos') ||
    location.pathname.startsWith('/personnel') ||
    location.pathname.startsWith('/partenariats')
  const resourcesActive =
    location.pathname.startsWith('/blog') ||
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
          <span>{t('header.regionLine')}</span>
          <span>
            <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
            {' · '}
            <a href={`tel:${SITE_CONTACT.phonePrimaryTel}`}>{SITE_CONTACT.phonePrimaryDisplay}</a>
            {' · '}
            <a href={SITE_CONTACT.whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </span>
        </div>
      </div>
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" onClick={closeAll}>
          <img className="site-logo__image" src="/geaco-logo-transparent.png" alt={t('brand.long')} />
        </NavLink>

        <nav className="nav-desktop" aria-label="Principal">
          <NavLink to="/" end>
            {navLabel('nav.home')}
          </NavLink>

          <div className={`nav-dropdown${servicesActive ? ' nav-dropdown--active' : ''}`}>
            <NavLink className="nav-dropdown__trigger" to="/services" end={false}>
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
                  to={`/services/${slug}`}
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
              <Link className="nav-dropdown__link" to="/projets/construction" role="menuitem">
                {navLabel('nav.projectsConstruction')}
              </Link>
              <Link className="nav-dropdown__link" to="/projets/wash" role="menuitem">
                {navLabel('nav.projectsWash')}
              </Link>
            </div>
          </div>

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
              <Link className="nav-dropdown__link" to="/galerie" role="menuitem">
                {navLabel('nav.gallery')}
              </Link>
              <Link className="nav-dropdown__link" to="/faq" role="menuitem">
                {navLabel('nav.faq')}
              </Link>
            </div>
          </div>

          <NavLink to="/contact">{navLabel('nav.contact')}</NavLink>

          <Link className="btn btn--primary nav-desktop__cta" to="/devis">
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
            aria-expanded={mobileServicesOpen}
            onClick={() => setMobileServicesOpen((v) => !v)}
          >
            {navLabel('nav.solutions')} {mobileServicesOpen ? '▴' : '▾'}
          </button>
          {mobileServicesOpen ? (
            <div className="nav-mobile__sub">
              <NavLink to="/services" onClick={closeAll}>
                {navLabel('nav.solutions')}
              </NavLink>
              {SERVICE_ROUTES.map(({ slug, detailKey }) => (
                <NavLink key={slug} to={`/services/${slug}`} onClick={closeAll}>
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
