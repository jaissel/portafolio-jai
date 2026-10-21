// Callback de GitHub: valida el state, cambia el code por un token, lee el usuario y solo deja entrar
// a ADMIN_GITHUB_LOGIN. El token de GitHub no se guarda: solo login, nombre y avatar en la sesión.
const RETENTION_MS = 13 * 30 * 24 * 60 * 60 * 1000 // ~13 meses

export default defineEventHandler(async (event) => {
  const env = useCloudflareEnv(event)
  const { code, state } = getQuery(event)
  const session = await useAdminSession(event)
  const fail = async (reason: string) => {
    await session.clear()
    return sendRedirect(event, `/admin/login?error=${reason}`)
  }

  if (typeof code !== 'string' || typeof state !== 'string' || state !== session.data.state)
    return fail('state')

  const token = await $fetch<{ access_token?: string }>('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { accept: 'application/json' },
    body: {
      client_id: env.NUXT_OAUTH_GITHUB_CLIENT_ID,
      client_secret: env.NUXT_OAUTH_GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${getRequestURL(event).origin}/auth/callback`,
    },
  }).catch(() => null)
  if (!token?.access_token) return fail('token')

  const user = await $fetch<{ login: string; name: string | null; avatar_url: string }>(
    'https://api.github.com/user',
    { headers: { authorization: `Bearer ${token.access_token}`, 'user-agent': 'jai-portfolio' } },
  ).catch(() => null)
  if (!user) return fail('user')
  if (!env.ADMIN_GITHUB_LOGIN || user.login.toLowerCase() !== env.ADMIN_GITHUB_LOGIN.toLowerCase())
    return fail('denied')

  await session.update({
    login: user.login,
    name: user.name ?? user.login,
    avatar: user.avatar_url,
    state: undefined,
  })

  // Retención: eventos de más de ~13 meses y rate limits vencidos se borran al iniciar sesión
  const db = env.DB
  if (db) {
    const now = Date.now()
    await db.batch([
      db.prepare('DELETE FROM events WHERE ts < ?').bind(now - RETENTION_MS),
      db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now),
    ])
  }
  return sendRedirect(event, '/admin')
})
