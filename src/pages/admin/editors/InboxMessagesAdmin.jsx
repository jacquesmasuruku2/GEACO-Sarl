import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

function formatWhen(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return String(iso)
  }
}

/**
 * Boîte de réception des messages Contact ou Devis (`site_lead_messages`).
 * @param {{ source: 'contact' | 'quote', title: string, emptyLabel: string }} props
 */
export function LeadMessagesAdmin({ source, title, emptyLabel }) {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error: qErr } = await supabase
      .from('site_lead_messages')
      .select('*')
      .eq('source', source)
      .order('created_at', { ascending: false })
    if (qErr) {
      setError(qErr.message)
      setRows([])
      setLoading(false)
      return
    }
    setRows(data ?? [])
    setError('')
    setLoading(false)
  }, [source])

  useEffect(() => {
    load()
  }, [load])

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer ce message ?')) return
    const { error: delErr } = await supabase.from('site_lead_messages').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Message supprimé.')
    if (openId === id) setOpenId(null)
    load()
  }

  const openRow = rows.find((r) => r.id === openId) ?? null

  return (
    <section className="admin-section admin-inbox">
      <div className="admin-section__head">
        <h2>
          {title} ({rows.length})
        </h2>
        <button type="button" className="btn btn--ghost" onClick={load} disabled={loading}>
          {loading ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>

      {message ? (
        <p className="admin-success admin-feedback" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="admin-error admin-feedback" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}

      <p className="admin-muted">
        Messages reçus via le formulaire public. Ouvrez une fiche pour lire le contenu complet, répondre par
        e-mail, puis supprimer si besoin.
      </p>

      <div className="admin-compact-list">
        {rows.map((row) => (
          <article className="admin-compact-item" key={row.id}>
            <div className="admin-compact-item__main">
              <div className="admin-compact-item__avatar" aria-hidden="true">
                <span>{source === 'quote' ? '📝' : '✉️'}</span>
              </div>
              <div className="admin-compact-item__text">
                <h3>{row.full_name || 'Sans nom'}</h3>
                <p>{row.subject || 'Sans objet'}</p>
                <p className="admin-status-pill is-live">{formatWhen(row.created_at)}</p>
              </div>
            </div>
            <div className="admin-compact-item__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setOpenId((prev) => (prev === row.id ? null : row.id))}
              >
                {openId === row.id ? 'Fermer' : 'Voir'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => removeRow(row.id)}>
                Supprimer
              </button>
            </div>
          </article>
        ))}
        {!loading && !rows.length ? <p className="admin-muted">{emptyLabel}</p> : null}
      </div>

      {openRow ? (
        <div className="admin-card admin-card--tight admin-inbox__detail">
          <h3 style={{ marginTop: 0 }}>{openRow.subject}</h3>
          <dl className="admin-inbox__meta">
            <div>
              <dt>Reçu le</dt>
              <dd>{formatWhen(openRow.created_at)}</dd>
            </div>
            <div>
              <dt>Nom</dt>
              <dd>{openRow.full_name}</dd>
            </div>
            <div>
              <dt>Organisation</dt>
              <dd>{openRow.organization || '—'}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${openRow.email}`}>{openRow.email}</a>
              </dd>
            </div>
            <div>
              <dt>Téléphone</dt>
              <dd>
                {openRow.phone ? <a href={`tel:${String(openRow.phone).replace(/\s+/g, '')}`}>{openRow.phone}</a> : '—'}
              </dd>
            </div>
            <div>
              <dt>Langue</dt>
              <dd>{openRow.locale === 'en' ? 'EN' : 'FR'}</dd>
            </div>
          </dl>
          <pre className="admin-inbox__body">{openRow.message}</pre>
          <div className="admin-actions">
            <a className="btn btn--primary" href={`mailto:${openRow.email}?subject=${encodeURIComponent(`Re: ${openRow.subject}`)}`}>
              Répondre par e-mail
            </a>
            <button type="button" className="btn btn--ghost" onClick={() => setOpenId(null)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function ContactMessagesAdmin() {
  return (
    <LeadMessagesAdmin
      source="contact"
      title="Contacts"
      emptyLabel="Aucun message de contact pour le moment."
    />
  )
}

export function QuoteMessagesAdmin() {
  return (
    <LeadMessagesAdmin source="quote" title="Devis" emptyLabel="Aucune demande de devis pour le moment." />
  )
}

export function PartnershipMessagesAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error: qErr } = await supabase
      .from('site_partnership_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (qErr) {
      setError(qErr.message)
      setRows([])
      setLoading(false)
      return
    }
    setRows(data ?? [])
    setError('')
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer cette demande de partenariat ?')) return
    const { error: delErr } = await supabase.from('site_partnership_messages').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Demande supprimée.')
    if (openId === id) setOpenId(null)
    load()
  }

  const openRow = rows.find((r) => r.id === openId) ?? null

  return (
    <section className="admin-section admin-inbox">
      <div className="admin-section__head">
        <h2>Partenariats ({rows.length})</h2>
        <button type="button" className="btn btn--ghost" onClick={load} disabled={loading}>
          {loading ? 'Chargement…' : 'Actualiser'}
        </button>
      </div>

      {message ? (
        <p className="admin-success admin-feedback" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="admin-error admin-feedback" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}

      <p className="admin-muted">Demandes reçues via la page Partenariats du site.</p>

      <div className="admin-compact-list">
        {rows.map((row) => (
          <article className="admin-compact-item" key={row.id}>
            <div className="admin-compact-item__main">
              <div className="admin-compact-item__avatar" aria-hidden="true">
                <span>🤝</span>
              </div>
              <div className="admin-compact-item__text">
                <h3>{row.organization || row.full_name || 'Sans nom'}</h3>
                <p>
                  {row.full_name}
                  {row.email ? ` · ${row.email}` : ''}
                </p>
                <p className="admin-status-pill is-live">{formatWhen(row.created_at)}</p>
              </div>
            </div>
            <div className="admin-compact-item__actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setOpenId((prev) => (prev === row.id ? null : row.id))}
              >
                {openId === row.id ? 'Fermer' : 'Voir'}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => removeRow(row.id)}>
                Supprimer
              </button>
            </div>
          </article>
        ))}
        {!loading && !rows.length ? (
          <p className="admin-muted">Aucune demande de partenariat pour le moment.</p>
        ) : null}
      </div>

      {openRow ? (
        <div className="admin-card admin-card--tight admin-inbox__detail">
          <h3 style={{ marginTop: 0 }}>{openRow.subject}</h3>
          <dl className="admin-inbox__meta">
            <div>
              <dt>Reçu le</dt>
              <dd>{formatWhen(openRow.created_at)}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{openRow.full_name}</dd>
            </div>
            <div>
              <dt>Organisation</dt>
              <dd>{openRow.organization}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${openRow.email}`}>{openRow.email}</a>
              </dd>
            </div>
            <div>
              <dt>Langue</dt>
              <dd>{openRow.locale === 'en' ? 'EN' : 'FR'}</dd>
            </div>
          </dl>
          <pre className="admin-inbox__body">{openRow.message}</pre>
          <div className="admin-actions">
            <a
              className="btn btn--primary"
              href={`mailto:${openRow.email}?subject=${encodeURIComponent(`Re: ${openRow.subject}`)}`}
            >
              Répondre par e-mail
            </a>
            <button type="button" className="btn btn--ghost" onClick={() => setOpenId(null)}>
              Fermer
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
