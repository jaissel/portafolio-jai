import type { H3Event } from 'h3'

// Sesión del dashboard: cookie cifrada de h3 (sin dependencias). Solo existe para la admin en /admin;
// los visitantes del sitio público no reciben cookies.
export interface AdminSession {
  login?: string
  name?: string
  avatar?: string
  /** Estado OAuth mientras dura el login */
  state?: string
}

const WEEK = 60 * 60 * 24 * 7

export function useAdminSession(event: H3Event) {
  const password = useCloudflareEnv(event).NUXT_SESSION_PASSWORD
  if (!password || password.length < 32)
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_SESSION_PASSWORD no configurado (≥ 32 caracteres)',
    })
  return useSession<AdminSession>(event, {
    name: 'jai_admin',
    password,
    maxAge: WEEK,
    cookie: { httpOnly: true, sameSite: 'lax', secure: !import.meta.dev, path: '/' },
  })
}

/** Solo la usuaria de ADMIN_GITHUB_LOGIN. Lanza 401 si no hay sesión válida. */
export async function requireAdmin(event: H3Event) {
  const admin = useCloudflareEnv(event).ADMIN_GITHUB_LOGIN?.toLowerCase()
  const session = await useAdminSession(event)
  if (!admin || session.data.login?.toLowerCase() !== admin)
    throw createError({ statusCode: 401, statusMessage: 'No autorizado' })
  return session.data
}
