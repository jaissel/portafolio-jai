// Sitemap con alternates hreflang. Con tan pocas URLs no hace falta @nuxtjs/sitemap.
const PAGES = ['', '/sites'] // ruta después del idioma

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const urls = PAGES.flatMap((page) => {
    const alternates = [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}${page}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/es${page}"/>`,
    ].join('\n')
    return LOCALES.map((l) => `  <url>\n    <loc>${siteUrl}/${l}${page}</loc>\n${alternates}\n  </url>`)
  }).join('\n')

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
})
