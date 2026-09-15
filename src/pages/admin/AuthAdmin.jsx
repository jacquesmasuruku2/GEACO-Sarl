import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function AuthAdmin() {
  const navigate = useNavigate()
  const location = useLocation()
  const idleExpired = location.state?.reason === 'idle'
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
      <div className="admin-login">
        <div className="admin-login__panel">
          <div className="admin-login__card">
            <img className="admin-login__logo" src="/geaco-logo-transparent.png" alt="GEACO SARL" />
            <h1 className="admin-login__title">Configuration requise</h1>
            <p className="admin-login__lead">
              Supabase n’est pas disponible : les variables <code>VITE_SUPABASE_URL</code> et{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> doivent être présentes au moment du build.
            </p>
            <p className="admin-login__hint">
              En local : fichier <code>.env</code> à la racine, puis <code>npm run dev</code>. Sur Vercel :
              Environment Variables → Production → Redeploy.
            </p>
            <Link className="admin-login__back" to="/">
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!checked) {
    return (
      <div className="admin-login">
        <div className="admin-login__panel">
          <p className="admin-login__loading">Chargement…</p>
        </div>
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
    const normalizedEmail = email.trim().toLowerCase()
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })
    if (signErr) {
      setBusy(false)
      setError(signErr.message)
      return
    }
    const {
      data: { session: s },
      error: sessErr,
    } = await supabase.auth.getSession()
    if (sessErr || !s) {
      setBusy(false)
      setError(
        sessErr?.message ??
          'Session non enregistrée. Vérifiez que le stockage du navigateur n’est pas bloqué, puis réessayez.',
      )
      return
    }
    setBusy(false)
    navigate('/auth-admin/panel', { replace: true })
  }

  return (
    <div className="admin-login">
      <div className="admin-login__aside" aria-hidden="true">
        <div className="admin-login__aside-glow" />
        <div className="admin-login__aside-content">
          <img src="/geaco-logo-transparent.png" alt="" className="admin-login__aside-logo" />
          <p className="admin-login__aside-kicker">GEACO SARL</p>
          <p className="admin-login__aside-title">Espace de publication</p>
          <p className="admin-login__aside-text">
            Gérez projets, articles, équipe et contenus des pages services depuis un seul tableau de bord.
          </p>
        </div>
      </div>

      <div className="admin-login__panel">
        <div className="admin-login__card">
          <img className="admin-login__logo" src="/geaco-logo-transparent.png" alt="GEACO SARL" />
          <h1 className="admin-login__title">Connexion</h1>
          <p className="admin-login__lead">Accédez au studio de contenu GEACO.</p>
          {idleExpired ? (
            <p className="admin-login__hint" role="status">
              Session expirée après inactivité. Reconnectez-vous pour continuer.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="admin-login__form">
            <label className="admin-login__field" htmlFor="adm-email">
              <span>Email</span>
              <input
                id="adm-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
              />
            </label>
            <label className="admin-login__field" htmlFor="adm-pass">
              <span>Mot de passe</span>
              <input
                id="adm-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            {error ? (
              <p className="admin-login__error" role="alert">
                {error}
              </p>
            ) : null}
            <button className="admin-login__submit" type="submit" disabled={busy}>
              {busy ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <Link className="admin-login__back" to="/">
            ← Retour au site public
          </Link>
        </div>
      </div>
    </div>
  )
}
