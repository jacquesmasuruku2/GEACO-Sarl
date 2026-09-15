import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/** Inactivité admin : entre 5 et 10 min — 8 min. */
export const ADMIN_IDLE_TIMEOUT_MS = 8 * 60 * 1000

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']

/**
 * Déconnecte l’admin après une période sans interaction et redirige vers /login.
 * @param {{ enabled?: boolean }} options
 */
export function useAdminIdleTimeout({ enabled = true } = {}) {
  const navigate = useNavigate()
  const lastActivityRef = useRef(Date.now())
  const timerRef = useRef(null)
  const loggingOutRef = useRef(false)

  useEffect(() => {
    if (!enabled || !supabase) return undefined

    async function logoutForIdle() {
      if (loggingOutRef.current) return
      loggingOutRef.current = true
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
      navigate('/login', { replace: true, state: { reason: 'idle' } })
    }

    function clearTimer() {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    function schedule() {
      clearTimer()
      timerRef.current = window.setTimeout(() => {
        const idleFor = Date.now() - lastActivityRef.current
        if (idleFor >= ADMIN_IDLE_TIMEOUT_MS) {
          logoutForIdle()
          return
        }
        schedule()
      }, Math.max(1000, ADMIN_IDLE_TIMEOUT_MS - (Date.now() - lastActivityRef.current)))
    }

    function markActivity() {
      lastActivityRef.current = Date.now()
      schedule()
    }

    function onVisibility() {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastActivityRef.current >= ADMIN_IDLE_TIMEOUT_MS) {
        logoutForIdle()
        return
      }
      schedule()
    }

    markActivity()
    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, markActivity, { passive: true })
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearTimer()
      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, markActivity)
      }
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled, navigate])
}
