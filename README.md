# Site vitrine GEACO SARL

Application [React](https://react.dev/) + [Vite](https://vite.dev/), structurée pour un déploiement statique sur [Vercel](https://vercel.com/).

## Démarrage local

```bash
npm install
npm run dev
```

## Déploiement Vercel

1. Pousser le dépôt GitHub et lier le projet dans Vercel.
2. **Root Directory** : si le dépôt contient plusieurs dossiers, régler sur **`geaco-sarl`** (là où se trouvent `package.json` et `vite.config.js`).
3. **Framework Preset** : **Vite**. Build : `npm run build`, sortie : **`dist`**.
4. **Variables d’environnement** (Settings → Environment Variables), pour **Production** (et Preview si besoin) — elles sont injectées **au moment du build** pour les clés `VITE_*` :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_SITE_URL` (URL exacte du site, ex. `https://votre-projet.vercel.app`) pour les formulaires / SEO.
5. Redéployer après toute modification des variables (`VITE_*`).

**Projet Supabase GEACO** (réf. `hopqewazhhhqdgprllpw`) : récupérer **Project URL** et la clé **anon public** dans le dashboard → [API / clés](https://supabase.com/dashboard/project/hopqewazhhhqdgprllpw/settings/api). Les mêmes valeurs doivent figurer dans le fichier **`.env` local** (non versionné) et être **recopiées à l’identique** dans Vercel (Production), car Vite les intègre **au build** — le chat ou un e-mail ne configure pas Vercel tout seul.

Après avoir rempli `.env`, lancer **`npm run check:env`** pour valider la présence des variables sans afficher les secrets.

Le fichier `vercel.json` renvoie les routes SPA vers `index.html` **sans** intercepter `/assets/*` ni les favicons, afin d’éviter une page blanche (le navigateur doit charger les fichiers `.js` / `.css` du build).

### Formulaires Contact & Partenariats

Les envois passent par **Supabase** (table `public.site_lead_messages`, migration `supabase/migrations/005_site_lead_messages.sql`). Exécuter cette migration sur le projet Supabase après les migrations `001`–`004`. Les messages sont visibles en SQL ou pour une future vue admin (policy `SELECT` réservée aux comptes `app_admins`).

### Page blanche ou « rien » sur mobile / ordinateur

1. Vercel → **Deployments** → dernier déploiement : statut **Ready** ? Ouvrir les **Build Logs** (erreur de build = site vide).
2. Sur le téléphone, ouvrir les **outils développeur** (Chrome à distance) ou tester l’URL `/` en **navigation privée** (cache).
3. Vérifier qu’aucune extension ne bloque les scripts ; vérifier la **4G** (le premier chargement du bundle peut prendre quelques secondes).
4. Confirmer les variables `VITE_*` ci-dessus pour la cible **Production**.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build production
- `npm run preview` — prévisualisation du build
- `npm run lint` — ESLint
- `npm run check:env` — vérifie que `.env` contient bien `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` (sans afficher les clés)

### Compte administrateur du panel (`/auth-admin`)

Le panel vérifie la table Supabase `public.app_admins` (voir migration `supabase/migrations/001_site_content.sql`).

1. Dans le dashboard Supabase : **Settings → API**, copier **service_role** (secret, jamais côté navigateur).
2. Renseigner `.env` : `SUPABASE_SERVICE_ROLE_KEY`, `VITE_SUPABASE_URL` (déjà utilisé par le site).
3. Se placer dans le dossier du projet, puis exécuter :

```bash
cd geaco-sarl
npm run admin:create-user
```

Sous Windows, si vous restez dans `C:\Users\jacqu` (sans `cd`), npm échoue car il ne trouve pas `package.json`. Alternative sans `cd` :

```bash
npm run admin:create-user --prefix "C:\Users\jacqu\geaco-sarl"
```

(Remplacez le chemin par celui de votre clone.) Vous pouvez aussi lancer directement :

```bash
node "C:\Users\jacqu\geaco-sarl\scripts\create-admin-user.mjs"
```

Par défaut le script crée ou met à jour **`jacquesmasuruku2@gmail.com`** avec le mot de passe **`Jacques12`**, confirme l’e-mail, et ajoute l’UUID dans **`app_admins`**. Surcharge possible :

```bash
set ADMIN_EMAIL=autre@mail.com
set ADMIN_PASSWORD=VotreMotDePasse
set SUPABASE_SERVICE_ROLE_KEY=eyJ...
npm run admin:create-user
```

(PowerShell : `$env:ADMIN_EMAIL="..."` etc.) En production, changez le mot de passe après la première connexion et ne commitez pas la clé service_role.
