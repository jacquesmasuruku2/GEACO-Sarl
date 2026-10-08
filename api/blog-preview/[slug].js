import process from 'node:process'

const DEFAULT_OG_IMAGE = '/geaco-logo-transparent.png'
const DEFAULT_SITE_URL = 'https://www.geacosarl.org'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getPublicUrl(value, baseUrl) {
  try {
    const url = new URL(value, baseUrl)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function renderPreview({ title, description, pageUrl, imageUrl }) {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const safePageUrl = escapeHtml(pageUrl)
  const safeImageUrl = escapeHtml(imageUrl)

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}">
    <link rel="canonical" href="${safePageUrl}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:url" content="${safePageUrl}">
    <meta property="og:image" content="${safeImageUrl}">
    <meta property="og:image:alt" content="${safeTitle}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${safeImageUrl}">
  </head>
  <body>
    <main>
      <h1>${safeTitle}</h1>
      <p>${safeDescription}</p>
      <a href="${safePageUrl}">Lire l’article sur GEACO SARL</a>
    </main>
  </body>
</html>`
}

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD')
    return response.status(405).send('Method not allowed')
  }

  const slug = Array.isArray(request.query.slug) ? request.query.slug[0] : request.query.slug
  if (!slug || typeof slug !== 'string') {
    return response.status(400).send('Missing article slug')
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Blog preview requires Supabase URL and anon key environment variables.')
    return response.status(500).send('Blog preview is not configured')
  }

  let siteUrl
  try {
    siteUrl = new URL(process.env.VITE_PUBLIC_SITE_URL || DEFAULT_SITE_URL).origin
  } catch (error) {
    console.error('Blog preview has an invalid VITE_PUBLIC_SITE_URL.', error)
    return response.status(500).send('Blog preview is not configured')
  }

  const query = new URLSearchParams({
    select: 'slug,locale,title,excerpt,hero_image_url',
    slug: `eq.${slug}`,
    published: 'eq.true',
    limit: '2',
  })

  let postsResponse
  try {
    postsResponse = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/site_blog_posts?${query.toString()}`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
      },
    )
  } catch (error) {
    console.error('Blog preview could not reach Supabase.', error)
    return response.status(502).send('Unable to load blog preview')
  }

  if (!postsResponse.ok) {
    console.error(`Blog preview query failed with status ${postsResponse.status}.`)
    return response.status(502).send('Unable to load blog preview')
  }

  let posts
  try {
    posts = await postsResponse.json()
  } catch (error) {
    console.error('Blog preview received invalid data from Supabase.', error)
    return response.status(502).send('Unable to load blog preview')
  }

  const post = Array.isArray(posts) ? posts.find((item) => item.locale === 'fr') || posts[0] : null
  if (!post) {
    return response.status(404).send('Article not found')
  }

  const pageUrl = new URL(`/blog/${encodeURIComponent(post.slug)}`, siteUrl).href
  const imageUrl =
    getPublicUrl(post.hero_image_url || '', siteUrl) ||
    getPublicUrl(DEFAULT_OG_IMAGE, siteUrl)

  response.setHeader('Content-Type', 'text/html; charset=utf-8')
  response.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
  if (request.method === 'HEAD') {
    return response.status(200).end()
  }

  return response
    .status(200)
    .send(
      renderPreview({
        title: post.title || 'GEACO SARL',
        description: post.excerpt || post.title || 'Découvrez les actualités de GEACO SARL.',
        pageUrl,
        imageUrl,
      }),
    )
}
