<script setup lang="ts">
import type { TimelineItem } from '#ui/components/Timeline.vue'

const { t, locale } = useI18n()
const baseUrl = 'https://cubacontrol-sa.web.app'

useSeoMeta({
  title: () => t('navigation.about'),
  description: () => t('landing.essence.description'),
  ogTitle: () => t('navigation.about'),
  ogDescription: () => t('landing.essence.description'),
  ogImage: `${baseUrl}/logo.png`,
  ogUrl: () => locale.value === 'es' ? `${baseUrl}/about` : `${baseUrl}/en/about`,
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/logo.png`
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const items: TimelineItem[] = [
  {
    title: t('about-us.history.p1.title'),
    description: t('about-us.history.p1.description'),
    icon: 'i-lucide-building-2'
  },
  {
    title: t('about-us.history.p2.title'),
    description: t('about-us.history.p2.description'),
    icon: 'i-lucide-landmark'
  },
  {
    title: t('about-us.history.p3.title'),
    description: t('about-us.history.p3.description'),
    icon: 'i-lucide-settings'
  },
  {
    title: t('about-us.history.p4.title'),
    description: t('about-us.history.p4.description'),
    icon: 'i-lucide-shield-check'
  }
]

const units = computed(() => [
  'external_services',
  'occidente',
  'laboratorio',
  'matanzas',
  'cienfuegos',
  'nuevitas',
  'holguin',
  'santiago'
].map(key => ({
  name: t(`about-us.units.items.${key}.name`),
  description: t(`about-us.units.items.${key}.description`)
})))
</script>

<template>
  <UPage>
    <!-- HERO -->
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
      <div
        class="absolute inset-0 -z-10"
      >
        <!-- imagen -->
        <img
          src="/edificio.webp"
          alt=""
          class="w-full h-full object-cover"
        >

        <!-- overlay claro -->
        <div
          class="
          absolute inset-0
          bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.85)_10%,rgba(255,255,255,0.65)_30%,rgba(255,255,255,0.4)_70%)]
          backdrop-blur-[2px]
        "
        />
      </div>
    </UPageHero>

    <!-- HISTORIA -->
    <UContainer class="max-w-4xl mt-32">
      <UTimeline
        :items="items"
        :default-value="items.length - 1"
        color="primary"
        :ui="{
          description: 'text-justify'
        }"
        class="w-full"
      />
    </UContainer>

    <!-- CTA -->
    <UPageSection
      :title="t('about-us.units.title')"
      :description="t('about-us.units.description')"
    >
      <UContainer>
        <!-- GRID -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          <UCard
            v-for="unit in units"
            :key="unit.name"
            class="
              group
              h-full
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <div class="flex items-start gap-4">
              <!-- CONTENT -->
              <div class="space-y-2">
                <h3 class="font-semibold text-base leading-snug">
                  S.I.S. CUBACONTROL
                </h3>

                <p class="text-sm font-medium text-primary">
                  UEB {{ unit.name }}
                </p>

                <p class="text-sm text-neutral-600 leading-relaxed text-justify">
                  {{ unit.description }}
                </p>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </UPageSection>
    <MapContact />
  </UPage>
</template>
