import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

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
    const { error: insErr } = await supabase.from('site_projects').insert({
      slug,
      title: 'Nouveau projet',
      tag: 'Tag',
      description: '',
      impact: '',
      sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
      published: false,
    })
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Projet créé (brouillon, non publié).')
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
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
      setError(upErr.message)
      return
    }
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
        <h2>Projets (page « Projets »)</h2>
        <button type="button" className="btn btn--primary" onClick={addRow}>
          Ajouter un projet
        </button>
      </div>
      {message ? <p className="admin-success">{message}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <p className="admin-muted">
        Seuls les projets avec « Publié » coché sont visibles sur le site public. Slug unique (URL
        interne / référence).
      </p>
      <div className="admin-stack">
        {rows.map((row) => (
          <div className="admin-card admin-card--tight" key={row.id}>
            <div className="admin-grid">
              <label>
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
              <label>
                Ordre
                <input
                  type="number"
                  value={row.sort_order}
                  onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                />
              </label>
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
              <label className="admin-span-2">
                Description
                <textarea
                  rows={3}
                  value={row.description}
                  onChange={(e) => updateLocal(row.id, { description: e.target.value })}
                />
              </label>
              <label className="admin-span-2">
                Impact
                <textarea
                  rows={2}
                  value={row.impact}
                  onChange={(e) => updateLocal(row.id, { impact: e.target.value })}
                />
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={row.published}
                  onChange={(e) => updateLocal(row.id, { published: e.target.checked })}
                />
                Publié sur le site
              </label>
            </div>
            <div className="admin-actions">
              <button type="button" className="btn btn--primary" onClick={() => saveRow(row)}>
                Enregistrer
              </button>
              <button type="button" className="btn btn--outline" onClick={() => removeRow(row.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
