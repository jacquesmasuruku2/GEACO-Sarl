/**
 * Vérifie que les variables Vite pour Supabase sont présentes dans `.env` (local).
 * N’affiche jamais les secrets. Utile avant `npm run build` ou pour diagnostiquer Vercel.
 */
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const envPath = resolve(root, '.env')

function parseEnv(text) {
  const out = {}
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[k] = v
  }
  return out
}

let env = {}
try {
  env = parseEnv(readFileSync(envPath, 'utf8'))
} catch {
  console.error(`Fichier introuvable : ${envPath}`)
  console.error('Créez un .env à la racine du projet (copiez .env.example).')
  process.exit(1)
}

const url = (env.VITE_SUPABASE_URL || '').trim()
const key = (env.VITE_SUPABASE_ANON_KEY || '').trim()
const site = (env.VITE_PUBLIC_SITE_URL || '').trim()

let ok = true
if (!url) {
  console.error('Manque VITE_SUPABASE_URL dans .env')
  ok = false
} else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url.replace(/\/$/, ''))) {
  console.warn('VITE_SUPABASE_URL : format inhabituel (attendu : https://<ref>.supabase.co)')
}

if (!key) {
  console.error('Manque VITE_SUPABASE_ANON_KEY dans .env')
  ok = false
} else if (!key.startsWith('eyJ')) {
  console.warn('VITE_SUPABASE_ANON_KEY : ne ressemble pas à un JWT Supabase (eyJ…)')
}

if (!site || site.includes('votre-projet')) {
  console.warn(
    'VITE_PUBLIC_SITE_URL : renseignez l’URL publique du site (Vercel) pour les redirections / SEO.',
  )
}

if (!ok) {
  console.error('\nSur Vercel, ajoutez les mêmes clés dans Settings → Environment Variables (Production), puis Redeploy.')
  process.exit(1)
}

console.log('OK : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis dans .env')
console.log('Réf. projet (URL) :', url.replace(/^https:\/\//, '').replace(/\.supabase\.co.*/, ''))
console.log(
  '\nRappel : le site en ligne lit ces valeurs au moment du build. Recopiez-les sur Vercel si le formulaire affiche « Supabase non configuré ».',
)
