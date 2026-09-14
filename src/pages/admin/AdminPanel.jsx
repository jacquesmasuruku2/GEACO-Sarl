import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAdminAccess } from '../../hooks/useAdminAccess'
import { ProjectsAdmin } from './editors/ProjectsAdmin'
import { PartnersAdmin } from './editors/PartnersAdmin'
import { ServiceContentAdmin } from './editors/ServiceContentAdmin'
import { BlogAdmin } from './editors/BlogAdmin'
import { PersonnelAdmin } from './editors/PersonnelAdmin'
import { ServiceCardsAdmin } from './editors/ServiceCardsAdmin'
import { GalleryAdmin } from './editors/GalleryAdmin'
import {
  ContactMessagesAdmin,
  QuoteMessagesAdmin,
  PartnershipMessagesAdmin,
} from './editors/InboxMessagesAdmin'

function PanelIcon({ name }) {
  if (name === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h7v7H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 13h7v7H4z" />
      </svg>
    )
  }
  if (name === 'contacts') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16v12H4zM4 8l8 5 8-5" />
      </svg>
    )
  }
  if (name === 'quotes') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h8l4 4v14H7zM15 3v4h4M9 13h6M9 17h6M9 9h3" />
      </svg>
    )
  }
  if (name === 'partnerships') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a5 5 0 0 1 10 0M11 20a5 5 0 0 1 10 0" />
      </svg>
    )
  }
  if (name === 'projects') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h18M6 7V5h12v2M5 7h14v12H5z" />
      </svg>
    )
  }
  if (name === 'partners') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20a5 5 0 0 1 10 0M12 20a5 5 0 0 1 10 0" />
      </svg>
    )
  }
  if (name === 'blog') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4h11l3 3v13H5zM16 4v3h3M8 12h8M8 16h8M8 8h5" />
      </svg>
    )
  }
  if (name === 'personnel') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0" />
      </svg>
    )
  }
  if (name === 'cards') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 7h18v10H3zM7 11h6M7 14h4" />
      </svg>
    )
  }
  if (name === 'gallery') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v14H4zM8 10h.01M20 16l-5-5-4 4-2-2-5 5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function formatDashboardTime(date) {
  if (!date) return ''
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return ''
  }
}

