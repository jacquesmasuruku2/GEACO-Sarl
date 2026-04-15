import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSiteProjects() {
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
    setLoading(true)
    supabase
      .from('site_projects')
      .select('slug,title,tag,project_category,image_url,description,impact,sort_order')
      .eq('published', true)
      .order('sort_order', { ascending: true })
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
  }, [])

  return { rows, loading, error }
}
