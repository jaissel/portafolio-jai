import type { H3Event } from 'h3'

// Utilidades de analítica sin cookies. Nunca se guarda la IP: solo un hash que cambia cada día.

export const EVENT_TYPES = [
  'pageview',
  'click',
  'cv_download',
  'section_view',
  'scroll_depth',
  'chat_open',
  'chat_ask',
] as const
export type EventType = (typeof EVENT_TYPES)[number]

export const isEventType = (v: unknown): v is EventType =>
  typeof v === 'string' && (EVENT_TYPES as readonly string[]).includes(v)

const BOT_RE =
  /bot|crawl|spider|slurp|scrape|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|quora link|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|go-http|java\/|monitor|uptime|pingdom/i

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_RE.test(userAgent)
}

export function deviceFrom(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  if (/ipad|tablet|kindle|silk|playbook|(android(?!.*mobile))/i.test(userAgent)) return 'tablet'
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

/** Solo el dominio del referrer, y nada si es el propio sitio. */
export function referrerDomain(referrer: unknown, ownHost: string): string | null {
  if (typeof referrer !== 'string' || !referrer) return null
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return host && host !== ownHost ? host.slice(0, 100) : null
  } catch {
    return null
  }
}

/** Respeta Do Not Track y Global Privacy Control. */
export function optedOut(event: H3Event): boolean {
  return getRequestHeader(event, 'dnt') === '1' || getRequestHeader(event, 'sec-gpc') === '1'
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Visitante único por día: hash(sal diaria + IP + user-agent). La sal se deriva del secreto y la fecha UTC,
 * así que el mismo visitante no se puede seguir entre días. La IP se usa solo en memoria para el hash.
 */
export async function dailyVisitorId(event: H3Event, secret: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10)
  const ip = getRequestHeader(event, 'cf-connecting-ip') ?? getRequestIP(event, { xForwardedFor: true }) ?? ''
  const ua = getRequestHeader(event, 'user-agent') ?? ''
  const salt = await sha256(`${secret}:${day}`)
  return (await sha256(`${salt}:${ip}:${ua}`)).slice(0, 24)
}
