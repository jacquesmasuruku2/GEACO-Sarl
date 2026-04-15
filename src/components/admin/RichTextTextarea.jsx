import { useEffect, useId, useRef, useState } from 'react'
import { RichTextContent } from '../RichTextContent'

function applyWrap(textarea, left, right = left) {
  const start = textarea.selectionStart ?? 0
  const end = textarea.selectionEnd ?? 0
  const value = textarea.value ?? ''
  const selected = value.slice(start, end) || 'texte'
  const next = `${value.slice(0, start)}${left}${selected}${right}${value.slice(end)}`
  const cursor = start + left.length + selected.length + right.length
  return { next, cursor }
}

function applyLinePrefix(textarea, prefix) {
  const start = textarea.selectionStart ?? 0
  const end = textarea.selectionEnd ?? 0
  const value = textarea.value ?? ''
  const lineStart = value.lastIndexOf('\n', Math.max(0, start - 1)) + 1
  const lineEndIdx = value.indexOf('\n', end)
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx
  const segment = value.slice(lineStart, lineEnd)
  const replaced = segment
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
  const next = `${value.slice(0, lineStart)}${replaced}${value.slice(lineEnd)}`
  return { next, cursor: end + prefix.length }
}

export function RichTextTextarea({
  id,
  label,
  value,
  onChange,
  rows = 8,
  className = '',
  storageKey = '',
  hint = 'Outils : # titre, **gras**, *italique*, listes et liens.',
}) {
  const autoId = useId()
  const fieldId = id || autoId
  const textareaRef = useRef(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [draftStatus, setDraftStatus] = useState('')

  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = window.localStorage.getItem(`cms-draft:${storageKey}`)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.value === 'string' && parsed.value !== (value ?? '') && !(value ?? '').trim()) {
        onChange({ target: { value: parsed.value } })
        setDraftStatus('Brouillon restauré automatiquement.')
      }
    } catch {
      // ignore local restore errors
    }
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    try {
      window.localStorage.setItem(
        `cms-draft:${storageKey}`,
        JSON.stringify({ value: value ?? '', updatedAt: Date.now() }),
      )
      setDraftStatus('Brouillon local enregistré.')
    } catch {
      setDraftStatus('Stockage local indisponible.')
    }
  }, [storageKey, value])

  function runTransform(transform) {
    const textarea = textareaRef.current
    if (!textarea) return
    const { next, cursor } = transform(textarea)
    onChange({ target: { value: next } })
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = cursor
      textarea.selectionEnd = cursor
    })
  }

  function onTextareaKeyDown(e) {
    if (!e.ctrlKey && !e.metaKey) return
    const key = e.key.toLowerCase()
    if (key === 'b') {
      e.preventDefault()
      runTransform((t) => applyWrap(t, '**'))
      return
    }
    if (key === 'i') {
      e.preventDefault()
      runTransform((t) => applyWrap(t, '*'))
      return
    }
    if (key === 'k') {
      e.preventDefault()
      runTransform((t) => applyWrap(t, '[', '](https://)'))
      return
    }
    if (key === '7' && e.shiftKey) {
      e.preventDefault()
      runTransform((t) => applyLinePrefix(t, '1. '))
      return
    }
    if (key === '8' && e.shiftKey) {
      e.preventDefault()
      runTransform((t) => applyLinePrefix(t, '- '))
    }
  }

  return (
    <label className={`admin-span-2 ${className}`.trim()} data-editor-fullscreen={fullscreen ? 'true' : 'false'}>
      <span className="cms-editor__label">{label}</span>
      <div className={`cms-editor ${fullscreen ? 'cms-editor--fullscreen' : ''}`}>
        <div className="cms-editor__toolbar cms-editor__toolbar--sticky" role="toolbar" aria-label={`Outils de formatage pour ${label}`}>
          <div className="cms-editor__toolbar-group">
            <button type="button" onClick={() => runTransform((t) => applyWrap(t, '**'))} title="Gras">
              B
            </button>
            <button type="button" onClick={() => runTransform((t) => applyWrap(t, '*'))} title="Italique">
              I
            </button>
            <button
              type="button"
              onClick={() => runTransform((t) => applyLinePrefix(t, '# '))}
              title="Titre"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => runTransform((t) => applyLinePrefix(t, '## '))}
              title="Sous-titre"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => runTransform((t) => applyLinePrefix(t, '- '))}
              title="Liste à puces"
            >
              Liste
            </button>
            <button
              type="button"
              onClick={() => runTransform((t) => applyLinePrefix(t, '1. '))}
              title="Liste numérotée"
            >
              1. Liste
            </button>
            <button
              type="button"
              onClick={() => runTransform((t) => applyWrap(t, '[', '](https://)'))}
              title="Lien"
            >
              Lien
            </button>
          </div>
          <div className="cms-editor__toolbar-group cms-editor__toolbar-group--right">
            <button type="button" onClick={() => setPreviewOpen((v) => !v)} title="Prévisualiser">
              {previewOpen ? 'Editer' : 'Previsualiser'}
            </button>
            <button type="button" onClick={() => setFullscreen((v) => !v)} title="Plein ecran">
              {fullscreen ? 'Fermer plein ecran' : 'Plein ecran'}
            </button>
          </div>
        </div>
        {previewOpen ? (
          <div className="cms-editor__preview">
            <RichTextContent value={value ?? ''} />
          </div>
        ) : (
          <textarea
            id={fieldId}
            ref={textareaRef}
            rows={rows}
            value={value ?? ''}
            onChange={onChange}
            onKeyDown={onTextareaKeyDown}
            className="cms-editor__textarea"
          />
        )}
      </div>
      <span className="admin-muted">{hint}</span>
      <span className="admin-muted">{draftStatus}</span>
    </label>
  )
}
