import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { RichTextTextarea } from '../../../components/admin/RichTextTextarea'
import { ImagePickerField } from '../../../components/admin/ImagePickerField'

const PROJECT_CATEGORY_OPTIONS = [
  { value: 'construction', label: 'Projet de construction' },
  { value: 'agricole', label: 'Projet agricole' },
  { value: 'wash', label: 'Projet WASH' },
]

function projectCategoryLabel(value) {
  return PROJECT_CATEGORY_OPTIONS.find((option) => option.value === value)?.label ?? 'Projet de construction'
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function toDateInputValue(value) {
  if (!value) return ''
  const raw = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
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
        tag: '',
        project_category: 'wash',
        image_url: '',
        description: '',
        impact: '',
        location: '',
        executed_at: null,
        sort_order: (rows[rows.length - 1]?.sort_order ?? 0) + 1,
        published: false,
      })
      .select('id')
      .single()
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Projet créé (brouillon). Renseignez image, date, titre et description.')
    setEditingId(inserted?.id ?? null)
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    const executedAt = toDateInputValue(row.executed_at) || null
    const { error: upErr } = await supabase
      .from('site_projects')
      .update({
        slug: row.slug,
        title: row.title,
        tag: row.tag,
        project_category:
          row.project_category === 'agricole'
            ? 'agricole'
            : row.project_category === 'wash'
              ? 'wash'
              : 'construction',
        image_url: row.image_url || null,
        description: row.description,
        impact: row.impact,
        location: row.location || '',
        executed_at: executedAt,
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
          + Ajouter une fiche
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
        Chaque projet publié apparaît comme un article (image, titre, date d’exécution, description) sur
        /projets/… et dans sa catégorie (Agriculture, Construction, WASH). Slug = URL publique
        /projets/votre-slug.
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  {String(row.image_url ?? '').trim() ? (
                    <img src={String(row.image_url).trim()} alt="" />
                  ) : (
                    'PJ'
                  )}
                </div>
                <div className="admin-compact-item__text">
                  <h3>{row.title || 'Projet sans titre'}</h3>
                  <p>{projectCategoryLabel(row.project_category)}</p>
                  <p>
                    {row.executed_at
                      ? `Exécution : ${toDateInputValue(row.executed_at)}`
                      : 'Date d’exécution non renseignée'}
                  </p>
                  <p className={`admin-status-pill ${row.published ? 'is-live' : 'is-draft'}`}>
                    {row.published ? 'Publié' : 'Brouillon'}
                  </p>
                </div>
              </div>
              <div className="admin-compact-item__actions">
                {row.published && row.slug ? (
                  <Link className="btn btn--ghost" to={`/projets/${row.slug}`} target="_blank" rel="noreferrer">
                    Voir
                  </Link>
                ) : null}
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
                      Titre du projet
                      <input
                        value={row.title}
                        onChange={(e) => updateLocal(row.id, { title: e.target.value })}
                      />
                    </label>
                    <ImagePickerField
                      label="Image de couverture (haut de page)"
                      value={row.image_url ?? ''}
                      onChange={(e) => updateLocal(row.id, { image_url: e.target.value })}
                      storageFolder="projects"
                      previewAlt={`Couverture de ${row.title ?? 'projet'}`}
                      icon="PJ"
                      help="Image affichée en haut de la fiche article et sur la liste des projets."
                    />
                    <label>
                      Date d’exécution
                      <input
                        type="date"
                        value={toDateInputValue(row.executed_at)}
                        onChange={(e) => updateLocal(row.id, { executed_at: e.target.value })}
                      />
                    </label>
                    <label>
                      Lieu
                      <input
                        value={row.location ?? ''}
                        onChange={(e) => updateLocal(row.id, { location: e.target.value })}
                        placeholder="Ex. : Goma, Nord-Kivu"
                      />
                    </label>
                    <label>
                      Étiquette courte
                      <input
                        value={row.tag ?? ''}
                        onChange={(e) => updateLocal(row.id, { tag: e.target.value })}
                        placeholder="Ex. : Forage, Adduction, Assainissement"
                      />
                    </label>
                    <label>
                      Catégorie
                      <select
                        value={row.project_category ?? 'construction'}
                        onChange={(e) => updateLocal(row.id, { project_category: e.target.value })}
                      >
                        {PROJECT_CATEGORY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <RichTextTextarea
                      label="Description (corps de l’article)"
                      rows={12}
                      storageKey={`project:${row.id}:description`}
                      value={row.description}
                      onChange={(e) => updateLocal(row.id, { description: e.target.value })}
                    />
                    <RichTextTextarea
                      label="Résultats / impact (facultatif)"
                      rows={5}
                      storageKey={`project:${row.id}:impact`}
                      value={row.impact}
                      onChange={(e) => updateLocal(row.id, { impact: e.target.value })}
                    />
                  </div>
                </div>
                <aside className="cms-record__side">
                  <div className="admin-grid">
                    <label className="admin-span-2">
                      Slug (URL /projets/…)
                      <input
                        value={row.slug}
                        onChange={(e) => updateLocal(row.id, { slug: e.target.value })}
                        onBlur={() => {
                          if (!String(row.slug ?? '').trim() && row.title) {
                            updateLocal(row.id, { slug: slugify(row.title) })
                          }
                        }}
                      />
                    </label>
                    <label className="admin-span-2">
                      Ordre d’affichage
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
                    <p className="admin-muted admin-span-2">
                      Aperçu public : /projets/{row.slug || '…'}
                    </p>
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
