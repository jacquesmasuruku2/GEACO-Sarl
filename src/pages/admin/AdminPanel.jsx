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

function PanelIcon({ name }) {
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

export function AdminPanel() {
  const { loading, session, isAdmin, verificationFailed, recheckAdmin } = useAdminAccess()
  const allowUnloadRef = useRef(false)
  const modules = useMemo(
    () => [
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
  const [activeModuleId, setActiveModuleId] = useState('projects')
  const [dashboardOpen, setDashboardOpen] = useState(false)
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
      leads: { total: 0 },
      partnerships: { total: 0 },
    },
  })

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? modules[0]
  const userEmail = session?.user?.email ?? ''

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
      leadsTotal,
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
      countQuery(supabase.from('site_lead_messages').select('*', { count: 'exact', head: true })),
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
      leadsTotal,
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
        leads: { total: leadsTotal ?? 0 },
        partnerships: { total: partnershipsTotal ?? 0 },
      },
    })
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
          {modules.map((module) => (
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
              <p className="admin-app__eyebrow">Publication</p>
              <h1>{activeModule.label}</h1>
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
          <section className="admin-dashboard">
            <div className="admin-dashboard__head">
              <div>
                <h2>Aperçu</h2>
                <p className="admin-muted">Contenus publiés sur le site</p>
              </div>
              <div className="admin-dashboard__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setDashboardOpen((v) => !v)}>
                  {dashboardOpen ? 'Masquer' : 'Détails'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={loadDashboard}>
                  Actualiser
                </button>
              </div>
            </div>
            <div className="admin-kpi-strip" aria-live="polite">
              <span>
                <strong>{dashboard.data.projects.published}</strong> projets
              </span>
              <span>
                <strong>{dashboard.data.blog.published}</strong> articles
              </span>
              <span>
                <strong>{dashboard.data.partners.published}</strong> partenaires
              </span>
              <span>
                <strong>{dashboard.data.personnel.published}</strong> équipe
              </span>
            </div>
            {dashboardOpen ? (
              <>
                {dashboard.loading ? <p className="admin-muted">Chargement des statistiques…</p> : null}
                {dashboard.error ? <p className="admin-error">{dashboard.error}</p> : null}
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
                    <p>{dashboard.data.leads.total} contacts</p>
                    <p>{dashboard.data.partnerships.total} partenariats</p>
                  </article>
                </div>
              </>
            ) : null}
          </section>

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
