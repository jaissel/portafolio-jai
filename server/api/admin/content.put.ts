// Guarda una sección en un idioma. Al cambiar updated_at cambia la versión del contenido
// (server/utils/content.ts) y la página pública lo muestra en la siguiente petición.
const MAX_BYTES = 64 * 1024

export default defineEventHandler(async (event) => {
  const db = useDB(event)
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 no disponible' })
  const body = await readBody<{ locale?: unknown; section?: unknown; data?: unknown }>(event)
  const { locale, section, data } = body ?? {}

  if (!isLocale(locale)) throw createError({ statusCode: 400, statusMessage: 'Idioma inválido' })
  const reference = (await getSiteContent(event, locale)) as unknown as Record<string, unknown>
  if (typeof section !== 'string' || !(section in reference))
    throw createError({ statusCode: 400, statusMessage: 'Sección desconocida' })
  // Misma forma de nivel superior que la sección actual (objeto vs. lista)
  if (data === null || typeof data !== 'object' || Array.isArray(data) !== Array.isArray(reference[section]))
    throw createError({ statusCode: 400, statusMessage: 'La sección no tiene el formato esperado' })

  const json = JSON.stringify(data)
  if (json.length > MAX_BYTES)
    throw createError({ statusCode: 413, statusMessage: 'Sección demasiado grande' })

  const updatedAt = Date.now()
  await db
    .prepare(
      `INSERT INTO content (locale, section, data, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(locale, section) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
    .bind(locale, section, json, updatedAt)
    .run()
  return { ok: true, updatedAt }
})
