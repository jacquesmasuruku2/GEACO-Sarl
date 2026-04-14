import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * @param {string} slug
 * @param {string} locale 'fr' | 'en'
 */
export function useBlogPost(slug, locale) {
  const [row, setRow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase || !slug) {
      setRow(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('site_blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('locale', locale === 'en' ? 'en' : 'fr')
      .eq('published', true)
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
  }, [slug, locale])

  return { row, loading, error }
}
