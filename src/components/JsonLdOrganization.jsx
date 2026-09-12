import { SOCIAL_LINKS } from '../data/socialLinks'
import { SITE_CONTACT } from '../data/siteContact'

/**
 * Données structurées Schema.org — améliore la compréhension par les moteurs de recherche.
 */
export function JsonLdOrganization() {
  const base = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_CONTACT.legalName,
    description:
      'Études, conception et réalisation de projets intégrés en agriculture, construction et WASH — RDC.',
    url: base || undefined,
    email: SITE_CONTACT.email,
    telephone: [SITE_CONTACT.phonePrimaryTel, SITE_CONTACT.whatsappTel],
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
      {
        '@type': 'PostalAddress',
        streetAddress: 'Burora, en face de l’enclos de Mwami',
        addressLocality: 'Bweremana',
        addressRegion: 'Nord-Kivu, Territoire de Masisi',
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
