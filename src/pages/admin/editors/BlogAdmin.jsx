import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export function BlogAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
    const { error: insErr } = await supabase.from('site_blog_posts').insert({
      slug,
      locale: 'fr',
      title: 'Nouvel article',
      excerpt: '',
      body: '',
      published: false,
      published_at: null,
      sort_order: 0,
    })
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Article créé (brouillon).')
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
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
      setError(upErr.message)
      return
    }
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
        <h2>Blog (pages /blog)</h2>
        <button type="button" className="btn btn--primary" onClick={addRow}>
          Ajouter un article
        </button>
      </div>
      {message ? <p className="admin-success">{message}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <p className="admin-muted">
        Renseignez un couple unique <strong>slug + langue</strong>. Cochez « Publié » pour afficher
        l’article sur le site. La date de publication peut être ajustée manuellement.
      </p>
      <div className="admin-stack">
        {rows.map((row) => (
          <div className="admin-card admin-card--tight" key={row.id}>
            <div className="admin-grid">
              <label>
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
              <label className="admin-span-2">
                Corps (texte — paragraphes séparés par une ligne vide)
                <textarea
                  rows={8}
                  value={row.body ?? ''}
                  onChange={(e) => updateLocal(row.id, { body: e.target.value })}
                />
              </label>
              <label className="admin-span-2">
                Image (URL optionnelle)
                <input
                  value={row.hero_image_url ?? ''}
                  onChange={(e) => updateLocal(row.id, { hero_image_url: e.target.value })}
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
              <label>
                Date publication (ISO, si publié)
                <input
                  type="datetime-local"
                  value={
                    row.published_at
                      ? String(row.published_at).slice(0, 16)
                      : ''
                  }
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
