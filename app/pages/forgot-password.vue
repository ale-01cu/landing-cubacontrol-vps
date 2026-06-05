<script setup lang="ts">
const { t } = useI18n()
const email = ref('')
const loading = ref(false)
const message = ref('')

const { requestPasswordReset } = useAuth()

const handleSubmit = async () => {
  loading.value = true
  message.value = ''

  const res = await requestPasswordReset(email.value)

  message.value = res.success
    ? t('auth.forgotPassword.success')
    : t('auth.forgotPassword.error')

  loading.value = false
}
</script>

<template>
  <div class="flex justify-center items-start mt-6 min-h-screen">
    <UCard class="w-full max-w-md">
      <h1 class="text-xl font-semibold mb-5">
        {{ t('auth.forgotPassword.title') }}
      </h1>
      <UForm
        class="space-y-5"
        @submit="handleSubmit"
      >
        <UFormField :label="t('auth.forgotPassword.email')">
          <UInput
            v-model="email"
            class="w-full"
            type="email"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
            required
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="loading"
        >
          {{ t('auth.forgotPassword.submit') }}
        </UButton>
      </UForm>

      <p
        v-if="message"
        class="text-sm text-center"
      >
        {{ message }}
      </p>
    </UCard>
  </div>
</template>
