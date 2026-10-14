// `/` → `/es` o `/en` según Accept-Language (sin cookies).
export default defineEventHandler((event) => {
  if (event.path !== '/' && !event.path.startsWith('/?')) return
  const accept = getRequestHeader(event, 'accept-language') ?? ''
  const preferred = accept
    .split(',')
    .map((part) => {
      const [tag = '', q] = part.trim().split(';q=')
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
    .find((p) => isLocale(p.lang))
  setResponseHeader(event, 'vary', 'accept-language')
  return sendRedirect(event, `/${preferred?.lang ?? 'es'}`, 302)
})
