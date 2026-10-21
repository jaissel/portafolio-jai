// Preguntas recibidas por el chat (se llenan en la Fase 5). ?flagged=1 para solo las marcadas para FAQ.
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 no disponible' })
  const onlyFlagged = getQuery(event).flagged === '1'
  const { results } = await db
    .prepare(
      `SELECT id, ts, locale, question, answer, country, flagged FROM chat_logs
       ${onlyFlagged ? 'WHERE flagged = 1' : ''} ORDER BY ts DESC LIMIT 200`,
    )
    .all<{
      id: number
      ts: number
      locale: string | null
      question: string
      answer: string | null
      country: string | null
      flagged: number
    }>()
  return results
})
