/** Clé `services.detail.*` (i18n) → clé ligne `site_service_content.service_key`. */
export function serviceKeyFromDetailKey(detailKey) {
  if (detailKey === 'solutionCafe') return 'solution_cafe'
  return detailKey
}

export const SERVICE_CONTENT_KEYS = ['agronomie', 'civil', 'hydro', 'solution_cafe']
