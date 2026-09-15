import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { supabase } from '../../../lib/supabase'
import { ImagePickerField } from '../../../components/admin/ImagePickerField'
import { ServiceIdCard, ServiceIdCardBack, resolveServiceCardData } from '../../../components/admin/ServiceIdCard'
import { SITE_CONTACT } from '../../../data/siteContact'
import { slugifyPersonnel } from '../../../lib/personnelSlug'
import {
  downloadPersonnelXls,
  parsePersonnelXls,
  personnelToXlsRow,
} from '../../../lib/personnelCardXls'

function slugifyFilename(value) {
  return (
    String(value || 'carte')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'carte'
  )
}

function isLikelyIos() {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/** Enregistre un PNG : partage natif (mobile) ou téléchargement ; repli iOS = ouvrir l’image. */
async function savePngBlob(blob, filename) {
  const file = new File([blob], filename, { type: 'image/png' })
  if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function') {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Carte de service GEACO',
        })
        return 'shared'
      }
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled'
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()

  if (isLikelyIos()) {
    window.open(url, '_blank', 'noopener')
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  return 'downloaded'
}

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
    card_phone: '',
    card_blood_group: '',
    card_signature_url: '',
    card_valid_until: '',
  }
}

const CARD_EDIT_KEYS = [
  'name',
  'role',
  'slug',
  'photo_url',
  'card_last_name',
  'card_post_name',
  'card_first_name',
  'card_sex',
  'card_birth_place',
  'card_birth_date',
  'card_matricule',
  'card_department',
  'card_address',
  'card_phone',
  'card_blood_group',
  'card_signature_url',
  'card_valid_until',
]

function snapshotCardFields(row) {
  const snap = {}
  for (const key of CARD_EDIT_KEYS) {
    snap[key] = row?.[key] == null ? '' : String(row[key])
  }
  return snap
}

function isCardDirty(row, baseline) {
  if (!row || !baseline) return false
  return CARD_EDIT_KEYS.some((key) => {
    const current = row[key] == null ? '' : String(row[key])
    return current !== baseline[key]
  })
}

