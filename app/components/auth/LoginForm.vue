<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import IconLoginGoogle from '~/components/auth/IconLoginGoogle.vue'

definePageMeta({
  title: 'Login'
})

const { t } = useI18n()

const fields: AuthFormField[] = computed(() => [{
  name: 'email',
  type: 'email',
  label: t('auth.login.email'),
  placeholder: t('auth.login.emailPlaceholder'),
  required: true,
  disabled: loading.value
}, {
  name: 'password',
  label: t('auth.login.password'),
  type: 'password',
  placeholder: t('auth.login.passwordPlaceholder'),
  required: true,
  disabled: loading.value
}, {
  name: 'remember',
  label: t('auth.login.remember'),
  type: 'checkbox',
  disabled: loading.value
}])

const { login, loading } = useAuth()

const schema = z.object({
  email: z.string(t('auth.validation.emailRequired')).min(4, t('auth.validation.emailMin')),
  password: z.string(t('auth.validation.passwordRequired')).min(8, t('auth.validation.minPassword'))
})

type Schema = z.output<typeof schema>
async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true
  await login(payload.data.email, payload.data.password)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-8 p-4">
    <UPageCard class="w-full max-w-md">
      <!-- :schema="schema" -->
      <UAuthForm
        :schema="schema"
        :title="t('auth.login.title')"
        :description="t('auth.login.formDescription')"
        icon="i-lucide-user"
        :fields="fields"
        :submit="{
          label: t('auth.login.submit'),
          color: 'primary',
          loading: loading
        }"
        @submit="onSubmit"
      >
        <template #providers>
          <IconLoginGoogle />
          <USeparator :label="t('auth.login.providers')" />
        </template>
        <template #footer>
          <p
            class="text-sm text-gray-500 hover:cursor-pointer"
            @click="navigateTo('/forgot-password')"
          >
            {{ t('auth.login.forgotPassword') }}
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
