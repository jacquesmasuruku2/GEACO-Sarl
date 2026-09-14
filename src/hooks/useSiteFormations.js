import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Formations publiées pour la page publique /formations.
 * @param {string} locale
 */
export function useSiteFormations(locale = 'fr') {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setRows([])
      setLoading(false)
      return
    }
    let cancelled = false
    const loc = locale === 'en' ? 'en' : 'fr'
    setLoading(true)
    supabase
      .from('site_formations')
      .select(
        'id,slug,title,summary,description,location,starts_on,ends_on,duration_label,seats_label,image_url,registration_open,registration_status,sort_order',
      )
      .eq('published', true)
      .eq('locale', loc)
      .order('sort_order', { ascending: true })
      .order('starts_on', { ascending: true, nullsFirst: false })
      .then(({ data, error: qErr }) => {
        if (cancelled) return
        if (qErr) {
          setError(qErr)
          setRows([])
        } else {
          setError(null)
          setRows(data ?? [])
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  return { rows, loading, error }
}
