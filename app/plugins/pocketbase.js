// plugins/pocketbase.js
import PocketBase from 'pocketbase'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const pocketbaseUrl = config.public.pocketbaseUrl || 'http://127.0.0.1:8090'

  const pb = new PocketBase(pocketbaseUrl)

  const cookie = useCookie('pb_auth', {
    path: '/',
    secure: true,
    sameSite: 'strict',
    httpOnly: false,
    maxAge: 604800
  })

  const userCookie = useCookie('auth_user', {
    path: '/',
    sameSite: 'strict',
    secure: false // true en producción
  })

  pb.authStore.save(cookie.value?.token, cookie.value?.record)

  pb.authStore.onChange((token, model) => {
    cookie.value = {
      token,
      record: model
    }
    // Sincronizar la cookie de usuario que usa useAuth
    userCookie.value = model
  })

  try {
    if (pb.authStore.isValid) {
      const userGroup = pb.authStore.model?.group
      if (userGroup === 'STAFF' || userGroup === 'ADMIN' || userGroup === 'superuser') {
        await pb.collection('users').authRefresh()
      }
    }
  } catch {
    pb.authStore.clear()
  }

  return {
    provide: { pb }
  }
})
