<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

interface ServiceItem {
  title: string
  description: string
}
interface LandingServices {
  items: ServiceItem[]
}
const { tm, t, rt } = useI18n()
const { getText, getSectionItems, services: servicesRecord, fetched, fetchFailed, getFileUrl } = useHomeContent()

const services = computed(
  () => tm('landing.services') as LandingServices
)
const icons = [
  'i-lucide-shield',
  'i-lucide-package-search',
  'i-lucide-flask-conical',
  'i-lucide-ship',
  'i-lucide-clipboard-check',
  'i-lucide-brain-circuit'
]
const fallbackFeatures = computed(() =>
  services.value.items.map((item, index) => ({
    icon: icons[index],
    title: rt(item.title),
    description: rt(item.description)
  }))
)
const features = computed(() => {
  const dyn = getSectionItems<any>('services', [])
  if (dyn.length) {
    return dyn.map((d: any, i: number) => ({
      icon: d.icon || icons[i] || 'i-lucide-circle',
      title: d.title,
      description: d.description
    }))
  }
  // ponytail: active=false -> lista vacía; carga/error -> fallback
  if (fetched.value && !fetchFailed.value) return [] as { icon: string, title: string, description: string }[]
  return fallbackFeatures.value
})
// ponytail: active=false oculta, carga/error muestra fallback
const isVisible = computed(() => {
  if (!fetched.value || fetchFailed.value) return true
  return !!servicesRecord.value
})
const servicesTitle = computed(() => getText('services.title', t('landing.services.title')))
const servicesDescription = computed(() => getText('services.description', t('landing.services.description')))
const servicesImage = computed(() => {
  const r = servicesRecord.value
  if (r?.image) {
    const url = getFileUrl(r as any, r.image)
    if (url) return url
  }
  return '/control-package.jpg'
})

const links = ref<ButtonProps[]>([
  {
    label: t('landing.services.link.label'),
    to: 'services',
    color: 'primary',
    trailingIcon: 'i-lucide-arrow-right'
  }
])
</script>

<template>
  <UPageSection
    v-if="isVisible"
    orientation="horizontal"
    :ui="{
      title: 'justify-end',
      headline: 'justify-end'
    }"
    :links="links"
  >
    <div class="relative inline-block pl-2 pt-2 sm:pl-4 sm:pt-4">
      <!-- BLOQUE DECORATIVO -->
      <div
        class="absolute inset-0 right-2 bottom-2 sm:right-4 sm:bottom-4
           bg-red-100
           rounded-2xl
           -z-10"
      />

      <!-- IMAGEN -->
      <NuxtImg
        data-aos="fade-left"
        :src="servicesImage"
        alt="Illustration"
        class="w-full h-[320px] object-cover rounded-2xl relative z-10"
      />
    </div>
    <template #features>
      <UPageFeature
        v-for="(item, i) in features"
        :key="i"
        :title="item.title"
        :icon="item.icon"
      >
        <template #description>
          <p
            class="text-justify"
            data-aos="fade-right"
            data-aos-delay="200"
          >
            {{ item.description }}
          </p>
        </template>
      </UPageFeature>
    </template>
    <template #title>
      <h1 data-aos="fade-right">
        {{ servicesTitle }}
      </h1>
    </template>

    <template #description>
      <p
        data-aos="fade-right"
        data-aos-delay="200"
      >
        {{ servicesDescription }}
      </p>
    </template>
  </UPageSection>
</template>
