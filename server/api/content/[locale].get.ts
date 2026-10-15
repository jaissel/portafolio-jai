export default defineEventHandler(async (event) => {
  const locale = getRouterParam(event, 'locale')
  if (!isLocale(locale)) throw createError({ statusCode: 404, statusMessage: 'Unknown locale' })
  return getSiteContent(event, locale)
})
