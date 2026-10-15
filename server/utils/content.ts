import type { H3Event } from 'h3'
import seedEn from '../../content/seed.en.json'
import seedEs from '../../content/seed.es.json'

// El contenido vive en D1 (tabla `content`, un JSON por sección e idioma). Los seed son el respaldo:
// si D1 falla o le falta una sección, se usa la del seed y la página nunca se ve rota.
const seeds: Record<Locale, SiteContent> = { es: seedEs, en: seedEn }

// Caché en memoria del isolate, por idioma y versión. La versión es la última edición (MAX(updated_at)):
// al guardar desde el dashboard cambia y la siguiente petición lee el contenido nuevo, sin purgar nada.
const cache = new Map<string, SiteContent>()

export async function getContentVersion(db: D1Database): Promise<number> {
  const row = await db.prepare('SELECT MAX(updated_at) AS v FROM content').first<{ v: number | null }>()
  return row?.v ?? 0
}

export async function getSiteContent(event: H3Event, locale: Locale): Promise<SiteContent> {
  const db = useDB(event)
  if (!db) return seeds[locale]

  try {
    const version = await getContentVersion(db)
    const key = `${locale}:${version}`
    const hit = cache.get(key)
    if (hit) return hit

    const { results } = await db
      .prepare('SELECT section, data FROM content WHERE locale = ?')
      .bind(locale)
      .all<{ section: string; data: string }>()
    const fromDb = Object.fromEntries(results.map((r) => [r.section, JSON.parse(r.data)]))
    const content = { ...seeds[locale], ...fromDb } as SiteContent

    for (const k of cache.keys()) if (k.startsWith(`${locale}:`)) cache.delete(k)
    cache.set(key, content)
    return content
  } catch (error) {
    console.error('[content] D1 no disponible, uso el seed:', error)
    return seeds[locale]
  }
}
