// Toda la API del dashboard requiere sesión de la admin
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) await requireAdmin(event)
})
