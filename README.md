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
