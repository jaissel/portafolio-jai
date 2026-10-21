export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)
  await session.clear()
  return sendRedirect(event, '/admin/login', 303)
})
