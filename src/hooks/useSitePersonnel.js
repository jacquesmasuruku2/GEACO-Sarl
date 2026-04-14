import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { groupPersonnelRows } from '../lib/groupPersonnelRows'

/**
 * @param {string} locale 'fr' | 'en'
 */
export function useSitePersonnel(locale) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setGroups([])
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    const loc = locale === 'en' ? 'en' : 'fr'
    supabase
      .from('site_personnel')
      .select('*')
      .eq('published', true)
      .eq('locale', loc)
      .order('section_order', { ascending: true })
      .order('sort_order', { ascending: true })
      .then(({ data, error: qErr }) => {
        if (cancelled) return
        if (qErr) {
          setError(qErr)
          setGroups([])
        } else {
          setError(null)
          setGroups(groupPersonnelRows(data ?? []))
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  return { groups, loading, error }
}
