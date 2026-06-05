export default defineNuxtRouteMiddleware((to, from) => {
  const { isStaff } = useAuth()

  if (!isStaff.value) {
    return navigateTo('/')
  }
})
