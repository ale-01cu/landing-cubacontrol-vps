import type { User } from '~/types/User'

export function useAuth() {
  const nuxtApp = useNuxtApp()
  const $pb = nuxtApp.$pb as any
  const t = (key: string) => (nuxtApp.$i18n as any)?.t ? (nuxtApp.$i18n as any).t(key) : key
  const toast = useToast()
  
  // 📦 estado centralizado y compartido (Singletons vía useState)
  const loading = useState<boolean>('auth_loading', () => false)
  const error = useState<string | null>('auth_error', () => null)
  
  const user = useCookie<User | null>('auth_user', {
    path: '/',
    sameSite: 'strict',
    secure: false // ⚠️ true solo en HTTPS
  })

  // 🔐 estado derivado (reactivo y compartido)
  const isAuthenticated = computed(() => {
    // Es válido si PocketBase tiene token Y tenemos el objeto de usuario en la cookie
    return !!user.value && $pb.authStore.isValid
  })

  const role = computed(() => {
    // Si tenemos los datos expandidos, usamos el nombre del grupo
    if (user.value?.expand?.group?.name) {
      return user.value.expand.group.name
    }
    return null
  })

  const isStaff = computed(() => {
    const userRole = role.value
    return userRole === 'STAFF' || userRole === 'ADMIN' || userRole === 'superuser'
  })

  const isAdmin = computed(() => {
    const userRole = role.value
    return userRole === 'ADMIN' || userRole === 'superuser'
  })

  /* ======================
     LOGIN
     ====================== */
  async function login(email: string, password: string) {
    try {
      loading.value = true
      error.value = null
      
      const resp = await $pb
        .collection('users')
        .authWithPassword(email, password, { expand: 'group' })
      
      user.value = resp.record as User
      loading.value = false
      navigateTo('/')
    } catch (err: any) {
      error.value = err.message || 'Error al iniciar sesión'
      toast.add({
        title: t('auth.loginFailed.title'),
        description: t('auth.loginFailed.description'),
        color: 'error'
      })
      loading.value = false
      throw err
    }
  }

  /* ======================
     REGISTER
     ====================== */
  const register = async (email: string, password: string, userData = {}) => {
    loading.value = true
    error.value = null

    try {
      await $pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        emailVisibility: true,
        group: 'beuxs1bhp8wsjk3',
        ...userData
      })

      await $pb.collection('users').requestVerification(email)
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Error al registrar usuario'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const registerWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null
      
      const authData = await $pb.collection('users').authWithOAuth2({
        provider: 'google',
        createData: {
          group: 'beuxs1bhp8wsjk3'
        },
        expand: 'group'
      })
      
      user.value = authData.record as User
      loading.value = false
      navigateTo('/')
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Error al registrar con Google'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const verifyEmail = async (token: string) => {
    loading.value = true
    error.value = null

    try {
      await $pb.collection('users').confirmVerification(token)
      if ($pb.authStore.isValid) {
        const updatedUser = await $pb.collection('users').getOne($pb.authStore.record?.id || '', { expand: 'group' })
        user.value = updatedUser as User
      }
      return { success: true }
    } catch (err: any) {
      error.value = err.message || 'Error al verificar email'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await $pb.collection('users').requestPasswordReset(email)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  const confirmPasswordReset = async (
    token: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      await $pb.collection('users').confirmPasswordReset(
        token,
        password,
        passwordConfirm
      )
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }

  /* ======================
     LOGOUT
     ====================== */
  function logout() {
    $pb.authStore.clear()
    user.value = null
  }

  /* ======================
     REFRESH SESSION
     ====================== */
  async function refresh() {
    try {
      if (!$pb.authStore.isValid) {
        user.value = null
        return
      }
      const resp = await $pb.collection('users').authRefresh({ expand: 'group' })
      user.value = resp.record as User
    } catch {
      logout()
    }
  }

  return {
    confirmPasswordReset,
    requestPasswordReset,
    user,
    role,
    loading,
    error,
    isAuthenticated,
    isStaff,
    isAdmin,
    registerWithGoogle,
    verifyEmail,
    login,
    register,
    logout,
    refresh
  }
}
