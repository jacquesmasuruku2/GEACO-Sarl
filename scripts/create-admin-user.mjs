/**
 * Crée (ou réassocie) un compte Supabase Auth + entrée `public.app_admins`
 * pour l’accès au panel `/auth-admin`.
 *
 * Prérequis : variables d’environnement
 *   - SUPABASE_SERVICE_ROLE_KEY (dashboard → Settings → API)
 *   - VITE_SUPABASE_URL ou SUPABASE_URL
 *
 * Exécution (PowerShell) :
 *   $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   $env:VITE_SUPABASE_URL="https://xxx.supabase.co"
 *   node scripts/create-admin-user.mjs
 *
 * Surcharges optionnelles : ADMIN_EMAIL, ADMIN_PASSWORD
 *
 * Sécurité : en production, préférez ADMIN_PASSWORD en variable d’environnement
 * et changez le mot de passe après la première connexion.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Racine du repo (même si la commande est lancée depuis un autre répertoire). */
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(PROJECT_ROOT)

function loadDotEnv() {
  try {
    const p = resolve(PROJECT_ROOT, '.env')
    const raw = readFileSync(p, 'utf8')
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i === -1) continue
      const k = t.slice(0, i).trim()
      let v = t.slice(i + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      if (process.env[k] === undefined) process.env[k] = v
    }
  } catch {
    /* pas de .env : uniquement les variables déjà exportées */
  }
}

loadDotEnv()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jacquesmasuruku2@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Jacques12'

async function findUserIdByEmail(adminClient, email) {
  let page = 1
  const perPage = 200
  for (;;) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const users = data?.users ?? []
    const found = users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase())
    if (found) return found.id
    if (users.length < perPage) return null
    page += 1
  }
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error(
      'Manque SUPABASE_SERVICE_ROLE_KEY et/ou URL (VITE_SUPABASE_URL ou SUPABASE_URL). Voir scripts/create-admin-user.mjs',
    )
    process.exit(1)
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let userId = await findUserIdByEmail(supabase, ADMIN_EMAIL)

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    })
    if (error) {
      console.error('createUser:', error.message)
      process.exit(1)
    }
    userId = data.user?.id
    if (!userId) {
      console.error('createUser: pas d’UUID utilisateur retourné')
      process.exit(1)
    }
    console.log('Compte Auth créé :', ADMIN_EMAIL)
  } else {
    const { error: updErr } = await supabase.auth.admin.updateUserById(userId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    })
    if (updErr) {
      console.error('updateUserById:', updErr.message)
      process.exit(1)
    }
    console.log('Compte Auth existant mis à jour (mot de passe / email confirmé) :', ADMIN_EMAIL)
  }

  const { error: insErr } = await supabase.from('app_admins').upsert(
    { user_id: userId },
    { onConflict: 'user_id' },
  )
  if (insErr) {
    console.error('app_admins:', insErr.message)
    process.exit(1)
  }

  console.log('Panel admin : utilisateur enregistré dans public.app_admins (user_id =', userId + ')')
  console.log('Connexion :', ADMIN_EMAIL)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
