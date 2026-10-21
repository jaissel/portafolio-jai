// Exporta los eventos del período en CSV (?range=today|7|30|90). Sin IPs: no existen en la base.
const DAY = 24 * 60 * 60 * 1000
const COLUMNS = [
  'ts',
  'type',
  'target',
  'path',
  'locale',
  'referrer',
  'country',
  'device',
  'visitor',
] as const

const cell = (v: unknown) => {
  const s = v == null ? '' : String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default defineEventHandler(async (event) => {
  const db = useDB(event)
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 no disponible' })
  const range = String(getQuery(event).range ?? '30')
  const days = range === 'today' ? 1 : [7, 30, 90].includes(Number(range)) ? Number(range) : 30

  const { results } = await db
    .prepare(`SELECT ${COLUMNS.join(', ')} FROM events WHERE ts >= ? ORDER BY ts`)
    .bind(Date.now() - days * DAY)
    .all<Record<(typeof COLUMNS)[number], unknown>>()

  const rows = results.map((r) =>
    COLUMNS.map((c) => cell(c === 'ts' ? new Date(Number(r.ts)).toISOString() : r[c])).join(','),
  )
  setResponseHeaders(event, {
    'content-type': 'text/csv; charset=utf-8',
    'content-disposition': `attachment; filename="eventos-${range}-${new Date().toISOString().slice(0, 10)}.csv"`,
  })
  return [COLUMNS.join(','), ...rows].join('\n')
})
