/**
 * Libellés navigation : tout en minuscules sauf la première lettre de chaque mot.
 * @param {string} value
 * @param {string} [locale]
 */
export function formatNavLabel(value, locale = undefined) {
  if (typeof value !== 'string') return value
  const s = value.trim()
  if (!s) return value
  const loc = locale === 'en' ? 'en' : 'fr'
  return s
    .split(/\s+/)
    .map((word) => {
      if (!word) return word
      const lower = word.toLocaleLowerCase(loc)
      return lower.charAt(0).toLocaleUpperCase(loc) + lower.slice(1)
    })
    .join(' ')
}
