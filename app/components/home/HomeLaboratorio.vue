<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const { tm, rt } = useI18n()

interface AreaItem {
  title: string
}

interface Laboratorio {
  headline: string
  title: string
  description: string
  button: string
  areasTitle: string
  areas: AreaItem[]
  certHeadline: string
  certTitle: string
  certDescription: string
  certifications: string[]
  galleryHeadline: string
  galleryTitle: string
}

const laboratorio = computed(() => tm('landing.laboratorio') as Laboratorio)

const labHeadline = computed(() => rt(laboratorio.value.headline))
const labTitle = computed(() => rt(laboratorio.value.title))
const labDescription = computed(() => rt(laboratorio.value.description))
const labButton = computed(() => rt(laboratorio.value.button))
const labAreasTitle = computed(() => rt(laboratorio.value.areasTitle))
const labAreas = computed(() => laboratorio.value.areas.map(a => rt(a.title)))
const labCertHeadline = computed(() => rt(laboratorio.value.certHeadline))
const labCertTitle = computed(() => rt(laboratorio.value.certTitle))
const labCertDescription = computed(() => rt(laboratorio.value.certDescription))
const labCertifications = computed(() => laboratorio.value.certifications.map(c => rt(c)))
const labGalleryHeadline = computed(() => rt(laboratorio.value.galleryHeadline))
const labGalleryTitle = computed(() => rt(laboratorio.value.galleryTitle))

const links = ref<ButtonProps[]>([
  {
    label: labButton,
    to: '/contact',
    color: 'primary',
    trailingIcon: 'i-lucide-arrow-right'
  }
])

const areas = [
  { title: 'Fertilizantes', icon: 'i-lucide-leaf' },
  { title: 'Frutas, Vegetales y Conservas', icon: 'i-lucide-apple' },
  { title: 'Lácteos, Aceites y Grasas', icon: 'i-lucide-cheese' },
  { title: 'Harinas y Granos', icon: 'i-lucide-wheat' },
  { title: 'Bebidas', icon: 'i-lucide-wine' },
  { title: 'Mieles', icon: 'i-lucide-honey' },
  { title: 'Azúcar', icon: 'i-lucide-cube' },
  { title: 'Microbiología y Sensorial', icon: 'i-lucide-microscope' }
]

const images = [
  '/lab_images/lab-3.png',
  '/lab_images/lab-4.png',
  '/lab_images/lab-5.jpeg',
  '/lab_images/lab-6.jpeg',
  '/lab_images/lab-7.jpeg',
  '/lab_images/lab-8.jpeg'
]
</script>

<template>
  <UPageSection
    id="laboratorio"
    class="bg-primary/5 rounded-3xl"
  >
    <div class="grid lg:grid-cols-2 gap-8 items-start">
      <div class="space-y-6">
        <span class="text-primary font-semibold text-sm uppercase tracking-wide">
          {{ labHeadline }}
        </span>
        <h2 class="text-3xl sm:text-4xl font-semibold text-gray-900">
          {{ labTitle }}
        </h2>
        <p class="text-gray-600 leading-relaxed text-justify">
          {{ labDescription }}
        </p>
        <UButton
          v-bind="links[0]"
          size="xl"
          class="rounded-3xl"
        />
      </div>

      <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">
          {{ labAreasTitle }}
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <UCard
            v-for="(area, i) in areas"
            :key="area.title"
            class="text-center hover:shadow-md transition-shadow"
            :ui="{ body: 'p-3' }"
          >
            <UIcon
              :name="area.icon"
              class="text-primary text-xl mb-1 block"
            />
            <span class="text-xs font-medium text-gray-700">{{ labAreas[i] }}</span>
          </UCard>
        </div>
      </div>
    </div>
  </UPageSection>

  <UPageSection
    orientation="horizontal"
    reverse
  >
    <div class="relative inline-block pl-2 pt-2 sm:pl-4 sm:pt-4">
      <div
        class="absolute inset-0 right-2 bottom-2 sm:right-4 sm:bottom-4
           bg-red-100
           rounded-2xl
           -z-10"
      />
      <NuxtImg
        data-aos="fade-left"
        src="/lab_images/lab-3.png"
        alt="Análisis en laboratorio"
        class="w-full h-[320px] object-cover rounded-2xl relative z-10"
      />
    </div>

    <template #headline>
      <span class="text-primary font-semibold">{{ labCertHeadline }}</span>
    </template>

    <template #title>
      <h1>{{ labCertTitle }}</h1>
    </template>

    <template #description>
      <p class="text-base text-justify">
        {{ labCertDescription }}
      </p>
    </template>

    <template #features>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UPageFeature
          v-for="cert in labCertifications"
          :key="cert"
          :title="cert"
          icon="i-lucide-award"
        />
      </div>
    </template>
  </UPageSection>
</template>
