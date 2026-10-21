// Inicia el login con GitHub (OAuth). El `state` va en la sesión cifrada para validar el callback.
export default defineEventHandler(async (event) => {
  const clientId = useCloudflareEnv(event).NUXT_OAUTH_GITHUB_CLIENT_ID
  if (!clientId)
    throw createError({ statusCode: 500, statusMessage: 'NUXT_OAUTH_GITHUB_CLIENT_ID no configurado' })

  const state = crypto.randomUUID()
  const session = await useAdminSession(event)
  await session.update({ state })

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', `${getRequestURL(event).origin}/auth/callback`)
  url.searchParams.set('scope', 'read:user')
  url.searchParams.set('state', state)
  url.searchParams.set('allow_signup', 'false')
  return sendRedirect(event, url.toString())
})
