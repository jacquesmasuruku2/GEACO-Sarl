import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * @param {string} locale 'fr' | 'en'
 */
export function useBlogPosts(locale) {
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
      .from('site_blog_posts')
      .select('slug,title,excerpt,hero_image_url,published_at,sort_order')
      .eq('published', true)
      .eq('locale', locale === 'en' ? 'en' : 'fr')
      .order('published_at', { ascending: false, nullsFirst: false })
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
  }, [locale])

  return { rows, loading, error }
}
