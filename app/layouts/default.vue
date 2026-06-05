<script setup lang="ts">
import SocialSelector from '~/components/home/SocialSelector.vue'
import HomeSiguenos from '~/components/home/HomeSiguenos.vue'
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'
import HeaderAvatar from '~/components/auth/HeaderAvatar.vue'
import CustomerChatWidget from '~/components/chat/CustomerChatWidget.vue'

const { locale, setLocale, t } = useI18n()
const localePath = useLocalePath()
const locales = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
]

const menuLocales = locales.map(l => ({
  label: l.label,
  onSelect: () => setLocale(l.code)
})) as DropdownMenuItem[]
const route = useRoute()
const items = computed(() => {
  const homePath = localePath('/')
  const isHomeActive = route.path === homePath || route.path === (homePath.endsWith('/') ? homePath : homePath + '/')

  return [
    {
      label: t('navigation.home'),
      icon: 'i-lucide-home',
      to: isHomeActive ? '#start' : homePath,
      active: isHomeActive
    },
    {
      label: t('navigation.bulletins'),
      icon: 'i-lucide-newspaper',
      to: localePath('/newsletters'),
      active: route.path.startsWith(localePath('/newsletters'))
    },
    {
      label: t('navigation.news'),
      icon: 'i-lucide-newspaper',
      to: localePath('/news'),
      active: route.path.startsWith(localePath('/news')) && !route.path.startsWith(localePath('/newsletters'))
    },
    {
      label: t('navigation.services'),
      icon: 'i-lucide-list',
      to: localePath('/services'),
      active: route.path.startsWith(localePath('/services'))
    },
    {
      label: t('navigation.about'),
      icon: 'i-lucide-box',
      to: localePath('/about'),
      active: route.path.startsWith(localePath('/about'))
    },
    {
      label: t('navigation.contact'),
      icon: 'i-lucide-mail',
      to: localePath('/contact'),
      active: route.path.startsWith(localePath('/contact'))
    }
  ]
})
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <div
          class="flex items-center gap-1 sm:gap-3"
          @click="() => navigateTo('/')"
        >
          <!-- Logo -->
          <NuxtImg
            class="sm:h-10 h-8 w-8 lg:h-12 sm:w-auto shrink-0"
            src="/logo.png"
            alt="S.I.S CUBACONTROL S.A"
          />

          <!-- Nombre de la empresa -->
          <div class="flex flex-col">
            <p
              class="text-black text-xs sm:text-sm font-semibold leading-tight lg:hidden xl:block"
            >
              S.I.S CUBACONTROL S.A
            </p>
          </div>
        </div>
      </template>
      <template #right>
        <UNavigationMenu
          :items="items"
          variant="link"
          class="hidden lg:block"
        />
        <SocialSelector :size="'sm'" />
        <UDropdownMenu :items="menuLocales">
          <UButton
            icon="i-lucide-globe"
            color="neutral"
            variant="ghost"
            size="sm"
          >
            {{ locale.toUpperCase() }}
          </UButton>
        </UDropdownMenu>
        <HeaderAvatar />
      </template>
      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
        <div class="flex items-center gap-2 mt-4">
          <p class="text-sm text-muted">
            Síguenos:
          </p>
          <SocialSelector :size="'sm'" />
        </div>
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator class="mt-20" />

    <UFooter>
      <div class="flex flex-col items-center gap-10 gap-y-20">
        <HomeSiguenos :size="'xl'" />
        <UNavigationMenu
          :items="items"
          variant="link"
          :ui="{
            root: `
              grid-cols-2 gap-3
            `,
            list: `
              grid grid-cols-2 gap-3 w-full
              sm:flex sm:flex-wrap sm:gap-6
            `,
            item: 'justify-start'
          }"
        />
        <p class="text-sm text-muted text-primary">
          S.I.S CUBACONTROL S.A • {{ new Date().getFullYear() }}
        </p>
      </div>
    </UFooter>

    <ClientOnly>
      <CustomerChatWidget />
    </ClientOnly>
  </div>
</template>

<style scoped></style>
