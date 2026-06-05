<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const { isAuthenticated, user } = useAuth()

const email = ref('')
const loading = ref(false)
const subscribed = ref(false)
const checkingStatus = ref(true)

// Pre-fill con email del usuario autenticado
watchEffect(() => {
  if (user.value?.email) {
    email.value = user.value.email
  }
})

// Verificar suscripción al montar
onMounted(async () => {
  if (!isAuthenticated.value) {
    checkingStatus.value = false
    return
  }

  try {
    const res = await $fetch('/nxapi/subscriptions/status')
    subscribed.value = res.subscribed
  } catch {
    // si falla la consulta, asumimos que no está suscrito
  } finally {
    checkingStatus.value = false
  }
})

const subscribe = async () => {
  loading.value = true

  try {
    const result = await $fetch('/nxapi/subscriptions/register', {
      method: 'POST'
    })

    if (result.subscribed) {
      subscribed.value = true
      toast.add({
        title: t('newsletters.subscribeSuccess'),
        color: 'success'
      })
    }
  } catch (err: any) {
    toast.add({
      title: err?.statusMessage || t('newsletters.subscribeError'),
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UPageSection
    class="bg-primary-50 rounded-3xl"
    :title="t('landing.subscription.title')"
    :description="t('landing.subscription.description')"
  >
    <div class="max-w-3xl mx-auto text-center">
      <!-- Usuario autenticado -->
      <template v-if="isAuthenticated">
        <!-- Ya suscrito -->
        <div
          v-if="subscribed"
          class="mt-8 flex flex-col items-center gap-3"
        >
          <div class="size-14 rounded-full bg-success/10 flex items-center justify-center">
            <UIcon
              name="i-lucide-check"
              class="text-success text-3xl"
            />
          </div>
          <p class="text-lg font-semibold text-success">
            {{ t('newsletters.subscribedTitle') }}
          </p>
          <p class="text-sm text-muted max-w-md">
            {{ t('newsletters.subscribedDescription') }}
          </p>
        </div>

        <!-- Formulario de suscripción (cuando NO está suscrito) -->
        <form
          v-else-if="!checkingStatus"
          class="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          @submit.prevent="subscribe"
        >
          <UInput
            v-model="email"
            type="email"
            :placeholder="t('landing.subscription.input.placeholder')"
            size="xl"
            class="flex-1"
            disabled
          />

          <UButton
            type="submit"
            size="xl"
            :loading="loading"
            trailing-icon="i-lucide-send"
          >
            {{ t('landing.subscription.actions.submit.label') }}
          </UButton>
        </form>

        <p
          v-if="!subscribed && !checkingStatus"
          class="text-xs text-muted mt-3"
        >
          {{ t('landing.subscription.note') }}
        </p>
      </template>

      <!-- Usuario no autenticado → invitar a login -->
      <template v-else>
        <div class="mt-8 flex flex-col items-center gap-4">
          <UIcon
            name="i-lucide-lock"
            class="w-10 h-10 text-muted"
          />
          <p class="text-muted text-sm">
            {{ t('newsletters.loginToSubscribe') }}
          </p>
          <UButton
            :to="'/login'"
            size="lg"
            trailing-icon="i-lucide-arrow-right"
          >
            {{ t('auth.login.title') }}
          </UButton>
        </div>
      </template>
    </div>
  </UPageSection>
</template>
