# Site vitrine GEACO SARL

Application [React](https://react.dev/) + [Vite](https://vite.dev/), structurée pour un déploiement statique sur [Vercel](https://vercel.com/).

## Démarrage local

```bash
npm install
npm run dev
```

## Déploiement Vercel

1. Pousser le dossier `geaco-sarl` dans un dépôt Git (GitHub, GitLab, etc.).
2. Importer le projet dans Vercel (framework : Vite, commande de build : `npm run build`, répertoire de sortie : `dist`).
3. Dans **Settings → Environment Variables**, ajouter `VITE_PUBLIC_SITE_URL` avec l’URL publique du site (ex. `https://geaco.vercel.app`) pour la redirection après envoi des formulaires.
4. Le fichier `vercel.json` configure la réécriture SPA vers `index.html`.

Les formulaires utilisent [FormSubmit](https://formsubmit.co/) vers `geacosarl@gmail.com` : au premier message, FormSubmit envoie un e-mail de vérification à activer.

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build production
- `npm run preview` — prévisualisation du build
- `npm run lint` — ESLint

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
