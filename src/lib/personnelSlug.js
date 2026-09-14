/**
 * Slug URL pour une fiche équipe (/personnel/:slug).
 */
export function slugifyPersonnel(value) {
  return (
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'membre'
  )
}

/**
 * URL publique du profil (QR carte de service).
 * @param {{ slug?: string | null, name?: string | null }} row
 * @param {string} [siteOrigin]
 */
export function personnelProfileUrl(row, siteOrigin = 'https://www.geacosarl.org') {
  const slug = String(row?.slug ?? '').trim() || slugifyPersonnel(row?.name)
  const base = String(siteOrigin || '').replace(/\/$/, '') || 'https://www.geacosarl.org'
  return `${base}/personnel/${slug}`
}
