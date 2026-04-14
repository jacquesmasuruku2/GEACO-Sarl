import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * @param {string} serviceKey agronomie | civil | hydro | solution_cafe
 */
export function useSiteServiceContent(serviceKey) {
  const [row, setRow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase || !serviceKey) {
      setRow(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('site_service_content')
      .select('*')
      .eq('service_key', serviceKey)
      .maybeSingle()
      .then(({ data, error: qErr }) => {
        if (cancelled) return
        if (qErr) {
          setError(qErr)
          setRow(null)
        } else {
          setError(null)
          setRow(data)
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [serviceKey])

  return { row, loading, error }
}
