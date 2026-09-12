# Validation de contenus — GEACO SARL

Document généré lors de la refonte structurelle (12 septembre 2026).  
**Aucune donnée inventée.** Les éléments ci-dessous doivent être confirmés ou corrigés par GEACO avant publication définitive.

## Identité juridique

| Élément | État actuel | Action |
| --- | --- | --- |
| Dénomination | GEACO SARL (site) | Confirmer |
| Page Facebook | Libellé « GEACO ASBL » | Clarifier SARL vs ASBL et liens officiels |
| RCCM | Affiché « en cours de négociation » | Ne plus utiliser comme argument de confiance ; publier uniquement si exact |
| Numéro d’impôt | Idem | À confirmer |

## Téléphones (contradiction)

| Numéro | Où il apparaissait | Décision temporaire |
| --- | --- | --- |
| `+243 808 368 955` | Contact, footer, JSON-LD | **Principal** (source unique `siteContact.js`) |
| `+243 836 895 855` | Header topbar, Solution Café | Conservé comme secondaire / TODO |
| `+243 977 472 158` | WhatsApp | Conservé comme WhatsApp Business |

## Implantations (contradiction)

| Source | Valeur |
| --- | --- |
| Adresses | Goma + Butembo |
| Ancien chiffre clé | « Goma & Bweremana » |

**Décision temporaire :** afficher Goma & Butembo uniquement. Bweremana retiré des stats jusqu’à validation.

## Chiffres clés

| Élément | Décision |
| --- | --- |
| « 99 ans — horizon de la société » | Retiré de l’accueil (durée statutaire ≠ KPI commercial) |
| « 3 domaines d’expertise » | Conservé (Agriculture, Construction, WASH) |
| « 2 implantations » | Conservé avec libellé Goma & Butembo |

## Projets & partenaires

| Élément | Action |
| --- | --- |
| Mention UNICEF (Bukavu) | Vérifier formulation, autorisation de publication, statut (réalisé / en cours / capacité) |
| Partenaires publiés via CMS | OK s’ils sont saisis et marqués publiés |
| Typologies projets illustratives | Ne pas présenter comme réalisations sans preuve éditoriale |

## Galerie

| Élément | Action |
| --- | --- |
| Titres « Image GEACO N » | Remplacés par légendes descriptives génériques (lieu/domaine) ; enrichir via admin CMS |
| Droits de publication des photos terrain | À confirmer |

## Stack technique

- Framework : **Vite + React Router** (pas Next.js App Router)
- i18n : FR / EN via `messages.js`
- CMS : Supabase (`site_*` tables)
