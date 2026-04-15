import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { ImagePickerField } from '../../../components/admin/ImagePickerField'

export function PersonnelAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase
      .from('site_personnel')
      .select('*')
      .order('section_order', { ascending: true })
      .order('sort_order', { ascending: true })
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
    setError('')
    setMessage('')
    const nextOrder = rows.length ? Math.max(...rows.map((r) => Number(r.section_order) || 0)) + 1 : 0
    const { error: insErr } = await supabase.from('site_personnel').insert({
      section_order: nextOrder,
      section_title: 'Nouvelle rubrique',
      name: 'Nom',
      role: 'Fonction',
      focus: '',
      bio: '',
      photo_url: null,
      email: null,
      facebook_url: null,
      linkedin_url: null,
      sort_order: 0,
      locale: 'fr',
      published: true,
    })
    if (insErr) {
      setError(insErr.message)
      return
    }
    setMessage('Fiche créée et publiée par défaut. Vous pouvez la repasser en brouillon si besoin.')
    load()
  }

  async function saveRow(row) {
    if (!supabase) return
    setSavingId(row.id)
    setError('')
    setMessage('')
    const { error: upErr } = await supabase
      .from('site_personnel')
      .update({
        section_order: Number(row.section_order) || 0,
        section_title: row.section_title,
        name: row.name,
        role: row.role,
        focus: row.focus || null,
        bio: row.bio || null,
        photo_url: row.photo_url?.trim() || null,
        email: row.email?.trim() || null,
        facebook_url: row.facebook_url?.trim() || null,
        linkedin_url: row.linkedin_url?.trim() || null,
        sort_order: Number(row.sort_order) || 0,
        locale: row.locale === 'en' ? 'en' : 'fr',
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
    if (row.published) {
      setMessage('Fiche enregistrée et visible sur le site.')
    } else {
      setMessage('Fiche enregistrée en brouillon (non visible sur le site tant que "Publié" n’est pas coché).')
    }
    load()
  }

  async function removeRow(id) {
    if (!supabase) return
    if (!window.confirm('Supprimer cette fiche ?')) return
    const { error: delErr } = await supabase.from('site_personnel').delete().eq('id', id)
    if (delErr) {
      setError(delErr.message)
      return
    }
    setMessage('Fiche supprimée.')
    load()
  }

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function isPhotoUrl(url) {
    return String(url ?? '').trim().startsWith('http')
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Personnel (page /personnel) 👤</h2>
        <button type="button" className="btn btn--primary" onClick={addRow}>
          Ajouter une fiche
        </button>
      </div>
      {message ? <p className="admin-success">{message}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      <p className="admin-muted">
        Les cartes partageant le même <strong>ordre de section</strong> (nombre entier) et la même{' '}
        <strong>langue</strong> sont regroupées sous le titre de section (texte de la première fiche du groupe).
        Utilisez le même <code>section_order</code> pour toutes les personnes d’un même bloc (ex. 0 pour la
        direction, 1 pour le secrétariat). <strong>URL photo</strong> : lien https vers une image (hébergement
        libre ou fichier public Supabase Storage). Dupliquez les fiches en FR et EN si besoin. En bas de carte
        : email (texte avec @) et liens Facebook / LinkedIn (URL https complètes).
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {rows.map((row) => (
            <article className="admin-compact-item" key={row.id}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  {isPhotoUrl(row.photo_url) ? (
                    <img src={String(row.photo_url).trim()} alt="" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>
                <div className="admin-compact-item__text">
                  <h3>{row.name || 'Sans nom'}</h3>
                  <p>{row.role || 'Fonction non renseignée'}</p>
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
                <label>
                  Ordre de section (groupe)
                  <input
                    type="number"
                    value={row.section_order}
                    onChange={(e) => updateLocal(row.id, { section_order: e.target.value })}
                  />
                </label>
                <label>
                  Ordre dans la section
                  <input
                    type="number"
                    value={row.sort_order}
                    onChange={(e) => updateLocal(row.id, { sort_order: e.target.value })}
                  />
                </label>
                <label className="admin-span-2">
                  Titre de section (affiché pour le groupe)
                  <input
                    value={row.section_title}
                    onChange={(e) => updateLocal(row.id, { section_title: e.target.value })}
                  />
                </label>
                <label>
                  Langue
                  <select value={row.locale} onChange={(e) => updateLocal(row.id, { locale: e.target.value })}>
                    <option value="fr">FR</option>
                    <option value="en">EN</option>
                  </select>
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={row.published}
                    onChange={(e) => updateLocal(row.id, { published: e.target.checked })}
                  />
                  Publié
                </label>
                <label className="admin-span-2">
                  Nom affiché
                  <input value={row.name} onChange={(e) => updateLocal(row.id, { name: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Fonction (titre)
                  <input value={row.role} onChange={(e) => updateLocal(row.id, { role: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Périmètre / sous-titre
                  <input value={row.focus ?? ''} onChange={(e) => updateLocal(row.id, { focus: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Biographie
                  <textarea
                    rows={3}
                    value={row.bio ?? ''}
                    onChange={(e) => updateLocal(row.id, { bio: e.target.value })}
                  />
                </label>
                <ImagePickerField
                  label="Photo de la personne"
                  value={row.photo_url ?? ''}
                  onChange={(e) => updateLocal(row.id, { photo_url: e.target.value })}
                  storageFolder="personnel"
                  previewAlt={`Photo de ${row.name ?? 'membre'}`}
                  icon="👤"
                />
                <label className="admin-span-2">
                  Email (affiché en lien mailto)
                  <input
                    type="email"
                    value={row.email ?? ''}
                    onChange={(e) => updateLocal(row.id, { email: e.target.value })}
                    placeholder="prenom.nom@exemple.com"
                  />
                </label>
                <label className="admin-span-2">
                  Lien page Facebook (https://…)
                  <input
                    value={row.facebook_url ?? ''}
                    onChange={(e) => updateLocal(row.id, { facebook_url: e.target.value })}
                    placeholder="https://www.facebook.com/…"
                  />
                </label>
                <label className="admin-span-2">
                  Lien profil LinkedIn (https://…)
                  <input
                    value={row.linkedin_url ?? ''}
                    onChange={(e) => updateLocal(row.id, { linkedin_url: e.target.value })}
                    placeholder="https://www.linkedin.com/in/…"
                  />
                </label>
              </div>
              <div className="admin-actions admin-actions--sticky">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => saveRow(row)}
                  disabled={savingId === row.id}
                >
                  {savingId === row.id ? 'Enregistrement…' : 'Enregistrer la fiche'}
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
