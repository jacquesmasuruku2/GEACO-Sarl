/** @param {unknown} v */
export function pickNonEmptyString(v, fallback) {
  if (typeof v !== 'string') return fallback
  const t = v.trim()
  return t ? v : fallback
}

/**
 * @param {unknown} dbSections
 * @param {Array<{ title?: string, text?: string, items?: string[] }>} fallback
 */
export function pickSections(dbSections, fallback) {
  if (!Array.isArray(dbSections) || dbSections.length === 0) return fallback
  return dbSections.map((s) => ({
    title: typeof s?.title === 'string' ? s.title : '',
    text: typeof s?.text === 'string' ? s.text : undefined,
    items: Array.isArray(s?.items) ? s.items.filter((x) => typeof x === 'string') : undefined,
  }))
}
