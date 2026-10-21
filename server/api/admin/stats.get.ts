// Estadísticas del dashboard sobre D1.events. ?range=today|7|30|90 (días). Compara con el período anterior.
const DAY = 24 * 60 * 60 * 1000
// Embudo: visita → ve un caso de estudio → contacto (CV, email o LinkedIn)
const CONVERSION_TARGETS = ['footer.email', 'footer.cta', 'footer.linkedin']

function periodFor(range: string) {
  const now = Date.now()
  if (range === 'today') {
    const start = new Date()
    start.setUTCHours(0, 0, 0, 0)
    const from = start.getTime()
    return { from, to: now, prevFrom: from - DAY, prevTo: from }
  }
  const days = [7, 30, 90].includes(Number(range)) ? Number(range) : 7
  const from = now - days * DAY
  return { from, to: now, prevFrom: from - days * DAY, prevTo: from }
}

export default defineEventHandler(async (event) => {
  const db = useDB(event)
  if (!db) throw createError({ statusCode: 503, statusMessage: 'D1 no disponible' })
  const range = String(getQuery(event).range ?? '7')
  const { from, to, prevFrom, prevTo } = periodFor(range)

  const kpiSql = `SELECT
      COUNT(DISTINCT CASE WHEN type = 'pageview' THEN visitor END) AS visitors,
      SUM(type = 'pageview') AS pageviews,
      SUM(type = 'cv_download') AS cvDownloads,
      SUM(type = 'chat_ask') AS chatAsks
    FROM events WHERE ts >= ? AND ts < ?`
  const top = (column: string, where = '', limit = 10) =>
    db
      .prepare(
        `SELECT ${column} AS label, COUNT(*) AS value FROM events
         WHERE ts >= ? AND ts < ? ${where} AND ${column} IS NOT NULL
         GROUP BY ${column} ORDER BY value DESC LIMIT ${limit}`,
      )
      .bind(from, to)

  type Kpis = { visitors: number; pageviews: number; cvDownloads: number; chatAsks: number }
  type Row = { label: string; value: number }
  const [
    kpis,
    prev,
    timeline,
    funnel,
    clicks,
    sections,
    blocks,
    countries,
    referrers,
    direct,
    locales,
    devices,
    live,
  ] = await db.batch([
    db.prepare(kpiSql).bind(from, to),
    db.prepare(kpiSql).bind(prevFrom, prevTo),
    db
      .prepare(
        `SELECT date(ts / 1000, 'unixepoch') AS day,
             COUNT(DISTINCT visitor) AS visitors, COUNT(*) AS pageviews
           FROM events WHERE ts >= ? AND ts < ? AND type = 'pageview' GROUP BY day ORDER BY day`,
      )
      .bind(from, to),
    db
      .prepare(
        `SELECT
             COUNT(DISTINCT CASE WHEN type = 'pageview' THEN visitor END) AS visits,
             COUNT(DISTINCT CASE WHEN type = 'section_view'
               AND (target = 'section.work' OR target LIKE 'project.%') THEN visitor END) AS sawCase,
             COUNT(DISTINCT CASE WHEN type = 'cv_download'
               OR (type = 'click' AND target IN (${CONVERSION_TARGETS.map(() => '?').join(',')})) THEN visitor END) AS converted
           FROM events WHERE ts >= ? AND ts < ?`,
      )
      .bind(...CONVERSION_TARGETS, from, to),
    top('target', "AND type IN ('click', 'cv_download')", 12),
    top('target', "AND type = 'section_view'", 20),
    // Heatmap: interacciones por bloque (prefijo del data-track: hero, nav, work, ask, footer...)
    db
      .prepare(
        `SELECT CASE WHEN type IN ('chat_open', 'chat_ask') THEN 'ask'
             ELSE substr(target, 1, instr(target || '.', '.') - 1) END AS label,
           COUNT(*) AS value FROM events
           WHERE ts >= ? AND ts < ? AND type IN ('click', 'cv_download', 'chat_open', 'chat_ask')
             AND target IS NOT NULL
           GROUP BY label ORDER BY value DESC`,
      )
      .bind(from, to),
    top('country', "AND type = 'pageview'"),
    top('referrer', "AND type = 'pageview'"),
    db
      .prepare(
        "SELECT COUNT(*) AS n FROM events WHERE ts >= ? AND ts < ? AND type = 'pageview' AND referrer IS NULL",
      )
      .bind(from, to),
    top('locale', "AND type = 'pageview'"),
    top('device', "AND type = 'pageview'"),
    db
      .prepare('SELECT COUNT(DISTINCT visitor) AS n FROM events WHERE ts >= ?')
      .bind(Date.now() - 5 * 60 * 1000),
  ])

  const first = <T>(r: unknown) => ((r as { results: T[] }).results[0] ?? {}) as T
  const all = <T>(r: unknown) => (r as { results: T[] }).results
  // Visitas sin referrer = tráfico directo
  const directVisits = first<{ n: number }>(direct).n ?? 0
  return {
    range,
    kpis: first<Kpis>(kpis),
    previous: first<Kpis>(prev),
    timeline: all<{ day: string; visitors: number; pageviews: number }>(timeline),
    funnel: first<{ visits: number; sawCase: number; converted: number }>(funnel),
    topClicks: all<Row>(clicks),
    sections: all<Row>(sections),
    blocks: all<Row>(blocks),
    countries: all<Row>(countries),
    referrers: [
      ...all<Row>(referrers),
      ...(directVisits ? [{ label: 'directo', value: directVisits }] : []),
    ].sort((a, b) => b.value - a.value),
    locales: all<Row>(locales),
    devices: all<Row>(devices),
    live: first<{ n: number }>(live).n ?? 0,
  }
})
