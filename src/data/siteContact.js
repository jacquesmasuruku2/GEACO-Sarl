/**
 * Source unique des coordonnées publiques GEACO SARL.
 * Toute contradiction historique est documentée dans CONTENT-VALIDATION.md.
 *
 * Téléphone principal (affichage public) : +243 808 368 955
 * WhatsApp terrain : +243 977 472 158
 * Email : geacosarl@gmail.com
 *
 * TODO GEACO : confirmer si +243 836 895 855 reste un numéro secondaire valide.
 */
export const SITE_CONTACT = {
  legalName: 'GEACO SARL',
  legalNameLong: "Groupe d'Etudes Agronomiques et de Construction",
  websiteDisplay: 'www.geacosarl.org',
  websiteUrl: 'https://www.geacosarl.org',
  email: 'geacosarl@gmail.com',
  phonePrimaryDisplay: '+243 808 368 955',
  phonePrimaryTel: '+243808368955',
  /** Ancien numéro encore présent sur certains supports — à confirmer */
  phoneSecondaryDisplay: '+243 836 895 855',
  phoneSecondaryTel: '+243836895855',
  whatsappDisplay: '097 747 2158',
  whatsappTel: '+243977472158',
  whatsappUrl: 'https://wa.me/243977472158',
  offices: {
    goma: {
      label: 'Siège social — Goma',
      labelEn: 'Head office — Goma',
      city: 'Goma',
      shortAddress: '46, Av. Erengeti, Kyeshero',
      address:
        '46, Avenue Erengeti, Quartier Kyeshero, Commune de Goma, Ville de Goma, Nord-Kivu, RDC.',
    },
    butembo: {
      label: 'Agence — Butembo',
      labelEn: 'Branch — Butembo',
      city: 'Butembo',
      shortAddress: '275, Cellule Mihake, Kamesi Mbonzo',
      address:
        '275, Cellule MIHAKE, Quartier KAMESI MBONZO, Commune de Bulengera, Ville de Butembo, Nord-Kivu, RDC.',
    },
    bweremana: {
      label: 'Bureau — Masisi / Bweremana',
      labelEn: 'Office — Masisi / Bweremana',
      city: 'Bweremana',
      shortAddress: 'Burora, face à l’enclos de Mwami',
      address:
        'Burora, en face de l’enclos de Mwami, Bweremana, Territoire de Masisi, Nord-Kivu, RDC.',
    },
  },
  map: {
    embedSrc:
      'https://www.openstreetmap.org/export/embed.html?bbox=29.165%2C-1.705%2C29.295%2C-1.625&layer=mapnik',
    link: 'https://www.openstreetmap.org/?mlat=-1.665&mlon=29.23#map=13/-1.665/29.23',
  },
  socialNote:
    'La page Facebook historique porte le libellé « GEACO ASBL ». À clarifier juridiquement (SARL vs ASBL).',
}

/** Liste ordonnée des implantations (Goma, Butembo, Bweremana). */
export const SITE_OFFICES = Object.values(SITE_CONTACT.offices)
