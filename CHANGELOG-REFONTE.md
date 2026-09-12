# CHANGELOG — Refonte structurelle GEACO SARL

Date : 12 septembre 2026  
Stack : Vite + React Router + Supabase CMS (pas Next.js)

## Objectif

Passer d’une vitrine généraliste à une plateforme orientée **domaines d’intervention** (Agriculture, Construction, WASH), avec parcours clairs vers devis / contact / partenariat, sans inventer de données.

## Changements réalisés

### Architecture & navigation
- Menu **Nos solutions** (Agriculture / Construction / WASH / Solution Café) en entrée de premier niveau
- Menu **Ressources** (Blog, Galerie, FAQ)
- CTA **Devis** prioritaire dans le header
- Routes projets : `/projets`, `/projets/agriculture`, `/projets/construction`, `/projets/wash`
- Redirect `/projets/agricoles` → `/projets/agriculture`

### Accueil
- Hero : « Produire mieux. Construire durablement. Garantir l’eau et l’assainissement. »
- Trois cartes piliers
- Section **approche intégrée**
- Projets à la une avec mention de statut à valider
- **Méthode GEACO** en 5 étapes
- Stats sans « 99 ans » ni « Bweremana »
- CTA final : devis / visite / partenariat
- Informations légales RCCM retirées du parcours commercial d’accueil

### Crédibilité / source unique
- `src/data/siteContact.js` : email, téléphone principal, WhatsApp, adresses, carte OSM
- Header, Footer, Contact, JSON-LD branchés sur cette source
- `CONTENT-VALIDATION.md` : contradictions et TODO GEACO

### Projets
- Filtre par domaine Agriculture / Construction / WASH
- Badge « typologie / capacité » sur contenus de secours
- Mention UNICEF adoucie (à confirmer avant publication nominative)
- Admin : catégorie `wash` ajoutée
- Migration SQL `015_site_projects_wash_category.sql`

### Devis
- Première question réordonnée par **domaine de besoin** (Agriculture, Construction, WASH, Irrigation, etc.)

### Galerie
- Remplacement des titres « Image GEACO N » par légendes descriptives (domaine / archive), sans inventer de faits de projet

### WASH
- Domaine de 1er niveau dans nav, home, services, filtres projets, formulaire devis

## Hypothèses
- Téléphone principal public = `+243 808 368 955`
- WhatsApp = `097 747 2158`
- Implantations affichées = Goma & Butembo uniquement
- Contenu fallback projets = typologies illustratives, pas des réalisations certifiées

## À confirmer par GEACO (voir CONTENT-VALIDATION.md)
- Identité SARL vs ASBL (Facebook)
- RCCM / n° Impôt
- Numéro secondaire `+243 836 895 855`
- Références partenaires nominatives (ex. UNICEF)
- Droits de publication des photos
- Statuts réels des projets (réalisé / en cours / capacité)

## Migrations Supabase à appliquer
1. `014_site_lead_messages_quote.sql` (source `quote`)
2. `015_site_projects_wash_category.sql` (catégorie `wash`)

## Design (inspiration Cardano.org — 12 sept. 2026)
- Typo Outfit + Manrope
- Hero sombre atmosphérique (glows / aurora CSS), CTAs pilules blancs
- Palette bleu profond + cyan, accent terre pour construction
- Sections profondes pour la méthode, footer sombre
- Pas de copie de marque Cardano

