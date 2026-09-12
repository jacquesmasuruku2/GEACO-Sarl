/**
 * Trois piliers GEACO + filière café.
 * Les anciennes URLs (agronomie, genie-civil, hydraulique) sont redirigées vers ces slugs.
 */
export const SERVICE_ROUTES = [
  { slug: 'agriculture', detailKey: 'agriculture', pillar: 'ag', dbKey: 'agronomie' },
  { slug: 'construction', detailKey: 'construction', pillar: 'civil', dbKey: 'civil' },
  { slug: 'wash', detailKey: 'wash', pillar: 'wash', dbKey: 'hydro' },
  { slug: 'solution-cafe', detailKey: 'solutionCafe', pillar: null, dbKey: 'solution_cafe' },
]

/** Anciennes URLs → nouvelles (SEO / liens existants). */
export const SERVICE_SLUG_REDIRECTS = {
  agronomie: 'agriculture',
  'genie-civil': 'construction',
  hydraulique: 'wash',
}

export const PILLAR_ROUTES = SERVICE_ROUTES.filter((r) => r.pillar)

export function isValidServiceSlug(slug) {
  return SERVICE_ROUTES.some((r) => r.slug === slug)
}

export function detailKeyFromSlug(slug) {
  return SERVICE_ROUTES.find((r) => r.slug === slug)?.detailKey ?? null
}

export function dbKeyFromSlug(slug) {
  return SERVICE_ROUTES.find((r) => r.slug === slug)?.dbKey ?? null
}

export function serviceNavLabel(detailKey, t) {
  if (detailKey === 'solutionCafe') return t('services.solutionCafe.navTitle')
  if (detailKey === 'agriculture') return t('services.agriculture.title')
  if (detailKey === 'construction') return t('services.construction.title')
  if (detailKey === 'wash') return t('services.wash.title')
  return t('services.title')
}
