<script setup lang="ts">
import type { ButtonProps } from '#ui/components/Button.vue'

const props = defineProps<{
  title: string
  items?: string[]
  description?: string
  icon?: string
  image?: string
  typeService?: string
  reverse?: boolean
  customsLinks?: ButtonProps[]
}>()

const emit = defineEmits(['action:service'])

const { t } = useI18n()
const links = [
  {
    label: t('landing.hero.links.request'),
    color: 'primary',
    trailingIcon: 'i-lucide-arrow-right',
    onClick: () => emit('action:service', props.title)
  }
] as ButtonProps[]

const mergedLinks = computed<ButtonProps[]>((): ButtonProps[] => {
  if (!props.customsLinks?.length) {
    return links
  }

  return [...links, ...props.customsLinks]
})
</script>

<template>
  <UPageCTA
    :title="title"
    orientation="horizontal"
    reverse
    :links="mergedLinks"
    class="shadow-xl"
  >
    <div class="rounded-2xl overflow-hidden">
      <NuxtImg
        :src="image"
        :alt="title"
        format="webp"
        quality="90"
        densities="x1 x2"
        class="w-full h-64 object-cover"
        loading="lazy"
      />
    </div>
    <template #description>
      <div
        v-if="description"
        class="text-sm text-neutral-700 text-justify"
      >
        {{ description }}
      </div>
      <ul
        v-if="items"
        class="grid md:grid-cols-2 gap-y-3 gap-x-6 "
      >
        <li
          v-for="item in items"
          :key="item"
          class="flex items-start gap-2 text-sm text-neutral-700"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="text-primary mt-0.5 shrink-0"
          />
          <span>{{ item }}</span>
        </li>
      </ul>
      <slot name="belowInfo" />
    </template>
  </UPageCTA>
</template>
