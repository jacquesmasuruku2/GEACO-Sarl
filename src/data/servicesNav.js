/**
 * Trois piliers GEACO (Agriculture, Construction, WASH).
 * Solution Café est un projet agricole → /projets/solution-cafe
 */
export const SERVICE_ROUTES = [
  {
    slug: 'agriculture',
    detailKey: 'agriculture',
    pillar: 'ag',
    dbKey: 'agronomie',
    image: '/media/geaco/Agriculture.png',
    imageAlt: 'Cultures agricoles en plein champ',
  },
  {
    slug: 'construction',
    detailKey: 'construction',
    pillar: 'civil',
    dbKey: 'civil',
    image: '/media/geaco/geaco-construction-hero.png',
    imageAlt: 'Chantier de construction et infrastructure',
  },
  {
    slug: 'wash',
    detailKey: 'wash',
    pillar: 'wash',
    dbKey: 'hydro',
    image: '/media/geaco/eha.jpg',
    imageAlt: 'Eau, hygiène et assainissement (EHA)',
  },
]

/** Anciennes URLs services → nouvelles. */
export const SERVICE_SLUG_REDIRECTS = {
  agronomie: 'agriculture',
  'genie-civil': 'construction',
  hydraulique: 'wash',
}

/** Redirections hors catalogue services (ex. Solution Café → projets). */
export const SERVICE_TO_PROJECT_REDIRECTS = {
  'solution-cafe': '/projets/solution-cafe',
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
  if (detailKey === 'agriculture') return t('services.agriculture.title')
  if (detailKey === 'construction') return t('services.construction.title')
  if (detailKey === 'wash') return t('services.wash.title')
  return t('services.title')
}
