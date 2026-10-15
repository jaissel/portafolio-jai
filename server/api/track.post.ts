// Recibe eventos de analítica (navigator.sendBeacon) y los guarda en D1.events.
// Sin cookies, sin IP: país (cf-ipcountry), dispositivo, dominio del referrer y hash diario de visitante.
const str = (v: unknown, max: number) => (typeof v === 'string' && v ? v.slice(0, max) : null)

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 204)
  const ua = getRequestHeader(event, 'user-agent') ?? ''
  if (optedOut(event) || isBot(ua)) return null

  const env = useCloudflareEnv(event)
  const db = env.DB
  if (!db) return null

  // sendBeacon manda text/plain para evitar preflight: se parsea a mano y se descarta lo que no cumple
  let body: Record<string, unknown>
  try {
    const raw = await readRawBody(event, 'utf8')
    if (!raw || raw.length > 2048) return null
    body = JSON.parse(raw)
  } catch {
    return null
  }

  const type = body.t
  if (!isEventType(type)) return null
  const path = str(body.p, 200)
  if (!path?.startsWith('/')) return null
  const locale = str(body.l, 5)

  const ownHost =
    getRequestHost(event, { xForwardedHost: true })
      .replace(/^www\./, '')
      .split(':')[0] ?? ''
  const visitor = env.HASH_SALT_SECRET ? await dailyVisitorId(event, env.HASH_SALT_SECRET) : null

  await db
    .prepare(
      'INSERT INTO events (ts, type, target, path, locale, referrer, country, device, visitor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(
      Date.now(),
      type,
      str(body.g, 80),
      path,
      isLocale(locale) ? locale : null,
      type === 'pageview' ? referrerDomain(body.r, ownHost) : null,
      str(getRequestHeader(event, 'cf-ipcountry'), 2),
      deviceFrom(ua),
      visitor,
    )
    .run()
  return null
})
