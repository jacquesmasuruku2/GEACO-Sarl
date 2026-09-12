import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { ImagePickerField } from '../../../components/admin/ImagePickerField'
import { ServiceIdCard, resolveServiceCardData } from '../../../components/admin/ServiceIdCard'
import { SITE_CONTACT } from '../../../data/siteContact'

function blankCardFields() {
  return {
    card_last_name: '',
    card_post_name: '',
    card_first_name: '',
    card_sex: '',
    card_birth_place: '',
    card_birth_date: '',
    card_matricule: '',
    card_department: '',
    card_address: SITE_CONTACT.offices.goma.shortAddress,
    card_signature_url: '',
    card_valid_until: '',
  }
}

export function ServiceCardsAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [previewId, setPreviewId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [printMode, setPrintMode] = useState('one') // one | all

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase
      .from('site_personnel')
      .select('*')
      .order('section_order', { ascending: true })
      .order('sort_order', { ascending: true })
    if (qErr) {
      setError(
        qErr.message.includes('card_')
          ? `${qErr.message} — Appliquez les migrations 017 et 018 (cartes de service) dans Supabase.`
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

  const previewRow = useMemo(
    () => rows.find((r) => r.id === previewId) ?? rows.find((r) => r.id === editingId) ?? rows[0] ?? null,
    [rows, previewId, editingId],
  )

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  async function saveCard(row) {
    if (!supabase) return
    setSavingId(row.id)
    setError('')
    setMessage('')
    const { error: upErr } = await supabase
      .from('site_personnel')
      .update({
        name: row.name,
        role: row.role,
        photo_url: row.photo_url?.trim() || null,
        card_last_name: row.card_last_name?.trim() || null,
        card_post_name: row.card_post_name?.trim() || null,
        card_first_name: row.card_first_name?.trim() || null,
        card_sex: row.card_sex?.trim() || null,
        card_birth_place: row.card_birth_place?.trim() || null,
        card_birth_date: row.card_birth_date || null,
        card_matricule: row.card_matricule?.trim() || null,
        card_department: row.card_department?.trim() || null,
        card_address: row.card_address?.trim() || null,
        card_signature_url: row.card_signature_url?.trim() || null,
        card_valid_until: row.card_valid_until || null,
      })
      .eq('id', row.id)
    if (upErr) {
      setSavingId(null)
      setError(
        upErr.message.includes('card_')
          ? `${upErr.message} — Appliquez les migrations 017 et 018 (cartes de service) dans Supabase.`
          : upErr.message,
      )
      return
    }
    setSavingId(null)
    setMessage('Données de carte enregistrées.')
    load()
  }

  function ensureCardDefaults(row) {
    const patch = {}
    if (!row.card_last_name && !row.card_first_name && row.name) {
      const parts = String(row.name).trim().split(/\s+/)
      if (parts.length >= 2) {
        patch.card_first_name = parts[parts.length - 1]
        patch.card_last_name = parts.slice(0, -1).join(' ')
      } else {
        patch.card_last_name = row.name
      }
    }
    if (!row.card_address) patch.card_address = SITE_CONTACT.offices.goma.shortAddress
    if (!row.card_valid_until) {
      const d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      patch.card_valid_until = d.toISOString().slice(0, 10)
    }
    if (Object.keys(patch).length) updateLocal(row.id, patch)
  }

  function openEditor(row) {
    ensureCardDefaults(row)
    setEditingId(row.id)
    setPreviewId(row.id)
  }

  function printCards(mode) {
    setPrintMode(mode)
    if (mode === 'one' && previewRow) setPreviewId(previewRow.id)
    window.setTimeout(() => window.print(), 80)
  }

  function isPhotoUrl(url) {
    return String(url ?? '').trim().startsWith('http')
  }

  const printRows = printMode === 'all' ? rows : previewRow ? [previewRow] : []

  return (
    <section className="admin-section service-cards-admin">
      <div className="admin-section__head">
        <h2>Cartes de service</h2>
        <div className="admin-dashboard__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => printCards('one')}
            disabled={!previewRow}
          >
            Imprimer la carte
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => printCards('all')}
            disabled={!rows.length}
          >
            Imprimer toutes
          </button>
        </div>
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
        Produisez les cartes de service GEACO à partir des fiches équipe. Renseignez noms, prénom,
        matricule, adresse, signature et date de validité, puis imprimez (ou exportez en PDF via
        « Imprimer → Enregistrer au format PDF »).
      </p>

      <div className="service-cards-admin__layout">
        <div className="service-cards-admin__list">
          <div className="admin-compact-list">
            {rows.map((row) => {
              const card = resolveServiceCardData(row)
              const ready = Boolean(row.card_matricule || row.card_last_name || row.card_first_name)
              return (
                <article className="admin-compact-item" key={row.id}>
                  <div className="admin-compact-item__main">
                    <div className="admin-compact-item__avatar" aria-hidden="true">
                      {isPhotoUrl(row.photo_url) ? (
                        <img src={String(row.photo_url).trim()} alt="" />
                      ) : (
                        <span>🪪</span>
                      )}
                    </div>
                    <div className="admin-compact-item__text">
                      <h3>{row.name || 'Sans nom'}</h3>
                      <p>
                        {row.role || 'Fonction'}
                        {row.card_matricule ? ` · ${row.card_matricule}` : ''}
                      </p>
                      <p className={`admin-status-pill ${ready ? 'is-live' : 'is-draft'}`}>
                        {ready ? `Carte · ${card.validUntil}` : 'Données carte à compléter'}
                      </p>
                    </div>
                  </div>
                  <div className="admin-compact-item__actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => setPreviewId(row.id)}
                    >
                      Aperçu
                    </button>
                    <button type="button" className="btn btn--outline" onClick={() => openEditor(row)}>
                      {editingId === row.id ? 'Édition ouverte' : 'Éditer carte'}
                    </button>
                  </div>
                </article>
              )
            })}
            {!rows.length ? (
              <p className="admin-muted">
                Aucune fiche équipe. Créez d’abord des membres dans le module « Équipe ».
              </p>
            ) : null}
          </div>

          {rows
            .filter((row) => row.id === editingId)
            .map((row) => (
              <div className="admin-card admin-card--tight" key={`card-edit-${row.id}`}>
                <h3 style={{ marginTop: 0 }}>Édition carte — {row.name}</h3>
                <div className="admin-grid">
                  <label>
                    Nom
                    <input
                      value={row.card_last_name ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_last_name: e.target.value })}
                      placeholder="Ex. BARAKA"
                    />
                  </label>
                  <label>
                    Post-nom
                    <input
                      value={row.card_post_name ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_post_name: e.target.value })}
                      placeholder="Ex. MUSA"
                    />
                  </label>
                  <label>
                    Prénom
                    <input
                      value={row.card_first_name ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_first_name: e.target.value })}
                      placeholder="Ex. Eric"
                    />
                  </label>
                  <label>
                    Sexe
                    <select
                      value={row.card_sex ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_sex: e.target.value })}
                    >
                      <option value="">—</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  </label>
                  <label>
                    Lieu de naissance
                    <input
                      value={row.card_birth_place ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_birth_place: e.target.value })}
                      placeholder="Ex. Goma"
                    />
                  </label>
                  <label>
                    Date de naissance
                    <input
                      type="date"
                      value={row.card_birth_date ? String(row.card_birth_date).slice(0, 10) : ''}
                      onChange={(e) => updateLocal(row.id, { card_birth_date: e.target.value })}
                    />
                  </label>
                  <label className="admin-span-2">
                    Nom affiché site (synchronisé)
                    <input value={row.name ?? ''} onChange={(e) => updateLocal(row.id, { name: e.target.value })} />
                  </label>
                  <label>
                    Fonction
                    <input value={row.role ?? ''} onChange={(e) => updateLocal(row.id, { role: e.target.value })} />
                  </label>
                  <label>
                    Matricule
                    <input
                      value={row.card_matricule ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_matricule: e.target.value })}
                      placeholder="Ex. GEA-001/2024"
                    />
                  </label>
                  <label>
                    Département
                    <input
                      value={row.card_department ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_department: e.target.value })}
                      placeholder="Ex. Construction"
                    />
                  </label>
                  <label>
                    Validité
                    <input
                      type="date"
                      value={row.card_valid_until ? String(row.card_valid_until).slice(0, 10) : ''}
                      onChange={(e) => updateLocal(row.id, { card_valid_until: e.target.value })}
                    />
                  </label>
                  <label className="admin-span-2">
                    Adresse (interne / optionnelle)
                    <input
                      value={row.card_address ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_address: e.target.value })}
                      placeholder={SITE_CONTACT.offices.goma.shortAddress}
                    />
                  </label>
                  <ImagePickerField
                    label="Photo (carte)"
                    value={row.photo_url ?? ''}
                    onChange={(e) => updateLocal(row.id, { photo_url: e.target.value })}
                    storageFolder="personnel"
                    previewAlt={`Photo de ${row.name ?? 'membre'}`}
                    icon="👤"
                  />
                  <ImagePickerField
                    label="Signature autorisée"
                    value={row.card_signature_url ?? ''}
                    onChange={(e) => updateLocal(row.id, { card_signature_url: e.target.value })}
                    storageFolder="personnel-signatures"
                    previewAlt="Signature"
                    icon="✍️"
                  />
                </div>
                <div className="admin-actions admin-actions--sticky">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => saveCard(row)}
                    disabled={savingId === row.id}
                  >
                    {savingId === row.id ? 'Enregistrement…' : 'Enregistrer la carte'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => {
                      const defaults = blankCardFields()
                      updateLocal(row.id, defaults)
                    }}
                  >
                    Réinitialiser champs carte
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setEditingId(null)}>
                    Fermer
                  </button>
                </div>
              </div>
            ))}
        </div>

        <aside className="service-cards-admin__preview">
          <div className="service-cards-admin__preview-head">
            <h3>Aperçu</h3>
            {previewRow ? (
              <button type="button" className="btn btn--ghost" onClick={() => printCards('one')}>
                Imprimer
              </button>
            ) : null}
          </div>
          {previewRow ? (
            <div className="service-cards-admin__stage">
              <ServiceIdCard member={previewRow} />
            </div>
          ) : (
            <p className="admin-muted">Sélectionnez un membre pour prévisualiser sa carte.</p>
          )}
        </aside>
      </div>

      {/* Zone d’impression hors écran normal */}
      <div className="service-cards-print" aria-hidden="true">
        {printRows.map((row) => (
          <div className="service-cards-print__page" key={`print-${row.id}`}>
            <ServiceIdCard member={row} />
          </div>
        ))}
      </div>
    </section>
  )
}
