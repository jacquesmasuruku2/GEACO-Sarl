import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function AuthAdmin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [session, setSession] = useState(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setChecked(true)
    })
  }, [])

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="admin-shell">
        <div className="admin-card">
          <h1>Administration</h1>
          <p>
            Supabase n’est pas disponible dans cette version du site : les variables{' '}
            <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> doivent être présentes{' '}
            <strong>au moment du build</strong> (Vite les intègre dans le bundle).
          </p>
          <p className="admin-muted">
            <strong>En local</strong> : fichier <code>.env</code> à la racine du dossier <code>geaco-sarl</code> (voir{' '}
            <code>.env.example</code>), puis <code>npm run dev</code>.
            <br />
            <strong>Sur Vercel</strong> : Settings → Environment Variables → ajoutez les deux clés pour{' '}
            <strong>Production</strong>, enregistrez, puis <strong>Redeploy</strong>. Le fichier <code>.env</code> n’est
            jamais envoyé sur GitHub : le déploiement ne le voit pas.
          </p>
          <p className="admin-muted">
            Ensuite, appliquez les migrations SQL dans Supabase (dont <code>001_site_content.sql</code> pour les
            admins).
          </p>
          <Link to="/">Retour au site</Link>
        </div>
      </div>
    )
  }

  if (!checked) {
    return (
      <div className="admin-shell">
        <p className="admin-muted">Chargement…</p>
      </div>
    )
  }

  if (session) {
    return <Navigate to="/auth-admin/panel" replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (signErr) {
      setError(signErr.message)
      return
    }
    navigate('/auth-admin/panel', { replace: true })
  }

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <h1>Connexion administrateur</h1>
        <p className="admin-muted">
          Accès réservé : votre compte doit être enregistré dans la table <code>app_admins</code> du
          projet Supabase.
        </p>
        <form onSubmit={onSubmit} className="admin-form">
          <label htmlFor="adm-email">Email</label>
          <input
            id="adm-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="adm-pass">Mot de passe</label>
          <input
            id="adm-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error ? <p className="admin-error">{error}</p> : null}
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
        <p style={{ marginTop: '1.25rem' }}>
          <Link to="/">← Retour au site public</Link>
        </p>
      </div>
    </div>
  )
}
