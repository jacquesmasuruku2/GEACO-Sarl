import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { RichTextTextarea } from '../../../components/admin/RichTextTextarea'

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export function ProjectsAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase.from('site_projects').select('*').order('sort_order')
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
    const id = crypto.randomUUID().slice(0, 8)
    const slug = `projet-${id}`
    const { data: inserted, error: insErr } = await supabase
      .from('site_projects')
      .insert({
        slug,
        title: 'Nouveau projet',
        tag: 'Tag',
        description: '',
        impact: '',
        sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
        published: false,
      })
      .select('id')
      .single()
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Projet créé (brouillon, non publié).')
    setEditingId(inserted?.id ?? null)
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    const { error: upErr } = await supabase
      .from('site_projects')
      .update({
        slug: row.slug,
        title: row.title,
        tag: row.tag,
        description: row.description,
        impact: row.impact,
        sort_order: Number(row.sort_order) || 0,
        published: Boolean(row.published),
      })
      .eq('id', row.id)
    if (upErr) {
      setSavingId(null)
      setError(upErr.message)
      return
    }
    setSavingId(null)
    setEditingId(null)
    setMessage('Projet enregistré.')
    load()
  }

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer ce projet ?')) return
    const { error: delErr } = await supabase.from('site_projects').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Projet supprimé.')
    load()
  }

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Projets ({rows.length})</h2>
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
        Seuls les projets avec « Publié » coché sont visibles sur le site public. Slug unique (URL
        interne / référence).
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  PJ
                </div>
                <div className="admin-compact-item__text">
                  <h3>{row.title || 'Projet sans titre'}</h3>
                  <p>{row.tag || 'Sans étiquette'}</p>
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
              <div className="cms-record">
                <div className="cms-record__main">
                  <div className="admin-grid">
                    <label className="admin-span-2">
                      Titre
                      <input
                        value={row.title}
                        onChange={(e) => updateLocal(row.id, { title: e.target.value })}
                      />
                    </label>
                    <label className="admin-span-2">
                      Étiquette (ex. Hydraulique)
                      <input value={row.tag} onChange={(e) => updateLocal(row.id, { tag: e.target.value })} />
                    </label>
                    <RichTextTextarea
                      label="Description"
                      rows={8}
                      storageKey={`project:${row.id}:description`}
                      value={row.description}
                      onChange={(e) => updateLocal(row.id, { description: e.target.value })}
                    />
                    <RichTextTextarea
                      label="Impact"
                      rows={6}
                      storageKey={`project:${row.id}:impact`}
                      value={row.impact}
                      onChange={(e) => updateLocal(row.id, { impact: e.target.value })}
                    />
                  </div>
                </div>
                <aside className="cms-record__side">
                  <div className="admin-grid">
                    <label className="admin-span-2">
                      Slug
                      <input
                        value={row.slug}
                        onChange={(e) => updateLocal(row.id, { slug: e.target.value })}
                        onBlur={() => {
                          if (!row.slug.trim() && row.title) {
                            updateLocal(row.id, { slug: slugify(row.title) })
                          }
                        }}
                      />
                    </label>
                    <label className="admin-span-2">
                      Ordre
                      <input
                        type="number"
                        value={row.sort_order}
                        onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                      />
                    </label>
                    <label className="admin-check admin-span-2">
                      <input
                        type="checkbox"
                        checked={row.published}
                        onChange={(e) => updateLocal(row.id, { published: e.target.checked })}
                      />
                      Publié sur le site
                    </label>
                  </div>
                </aside>
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
