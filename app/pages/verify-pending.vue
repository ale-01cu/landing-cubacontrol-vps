<!-- pages/verify-pending.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <UCard class="max-w-md text-center">
      <template #header>
        <div class="flex justify-center">
          <UIcon
            name="i-lucide-mail-check"
            class="w-16 h-16 text-primary-500"
          />
        </div>
        <h1 class="text-2xl font-bold mt-4">
          Verifica su email
        </h1>
      </template>

      <p class="text-gray-600 mb-6">
        Hemos enviado un enlace de verificación a <strong>{{ email }}</strong>
      </p>

      <p class="text-sm text-gray-500 mb-6">
        Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
        Si no lo encuentras, revisa la carpeta de spam.
      </p>

      <UButton
        color="primary"
        variant="ghost"
        :loading="resending"
        @click="resendVerification"
      >
        Reenviar email
      </UButton>

      <template #footer>
        <ULink
          to="/login"
          class="text-sm text-primary-600 hover:underline"
        >
          Volver al inicio de sesión
        </ULink>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const email = ref(route.query.email || '')

const { $pb } = useNuxtApp()
const resending = ref(false)

const resendVerification = async () => {
  if (!email.value) return

  resending.value = true
  try {
    await $pb.collection('users').requestVerification(email.value)
    useToast().add({
      title: 'Email reenviado',
      description: 'Revisa tu bandeja de entrada',
      color: 'success'
    })
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'No pudimos reenviar el email',
      color: 'error'
    })
  } finally {
    resending.value = false
  }
}
</script>
