<!-- components/RegisterForm.vue -->
<template>
  <UCard class="max-w-md mx-auto">
    <h2 class="text-xl font-semibold text-center">
      {{ t('auth.register.title') }}
    </h2>
    <form
      class="space-y-4"
      @submit.prevent="handleRegister"
    >
      <!-- Email -->
      <UFormField
        :label="t('auth.register.email')"
        required
      >
        <UInput
          v-model="form.email"
          type="email"
          :placeholder="t('auth.register.emailPlaceholder')"
          class="w-full"
          :disabled="loading"
        />
      </UFormField>

      <!-- Contraseña -->
      <UFormField
        :label="t('auth.register.password')"
        required
        :error="passwordError"
      >
        <UInput
          v-model="form.password"
          type="password"
          :placeholder="t('auth.register.passwordPlaceholder')"
          class="w-full"
          :disabled="loading"
          @blur="validatePassword"
        />
        <p class="text-xs text-gray-500 mt-1">
          {{ t('auth.register.minPassword') }}
        </p>
      </UFormField>

      <!-- Confirmar Contraseña -->
      <UFormField
        :label="t('auth.register.confirmPassword')"
        required
        :error="confirmPasswordError"
      >
        <UInput
          v-model="form.confirmPassword"
          type="password"
          :placeholder="t('auth.register.confirmPasswordPlaceholder')"
          class="w-full"
          :disabled="loading"
          @blur="validateConfirmPassword"
        />
      </UFormField>

      <!-- Nombre (opcional) -->
      <UFormField
        :label="t('auth.register.firstName')"
        :error="firstNameError"
      >
        <UInput
          v-model="form.firstName"
          type="text"
          :placeholder="t('auth.register.firstNamePlaceholder')"
          class="w-full"
          :disabled="loading"
          @blur="validateFirstName"
        />
      </UFormField>

      <!-- Apellidos (opcional) -->
      <UFormField
        :label="t('auth.register.lastName')"
        :error="lastNameError"
      >
        <UInput
          v-model="form.lastName"
          type="text"
          :placeholder="t('auth.register.lastNamePlaceholder')"
          class="w-full"
          :disabled="loading"
          @blur="validateLastName"
        />
      </UFormField>

      <!-- Mensaje de error -->
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-lucide-alert-circle"
      />

      <!-- Botón de registro -->
      <UButton
        type="submit"
        color="primary"
        :loading="loading"
        block
      >
        {{ t('auth.register.submit') }}
      </UButton>

      <p class="text-md text-center text-gray-600">
        {{ t('auth.register.continueWith') }}
      </p>
      <IconLoginGoogle />
    </form>
  </UCard>
</template>

<script setup lang="ts">
import IconLoginGoogle from '~/components/auth/IconLoginGoogle.vue'

const { t } = useI18n()
const { register, loading, error } = useAuth()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: ''
})

const passwordError = ref<string | undefined>(undefined)
const confirmPasswordError = ref<string | undefined>(undefined)
const firstNameError = ref<string | undefined>(undefined)
const lastNameError = ref<string | undefined>(undefined)

const validatePassword = () => {
  const pwd = form.password
  if (!pwd) {
    passwordError.value = t('auth.register.errors.passwordRequired')
    return false
  }
  if (pwd.length < 8) {
    passwordError.value = t('auth.register.errors.passwordMinLength')
    return false
  }
  if (!/[A-Z]/.test(pwd)) {
    passwordError.value = t('auth.register.errors.passwordUppercase')
    return false
  }
  if (!/[0-9]/.test(pwd)) {
    passwordError.value = t('auth.register.errors.passwordNumber')
    return false
  }
  passwordError.value = undefined
  return true
}

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    confirmPasswordError.value = t('auth.register.errors.confirmPasswordRequired')
    return false
  }
  if (form.password !== form.confirmPassword) {
    confirmPasswordError.value = t('auth.register.errors.passwordsDoNotMatch')
    return false
  }
  confirmPasswordError.value = undefined
  return true
}

const validateFirstName = () => {
  if (form.firstName && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(form.firstName)) {
    firstNameError.value = t('auth.register.errors.invalidName')
    return false
  }
  firstNameError.value = undefined
  return true
}

const validateLastName = () => {
  if (form.lastName && /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(form.lastName)) {
    lastNameError.value = t('auth.register.errors.invalidName')
    return false
  }
  lastNameError.value = undefined
  return true
}

const handleRegister = async () => {
  const isPasswordValid = validatePassword()
  const isConfirmPasswordValid = validateConfirmPassword()
  const isFirstNameValid = form.firstName ? validateFirstName() : true
  const isLastNameValid = form.lastName ? validateLastName() : true

  if (!isPasswordValid || !isConfirmPasswordValid || !isFirstNameValid || !isLastNameValid) {
    return
  }

  const result = await register(
    form.email,
    form.password,
    { first_name: form.firstName || undefined, last_name: form.lastName || undefined }
  )

  if (result.success) {
    useToast().add({
      title: t('auth.register.success.title'),
      description: t('auth.register.success.description'),
      color: 'success'
    })

    navigateTo('/verify-pending?email=' + encodeURIComponent(form.email))
  }
}
</script>
