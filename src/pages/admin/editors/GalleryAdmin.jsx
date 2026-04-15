import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { ImagePickerField } from '../../../components/admin/ImagePickerField'

export function GalleryAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase
      .from('site_gallery_photos')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
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
      .from('site_gallery_photos')
      .insert({
        title: 'Nouvelle photo',
        caption: '',
        image_url: '',
        album: 'general',
        sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
        published: false,
      })
      .select('id')
      .single()
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Photo ajoutée à la galerie (brouillon).')
    setEditingId(inserted?.id ?? null)
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    const { error: upErr } = await supabase
      .from('site_gallery_photos')
      .update({
        title: row.title,
        caption: row.caption || null,
        image_url: row.image_url || null,
        album: row.album || 'general',
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
    setMessage('Photo de galerie enregistrée.')
    load()
  }

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer cette photo de la galerie ?')) return
    const { error: delErr } = await supabase.from('site_gallery_photos').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Photo supprimée de la galerie.')
    load()
  }

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Galerie ({rows.length})</h2>
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
        Gérez ici les photos de la galerie. Une photo est visible côté site uniquement quand le statut
        « Publié » est coché.
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  {row.image_url ? <img src={String(row.image_url).trim()} alt="" /> : <span>🖼️</span>}
                </div>
                <div className="admin-compact-item__text">
                  <h3>{row.title || 'Photo sans titre'}</h3>
                  <p>{row.album || 'general'}</p>
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
                  Titre
                  <input value={row.title ?? ''} onChange={(e) => updateLocal(row.id, { title: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Légende
                  <textarea
                    rows={2}
                    value={row.caption ?? ''}
                    onChange={(e) => updateLocal(row.id, { caption: e.target.value })}
                  />
                </label>
                <ImagePickerField
                  label="Photo de galerie"
                  value={row.image_url ?? ''}
                  onChange={(e) => updateLocal(row.id, { image_url: e.target.value })}
                  storageFolder="gallery"
                  previewAlt={`Photo ${row.title ?? 'galerie'}`}
                  icon="🖼️"
                />
                <label>
                  Album
                  <input value={row.album ?? 'general'} onChange={(e) => updateLocal(row.id, { album: e.target.value })} />
                </label>
                <label>
                  Ordre
                  <input
                    type="number"
                    value={row.sort_order ?? 0}
                    onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                  />
                </label>
                <label className="admin-check admin-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(row.published)}
                    onChange={(e) => updateLocal(row.id, { published: e.target.checked })}
                  />
                  Publié sur la galerie
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
