export default defineNuxtRouteMiddleware(async to => {
  const user = await getCurrentUser()

  if (!user) {
    return navigateTo('/login')
  }

  const routeUserId = String(to.params.id || '')
  if (routeUserId !== user.uid) {
    return navigateTo(`/users/${user.uid}`)
  }
})
