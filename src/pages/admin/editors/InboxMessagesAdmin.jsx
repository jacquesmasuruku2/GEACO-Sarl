import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { slugifyPersonnel } from '../../../lib/personnelSlug'

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

export function FormationRegistrationsAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error: qErr } = await supabase
      .from('site_formation_registrations')
      .select('*')
      .order('created_at', { ascending: false })
    if (qErr) {
      setError(
        qErr.message.includes('site_formation_registrations')
          ? `${qErr.message} — Appliquez la migration 021 (formations) dans Supabase.`
          : qErr.message,
      )
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
    if (!window.confirm('Supprimer cette inscription ?')) return
    const { error: delErr } = await supabase.from('site_formation_registrations').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Inscription supprimée.')
    if (openId === id) setOpenId(null)
    load()
  }

  const openRow = rows.find((r) => r.id === openId) ?? null

  return (
    <section className="admin-section admin-inbox">
      <div className="admin-section__head">
        <h2>Inscriptions formations ({rows.length})</h2>
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

      <p className="admin-muted">Candidatures reçues via la page Formations du site.</p>

      <div className="admin-compact-list">
        {rows.map((row) => (
          <article className="admin-compact-item" key={row.id}>
            <div className="admin-compact-item__main">
              <div className="admin-compact-item__avatar" aria-hidden="true">
                <span>🎓</span>
              </div>
              <div className="admin-compact-item__text">
                <h3>{row.full_name || 'Sans nom'}</h3>
                <p>
                  {row.formation_title}
                  {row.email ? ` · ${row.email}` : ''}
                </p>
                <p className="admin-status-pill is-live">{formatWhen(row.created_at)}</p>
              </div>
            </div>
            <div className="admin-compact-item__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setOpenId((prev) => (prev === row.id ? null : row.id))}
              >
                {openId === row.id ? 'Fermer' : 'Ouvrir'}
              </button>
              <button type="button" className="btn btn--outline" onClick={() => removeRow(row.id)}>
                Supprimer
              </button>
            </div>
          </article>
        ))}
        {!loading && !rows.length ? (
          <p className="admin-muted">Aucune inscription pour le moment.</p>
        ) : null}
      </div>

      {openRow ? (
        <div className="admin-card admin-card--tight admin-inbox__detail">
          <h3 style={{ marginTop: 0 }}>{openRow.formation_title}</h3>
          <dl className="admin-inbox__meta">
            <div>
              <dt>Reçu le</dt>
              <dd>{formatWhen(openRow.created_at)}</dd>
            </div>
            <div>
              <dt>Candidat</dt>
              <dd>{openRow.full_name}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${openRow.email}`}>{openRow.email}</a>
              </dd>
            </div>
            <div>
              <dt>Téléphone</dt>
              <dd>{openRow.phone || '—'}</dd>
            </div>
            <div>
              <dt>Organisation</dt>
              <dd>{openRow.organization || '—'}</dd>
            </div>
            <div>
              <dt>Langue</dt>
              <dd>{openRow.locale === 'en' ? 'EN' : 'FR'}</dd>
            </div>
          </dl>
          <pre className="admin-inbox__body">{openRow.motivation}</pre>
          <div className="admin-actions">
            <a
              className="btn btn--primary"
              href={`mailto:${openRow.email}?subject=${encodeURIComponent(`Re: ${openRow.formation_title}`)}`}
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

function applicationStatusLabel(status) {
  if (status === 'approved') return 'Approuvée'
  if (status === 'rejected') return 'Rejetée'
  return 'En attente'
}

function buildDisplayName(row) {
  return [row.last_name, row.post_name, row.first_name].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

export function PersonnelApplicationsAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error: qErr } = await supabase
      .from('site_personnel_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (qErr) {
      setError(
        qErr.message.includes('site_personnel_applications')
          ? `${qErr.message} — Appliquez la migration 024 (candidatures cartes) dans Supabase.`
          : qErr.message,
      )
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
    if (!window.confirm('Supprimer cette candidature ?')) return
    const { error: delErr } = await supabase.from('site_personnel_applications').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Candidature supprimée.')
    if (openId === id) setOpenId(null)
    load()
  }

  async function rejectRow(row) {
    if (!supabase) return
    if (!window.confirm('Rejeter cette candidature ? Elle ne créera pas de fiche équipe.')) return
    setBusyId(row.id)
    const { error: upErr } = await supabase
      .from('site_personnel_applications')
      .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
      .eq('id', row.id)
    setBusyId(null)
    if (upErr) {
      setError(upErr.message)
      return
    }
    setMessage('Candidature rejetée.')
    load()
  }

  async function approveRow(row) {
    if (!supabase) return
    if (row.status === 'approved') {
      setMessage('Cette candidature est déjà approuvée.')
      return
    }
    if (
      !window.confirm(
        'Approuver ? Une fiche équipe (brouillon) sera créée avec les infos carte. Publiez-la ensuite dans Équipe / Cartes.',
      )
    ) {
      return
    }
    setBusyId(row.id)
    setError('')
    const displayName = buildDisplayName(row)
    const slugBase = slugifyPersonnel(displayName)
    const slug = `${slugBase}-${Date.now().toString(36).slice(-4)}`
    const validUntil = new Date()
    validUntil.setFullYear(validUntil.getFullYear() + 1)

    const { data: inserted, error: insErr } = await supabase
      .from('site_personnel')
      .insert({
        section_order: 90,
        section_title: 'Équipe',
        name: displayName || 'Nouveau membre',
        slug,
        role: row.role,
        focus: row.department || null,
        bio: row.notes || null,
        photo_url: row.photo_url || null,
        email: row.email || null,
        sort_order: 0,
        locale: row.locale === 'en' ? 'en' : 'fr',
        published: false,
        card_last_name: row.last_name,
        card_post_name: row.post_name || null,
        card_first_name: row.first_name,
        card_sex: row.sex || null,
        card_birth_place: row.birth_place || null,
        card_birth_date: row.birth_date || null,
        card_department: row.department || null,
        card_address: row.address || null,
        card_valid_until: validUntil.toISOString().slice(0, 10),
      })
      .select('id')
      .single()

    if (insErr) {
      setBusyId(null)
      setError(
        insErr.message.includes('slug') || insErr.message.includes('card_')
          ? `${insErr.message} — Vérifiez les migrations personnel / cartes.`
          : insErr.message,
      )
      return
    }

    const { error: upErr } = await supabase
      .from('site_personnel_applications')
      .update({
        status: 'approved',
        personnel_id: inserted.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', row.id)

    setBusyId(null)
    if (upErr) {
      setError(upErr.message)
      return
    }
    setMessage(
      'Candidature approuvée. Fiche créée en brouillon — publiez dans « Équipe » et finalisez dans « Cartes ».',
    )
    load()
  }

  const openRow = rows.find((r) => r.id === openId) ?? null
  const pendingCount = rows.filter((r) => r.status === 'pending').length

  return (
    <section className="admin-section admin-inbox">
      <div className="admin-section__head">
        <h2>
          Candidatures cartes ({rows.length}
          {pendingCount ? ` · ${pendingCount} en attente` : ''})
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
        Formulaire public partageable : <code>/candidature-carte</code>. Approuver crée une fiche Équipe
        (non publiée) préremplie pour la carte de service.
      </p>

      <div className="admin-compact-list">
        {rows.map((row) => {
          const name = buildDisplayName(row)
          const status = row.status || 'pending'
          return (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  {row.photo_url ? <img src={String(row.photo_url).trim()} alt="" /> : <span>🪪</span>}
                </div>
                <div className="admin-compact-item__text">
                  <h3>{name || 'Sans nom'}</h3>
                  <p>
                    {row.role}
                    {row.email ? ` · ${row.email}` : ''}
                  </p>
                  <p className={`admin-status-pill ${status === 'approved' ? 'is-live' : 'is-draft'}`}>
                    {applicationStatusLabel(status)} · {formatWhen(row.created_at)}
                  </p>
                </div>
              </div>
              <div className="admin-compact-item__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setOpenId((prev) => (prev === row.id ? null : row.id))}
                >
                  {openId === row.id ? 'Fermer' : 'Ouvrir'}
                </button>
                {status === 'pending' ? (
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={busyId === row.id}
                    onClick={() => approveRow(row)}
                  >
                    Approuver
                  </button>
                ) : null}
                <button type="button" className="btn btn--outline" onClick={() => removeRow(row.id)}>
                  Supprimer
                </button>
              </div>
            </article>
          )
        })}
        {!loading && !rows.length ? (
          <p className="admin-muted">Aucune candidature pour le moment.</p>
        ) : null}
      </div>

      {openRow ? (
        <div className="admin-card admin-card--tight admin-inbox__detail">
          <h3 style={{ marginTop: 0 }}>{buildDisplayName(openRow)}</h3>
          <dl className="admin-inbox__meta">
            <div>
              <dt>Statut</dt>
              <dd>{applicationStatusLabel(openRow.status)}</dd>
            </div>
            <div>
              <dt>Reçu le</dt>
              <dd>{formatWhen(openRow.created_at)}</dd>
            </div>
            <div>
              <dt>Nom</dt>
              <dd>{openRow.last_name}</dd>
            </div>
            <div>
              <dt>Post-nom</dt>
              <dd>{openRow.post_name || '—'}</dd>
            </div>
            <div>
              <dt>Prénom</dt>
              <dd>{openRow.first_name}</dd>
            </div>
            <div>
              <dt>Sexe</dt>
              <dd>{openRow.sex || '—'}</dd>
            </div>
            <div>
              <dt>Lieu de naissance</dt>
              <dd>{openRow.birth_place || '—'}</dd>
            </div>
            <div>
              <dt>Date de naissance</dt>
              <dd>{openRow.birth_date || '—'}</dd>
            </div>
            <div>
              <dt>Fonction</dt>
              <dd>{openRow.role}</dd>
            </div>
            <div>
              <dt>Département</dt>
              <dd>{openRow.department || '—'}</dd>
            </div>
            <div>
              <dt>Adresse</dt>
              <dd>{openRow.address || '—'}</dd>
            </div>
            <div>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${openRow.email}`}>{openRow.email}</a>
              </dd>
            </div>
            <div>
              <dt>Téléphone</dt>
              <dd>{openRow.phone || '—'}</dd>
            </div>
          </dl>
          {openRow.photo_url ? (
            <div className="admin-inbox__photo">
              <img src={String(openRow.photo_url).trim()} alt="" />
            </div>
          ) : null}
          {openRow.notes ? <pre className="admin-inbox__body">{openRow.notes}</pre> : null}
          <div className="admin-actions">
            {openRow.status === 'pending' ? (
              <>
                <button
                  type="button"
                  className="btn btn--primary"
                  disabled={busyId === openRow.id}
                  onClick={() => approveRow(openRow)}
                >
                  Approuver et créer la fiche
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  disabled={busyId === openRow.id}
                  onClick={() => rejectRow(openRow)}
                >
                  Rejeter
                </button>
              </>
            ) : null}
            <a
              className="btn btn--ghost"
              href={`mailto:${openRow.email}?subject=${encodeURIComponent('Candidature carte GEACO')}`}
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

