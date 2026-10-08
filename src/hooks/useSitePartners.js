import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSitePartners() {
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
      .from('site_partners')
      .select('id,name,subtitle,logo_url,website_url,notes,partnership_motive,sort_order')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(async ({ data, error: qErr }) => {
        if (cancelled) return
        let partnerRows = data
        let queryError = qErr
        if (qErr?.code === '42703' && /logo_url/i.test(qErr.message)) {
          const fallback = await supabase
            .from('site_partners')
            .select('id,name,subtitle,website_url,notes,partnership_motive,sort_order')
            .eq('published', true)
            .order('sort_order', { ascending: true })
          if (cancelled) return
          partnerRows = fallback.data?.map((partner) => ({ ...partner, logo_url: '' })) ?? null
          queryError = fallback.error
        }
        if (queryError) {
          setError(queryError)
          setRows([])
        } else {
          setError(null)
          setRows(partnerRows ?? [])
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { rows, loading, error }
}
