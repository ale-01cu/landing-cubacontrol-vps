<script setup lang="ts">
interface ReasonItem {
  title: string
  description: string
}
interface LandingBenefits {
  items: ReasonItem[]
}
const { tm, t, rt } = useI18n()
const { getText, getSectionItems } = useHomeContent()

const reasons = computed(
  () => tm('landing.benefits') as LandingBenefits
)
const icons = [
  'i-lucide-shield-check',
  'i-lucide-clipboard-list',
  'i-lucide-package-search',
  'i-lucide-search-check'
]
const fallbackFeatures = computed(() =>
  reasons.value.items.map((item, index) => ({
    icon: icons[index],
    title: rt(item.title),
    description: rt(item.description)
  }))
)
const features = computed(() => {
  const dyn = getSectionItems<any>('benefits', [])
  if (dyn.length) {
    return dyn.map((d: any, i: number) => ({
      icon: d.icon || icons[i] || 'i-lucide-circle',
      title: d.title,
      description: d.description
    }))
  }
  return fallbackFeatures.value
})
const benefitsTitle = computed(() => getText('benefits.title', t('landing.benefits.title')))
</script>

<template>
  <UPageSection
    class="bg-primary-50"
    orientation="horizontal"
    reverse
    :ui="{
      title: 'justify-end',
      headline: 'justify-end'
    }"
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
        src="/control-package-2.jpg"
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
        {{ benefitsTitle }}
      </h1>
    </template>
  </UPageSection>
</template>
