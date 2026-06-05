<template>
  <div class="flex items-center gap-3">
    <!-- Usuario NO autenticado -->
    <template v-if="!user">
      <!-- Variante elegante (recomendada) -->
      <UButton
        variant="ghost"
        size="sm"
        icon="i-lucide-log-in"
        @click="goToLogin"
      >
        Iniciar
      </UButton>
    </template>

    <!-- Usuario autenticado -->
    <UDropdownMenu
      v-else
      :items="items"
      :popper="{ placement: 'bottom-end' }"
    >
      <UAvatar
        :src="userAvatar"
        alt="U"
        size="sm"
        class="cursor-pointer"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'

const { $pb } = useNuxtApp()
const router = useRouter()
const { logout, isAuthenticated, user } = useAuth()

const userAvatar = computed(() => {
  if (!user.value?.avatar) return undefined
  return `${$pb.baseUrl}/api/files/${user.value.collectionId}/${user.value.id}/${user.value.avatar}`
})

// dropdown items
const items = computed<DropdownMenuItem[]>(() => [
  [
    {
      label: user.value?.first_name,
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Perfil',
      icon: 'i-lucide-user',
      onSelect: () => router.push('/profile')
    }
  ],
  [
    {
      label: 'Cerrar sesión',
      icon: 'i-lucide-log-out',
      onSelect: () => {
        logout()
        console.log('logout')
        navigateTo('/')
      }
    }
  ]
])

// acciones
function goToLogin() {
  navigateTo('/login')
}
</script>
