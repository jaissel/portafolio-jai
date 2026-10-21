// Usuario de la sesión (el middleware admin-guard ya validó el acceso)
export default defineEventHandler(async (event) => {
  const { login, name, avatar } = await requireAdmin(event)
  return { login, name, avatar }
})
