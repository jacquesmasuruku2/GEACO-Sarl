import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const FORMATION_SELECT =
  'id,slug,title,summary,description,location,starts_on,ends_on,duration_label,seats_label,image_url,registration_open,registration_status,sort_order,created_at'

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
      .select(FORMATION_SELECT)
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

/**
 * Une formation publiée par slug (page partageable /formations/:slug).
 * @param {string} slug
 * @param {string} locale
 */
export function useSiteFormation(slug, locale = 'fr') {
  const [row, setRow] = useState(null)
  const [loading, setLoading] = useState(Boolean(slug))
  const [error, setError] = useState(null)

  useEffect(() => {
    const clean = String(slug ?? '').trim()
    if (!supabase || !clean) {
      setRow(null)
      setLoading(false)
      return
    }
    let cancelled = false
    const loc = locale === 'en' ? 'en' : 'fr'
    setLoading(true)
    supabase
      .from('site_formations')
      .select(FORMATION_SELECT)
      .eq('published', true)
      .eq('locale', loc)
      .eq('slug', clean)
      .maybeSingle()
      .then(({ data, error: qErr }) => {
        if (cancelled) return
        if (qErr) {
          setError(qErr)
          setRow(null)
        } else {
          setError(null)
          setRow(data ?? null)
        }
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug, locale])

  return { row, loading, error }
}
