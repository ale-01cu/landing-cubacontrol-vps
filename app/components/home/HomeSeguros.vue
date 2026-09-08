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

const { t } = useI18n()
const { getText, insuranceHeader, insuranceRecords, fetched, fetchFailed, getInsuranceImageUrl } = useHomeContent()

const seguros = computed(() => tm('landing.seguros') as Seguros)

const segHeadline = computed(() => getText('seguros.headline', rt(seguros.value.headline)))
const segTitle = computed(() => getText('seguros.title', rt(seguros.value.title)))
const segIntro = computed(() => getText('seguros.intro', rt(seguros.value.intro)))
const segButton = computed(() => getText('seguros.button', rt(seguros.value.button)))
const segTypesTitle = computed(() => getText('seguros.typesTitle', rt(seguros.value.typesTitle)))

const segImages = [
  '/agent_images/seguro_de_vida.webp',
  '/agent_images/seguro_viajes.webp',
  '/agent_images/seguro_automotor.webp',
  '/agent_images/seguro_responsavilidad_civil.webp',
  '/agent_images/seguro_incendio.webp',
  '/agent_images/seguro_agricola.webp',
  '/agent_images/seguro_bienes_pecuarios.webp'
]

const fallbackSegTypes = computed(() => seguros.value.types.map((s, i) => ({
  title: rt(s.title),
  description: rt(s.description),
  image: segImages[i]
})))

const segTypes = computed(() => {
  if (insuranceRecords.value.length) {
    return insuranceRecords.value.map((r: any, i: number) => ({
      title: r.title ?? r.name ?? '',
      description: r.description,
      image: r.image ? getInsuranceImageUrl(r) : (segImages[i] || segImages[0])
    }))
  }
  // ponytail: active=false -> vacío; carga/error -> fallback
  if (fetched.value && !fetchFailed.value) return [] as { title: string, description: string, image: string }[]
  return fallbackSegTypes.value
})
// ponytail: active=false oculta, carga/error muestra fallback
const isVisible = computed(() => {
  if (!fetched.value || fetchFailed.value) return true
  return !!insuranceHeader.value
})

const links = computed<ButtonProps[]>(() => [
  {
    label: segButton.value,
    to: '/contact',
    color: 'primary',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>

<template>
  <UPageSection
    v-if="isVisible"
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
