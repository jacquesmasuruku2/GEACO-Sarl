import { Link, Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAdminAccess } from '../../hooks/useAdminAccess'
import { ProjectsAdmin } from './editors/ProjectsAdmin'
import { PartnersAdmin } from './editors/PartnersAdmin'
import { ServiceContentAdmin } from './editors/ServiceContentAdmin'
import { BlogAdmin } from './editors/BlogAdmin'
import { PersonnelAdmin } from './editors/PersonnelAdmin'

export function AdminPanel() {
  const { loading, session, isAdmin } = useAdminAccess()

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

  if (!isAdmin) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <h1>Accès refusé</h1>
          <p>Ce compte n’est pas autorisé à modifier le contenu publié.</p>
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
        <h1>Publication — GEACO</h1>
        <div className="admin-header__actions">
          <Link className="btn btn--ghost" to="/">
            Voir le site
          </Link>
          <button type="button" className="btn btn--outline" onClick={() => supabase.auth.signOut()}>
            Déconnexion
          </button>
        </div>
      </header>

      <p className="admin-muted" style={{ marginBottom: '2rem' }}>
        Les modifications sont enregistrées dans Supabase et s’affichent sur le site public lorsque les
        lignes sont publiées (projets / partenaires / blog / personnel) ou lorsque le contenu service est
        renseigné.
      </p>

      <ProjectsAdmin />
      <PartnersAdmin />
      <BlogAdmin />
      <PersonnelAdmin />
      <ServiceContentAdmin />
    </div>
  )
}
