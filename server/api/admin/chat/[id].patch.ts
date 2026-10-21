// Marca o desmarca una pregunta para convertirla en FAQ
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 no disponible' })
  const id = Number(getRouterParam(event, 'id'))
  const { flagged } = (await readBody<{ flagged?: unknown }>(event)) ?? {}
  if (!Number.isInteger(id) || typeof flagged !== 'boolean')
    throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })
  await db
    .prepare('UPDATE chat_logs SET flagged = ? WHERE id = ?')
    .bind(flagged ? 1 : 0, id)
    .run()
  return { ok: true }
})