export function AdminPanel() {
  const { loading, session, isAdmin, verificationFailed, recheckAdmin } = useAdminAccess()
  const allowUnloadRef = useRef(false)
  const modules = useMemo(
    () => [
      {
        id: 'contacts',
        label: 'Contacts',
        description: 'Messages reçus via la page Contact.',
        render: ContactMessagesAdmin,
        group: 'inbox',
      },
      {
        id: 'quotes',
        label: 'Devis',
        description: 'Demandes de devis reçues via le formulaire /devis.',
        render: QuoteMessagesAdmin,
        group: 'inbox',
      },
      {
        id: 'partnerships',
        label: 'Partenariats',
        description: 'Demandes de partenariat reçues via le site.',
        render: PartnershipMessagesAdmin,
        group: 'inbox',
      },
      { id: 'projects', label: 'Projets', description: 'Fiches projets type blog : image, date, description.', render: ProjectsAdmin },
      { id: 'partners', label: 'Partenaires', description: 'Cartes partenaires et publication.', render: PartnersAdmin },
      { id: 'blog', label: 'Blog', description: 'Articles, mises en forme et dates.', render: BlogAdmin },
      { id: 'personnel', label: 'Équipe', description: 'Fiches équipe, rôles et réseaux.', render: PersonnelAdmin },
      {
        id: 'cards',
        label: 'Cartes',
        description: 'Cartes de service GEACO : édition, aperçu et impression.',
        render: ServiceCardsAdmin,
      },
      { id: 'gallery', label: 'Galerie', description: 'Photos de galerie et albums.', render: GalleryAdmin },
      { id: 'services', label: 'Services', description: 'Contenu éditorial des pages métier.', render: ServiceContentAdmin },
    ],
    [],
  )
  const contentModules = useMemo(() => modules.filter((m) => m.group !== 'inbox'), [modules])
  const inboxModules = useMemo(() => modules.filter((m) => m.group === 'inbox'), [modules])
  const [activeModuleId, setActiveModuleId] = useState('dashboard')
  const [dashboardUpdatedAt, setDashboardUpdatedAt] = useState(null)
  const [navOpen, setNavOpen] = useState(false)
  const [dashboard, setDashboard] = useState({
    loading: true,
    error: '',
    data: {
      projects: { total: 0, published: 0 },
      blog: { total: 0, published: 0 },
      partners: { total: 0, published: 0 },
      personnel: { total: 0, published: 0 },
      services: { total: 0 },
      gallery: { total: 0, published: 0 },
      contacts: { total: 0 },
      quotes: { total: 0 },
      partnerships: { total: 0 },
    },
  })

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? null
  const isDashboard = activeModuleId === 'dashboard'
  const userEmail = session?.user?.email ?? ''
  const publishedTotal =
    dashboard.data.projects.published +
    dashboard.data.blog.published +
    dashboard.data.partners.published +
    dashboard.data.personnel.published +
    dashboard.data.gallery.published
  const inboxTotal =
    dashboard.data.contacts.total + dashboard.data.quotes.total + dashboard.data.partnerships.total

  const kpiTiles = useMemo(
    () => [
      {
        id: 'projects',
        label: 'Projets',
        tone: 'blue',
        value: dashboard.data.projects.published,
        meta: `${dashboard.data.projects.total} au total`,
      },
      {
        id: 'blog',
        label: 'Articles',
        tone: 'sky',
        value: dashboard.data.blog.published,
        meta: `${dashboard.data.blog.total} au total`,
      },
      {
        id: 'partners',
        label: 'Partenaires',
        tone: 'teal',
        value: dashboard.data.partners.published,
        meta: `${dashboard.data.partners.total} au total`,
      },
      {
        id: 'personnel',
        label: 'Équipe',
        tone: 'navy',
        value: dashboard.data.personnel.published,
        meta: `${dashboard.data.personnel.total} fiches`,
      },
      {
        id: 'gallery',
        label: 'Galerie',
        tone: 'amber',
        value: dashboard.data.gallery.published,
        meta: `${dashboard.data.gallery.total} photos`,
      },
      {
        id: 'services',
        label: 'Services',
        tone: 'slate',
        value: dashboard.data.services.total,
        meta: 'pages en base',
      },
    ],
    [dashboard.data],
  )

  const loadDashboard = useCallback(async () => {
    if (!supabase) return
    setDashboard((prev) => ({ ...prev, loading: true, error: '' }))

    async function countQuery(queryPromise) {
      const { count, error } = await queryPromise
      if (error) return null
      return Number(count) || 0
    }

    const [
      projectsTotal,
      projectsPublished,
      blogTotal,
      blogPublished,
      partnersTotal,
      partnersPublished,
      personnelTotal,
      personnelPublished,
      servicesTotal,
      galleryTotal,
      galleryPublished,
      contactsTotal,
      quotesTotal,
      partnershipsTotal,
    ] = await Promise.all([
      countQuery(supabase.from('site_projects').select('*', { count: 'exact', head: true })),
      countQuery(supabase.from('site_projects').select('*', { count: 'exact', head: true }).eq('published', true)),
      countQuery(supabase.from('site_blog_posts').select('*', { count: 'exact', head: true })),
      countQuery(supabase.from('site_blog_posts').select('*', { count: 'exact', head: true }).eq('published', true)),
      countQuery(supabase.from('site_partners').select('*', { count: 'exact', head: true })),
      countQuery(supabase.from('site_partners').select('*', { count: 'exact', head: true }).eq('published', true)),
      countQuery(supabase.from('site_personnel').select('*', { count: 'exact', head: true })),
      countQuery(supabase.from('site_personnel').select('*', { count: 'exact', head: true }).eq('published', true)),
      countQuery(supabase.from('site_service_content').select('*', { count: 'exact', head: true })),
      countQuery(supabase.from('site_gallery_photos').select('*', { count: 'exact', head: true })),
      countQuery(supabase.from('site_gallery_photos').select('*', { count: 'exact', head: true }).eq('published', true)),
      countQuery(
        supabase.from('site_lead_messages').select('*', { count: 'exact', head: true }).eq('source', 'contact'),
      ),
      countQuery(
        supabase.from('site_lead_messages').select('*', { count: 'exact', head: true }).eq('source', 'quote'),
      ),
      countQuery(supabase.from('site_partnership_messages').select('*', { count: 'exact', head: true })),
    ])

    const hasAnyMissing = [
      projectsTotal,
      projectsPublished,
      blogTotal,
      blogPublished,
      partnersTotal,
      partnersPublished,
      personnelTotal,
      personnelPublished,
      servicesTotal,
      galleryTotal,
      galleryPublished,
      contactsTotal,
      quotesTotal,
      partnershipsTotal,
    ].some((v) => v === null)

    setDashboard({
      loading: false,
      error: hasAnyMissing ? 'Certaines statistiques n’ont pas pu être chargées.' : '',
      data: {
        projects: { total: projectsTotal ?? 0, published: projectsPublished ?? 0 },
        blog: { total: blogTotal ?? 0, published: blogPublished ?? 0 },
        partners: { total: partnersTotal ?? 0, published: partnersPublished ?? 0 },
        personnel: { total: personnelTotal ?? 0, published: personnelPublished ?? 0 },
        services: { total: servicesTotal ?? 0 },
        gallery: { total: galleryTotal ?? 0, published: galleryPublished ?? 0 },
        contacts: { total: contactsTotal ?? 0 },
        quotes: { total: quotesTotal ?? 0 },
        partnerships: { total: partnershipsTotal ?? 0 },
      },
    })
    setDashboardUpdatedAt(new Date())
  }, [])

  useEffect(() => {
    if (session && isAdmin) {
      loadDashboard()
    }
  }, [session, isAdmin, loadDashboard])

  useEffect(() => {
    if (!session || !isAdmin) return

    function onBeforeUnload(event) {
      if (allowUnloadRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    function onKeyDown(event) {
      if (allowUnloadRef.current) return
      const key = String(event.key || '').toLowerCase()
      const wantsRefresh = key === 'f5' || ((event.ctrlKey || event.metaKey) && key === 'r')
      if (!wantsRefresh) return
      event.preventDefault()
      window.alert('Rafraîchissement bloqué pour éviter de perdre le contenu en cours. Cliquez sur Enregistrer.')
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [session, isAdmin])

  useEffect(() => {
    if (!navOpen) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') setNavOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [navOpen])

  function signOutSafely() {
    allowUnloadRef.current = true
    supabase.auth.signOut()
    window.setTimeout(() => {
      allowUnloadRef.current = false
    }, 1500)
  }

  function selectModule(id) {
    setActiveModuleId(id)
    setNavOpen(false)
  }

  if (!isSupabaseConfigured || !supabase) {
    return <Navigate to="/auth-admin" replace />
  }

  if (loading) {
    return (
      <div className="admin-app admin-app--status">
        <p className="admin-muted">Vérification de la session…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth-admin" replace />
  }

  if (verificationFailed) {
    return (
      <div className="admin-app admin-app--status">
        <div className="admin-status-card">
          <h1>Vérification temporairement indisponible</h1>
          <p>
            La connexion a réussi, mais le serveur n’a pas pu confirmer vos droits d’administration. Réessayez :
            cela ne signifie pas que votre mot de passe est incorrect.
          </p>
          <div className="admin-status-card__actions">
            <button type="button" className="btn btn--primary" onClick={() => recheckAdmin()}>
              Réessayer
            </button>
            <button type="button" className="btn btn--outline" onClick={() => supabase.auth.signOut()}>
              Se déconnecter
            </button>
          </div>
          <Link to="/">Retour au site</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-app admin-app--status">
        <div className="admin-status-card">
          <h1>Accès refusé</h1>
          <p>Ce compte n’est pas autorisé à modifier le contenu publié.</p>
          <p className="admin-muted">
            Vérifiez dans Supabase que votre compte figure dans <code>public.app_admins</code>.
          </p>
          <button type="button" className="btn btn--outline" onClick={signOutSafely}>
            Se déconnecter
          </button>
          <Link to="/">Retour au site</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`admin-app${navOpen ? ' is-nav-open' : ''}`}>
      <aside className="admin-app__sidebar">
        <div className="admin-app__brand">
          <img src="/geaco-logo-transparent.png" alt="" />
          <div>
            <strong>GEACO</strong>
            <span>Studio CMS</span>
          </div>
        </div>

        <nav className="admin-app__nav" aria-label="Modules du CMS">
          <button
            type="button"
            className={isDashboard ? 'is-active' : ''}
            onClick={() => selectModule('dashboard')}
          >
            <span className="admin-app__nav-icon" aria-hidden="true">
              <PanelIcon name="dashboard" />
            </span>
            <span>Tableau de bord</span>
          </button>

          <p className="admin-app__nav-label">Messages</p>
          {inboxModules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={activeModuleId === module.id ? 'is-active' : ''}
              onClick={() => selectModule(module.id)}
            >
              <span className="admin-app__nav-icon" aria-hidden="true">
                <PanelIcon name={module.id} />
              </span>
              <span>{module.label}</span>
              <span className="admin-app__nav-count" aria-hidden="true">
                {module.id === 'contacts'
                  ? dashboard.data.contacts.total
                  : module.id === 'quotes'
                    ? dashboard.data.quotes.total
                    : dashboard.data.partnerships.total}
              </span>
            </button>
          ))}

          <p className="admin-app__nav-label">Contenu</p>
          {contentModules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={activeModuleId === module.id ? 'is-active' : ''}
              onClick={() => selectModule(module.id)}
            >
              <span className="admin-app__nav-icon" aria-hidden="true">
                <PanelIcon name={module.id} />
              </span>
              <span>{module.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-app__sidebar-foot">
          <Link to="/" className="admin-app__side-link">
            Voir le site
          </Link>
        </div>
      </aside>

      {navOpen ? (
        <button
          type="button"
          className="admin-app__backdrop"
          aria-label="Fermer le menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div className="admin-app__main">
        <header className="admin-app__topbar">
          <div className="admin-app__topbar-left">
            <button
              type="button"
              className="admin-app__menu-btn"
              aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <div>
              <p className="admin-app__eyebrow">{isDashboard ? 'Vue d’ensemble' : 'Publication'}</p>
              <h1>{isDashboard ? 'Tableau de bord' : activeModule?.label}</h1>
            </div>
          </div>
          <div className="admin-app__topbar-right">
            {userEmail ? <span className="admin-app__user">{userEmail}</span> : null}
            <Link className="btn btn--ghost admin-app__btn-ghost" to="/">
              Site
            </Link>
            <button type="button" className="btn btn--outline" onClick={signOutSafely}>
              Déconnexion
            </button>
          </div>
        </header>

        <div className="admin-app__content">
          {isDashboard ? (
            <section className="admin-dashboard" aria-live="polite">
              <div className="admin-dashboard__hero">
                <div className="admin-dashboard__hero-copy">
                  <p className="admin-dashboard__kicker">GEACO Studio CMS</p>
                  <h2>Bienvenue dans l’espace de publication</h2>
                  <p>
                    Suivez les contenus en ligne, les messages entrants et ouvrez rapidement le module dont vous
                    avez besoin.
                  </p>
                </div>
                <div className="admin-dashboard__hero-aside">
                  <div className="admin-dashboard__hero-stat">
                    <span>Publiés</span>
                    <strong>{dashboard.loading ? '…' : publishedTotal}</strong>
                  </div>
                  <div className="admin-dashboard__hero-stat">
                    <span>Messages</span>
                    <strong>{dashboard.loading ? '…' : inboxTotal}</strong>
                  </div>
                  <button type="button" className="btn btn--primary" onClick={loadDashboard}>
                    Actualiser
                  </button>
                  {dashboardUpdatedAt ? (
                    <p className="admin-dashboard__updated">
                      Mis à jour · {formatDashboardTime(dashboardUpdatedAt)}
                    </p>
                  ) : null}
                </div>
              </div>

              {dashboard.error ? <p className="admin-error admin-feedback">{dashboard.error}</p> : null}

              <div className="admin-dashboard__section-head">
                <h3>Indicateurs</h3>
                <p>Touchez une tuile pour ouvrir le module</p>
              </div>

              <div className="admin-dashboard__rail" tabIndex={0}>
                {kpiTiles.map((tile) => (
                  <button
                    key={tile.id}
                    type="button"
                    className={`admin-dashboard__tile tone-${tile.tone}`}
                    onClick={() => selectModule(tile.id)}
                  >
                    <span className="admin-dashboard__tile-icon" aria-hidden="true">
                      <PanelIcon name={tile.id} />
                    </span>
                    <span className="admin-dashboard__tile-label">{tile.label}</span>
                    <strong className="admin-dashboard__tile-value">
                      {dashboard.loading ? '—' : tile.value}
                    </strong>
                    <span className="admin-dashboard__tile-meta">{tile.meta}</span>
                  </button>
                ))}
              </div>

              <div className="admin-dashboard__panels">
                <article className="admin-dashboard__panel">
                  <header>
                    <h3>Boîte de réception</h3>
                    <p>Ouvrir les messages reçus via le site</p>
                  </header>
                  <div className="admin-dashboard__inbox-actions">
                    <button type="button" className="admin-dashboard__inbox-btn" onClick={() => selectModule('contacts')}>
                      <span>
                        <strong>Contacts</strong>
                        <small>Page Contact</small>
                      </span>
                      <em>{dashboard.loading ? '—' : dashboard.data.contacts.total}</em>
                    </button>
                    <button type="button" className="admin-dashboard__inbox-btn" onClick={() => selectModule('quotes')}>
                      <span>
                        <strong>Devis</strong>
                        <small>Demandes de chiffrage</small>
                      </span>
                      <em>{dashboard.loading ? '—' : dashboard.data.quotes.total}</em>
                    </button>
                    <button
                      type="button"
                      className="admin-dashboard__inbox-btn"
                      onClick={() => selectModule('partnerships')}
                    >
                      <span>
                        <strong>Partenariats</strong>
                        <small>Propositions reçues</small>
                      </span>
                      <em>{dashboard.loading ? '—' : dashboard.data.partnerships.total}</em>
                    </button>
                  </div>
                </article>

                <article className="admin-dashboard__panel">
                  <header>
                    <h3>Accès rapides</h3>
                    <p>Ouvrir un module de contenu</p>
                  </header>
                  <div className="admin-dashboard__shortcuts">
                    {contentModules.map((module) => (
                      <button
                        key={`dash-${module.id}`}
                        type="button"
                        className="admin-dashboard__shortcut"
                        onClick={() => selectModule(module.id)}
                      >
                        <span className="admin-app__nav-icon" aria-hidden="true">
                          <PanelIcon name={module.id} />
                        </span>
                        <span>
                          <strong>{module.label}</strong>
                          <small>{module.description}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </article>
              </div>

              <div className="admin-dashboard__section-head">
                <h3>Détail des contenus</h3>
                <p>Publiés vs total en base</p>
              </div>

              <div className="admin-kpi-grid">
                <article className="admin-kpi-card">
                  <h3>Projets</h3>
                  <p>{dashboard.data.projects.total} total</p>
                  <p>{dashboard.data.projects.published} publiés</p>
                </article>
                <article className="admin-kpi-card">
                  <h3>Articles</h3>
                  <p>{dashboard.data.blog.total} total</p>
                  <p>{dashboard.data.blog.published} publiés</p>
                </article>
                <article className="admin-kpi-card">
                  <h3>Partenaires</h3>
                  <p>{dashboard.data.partners.total} total</p>
                  <p>{dashboard.data.partners.published} publiés</p>
                </article>
                <article className="admin-kpi-card">
                  <h3>Équipe</h3>
                  <p>{dashboard.data.personnel.total} total</p>
                  <p>{dashboard.data.personnel.published} publiés</p>
                </article>
                <article className="admin-kpi-card">
                  <h3>Pages services</h3>
                  <p>{dashboard.data.services.total} pages en base</p>
                </article>
                <article className="admin-kpi-card">
                  <h3>Galerie</h3>
                  <p>{dashboard.data.gallery.total} photos</p>
                  <p>{dashboard.data.gallery.published} publiées</p>
                </article>
                <article className="admin-kpi-card">
                  <h3>Messages</h3>
                  <p>{dashboard.data.contacts.total} contacts</p>
                  <p>{dashboard.data.quotes.total} devis</p>
                  <p>{dashboard.data.partnerships.total} partenariats</p>
                </article>
              </div>
            </section>
          ) : null}

          {modules.map((module) => {
            const ModuleComponent = module.render
            const isActive = activeModuleId === module.id
            return (
              <section
                key={module.id}
                className="admin-module-panel"
                role="tabpanel"
                aria-hidden={!isActive}
                hidden={!isActive}
              >
                <div className="admin-module-head">
                  <h2>{module.label}</h2>
                  <p className="admin-muted">{module.description}</p>
                </div>
                {isActive ? <ModuleComponent /> : null}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
