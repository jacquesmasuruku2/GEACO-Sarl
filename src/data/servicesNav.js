/**
 * Routes des pages « service » — slug URL → clé i18n `services.detail.<clé>`.
 */
export const SERVICE_ROUTES = [
  { slug: 'agronomie', detailKey: 'agronomie' },
  { slug: 'genie-civil', detailKey: 'civil' },
  { slug: 'hydraulique', detailKey: 'hydro' },
  { slug: 'solution-cafe', detailKey: 'solutionCafe' },
]

export function isValidServiceSlug(slug) {
  return SERVICE_ROUTES.some((r) => r.slug === slug)
}

export function detailKeyFromSlug(slug) {
  return SERVICE_ROUTES.find((r) => r.slug === slug)?.detailKey ?? null
}

/** Libellé menu / cartes (évite la duplication entre Header et page Services). */
export function serviceNavLabel(detailKey, t) {
  if (detailKey === 'solutionCafe') return t('services.solutionCafe.navTitle')
  if (detailKey === 'agronomie') return t('services.agronomy.title')
  if (detailKey === 'civil') return t('services.civil.title')
  if (detailKey === 'hydro') return t('services.hydro.title')
  return t('services.title')
}
