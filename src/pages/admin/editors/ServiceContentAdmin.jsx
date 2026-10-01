import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { SERVICE_CONTENT_KEYS } from '../../../lib/serviceDbKeys'

const LABELS = {
  agronomie: 'Agriculture (/domaines/agriculture)',
  civil: 'Construction (/domaines/construction)',
  hydro: 'WASH (/domaines/wash)',
  solution_cafe: 'Solution Café (projet → /projets/solution-cafe)',
}

export function ServiceContentAdmin() {
  const [serviceKey, setServiceKey] = useState('solution_cafe')
  const [editingKey, setEditingKey] = useState(null)
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [pageTitle, setPageTitle] = useState('')
  const [intro, setIntro] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [sectionsJson, setSectionsJson] = useState('[]')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    const { data, error: qErr } = await supabase
      .from('site_service_content')
      .select('*')
      .eq('service_key', serviceKey)
      .maybeSingle()
    setLoading(false)
    if (qErr) {
      setError(qErr.message)
      return
    }
    setError('')
    if (data) {
      setMetaTitle(data.meta_title ?? '')
      setMetaDescription(data.meta_description ?? '')
      setPageTitle(data.page_title ?? '')
      setIntro(data.intro ?? '')
      setHeroImageUrl(data.hero_image_url ?? '')
      setSectionsJson(JSON.stringify(data.sections ?? [], null, 2))
    } else {
      setMetaTitle('')
      setMetaDescription('')
      setPageTitle('')
      setIntro('')
      setHeroImageUrl('')
      setSectionsJson('[]')
    }
  }, [serviceKey])

  useEffect(() => {
    setMessage('')
    setError('')
    load()
  }, [load])

  useEffect(() => {
    if (!editingKey) return
    setServiceKey(editingKey)
  }, [editingKey])

  async function save() {
    if (!supabase) return
    let sections
    try {
      sections = JSON.parse(sectionsJson)
    } catch {
      setError('JSON des sections invalide.')
      return
    }
    if (!Array.isArray(sections)) {
      setError('Le champ « sections » doit être un tableau JSON.')
      return
    }
    const payload = {
      service_key: serviceKey,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      page_title: pageTitle || null,
      intro: intro || null,
      hero_image_url: heroImageUrl || null,
      sections,
    }
    const { error: upErr } = await supabase.from('site_service_content').upsert(payload, {
      onConflict: 'service_key',
    })
    if (upErr) {
      setError(upErr.message)
      return
    }
    setMessage('Contenu enregistré. Il remplace les textes par défaut du site pour cette page.')
    load()
  }

  return (
    <section className="admin-section">
      <div className="admin-section__head">
        <h2>Pages services ({SERVICE_CONTENT_KEYS.length})</h2>
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
        Si vous laissez un champ vide côté base, le site continue d’afficher le texte défini dans les
        fichiers de traduction — sauf pour les sections : dès qu’une ligne existe en base avec un
        tableau de sections non vide, celui-ci remplace les blocs par défaut.
      </p>
      <div className="admin-stack">
        <div className="admin-compact-list">
          {SERVICE_CONTENT_KEYS.map((key) => (
            <article className="admin-compact-item" key={key}>
              <div className="admin-compact-item__main">
                <div className="admin-compact-item__avatar" aria-hidden="true">
                  📄
                </div>
                <div className="admin-compact-item__text">
                  <h3>{LABELS[key] ?? key}</h3>
                  <p>Clé : {key}</p>
                  <p className={`admin-status-pill ${editingKey === key ? 'is-live' : 'is-draft'}`}>
                    {editingKey === key ? 'En cours' : 'Disponible'}
                  </p>
                </div>
              </div>
              <div className="admin-compact-item__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setEditingKey((prev) => (prev === key ? null : key))}
                >
                  {editingKey === key ? 'Fermer' : 'Editer'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {editingKey ? (
          <div className="admin-card admin-card--tight">
            <label>
              Page
              <select value={serviceKey} onChange={(e) => setServiceKey(e.target.value)}>
                {SERVICE_CONTENT_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {LABELS[k] ?? k}
                  </option>
                ))}
              </select>
            </label>
            {loading ? (
              <p className="admin-muted">Chargement…</p>
            ) : (
              <>
                <div className="admin-grid" style={{ marginTop: '1rem' }}>
                  <label className="admin-span-2">
                    Meta title (SEO)
                    <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                  </label>
                  <label className="admin-span-2">
                    Meta description (SEO)
                    <textarea
                      rows={2}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                    />
                  </label>
                  <label className="admin-span-2">
                    Titre de page (H1 / fil d’Ariane)
                    <input value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} />
                  </label>
                  <label className="admin-span-2">
                    Chapô (sous le titre)
                    <textarea rows={4} value={intro} onChange={(e) => setIntro(e.target.value)} />
                  </label>
                  <label className="admin-span-2">
                    Image hero (URL complète)
                    <input value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} />
                  </label>
                  <label className="admin-span-2">
                    Sections (JSON) — tableau d’objets{' '}
                    <code>{`{ "title": "...", "text": "...", "items": ["..."] }`}</code>
                    <textarea
                      rows={16}
                      value={sectionsJson}
                      onChange={(e) => setSectionsJson(e.target.value)}
                      spellCheck={false}
                    />
                  </label>
                </div>
                <div className="admin-actions">
                  <button type="button" className="btn btn--primary" onClick={save}>
                    Enregistrer dans Supabase
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="admin-muted">Cliquez sur « Editer » pour ouvrir le formulaire d’une page service.</p>
        )}
      </div>
    </section>
  )
}
