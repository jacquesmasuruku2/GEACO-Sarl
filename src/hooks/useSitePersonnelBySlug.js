import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Charge une fiche équipe publiée par slug (n’importe quelle locale, FR en priorité).
 * @param {string} slug
 */
export function useSitePersonnelBySlug(slug) {
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const clean = String(slug || '').trim()
    if (!supabase || !clean) {
      setMember(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('site_personnel')
      .select('*')
      .eq('published', true)
      .eq('slug', clean)
      .order('locale', { ascending: true })
      .limit(5)
      .then(({ data, error: qErr }) => {
        if (cancelled) return
        if (qErr) {
          setError(qErr)
          setMember(null)
        } else {
          const rows = data ?? []
          const preferred = rows.find((r) => r.locale === 'fr') ?? rows[0] ?? null
          setError(null)
          setMember(preferred)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  return { member, loading, error }
}
