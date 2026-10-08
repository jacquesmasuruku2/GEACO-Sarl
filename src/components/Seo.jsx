import { Helmet } from 'react-helmet-async'
import { SITE_CONTACT } from '../data/siteContact'

const DEFAULT_OG = '/geaco-logo-transparent.png'

function toAbsoluteUrl(value, baseUrl) {
  if (!value || !String(value).trim()) return null
  try {
    const url = new URL(value, baseUrl)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

/**
 * Balises SEO par page — titres et descriptions traduits via clés i18n.
 * @param {{ title: string, description: string, path?: string, image?: string, type?: string, noindex?: boolean }} props — `noindex` évite canonical et indexation (ex. 404).
 */
export function Seo({ title, description, path = '', image = DEFAULT_OG, type = 'website', noindex = false }) {
  const siteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const canonical = siteUrl && !noindex ? `${siteUrl}${path}` : undefined
  const imageUrl =
    toAbsoluteUrl(image, siteUrl || SITE_CONTACT.websiteUrl) ||
    toAbsoluteUrl(DEFAULT_OG, SITE_CONTACT.websiteUrl)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
    </Helmet>
  )
}
