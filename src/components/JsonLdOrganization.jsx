import { SOCIAL_LINKS } from '../data/socialLinks'

/**
 * Données structurées Schema.org — améliore la compréhension par les moteurs de recherche.
 */
export function JsonLdOrganization() {
  const base = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'GEACO SARL',
    description:
      'Études, conception et réalisation de projets intégrés en agronomie, génie civil et hydraulique rurale — RDC.',
    url: base || undefined,
    email: 'geacosarl@gmail.com',
    telephone: ['+243808368955', '+243977472158'],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: '46, Avenue Erengeti, Quartier Kyeshero',
        addressLocality: 'Goma',
        addressRegion: 'Nord-Kivu',
        addressCountry: 'CD',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: '275, Cellule MIHAKE, Quartier KAMESI MBONZO, Commune de Bulengera',
        addressLocality: 'Butembo',
        addressRegion: 'Nord-Kivu',
        addressCountry: 'CD',
      },
    ],
    areaServed: 'Central Africa',
    priceRange: '$$',
    sameAs: [SOCIAL_LINKS.facebookGeacoAsbl, SOCIAL_LINKS.linkedinCompany],
  }

  if (!data.url) delete data.url

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
