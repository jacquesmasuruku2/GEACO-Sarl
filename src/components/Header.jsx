import { useState, useLayoutEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n'
import { SERVICE_ROUTES, serviceNavLabel } from '../data/servicesNav'
import { formatNavLabel } from '../lib/formatNavLabel'

const mainLinksBeforeServices = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/personnel', key: 'nav.personnel', end: false },
]

const mainLinksAfterServices = [
  { to: '/projets', key: 'nav.projects', end: false },
  { to: '/blog', key: 'nav.blog', end: false },
  { to: '/partenariats', key: 'nav.partnerships', end: false },
  { to: '/contact', key: 'nav.contact', end: false },
]

/** Au-delà de ce décalage vertical, la topbar (ligne RDC + email/tél.) se replie. */
const TOPBAR_HIDE_SCROLL_Y = 36

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
  const location = useLocation()
  const servicesActive = location.pathname.startsWith('/services')
  const aboutActive = location.pathname.startsWith('/a-propos') || location.pathname === '/faq'

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

  const closeAll = () => {
    setOpen(false)
    setMobileServicesOpen(false)
    setMobileAboutOpen(false)
  }

  const navLabel = (key) => formatNavLabel(t(key), locale)

  return (
    <header className="site-header">
      <div className="site-topbar">
        <div className="site-topbar__inner">
          <span>{t('header.regionLine')}</span>
          <span>
            <a href="mailto:geacosarl@gmail.com">geacosarl@gmail.com</a>
            {' · '}
            <a href="tel:+243836895855">+243836895855</a>
          </span>
        </div>
      </div>
      <div className="site-header__inner">
        <NavLink to="/" className="site-logo" onClick={closeAll}>
          <img className="site-logo__image" src="/geaco-logo-transparent.png" alt={t('brand.long')} />
        </NavLink>

        <nav className="nav-desktop" aria-label="Principal">
          {mainLinksBeforeServices.map(({ to, key, end }) => (
            <NavLink key={to} to={to} end={end}>
              {navLabel(key)}
            </NavLink>
          ))}

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
              <Link className="nav-dropdown__link" to="/faq" role="menuitem">
                {navLabel('nav.faq')}
              </Link>
            </div>
          </div>

          <div className={`nav-dropdown${servicesActive ? ' nav-dropdown--active' : ''}`}>
            <NavLink className="nav-dropdown__trigger" to="/services" end={false}>
              {navLabel('nav.services')}
              <span className="nav-dropdown__caret" aria-hidden="true">
                ▾
              </span>
            </NavLink>
            <div className="nav-dropdown__panel" role="menu">
              <Link className="nav-dropdown__link" to="/services" role="menuitem">
                {navLabel('nav.servicesOverview')}
              </Link>
              {SERVICE_ROUTES.map(({ slug, detailKey }) => (
                <Link key={slug} className="nav-dropdown__link" to={`/services/${slug}`} role="menuitem">
                  {formatNavLabel(serviceNavLabel(detailKey, t), locale)}
                </Link>
              ))}
            </div>
          </div>

          {mainLinksAfterServices.map(({ to, key, end }) => (
            <NavLink key={to} to={to} end={end}>
              {navLabel(key)}
            </NavLink>
          ))}

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
        {mainLinksBeforeServices.map(({ to, key, end }) => (
          <NavLink key={to} to={to} end={end} onClick={closeAll}>
            {navLabel(key)}
          </NavLink>
        ))}

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
              <NavLink to="/faq" onClick={closeAll}>
                {navLabel('nav.faq')}
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
            {navLabel('nav.services')} {mobileServicesOpen ? '▴' : '▾'}
          </button>
          {mobileServicesOpen ? (
            <div className="nav-mobile__sub">
              <NavLink to="/services" onClick={closeAll}>
                {navLabel('nav.servicesOverview')}
              </NavLink>
              {SERVICE_ROUTES.map(({ slug, detailKey }) => (
                <NavLink key={slug} to={`/services/${slug}`} onClick={closeAll}>
                  {formatNavLabel(serviceNavLabel(detailKey, t), locale)}
                </NavLink>
              ))}
            </div>
          ) : null}
        </div>

        {mainLinksAfterServices.map(({ to, key, end }) => (
          <NavLink key={to} to={to} end={end} onClick={closeAll}>
            {navLabel(key)}
          </NavLink>
        ))}

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
