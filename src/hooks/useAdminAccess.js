import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAdminAccess() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      setSession(null)
      setIsAdmin(false)
      return
    }

    let cancelled = false

    async function applySession(s) {
      if (!s) {
        setSession(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }
      setSession(s)
      const { data, error } = await supabase.rpc('is_app_admin')
      if (cancelled) return
      if (error) setIsAdmin(false)
      else setIsAdmin(Boolean(data))
      setLoading(false)
    }

    async function init() {
      setLoading(true)
      const { data: { session: s } } = await supabase.auth.getSession()
      if (cancelled) return
      await applySession(s)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return
      setLoading(true)
      applySession(s)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return { loading, session, isAdmin }
}
