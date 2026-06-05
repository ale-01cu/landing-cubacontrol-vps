<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { tm, rt } = useI18n()

interface SeguroType {
  title: string
  description: string
}

interface Seguros {
  headline: string
  title: string
  intro: string
  button: string
  typesTitle: string
  types: SeguroType[]
}

const seguros = computed(() => tm('landing.seguros') as Seguros)

const segHeadline = computed(() => rt(seguros.value.headline))
const segTitle = computed(() => rt(seguros.value.title))
const segIntro = computed(() => rt(seguros.value.intro))
const segButton = computed(() => rt(seguros.value.button))
const segTypesTitle = computed(() => rt(seguros.value.typesTitle))

const segImages = [
  '/agent_images/seguro_de_vida.webp',
  '/agent_images/seguro_viajes.webp',
  '/agent_images/seguro_automotor.webp',
  '/agent_images/seguro_responsavilidad_civil.webp',
  '/agent_images/seguro_incendio.webp',
  '/agent_images/seguro_agricola.webp',
  '/agent_images/seguro_bienes_pecuarios.webp'
]

const segTypes = computed(() => seguros.value.types.map((s, i) => ({
  title: rt(s.title),
  description: rt(s.description),
  image: segImages[i]
})))

const links = ref<ButtonProps[]>([
  {
    label: segButton,
    to: '/contact',
    color: 'primary',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>

<template>
  <UPageSection
    id="seguros"
    class="bg-primary/5 rounded-3xl"
  >
    <div class="text-center mb-8">
      <span class="text-primary font-semibold text-sm uppercase tracking-wide">
        {{ segHeadline }}
      </span>
      <h2 class="text-3xl sm:text-4xl font-semibold text-gray-900 mt-2">
        {{ segTitle }}
      </h2>
      <p class="text-gray-600 mt-4 max-w-2xl mx-auto">
        {{ segIntro }}
      </p>
    </div>

    <h3 class="text-xl font-semibold mb-6 text-center">
      {{ segTypesTitle }}
    </h3>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <UCard
        v-for="seg in segTypes"
        :key="seg.title"
        class="hover:shadow-lg transition-shadow"
        :ui="{ body: 'p-0' }"
      >
        <div class="h-40 overflow-hidden rounded-t-xl">
          <NuxtImg
            :src="seg.image"
            :alt="seg.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-4">
          <h4 class="font-semibold text-gray-900 mb-2">
            {{ seg.title }}
          </h4>
          <p class="text-sm text-gray-600 line-clamp-3">
            {{ seg.description }}
          </p>
        </div>
      </UCard>
    </div>

    <div class="mt-8 text-center">
      <UButton
        v-bind="links[0]"
        size="xl"
        class="rounded-3xl"
      />
    </div>
  </UPageSection>
</template>
