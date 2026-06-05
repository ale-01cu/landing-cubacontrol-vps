<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue'

type SocialSelector = {
  size: 'sm' | 'xl'
}
defineProps<SocialSelector>()

const socialItems = [
  {
    label: 'WhatsApp',
    icon: 'i-simple-icons-whatsapp',
    to: 'https://whatsapp.com/channel/0029VbAfrDiAu3aW7NvTLi3N'
  },
  {
    label: 'Facebook',
    icon: 'i-simple-icons-facebook',
    to: 'https://www.facebook.com/siscubacontrolsa'
  },
  {
    label: 'Instagram',
    icon: 'i-simple-icons-instagram',
    to: '#'
  },
  {
    label: 'X (Twitter)',
    icon: 'i-simple-icons-x',
    to: 'https://x.com/Supervisin35612'
  }
]

const menuItems = socialItems.map(item => ({
  label: item.label,
  icon: item.icon,
  colorClass: item.label === 'WhatsApp' ? 'text-green-700' : item.label === 'Facebook' ? 'text-blue-700' : item.label === 'Instagram' ? 'text-pink-600' : 'text-black dark:text-white',
  onSelect: () => window.open(item.to, '_blank')
})) as DropdownMenuItem[]
</script>

<template>
  <UDropdownMenu
    :items="[menuItems]"
  >
    <UButton
      icon="i-lucide-share-2"
      color="neutral"
      variant="ghost"
      :size="size"
      aria-label="Redes sociales"
    />
    <template
      #item="{ item }"
    >
      <div class="flex items-center gap-2 p-2 px-4">
        <UIcon
          :name="item.icon as string"
          class="w-5 h-5"
          :class="item.colorClass"
        />
        <span>{{ item.label }}</span>
      </div>
    </template>
  </UDropdownMenu>
</template>
