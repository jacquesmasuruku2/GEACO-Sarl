import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const RPC_ATTEMPTS = 4
const RPC_BASE_DELAY_MS = 250

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * Appelle `is_app_admin` avec quelques tentatives (évite les refus intermittents
 * liés au réseau ou à un léger décalage juste après le login).
 */
async function rpcIsAppAdmin() {
  if (!supabase) {
    return { ok: false, isAdmin: false, error: new Error('Supabase non configuré') }
  }
  let lastError = null
  for (let attempt = 0; attempt < RPC_ATTEMPTS; attempt++) {
    const { data, error } = await supabase.rpc('is_app_admin')
    if (!error) {
      return { ok: true, isAdmin: Boolean(data), error: null }
    }
    lastError = error
    if (attempt < RPC_ATTEMPTS - 1) {
      await sleep(RPC_BASE_DELAY_MS * (attempt + 1))
    }
  }
  return { ok: false, isAdmin: false, error: lastError }
}

export function useAdminAccess() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const cancelledRef = useRef(false)
  /** Ignore les réponses de vérifications lancées avant la plus récente (course init / onAuthStateChange). */
  const checkGenRef = useRef(0)

  const applySession = useCallback(async (s) => {
    const gen = ++checkGenRef.current
    const stale = () => cancelledRef.current || gen !== checkGenRef.current

    if (!supabase) {
      if (stale()) return
      setSession(null)
      setIsAdmin(false)
      setVerificationFailed(false)
      setLoading(false)
      return
    }
    if (!s) {
      if (stale()) return
      setSession(null)
      setIsAdmin(false)
      setVerificationFailed(false)
      setLoading(false)
      return
    }
    setSession(s)
    const { ok, isAdmin: admin, error } = await rpcIsAppAdmin()
    if (stale()) return
    if (ok) {
      setIsAdmin(admin)
      setVerificationFailed(false)
    } else {
      setIsAdmin(false)
      setVerificationFailed(true)
      // eslint-disable-next-line no-console
      console.warn('[GEACO admin] is_app_admin indisponible après plusieurs tentatives :', error?.message)
    }
    setLoading(false)
  }, [])

  const recheckAdmin = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setVerificationFailed(false)
    const {
      data: { session: s },
    } = await supabase.auth.getSession()
    await applySession(s)
  }, [applySession])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      setSession(null)
      setIsAdmin(false)
      setVerificationFailed(false)
      return
    }

    cancelledRef.current = false

    async function init() {
      setLoading(true)
      const {
        data: { session: s },
      } = await supabase.auth.getSession()
      if (cancelledRef.current) return
      await applySession(s)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelledRef.current) return
      setLoading(true)
      applySession(s)
    })

    return () => {
      cancelledRef.current = true
      subscription.unsubscribe()
    }
  }, [applySession])

  return { loading, session, isAdmin, verificationFailed, recheckAdmin }
}
