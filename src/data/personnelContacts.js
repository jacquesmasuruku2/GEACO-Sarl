import { slugifyPersonnel } from '../lib/personnelSlug'

const PERSONNEL_EMAILS = {
  'baraka-musa-eric': 'dg@geacosarl.org',
  'mapenzi-masuruku-jacques': 'sg@geacosarl.org',
  'jacques-masuruku': 'sg@geacosarl.org',
}

export function personnelContactEmail({ slug, name, email }) {
  const profileSlug = String(slug || '').trim().toLowerCase() || slugifyPersonnel(name)
  return PERSONNEL_EMAILS[profileSlug] || email || ''
}
