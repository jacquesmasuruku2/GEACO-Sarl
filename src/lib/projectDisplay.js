export function projectCategoryPath(category) {
  if (category === 'agricole') return '/projets/agriculture'
  if (category === 'wash') return '/projets/wash'
  return '/projets/construction'
}

export function projectCategoryLabel(category, t) {
  if (category === 'agricole') return t('projects.agricultureTitle')
  if (category === 'wash') return t('projects.washTitle')
  return t('projects.constructionTitle')
}

export function formatProjectDate(value, locale = 'fr') {
  if (!value) return ''
  const raw = String(value).trim()
  if (!raw) return ''
  const date = new Date(raw.length <= 10 ? `${raw}T12:00:00` : raw)
  if (Number.isNaN(date.getTime())) return raw
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function plainExcerpt(htmlOrText, max = 180) {
  const text = String(htmlOrText ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trim()}…`
}
