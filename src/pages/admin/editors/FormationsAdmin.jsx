import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { isFormationDatePassed } from '../../../lib/formationStatus'

function slugify(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120)
}

function statusLabel(status) {
  switch (status) {
    case 'full':
      return 'Places épuisées'
    case 'ended':
      return 'Formation passée'
    case 'closed':
      return 'Inscriptions fermées'
    default:
      return 'Inscriptions ouvertes'
  }
}

export function FormationsAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase
      .from('site_formations')
      .select('*')
      .order('sort_order', { ascending: true })
    if (qErr) {
      setError(
        qErr.message.includes('site_formations')
          ? `${qErr.message} — Appliquez les migrations 021 et 022 (formations) dans Supabase.`
          : qErr.message,
      )
      return
    }
    setRows(data ?? [])
    setError('')
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function addRow() {
    if (!supabase) return
    const title = 'Nouvelle formation'
    const { data: inserted, error: insErr } = await supabase
      .from('site_formations')
      .insert({
        title,
        slug: `${slugify(title) || 'formation'}-${Date.now().toString(36)}`,
        locale: 'fr',
        summary: '',
        description: '',
        location: '',
        duration_label: '',
        seats_label: '',
        registration_status: 'open',
        registration_open: true,
        published: false,
        sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
      })
      .select('id')
      .single()
    if (insErr) {
      setError(
        insErr.message.includes('site_formations') || insErr.message.includes('registration_status')
          ? `${insErr.message} — Appliquez les migrations 021 et 022 (formations) dans Supabase.`
          : insErr.message,
      )
      return
    }
    setMessage('Formation créée (brouillon).')
    setEditingId(inserted?.id ?? null)
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    const title = String(row.title ?? '').trim()
    const slug = String(row.slug ?? '').trim() || slugify(title)
    const status = ['open', 'full', 'ended', 'closed'].includes(row.registration_status)
      ? row.registration_status
      : 'open'
    const { error: upErr } = await supabase
      .from('site_formations')
      .update({
        title,
        slug,
        locale: row.locale === 'en' ? 'en' : 'fr',
        summary: row.summary || null,
        description: row.description || '',
        location: row.location || null,
        starts_on: row.starts_on || null,
        ends_on: row.ends_on || null,
        duration_label: row.duration_label || null,
        seats_label: row.seats_label || null,
        registration_status: status,
        registration_open: status === 'open',
        published: Boolean(row.published),
        sort_order: Number(row.sort_order) || 0,
      })
      .eq('id', row.id)
    if (upErr) {
      setSavingId(null)
      setError(
        upErr.message.includes('registration_status')
          ? `${upErr.message} — Appliquez la migration 022 dans Supabase.`
          : upErr.message,
      )
      return
    }
    setSavingId(null)
    setEditingId(null)
    setMessage('Formation enregistrée.')
    load()
  }

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer cette formation ?')) return
    const { error: delErr } = await supabase.from('site_formations').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Formation supprimée.')
    load()
  }

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Formations ({rows.length})</h2>
        <button type="button" className="btn btn--primary" onClick={addRow}>
          + Ajouter
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
        Publiez une formation pour l’afficher sur <code>/formations</code>. Choisissez le statut
        d’inscription : <strong>ouvertes</strong>, <strong>places épuisées</strong>,{' '}
        <strong>formation passée</strong> ou <strong>fermées</strong>. Les candidatures arrivent dans
        « Inscriptions ».
      </p>

      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => {
            const status = row.registration_status || (row.registration_open === false ? 'closed' : 'open')
            const datePassed = isFormationDatePassed(row)
            return (
              <article className="admin-compact-item" key={row.id}>
                <div className="admin-compact-item__main">
                  <div className="admin-compact-item__avatar" aria-hidden="true">
                    🎓
                  </div>
                  <div className="admin-compact-item__text">
                    <h3>{row.title || 'Sans titre'}</h3>
                    <p>
                      {row.locale?.toUpperCase()} · {row.location || 'Lieu non précisé'}
                      {row.starts_on ? ` · ${row.starts_on}` : ''}
                    </p>
                    <p className={`admin-status-pill ${row.published ? 'is-live' : 'is-draft'}`}>
                      {row.published ? 'Publié' : 'Brouillon'} · {statusLabel(status)}
                    </p>
                    {datePassed && status === 'open' ? (
                      <p className="admin-muted" style={{ marginTop: '0.35rem' }}>
                        La date est dépassée : passez le statut à « Formation passée ».
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="admin-compact-item__actions">
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setEditingId((prev) => (prev === row.id ? null : row.id))}
                  >
                    {editingId === row.id ? 'Fermer' : 'Éditer'}
                  </button>
                  <button type="button" className="btn btn--outline" onClick={() => removeRow(row.id)}>
                    Supprimer
                  </button>
                </div>

                {editingId === row.id ? (
                  <div className="admin-card admin-compact-item__editor">
                    <div className="admin-grid">
                      <label>
                        Titre
                        <input
                          value={row.title ?? ''}
                          onChange={(e) => updateLocal(row.id, { title: e.target.value })}
                        />
                      </label>
                      <label>
                        Slug
                        <input
                          value={row.slug ?? ''}
                          onChange={(e) => updateLocal(row.id, { slug: e.target.value })}
                        />
                      </label>
                      <label>
                        Langue
                        <select
                          value={row.locale === 'en' ? 'en' : 'fr'}
                          onChange={(e) => updateLocal(row.id, { locale: e.target.value })}
                        >
                          <option value="fr">FR</option>
                          <option value="en">EN</option>
                        </select>
                      </label>
                      <label>
                        Ordre
                        <input
                          type="number"
                          value={row.sort_order ?? 0}
                          onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                        />
                      </label>
                      <label className="admin-span-2">
                        Résumé
                        <input
                          value={row.summary ?? ''}
                          onChange={(e) => updateLocal(row.id, { summary: e.target.value })}
                        />
                      </label>
                      <label className="admin-span-2">
                        Description
                        <textarea
                          rows={4}
                          value={row.description ?? ''}
                          onChange={(e) => updateLocal(row.id, { description: e.target.value })}
                        />
                      </label>
                      <label>
                        Lieu
                        <input
                          value={row.location ?? ''}
                          onChange={(e) => updateLocal(row.id, { location: e.target.value })}
                        />
                      </label>
                      <label>
                        Durée (libellé)
                        <input
                          value={row.duration_label ?? ''}
                          onChange={(e) => updateLocal(row.id, { duration_label: e.target.value })}
                          placeholder="Ex. 5 jours"
                        />
                      </label>
                      <label>
                        Début
                        <input
                          type="date"
                          value={row.starts_on ?? ''}
                          onChange={(e) => updateLocal(row.id, { starts_on: e.target.value })}
                        />
                      </label>
                      <label>
                        Fin
                        <input
                          type="date"
                          value={row.ends_on ?? ''}
                          onChange={(e) => updateLocal(row.id, { ends_on: e.target.value })}
                        />
                      </label>
                      <label>
                        Places (libellé)
                        <input
                          value={row.seats_label ?? ''}
                          onChange={(e) => updateLocal(row.id, { seats_label: e.target.value })}
                          placeholder="Ex. 20 places"
                        />
                      </label>
                      <label>
                        Statut d’inscription
                        <select
                          value={status}
                          onChange={(e) =>
                            updateLocal(row.id, {
                              registration_status: e.target.value,
                              registration_open: e.target.value === 'open',
                            })
                          }
                        >
                          <option value="open">Inscriptions ouvertes (postuler)</option>
                          <option value="full">Places épuisées</option>
                          <option value="ended">Formation déjà passée</option>
                          <option value="closed">Inscriptions fermées</option>
                        </select>
                      </label>
                      <label className="admin-check">
                        <input
                          type="checkbox"
                          checked={Boolean(row.published)}
                          onChange={(e) => updateLocal(row.id, { published: e.target.checked })}
                        />
                        Publié sur le site
                      </label>
                    </div>
                    <div className="admin-compact-item__actions" style={{ marginTop: '0.85rem' }}>
                      <button
                        type="button"
                        className="btn btn--primary"
                        disabled={savingId === row.id}
                        onClick={() => saveRow(row)}
                      >
                        {savingId === row.id ? 'Enregistrement…' : 'Enregistrer'}
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
