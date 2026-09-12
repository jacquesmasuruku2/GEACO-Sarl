import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const PROJECT_SELECT =
  'id,slug,title,tag,project_category,image_url,description,impact,executed_at,location,sort_order'

export function useSiteProjects(category = null) {
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
    let query = supabase
      .from('site_projects')
      .select(PROJECT_SELECT)
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('executed_at', { ascending: false })

    if (category) {
      query = query.eq('project_category', category)
    }

    query.then(({ data, error: qErr }) => {
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
  }, [category])

  return { rows, loading, error }
}

export function useSiteProject(slug) {
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
      .from('site_projects')
      .select(PROJECT_SELECT)
      .eq('slug', slug)
      .eq('published', true)
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
  }, [slug])

  return { row, loading, error }
}
