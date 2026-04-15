import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { RichTextTextarea } from '../../../components/admin/RichTextTextarea'
import { ImagePickerField } from '../../../components/admin/ImagePickerField'

export function BlogAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase
      .from('site_blog_posts')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
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
    const slug = `article-${id}`
    const { data: inserted, error: insErr } = await supabase
      .from('site_blog_posts')
      .insert({
        slug,
        locale: 'fr',
        title: 'Nouvel article',
        excerpt: '',
        body: '',
        published: false,
        published_at: null,
        sort_order: 0,
      })
      .select('id')
      .single()
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Article créé (brouillon).')
    setEditingId(inserted?.id ?? null)
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    const publishedAt = row.published ? row.published_at || new Date().toISOString() : null
    const { error: upErr } = await supabase
      .from('site_blog_posts')
      .update({
        slug: row.slug,
        locale: row.locale === 'en' ? 'en' : 'fr',
        title: row.title,
        excerpt: row.excerpt || null,
        body: row.body ?? '',
        hero_image_url: row.hero_image_url || null,
        published: Boolean(row.published),
        published_at: publishedAt,
        sort_order: Number(row.sort_order) || 0,
      })
      .eq('id', row.id)
    if (upErr) {
      setSavingId(null)
      setError(upErr.message)
      return
    }
    setSavingId(null)
    setEditingId(null)
    setMessage('Article enregistré.')
    load()
  }

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer cet article ?')) return
    const { error: delErr } = await supabase.from('site_blog_posts').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Article supprimé.')
    load()
  }

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Articles ({rows.length})</h2>
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
        Renseignez un couple unique <strong>slug + langue</strong>. Cochez « Publié » pour afficher
        l’article sur le site. Utilisez la barre d’outils pour un formatage moderne (titres, gras,
        listes, liens).
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  {row.hero_image_url ? <img src={String(row.hero_image_url).trim()} alt="" /> : <span>📓</span>}
                </div>
                <div className="admin-compact-item__text">
                  <h3>{row.title || 'Article sans titre'}</h3>
                  <p>{row.slug || 'Sans slug'}</p>
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
                      <input value={row.title} onChange={(e) => updateLocal(row.id, { title: e.target.value })} />
                    </label>
                    <label className="admin-span-2">
                      Chapô / extrait
                      <textarea
                        rows={2}
                        value={row.excerpt ?? ''}
                        onChange={(e) => updateLocal(row.id, { excerpt: e.target.value })}
                      />
                    </label>
                    <RichTextTextarea
                      label="Corps de l’article"
                      rows={12}
                      storageKey={`blog:${row.id}:body`}
                      value={row.body ?? ''}
                      onChange={(e) => updateLocal(row.id, { body: e.target.value })}
                    />
                    <ImagePickerField
                      label="Image de couverture de l’article"
                      value={row.hero_image_url ?? ''}
                      onChange={(e) => updateLocal(row.id, { hero_image_url: e.target.value })}
                      storageFolder="blog"
                      previewAlt={`Couverture de ${row.title ?? 'article'}`}
                      icon="📓"
                    />
                  </div>
                </div>
                <aside className="cms-record__side">
                  <div className="admin-grid">
                    <label className="admin-span-2">
                      Slug (URL)
                      <input value={row.slug} onChange={(e) => updateLocal(row.id, { slug: e.target.value })} />
                    </label>
                    <label>
                      Langue
                      <select
                        value={row.locale}
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
                        value={row.sort_order}
                        onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                      />
                    </label>
                    <label className="admin-span-2">
                      Date publication (ISO, si publié)
                      <input
                        type="datetime-local"
                        value={row.published_at ? String(row.published_at).slice(0, 16) : ''}
                        onChange={(e) =>
                          updateLocal(row.id, {
                            published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                          })
                        }
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
