// Páginas del dashboard: sin sesión válida, al login
export default defineNuxtRouteMiddleware(async () => {
  try {
    await useRequestFetch()('/api/admin/me')
  } catch {
    return navigateTo('/admin/login')
  }
})
