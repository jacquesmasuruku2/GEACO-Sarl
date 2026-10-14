import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * @param {string} locale 'fr' | 'en'
 */
export function useBlogPosts(locale, limit, imagesOnly = false, fallbackToFrench = false) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setRows([])
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)

    async function loadPosts() {
      async function fetchPosts(postLocale) {
        let request = supabase
          .from('site_blog_posts')
          .select('slug,title,excerpt,hero_image_url,published_at,sort_order')
          .eq('published', true)
          .eq('locale', postLocale)
          .order('published_at', { ascending: false, nullsFirst: false })
          .order('sort_order', { ascending: true })

        if (imagesOnly) {
          request = request.not('hero_image_url', 'is', null).neq('hero_image_url', '')
        }

        if (Number.isInteger(limit) && limit > 0) {
          request = request.limit(limit)
        }

        return request
      }

      const requestedLocale = locale === 'en' ? 'en' : 'fr'
      const { data, error: queryError } = await fetchPosts(requestedLocale)
      if (cancelled) return

      if (queryError) {
        setError(queryError)
        setRows([])
        setLoading(false)
        return
      }

      if (data?.length || !fallbackToFrench || requestedLocale === 'fr') {
        setRows(data ?? [])
        setLoading(false)
        return
      }

      const { data: fallbackData, error: fallbackError } = await fetchPosts('fr')
      if (cancelled) return
      setError(fallbackError)
      setRows(fallbackError ? [] : fallbackData ?? [])
      setLoading(false)
    }

    loadPosts()
    return () => {
      cancelled = true
    }
  }, [locale, limit, imagesOnly, fallbackToFrench])

  return { rows, loading, error }
}
