// Todo el contenido editable: { es: { seccion: data }, en: {...}, updatedAt: { 'es:hero': ts } }.
// Las secciones que aún no están en D1 vienen del seed (getSiteContent hace el merge).
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  const [es, en] = await Promise.all([getSiteContent(event, 'es'), getSiteContent(event, 'en')])
  const updatedAt: Record<string, number> = {}
  if (db) {
    const { results } = await db
      .prepare('SELECT locale, section, updated_at FROM content')
      .all<{ locale: string; section: string; updated_at: number }>()
    for (const r of results) updatedAt[`${r.locale}:${r.section}`] = r.updated_at
  }
  return { es, en, updatedAt }
})
