<script setup lang="ts">
import LoginForm from '~/components/auth/LoginForm.vue'
import type { TabsItem } from '#ui/components/Tabs.vue'
import RegisterForm from '~/components/auth/RegisterForm.vue'

const { t } = useI18n()
const { isAuthenticated } = useAuth()

// Redirigir si ya está autenticado
watchEffect(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})

const items: TabsItem[] = [
  {
    label: 'Login',
    icon: 'i-lucide-user'
  },
  {
    label: 'Register',
    icon: 'i-lucide-lock'
  }
]
</script>

<template>
  <UContainer>
    <UPageHero
      :title="t('about-us.title')"
      class="relative overflow-hidden h-80"
      :ui="{
        container: 'py-1 lg:py-1'
      }"
    >
      <template #headline>
        <div class="flex flex-row justify-center items-center">
          <NuxtImg
            class="h-30 w-auto shrink-0"
            src="/logo.png"
            alt="S.I.S CUBACONTROL S.A"
          />
        </div>
        <span
          class="text-3xl sm:text-4xl leading-tight"
          style="font-family: 'English 111 Vivace BT V2',serif;"
          data-aos="fade-top"
          data-aos-delay="400"
        >
          {{ t('landing.hero.headline') }}
        </span>
      </template>
    </UPageHero>
    <UTabs
      :items="items"
      variant="link"
      :ui="{
        list: 'relative flex justify-center p-1 group'
      }"
    >
      <template #content="{ item }">
        <LoginForm v-if="item.label == 'Login'" />
        <RegisterForm v-else />
      </template>
    </UTabs>
  </UContainer>
</template>

<style scoped>

</style>
