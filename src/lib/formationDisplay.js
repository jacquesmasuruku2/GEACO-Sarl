import { resolveFormationRegistrationStatus } from './formationStatus'

export function formatFormationDate(value, locale) {
  if (!value) return ''
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return String(value)
  }
}

export function formationStatusLabel(status, t) {
  if (status === 'full') return t('formations.statusFull')
  if (status === 'ended') return t('formations.statusEnded')
  if (status === 'closed') return t('formations.statusClosed')
  return t('formations.statusOpen')
}

export function formationPath(slug) {
  const s = String(slug ?? '').trim()
  return s ? `/formations/${s}` : '/formations'
}

export function formationSeoDescription(formation) {
  const raw = String(formation?.summary || formation?.description || formation?.title || '')
    .replace(/[#*_`\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return raw.slice(0, 160)
}

export { resolveFormationRegistrationStatus }
