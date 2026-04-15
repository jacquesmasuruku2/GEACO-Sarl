import { createClient } from '@supabase/supabase-js'

/** Les clés `VITE_*` sont figées au moment du `npm run build` (pas au runtime sur Vercel). */
const url = String(import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

if (import.meta.env.DEV && !isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[GEACO] Supabase : créez un fichier `.env` à la racine du projet avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (voir .env.example), puis relancez `npm run dev`.',
  )
}
