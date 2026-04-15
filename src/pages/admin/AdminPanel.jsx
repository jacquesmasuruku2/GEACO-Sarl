import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAdminAccess } from '../../hooks/useAdminAccess'
import { ProjectsAdmin } from './editors/ProjectsAdmin'
import { PartnersAdmin } from './editors/PartnersAdmin'
import { ServiceContentAdmin } from './editors/ServiceContentAdmin'
import { BlogAdmin } from './editors/BlogAdmin'
import { PersonnelAdmin } from './editors/PersonnelAdmin'
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
  const modules = useMemo(
    () => [
      { id: 'projects', label: 'Projets', description: 'Portefeuille de réalisations et impacts.', render: ProjectsAdmin },
      { id: 'partners', label: 'Partenaires', description: 'Cartes partenaires et publication.', render: PartnersAdmin },
      { id: 'blog', label: 'Blog', description: 'Articles, mises en forme et dates.', render: BlogAdmin },
      { id: 'personnel', label: 'Notre Equipe', description: 'Fiches équipe, rôles et réseaux.', render: PersonnelAdmin },
      { id: 'gallery', label: 'Galerie', description: 'Photos de galerie et albums.', render: GalleryAdmin },
      { id: 'services', label: 'Pages services', description: 'Contenu éditorial des pages métier.', render: ServiceContentAdmin },
    ],
    [],
  )
  const [activeModuleId, setActiveModuleId] = useState('projects')
  const [dashboardOpen, setDashboardOpen] = useState(false)
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

    const hasAnyMissing =
      [
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

  if (!isSupabaseConfigured || !supabase) {
    return <Navigate to="/auth-admin" replace />
  }

  if (loading) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Vérification de la session…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/auth-admin" replace />
  }

  if (verificationFailed) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <h1>Vérification temporairement indisponible</h1>
          <p>
            La connexion a réussi, mais le serveur n’a pas pu confirmer vos droits d’administration (réseau ou
            charge). Réessayez : cela ne signifie pas que votre mot de passe est incorrect.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn--primary" onClick={() => recheckAdmin()}>
              Réessayer la vérification
            </button>
            <button type="button" className="btn btn--outline" onClick={() => supabase.auth.signOut()}>
              Se déconnecter
            </button>
          </div>
          <p style={{ marginTop: '1.25rem' }}>
            <Link to="/">Retour au site</Link>
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <h1>Accès refusé</h1>
          <p>Ce compte n’est pas autorisé à modifier le contenu publié.</p>
          <p className="admin-muted">
            Si vous venez de créer le compte, vérifiez dans Supabase que votre <code>user_id</code> figure bien
            dans la table <code>public.app_admins</code> (script <code>scripts/create-admin-user.mjs</code> ou SQL
            manuel).
          </p>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => supabase.auth.signOut()}
          >
            Se déconnecter
          </button>
          <p>
            <Link to="/">Retour au site</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell admin-shell--wide">
      <header className="admin-header">
        <div>
          <p className="admin-chip">GEACO CMS</p>
          <h1>Studio de publication</h1>
        </div>
        <div className="admin-header__actions">
          <Link className="btn btn--ghost" to="/">
            Voir le site
          </Link>
          <button type="button" className="btn btn--outline" onClick={() => supabase.auth.signOut()}>
            Déconnexion
          </button>
        </div>
      </header>

      <section className="admin-layout">
        <aside className="admin-sidebar admin-sidebar--iconic">
          <div className="admin-tabs" role="tablist" aria-label="Modules du CMS">
            {modules.map((module) => (
              <button
                key={module.id}
                type="button"
                role="tab"
                aria-selected={activeModuleId === module.id}
                className={activeModuleId === module.id ? 'is-active' : ''}
                onClick={() => setActiveModuleId(module.id)}
                title={module.label}
                aria-label={module.label}
                data-label={module.label}
              >
                <span className="admin-tabs__icon" aria-hidden="true">
                  <PanelIcon name={module.id} />
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="admin-workspace">
          <section className="admin-dashboard">
            <div className="admin-dashboard__head">
              <h2>Tableau de bord</h2>
              <div className="admin-dashboard__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setDashboardOpen((v) => !v)}>
                  {dashboardOpen ? 'Masquer' : 'Afficher'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={loadDashboard}>
                  Actualiser
                </button>
              </div>
            </div>
            <div className="admin-kpi-strip" aria-live="polite">
              <span>Projets: {dashboard.data.projects.published}</span>
              <span>Blog: {dashboard.data.blog.published}</span>
              <span>Partenaires: {dashboard.data.partners.published}</span>
              <span>Notre Equipe: {dashboard.data.personnel.published}</span>
            </div>
            {dashboardOpen ? (
              <>
                {dashboard.loading ? <p className="admin-muted">Chargement des statistiques…</p> : null}
                {dashboard.error ? <p className="admin-error">{dashboard.error}</p> : null}
                <div className="admin-kpi-grid">
                  <article className="admin-kpi-card">
                    <h3>Projets</h3>
                    <p>{dashboard.data.projects.total} total</p>
                    <p>{dashboard.data.projects.published} publies</p>
                  </article>
                  <article className="admin-kpi-card">
                    <h3>Articles</h3>
                    <p>{dashboard.data.blog.total} total</p>
                    <p>{dashboard.data.blog.published} publies</p>
                  </article>
                  <article className="admin-kpi-card">
                    <h3>Partenaires</h3>
                    <p>{dashboard.data.partners.total} total</p>
                    <p>{dashboard.data.partners.published} publies</p>
                  </article>
                  <article className="admin-kpi-card">
                    <h3>Notre Equipe</h3>
                    <p>{dashboard.data.personnel.total} total</p>
                    <p>{dashboard.data.personnel.published} publies</p>
                  </article>
                  <article className="admin-kpi-card">
                    <h3>Pages services</h3>
                    <p>{dashboard.data.services.total} pages en base</p>
                  </article>
                  <article className="admin-kpi-card">
                    <h3>Galerie</h3>
                    <p>{dashboard.data.gallery.total} photos</p>
                    <p>{dashboard.data.gallery.published} publiees</p>
                  </article>
                  <article className="admin-kpi-card">
                    <h3>Messages entrants</h3>
                    <p>{dashboard.data.leads.total} contacts</p>
                    <p>{dashboard.data.partnerships.total} demandes</p>
                  </article>
                </div>
              </>
            ) : null}
          </section>

          <p className="admin-muted" style={{ marginBottom: '1rem' }}>
            Les modifications sont enregistrées dans Supabase et s’affichent sur le site public lorsque les
            lignes sont publiées (projets / partenaires / blog / notre equipe) ou lorsque le contenu service est
            renseigné.
          </p>
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
      </section>
    </div>
  )
}
