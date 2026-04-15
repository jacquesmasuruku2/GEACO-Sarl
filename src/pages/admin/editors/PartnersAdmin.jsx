import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export function PartnersAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase.from('site_partners').select('*').order('sort_order')
    if (qErr) {
      setError(qErr.message)
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
    const { data: inserted, error: insErr } = await supabase
      .from('site_partners')
      .insert({
        name: 'Nouveau partenaire',
        subtitle: '',
        website_url: '',
        notes: '',
        partnership_motive: '',
        sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
        active: false,
        published: false,
      })
      .select('id')
      .single()
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Partenaire créé.')
    setEditingId(inserted?.id ?? null)
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    const pub = Boolean(row.published)
    const { error: upErr } = await supabase
      .from('site_partners')
      .update({
        name: row.name,
        subtitle: row.subtitle || null,
        website_url: row.website_url || null,
        notes: row.notes || null,
        partnership_motive: row.partnership_motive || null,
        sort_order: Number(row.sort_order) || 0,
        published: pub,
        active: pub,
      })
      .eq('id', row.id)
    if (upErr) {
      setSavingId(null)
      setError(upErr.message)
      return
    }
    setSavingId(null)
    setEditingId(null)
    setMessage('Partenaire enregistré.')
    load()
  }

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer ce partenaire ?')) return
    const { error: delErr } = await supabase.from('site_partners').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Partenaire supprimé.')
    load()
  }

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Partenaires ({rows.length})</h2>
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
        Cochez <strong>Publié</strong> pour afficher le partenaire sur la page publique Partenariats (sinon il
        reste en brouillon). La colonne est stockée en base (<code>published</code>). Exécutez la migration{' '}
        <code>004_partners_publish_personnel_social.sql</code> si besoin. Champ Notes : court texte sur la
        carte.
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  🤝
                </div>
                <div className="admin-compact-item__text">
                  <h3>{row.name || 'Partenaire sans nom'}</h3>
                  <p>{row.subtitle || 'Sans sous-titre'}</p>
                  <p className={`admin-status-pill ${row.published ? 'is-live' : 'is-draft'}`}>
                    {row.published ? 'Publié' : 'Brouillon'}
                  </p>
                </div>
              </div>
              <div className="admin-compact-item__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setEditingId((prev) => (prev === row.id ? null : row.id))}
                >
                  {editingId === row.id ? 'Fermer' : 'Editer'}
                </button>
                <button type="button" className="btn btn--outline" onClick={() => removeRow(row.id)}>
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>

        {rows
          .filter((row) => row.id === editingId)
          .map((row) => (
            <div className="admin-card admin-card--tight" key={`edit-${row.id}`}>
              <div className="admin-grid">
                <label className="admin-span-2">
                  Nom
                  <input value={row.name} onChange={(e) => updateLocal(row.id, { name: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Sous-titre (optionnel)
                  <input
                    value={row.subtitle ?? ''}
                    onChange={(e) => updateLocal(row.id, { subtitle: e.target.value })}
                  />
                </label>
                <label className="admin-span-2">
                  Site web (URL)
                  <input
                    value={row.website_url ?? ''}
                    onChange={(e) => updateLocal(row.id, { website_url: e.target.value })}
                  />
                </label>
                <label className="admin-span-2">
                  Notes (texte court sur la carte)
                  <textarea
                    rows={2}
                    value={row.notes ?? ''}
                    onChange={(e) => updateLocal(row.id, { notes: e.target.value })}
                  />
                </label>
                <label className="admin-span-2">
                  Motif du partenariat (visible sur le site)
                  <textarea
                    rows={2}
                    value={row.partnership_motive ?? ''}
                    onChange={(e) => updateLocal(row.id, { partnership_motive: e.target.value })}
                  />
                </label>
                <label>
                  Ordre
                  <input
                    type="number"
                    value={row.sort_order}
                    onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                  />
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={Boolean(row.published ?? row.active)}
                    onChange={(e) =>
                      updateLocal(row.id, { published: e.target.checked, active: e.target.checked })
                    }
                  />
                  Publié sur le site public
                </label>
              </div>
              <div className="admin-actions admin-actions--sticky">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => saveRow(row)}
                  disabled={savingId === row.id}
                >
                  {savingId === row.id ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => setEditingId(null)}>
                  Fermer l’édition
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
