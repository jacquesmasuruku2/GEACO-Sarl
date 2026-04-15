import { useState } from 'react'
import { supabase } from '../../lib/supabase'

function sanitizeName(name) {
  return String(name ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ImagePickerField({
  label,
  value,
  onChange,
  storageFolder = 'misc',
  placeholder = 'https://...',
  previewAlt = 'Aperçu image',
  icon = 'IMG',
  help = 'Collez une URL publique ou téléversez une image.',
}) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const preview = String(value ?? '').trim()

  async function uploadFile(file) {
    if (!file || !supabase) return
    setBusy(true)
    setStatus('')

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg'
    const fileName = sanitizeName(file.name.replace(/\.[^/.]+$/, '')) || `img-${Date.now()}`
    const path = `${storageFolder}/${Date.now()}-${fileName}.${ext}`

    const { error: uploadErr } = await supabase.storage.from('site-media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadErr) {
      setBusy(false)
      setStatus("Upload impossible. Vérifiez le bucket 'site-media' et ses policies.")
      return
    }

    const { data } = supabase.storage.from('site-media').getPublicUrl(path)
    onChange({ target: { value: data.publicUrl } })
    setBusy(false)
    setStatus('Image téléversée et URL renseignée.')
  }

  return (
    <div className="image-picker-field admin-span-2">
      <label>
        {label}
        <input value={value ?? ''} onChange={onChange} placeholder={placeholder} />
      </label>
      <div className="image-picker-field__tools">
        <label className="btn btn--outline image-picker-field__upload-btn">
          {busy ? 'Upload…' : 'Televerser une image'}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) uploadFile(file)
              e.target.value = ''
            }}
            disabled={busy}
          />
        </label>
        <span className="admin-muted">{help}</span>
      </div>
      <div className="image-picker-field__preview">
        {preview.startsWith('http') ? (
          <img src={preview} alt={previewAlt} />
        ) : (
          <div className="image-picker-field__placeholder" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>
      {status ? <p className="admin-muted">{status}</p> : null}
    </div>
  )
}
