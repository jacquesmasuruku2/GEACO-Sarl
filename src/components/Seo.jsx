import { Helmet } from 'react-helmet-async'

const DEFAULT_OG = '/geaco-logo-transparent.png'

/**
 * Balises SEO par page — titres et descriptions traduits via clés i18n.
 * @param {{ title: string, description: string, path?: string, noindex?: boolean }} props — `noindex` évite canonical et indexation (ex. 404).
 */
export function Seo({ title, description, path = '', noindex = false }) {
  const siteUrl = (import.meta.env.VITE_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  const canonical = siteUrl && !noindex ? `${siteUrl}${path}` : undefined

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={siteUrl ? `${siteUrl}${DEFAULT_OG}` : DEFAULT_OG} />
    </Helmet>
  )
}