export function ServiceCardsAdmin() {
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [previewId, setPreviewId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [printMode, setPrintMode] = useState('one') // one | all
  const [exportingPng, setExportingPng] = useState(false)
  const [xlsBusy, setXlsBusy] = useState(false)
  const previewStageRef = useRef(null)
  const editBaselineRef = useRef(null)
  const xlsInputRef = useRef(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error: qErr } = await supabase
      .from('site_personnel')
      .select('*')
      .order('section_order', { ascending: true })
      .order('sort_order', { ascending: true })
    if (qErr) {
      setError(
        qErr.message.includes('card_') || qErr.message.includes('slug')
          ? `${qErr.message} — Appliquez les migrations 017–019 (cartes / slug) dans Supabase.`
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

  const editingRow = useMemo(
    () => (editingId ? rows.find((r) => r.id === editingId) ?? null : null),
    [rows, editingId],
  )

  const editorDirty = Boolean(editingRow && isCardDirty(editingRow, editBaselineRef.current))

  useEffect(() => {
    if (!editingId) {
      if (window.__geacoAdminLeaveGuard) delete window.__geacoAdminLeaveGuard
      return undefined
    }

    window.__geacoAdminLeaveGuard = () => {
      if (!editBaselineRef.current) return true
      const row = rows.find((r) => r.id === editingId)
      if (!row || !isCardDirty(row, editBaselineRef.current)) return true
      return window.confirm(
        'Des modifications de la carte ne sont pas enregistrées. Quitter l’édition ?',
      )
    }

    function onBeforeUnload(event) {
      const row = rows.find((r) => r.id === editingId)
      if (!row || !isCardDirty(row, editBaselineRef.current)) return
      event.preventDefault()
      event.returnValue = ''
    }

    function onKeyDown(event) {
      const key = String(event.key || '').toLowerCase()
      const wantsRefresh = key === 'f5' || ((event.ctrlKey || event.metaKey) && key === 'r')
      if (!wantsRefresh) return
      const row = rows.find((r) => r.id === editingId)
      if (!row || !isCardDirty(row, editBaselineRef.current)) return
      event.preventDefault()
      window.alert('Enregistrez la carte avant de rafraîchir la page.')
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      if (window.__geacoAdminLeaveGuard) delete window.__geacoAdminLeaveGuard
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [editingId, rows])

  function updateLocal(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  async function saveCard(row) {
    if (!supabase) return
    setSavingId(row.id)
    setError('')
    setMessage('')
    const slug = String(row.slug ?? '').trim() || slugifyPersonnel(row.name)
    const { error: upErr } = await supabase
      .from('site_personnel')
      .update({
        name: row.name,
        slug,
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
        card_phone: row.card_phone?.trim() || null,
        card_blood_group: row.card_blood_group?.trim() || null,
        card_signature_url: row.card_signature_url?.trim() || null,
        card_valid_until: row.card_valid_until || null,
      })
      .eq('id', row.id)
    if (upErr) {
      setSavingId(null)
      setError(
        upErr.message.includes('card_') || upErr.message.includes('slug')
          ? `${upErr.message} — Appliquez les migrations 017–019 / 025 (cartes) dans Supabase.`
          : upErr.message,
      )
      return
    }
    setSavingId(null)
    setMessage('Données de carte enregistrées.')
    editBaselineRef.current = snapshotCardFields({ ...row, slug })
    load()
  }

  function computeCardDefaults(row) {
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
    if (!row.slug && row.name) patch.slug = slugifyPersonnel(row.name)
    if (!row.card_valid_until) {
      const d = new Date()
      d.setFullYear(d.getFullYear() + 1)
      patch.card_valid_until = d.toISOString().slice(0, 10)
    }
    return patch
  }

  function openEditor(row) {
    if (editingId && editingId !== row.id) {
      const current = rows.find((r) => r.id === editingId)
      if (current && isCardDirty(current, editBaselineRef.current)) {
        const ok = window.confirm(
          'Des modifications de la carte ne sont pas enregistrées. Ouvrir une autre carte ?',
        )
        if (!ok) return
      }
    }
    const patch = computeCardDefaults(row)
    const next = { ...row, ...patch }
    if (Object.keys(patch).length) updateLocal(row.id, patch)
    editBaselineRef.current = snapshotCardFields(next)
    setEditingId(row.id)
    setPreviewId(row.id)
  }

  function closeEditor({ force = false } = {}) {
    if (!force && editingRow && isCardDirty(editingRow, editBaselineRef.current)) {
      const ok = window.confirm(
        'Des modifications de la carte ne sont pas enregistrées. Fermer l’édition ?',
      )
      if (!ok) return
    }
    editBaselineRef.current = null
    setEditingId(null)
  }

  function printCards(mode) {
    setPrintMode(mode)
    if (mode === 'one' && previewRow) setPreviewId(previewRow.id)
    window.setTimeout(() => window.print(), 80)
  }

  async function exportPreviewPng() {
    const stage = previewStageRef.current
    const nodes = stage ? [...stage.querySelectorAll('.service-id-card')] : []
    if (!previewRow || !nodes.length) return

    setExportingPng(true)
    setError('')
    setMessage('')
    try {
      const pixelRatio = Math.min(3, Math.max(2, window.devicePixelRatio || 2))
      const base = slugifyFilename(previewRow.card_matricule || previewRow.name)
      let lastMode = 'downloaded'

      for (const node of nodes) {
        const face = node.getAttribute('data-card-face') || 'recto'
        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio,
          backgroundColor: '#ffffff',
        })
        const blob = await (await fetch(dataUrl)).blob()
        const filename = `geaco-carte-service-${base}-${face}.png`
        lastMode = await savePngBlob(blob, filename)
        if (lastMode === 'cancelled') break
      }

      if (lastMode === 'shared') {
        setMessage('PNG recto/verso prêts. Enregistrez via le menu de partage.')
      } else if (lastMode === 'downloaded') {
        setMessage(
          isLikelyIos()
            ? 'PNG ouverts. Appui long → Enregistrer dans Photos (recto puis verso).'
            : 'PNG recto et verso téléchargés.',
        )
      }
    } catch (err) {
      setError(
        err?.message
          ? `Export PNG impossible : ${err.message}`
          : 'Export PNG impossible. Vérifiez la photo (CORS) et réessayez.',
      )
    } finally {
      setExportingPng(false)
    }
  }

  function exportXls() {
    downloadPersonnelXls(
      rows.map(personnelToXlsRow),
      `geaco-cartes-personnel-${new Date().toISOString().slice(0, 10)}.xlsx`,
    )
    setMessage(
      rows.length ? `${rows.length} fiche(s) exportée(s) en XLS.` : 'Modèle XLS téléchargé.',
    )
  }

  function downloadXlsTemplate() {
    downloadPersonnelXls([], 'geaco-modele-personnel-cartes.xlsx')
    setMessage('Modèle XLS téléchargé.')
  }

  async function importXlsFile(file) {
    if (!file || !supabase) return
    setXlsBusy(true)
    setError('')
    setMessage('')
    try {
      const buffer = await file.arrayBuffer()
      const { rows: parsed, errors: parseErrors } = parsePersonnelXls(buffer)
      if (!parsed.length) {
        setError(
          parseErrors.length
            ? parseErrors.slice(0, 5).join(' ')
            : 'Aucune ligne valide à importer.',
        )
        setXlsBusy(false)
        return
      }

      const validUntil = new Date()
      validUntil.setFullYear(validUntil.getFullYear() + 1)
      const validUntilStr = validUntil.toISOString().slice(0, 10)

      const payload = parsed.map((r, i) => {
        const displayName = [r.last_name, r.post_name, r.first_name].filter(Boolean).join(' ').trim()
        const slugBase = slugifyPersonnel(displayName)
        return {
          section_order: 90,
          section_title: 'Équipe',
          name: displayName || 'Nouveau membre',
          slug: `${slugBase}-${Date.now().toString(36).slice(-4)}${i}`,
          role: r.role,
          focus: r.department || null,
          photo_url: r.photo_url || null,
          email: r.email || null,
          sort_order: i,
          locale: 'fr',
          published: false,
          card_last_name: r.last_name,
          card_post_name: r.post_name,
          card_first_name: r.first_name,
          card_sex: r.sex,
          card_birth_place: r.birth_place,
          card_birth_date: r.birth_date,
          card_department: r.department,
          card_address: SITE_CONTACT.offices.goma.shortAddress,
          card_phone: r.phone,
          card_blood_group: r.blood_group,
          card_valid_until: validUntilStr,
        }
      })

      const { error: insErr } = await supabase.from('site_personnel').insert(payload)
      if (insErr) {
        setError(
          insErr.message.includes('card_blood') || insErr.message.includes('card_phone')
            ? `${insErr.message} — Appliquez la migration 025 dans Supabase.`
            : insErr.message,
        )
        setXlsBusy(false)
        return
      }

      const warn = parseErrors.length ? ` (${parseErrors.length} ligne(s) ignorée(s))` : ''
      setMessage(`${payload.length} fiche(s) créée(s) en brouillon depuis le XLS${warn}.`)
      load()
    } catch (err) {
      setError(err?.message || 'Import XLS impossible.')
    } finally {
      setXlsBusy(false)
    }
  }

  function isPhotoUrl(url) {
    return String(url ?? '').trim().startsWith('http')
  }

  const printRows = printMode === 'all' ? rows : previewRow ? [previewRow] : []

  return (
    <section className="admin-section service-cards-admin">
      <div className="admin-section__head">
        <h2>Cartes de service</h2>
        <div className="admin-dashboard__actions admin-xls-actions">
          <button type="button" className="btn btn--outline" onClick={downloadXlsTemplate} disabled={xlsBusy}>
            Modèle XLS
          </button>
          <button type="button" className="btn btn--outline" onClick={exportXls} disabled={xlsBusy || !rows.length}>
            Exporter XLS
          </button>
          <button
            type="button"
            className="btn btn--outline"
            disabled={xlsBusy}
            onClick={() => xlsInputRef.current?.click()}
          >
            {xlsBusy ? 'Import…' : 'Importer XLS'}
          </button>
          <input
            ref={xlsInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="visually-hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.target.value = ''
              if (file) importXlsFile(file)
            }}
          />
          <button
            type="button"
            className="btn btn--primary"
            onClick={exportPreviewPng}
            disabled={!previewRow || exportingPng}
          >
            {exportingPng ? 'PNG…' : 'Télécharger PNG'}
          </button>
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
            className="btn btn--outline"
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
        Import/export XLS (mêmes colonnes que le formulaire Google) : Nom, Post-nom, Prénom, Sexe,
        dates, photo (URL), fonction, département, téléphone/WhatsApp, groupe sanguin. Les fiches
        importées sont créées en brouillon.
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
              <form
                className="admin-card admin-card--tight"
                key={`card-edit-${row.id}`}
                onSubmit={(e) => {
                  e.preventDefault()
                  saveCard(row)
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return
                  const tag = String(e.target?.tagName || '').toLowerCase()
                  if (tag === 'textarea') return
                  if (tag === 'input' || tag === 'select') e.preventDefault()
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Édition carte — {row.name}
                  {editorDirty ? (
                    <span className="admin-muted" style={{ marginLeft: '0.5rem', fontWeight: 400 }}>
                      (non enregistré)
                    </span>
                  ) : null}
                </h3>
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
                  <label>
                    Groupe sanguin
                    <input
                      value={row.card_blood_group ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_blood_group: e.target.value })}
                      placeholder="Ex. O+"
                      maxLength={20}
                    />
                  </label>
                  <label>
                    Téléphone / WhatsApp
                    <input
                      value={row.card_phone ?? ''}
                      onChange={(e) => updateLocal(row.id, { card_phone: e.target.value })}
                      placeholder="+243 …"
                      maxLength={60}
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
                    label="Cachet + signature (défaut GEACO si vide)"
                    value={row.card_signature_url ?? ''}
                    onChange={(e) => updateLocal(row.id, { card_signature_url: e.target.value })}
                    storageFolder="personnel-signatures"
                    previewAlt="Cachet et signature"
                    icon="✍️"
                  />
                </div>
                <div className="admin-actions admin-actions--sticky">
                  <button
                    type="submit"
                    className="btn btn--primary"
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
                  <button type="button" className="btn btn--ghost" onClick={() => closeEditor()}>
                    Fermer
                  </button>
                </div>
              </form>
            ))}
        </div>

        <aside className="service-cards-admin__preview">
          <div className="service-cards-admin__preview-head">
            <h3>Aperçu</h3>
            {previewRow ? (
              <div className="service-cards-admin__preview-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={exportPreviewPng}
                  disabled={exportingPng}
                >
                  {exportingPng ? 'PNG…' : 'PNG'}
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => printCards('one')}>
                  Imprimer
                </button>
              </div>
            ) : null}
          </div>
          {previewRow ? (
            <div className="service-cards-admin__stage" ref={previewStageRef}>
              <p className="service-cards-admin__face-label">Recto</p>
              <ServiceIdCard member={previewRow} />
              <p className="service-cards-admin__face-label">Verso</p>
              <ServiceIdCardBack member={previewRow} />
            </div>
          ) : (
            <p className="admin-muted">Sélectionnez un membre pour prévisualiser sa carte.</p>
          )}
        </aside>
      </div>

      {/* Zone d’impression hors écran normal */}
      <div className="service-cards-print" aria-hidden="true">
        {printRows.flatMap((row) => [
          <div className="service-cards-print__page" key={`print-recto-${row.id}`}>
            <ServiceIdCard member={row} />
          </div>,
          <div className="service-cards-print__page" key={`print-verso-${row.id}`}>
            <ServiceIdCardBack member={row} />
          </div>,
        ])}
      </div>
    </section>
  )
}
