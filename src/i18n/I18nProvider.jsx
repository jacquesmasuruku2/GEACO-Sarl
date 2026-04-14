import { useCallback, useMemo, useState, useEffect } from 'react'
import { messages } from './messages'
import { I18nContext } from './i18nContext'

const STORAGE_KEY = 'geaco-locale'

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc != null ? acc[key] : undefined), obj)
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    if (typeof window === 'undefined') return 'fr'
    return window.localStorage.getItem(STORAGE_KEY) || 'fr'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next) => {
    if (next === 'fr' || next === 'en') setLocaleState(next)
  }, [])

  const dict = messages[locale] || messages.fr

  const t = useCallback(
    (path) => {
      const value = resolvePath(dict, path)
      if (value === undefined) {
        console.warn(`[i18n] Missing key: ${path} (${locale})`)
        return path
      }
      return value
    },
    [dict, locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
