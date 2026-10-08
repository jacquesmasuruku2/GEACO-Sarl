export function normalizeExternalUrl(value) {
  const input = String(value ?? '').trim()
  if (!input) return ''

  const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`
  try {
    const url = new URL(candidate)
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      !url.hostname.includes('.') ||
      url.username ||
      url.password
    ) {
      return ''
    }
    return url.href
  } catch {
    return ''
  }
}
