/**
 * Statuts d’inscription formation.
 * open = postuler | full = places épuisées | ended = déjà passée | closed = fermée
 */

export const FORMATION_REGISTRATION_STATUSES = ['open', 'full', 'ended', 'closed']

/**
 * @param {{ registration_status?: string, registration_open?: boolean, ends_on?: string | null, starts_on?: string | null }} formation
 * @param {Date} [now]
 */
export function resolveFormationRegistrationStatus(formation, now = new Date()) {
  const raw = String(formation?.registration_status ?? '').trim()
  if (FORMATION_REGISTRATION_STATUSES.includes(raw)) {
    if (raw === 'open' && isFormationDatePassed(formation, now)) return 'ended'
    return raw
  }
  if (formation?.registration_open === false) {
    return isFormationDatePassed(formation, now) ? 'ended' : 'closed'
  }
  return isFormationDatePassed(formation, now) ? 'ended' : 'open'
}

/**
 * @param {{ ends_on?: string | null, starts_on?: string | null }} formation
 * @param {Date} [now]
 */
export function isFormationDatePassed(formation, now = new Date()) {
  const end = String(formation?.ends_on || formation?.starts_on || '').trim()
  if (!end) return false
  const day = new Date(`${end}T23:59:59`)
  if (Number.isNaN(day.getTime())) return false
  return day.getTime() < now.getTime()
}

export function isFormationRegistrationOpen(formation, now = new Date()) {
  return resolveFormationRegistrationStatus(formation, now) === 'open'
}
