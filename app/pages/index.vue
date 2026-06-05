<script setup lang="ts">
import type { ButtonProps } from '#ui/components/Button.vue'
import HeroBannerCarousel, { type IBanner } from '~/components/banners/HeroBannerCarousel.vue'
import NewsletterSection from '~/components/news/NewsletterSection.vue'
import HomePatrons from '~/components/home/HomePatrons.vue'
import HomePartners from '~/components/home/HomePartners.vue'
import HomeLaboratorio from '~/components/home/HomeLaboratorio.vue'
import HomeSeguros from '~/components/home/HomeSeguros.vue'

const { t, locale } = useI18n()
const ready = ref(false)

const baseUrl = 'https://cubacontrol-sa.web.app'

useSeoMeta({
  title: () => t('landing.hero.title'),
  description: () => t('landing.hero.description'),
  ogTitle: () => t('landing.hero.title'),
  ogDescription: () => t('landing.hero.description'),
  ogImage: `${baseUrl}/logo.png`,
  ogUrl: () => locale.value === 'es' ? baseUrl : `${baseUrl}/en`,
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/logo.png`
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const banners = ref<IBanner[]>([
  {
    headline: 'Servicios Internacionales de Supervisión',
    title: 'CubaControl S.A',
    orientation: 'horizontal',
    description: `Sociedad Mercantil de capital 100% cubano con 8 Unidades Empresariales de Base, organizadas
          mediante Oficinas de Venta y Grupos de Trabajo.`,
    background: '/pared.jpg',
    gradientColor: 'from-black/100\n'
      + '           via-black/80\n'
      + '           to-black/10\n'
      + '           sm:from-black/85\n'
      + '           sm:via-black/45\n'
      + '           sm:to-black/0',
    headlineColor: 'text-white',
    descriptionColor: 'text-neutral-300',
    titleColor: 'text-white',
    links: [
      {
        label: 'Solicitar',
        to: '/contact',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        class: 'rounded-3xl'
      },
      {
        label: 'Servicios',
        to: '/services',
        icon: 'i-lucide-list',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle',
        class: 'rounded-3xl'
      }
    ] as ButtonProps[]
  },
  {
    headline: 'Servicios de Laboratorio',
    title: 'Laboratorio de Supervisión',
    orientation: 'horizontal',
    description: 'El Laboratorio de Supervisión de la Calidad CUBACONTROL S.A. es una unidad independiente que garantiza la calidad en operaciones comerciales de importación y exportación.',
    background: '/lab_images/lab-banner.webp',
    gradientColor: 'from-black/100\n'
      + '           via-black/70\n'
      + '           to-black/10\n'
      + '           sm:from-black/85\n'
      + '           sm:via-black/40\n'
      + '           sm:to-black/0',
    headlineColor: 'text-white',
    descriptionColor: 'text-neutral-300',
    titleColor: 'text-white',
    links: [
      {
        label: 'Ver más',
        to: '#laboratorio',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        class: 'rounded-3xl'
      },
      {
        label: 'Servicios',
        to: '/services',
        icon: 'i-lucide-list',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle',
        class: 'rounded-3xl'
      }
    ] as ButtonProps[]
  },
  {
    headline: 'Agente de Seguros',
    title: 'SIS CUBACONTROL S.A',
    orientation: 'horizontal',
    description: 'Entidad autorizada por la Superintendencia de Seguros. Vendemos seguros de vida, viaje, automotor, responsabilidad civil, incendio, bienes agrícolas y pecuarios.',
    background: '/agent_images/seguros_banner.webp',
    gradientColor: 'from-black/100\n'
      + '           via-black/70\n'
      + '           to-black/10\n'
      + '           sm:from-black/85\n'
      + '           sm:via-black/40\n'
      + '           sm:to-black/0',
    headlineColor: 'text-white',
    descriptionColor: 'text-neutral-300',
    titleColor: 'text-white',
    links: [
      {
        label: 'Ver más',
        to: '#seguros',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl',
        class: 'rounded-3xl'
      },
      {
        label: 'Servicios',
        to: '/services',
        icon: 'i-lucide-list',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle',
        class: 'rounded-3xl'
      }
    ] as ButtonProps[]
  }
])

onMounted(() => {
  ready.value = true
})
</script>

<template>
  <div id="start">
    <HeroBannerCarousel :banners="banners" />
    <UPageSection
      id="mision-vision"
      class="relative overflow-hidden mb-0"
    >
      <!-- Header -->
      <div class="max-w-3xl mx-auto text-center mb-7">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
          {{ t('landing.essence.title') }}
        </h2>

        <p class="text-muted mt-4 text-lg">
          {{ t('landing.essence.description') }}
        </p>
      </div>

      <!-- Grid -->
      <div
        class="grid lg:grid-cols-2 gap-8 items-stretch"
      >
        <!-- MISIÓN -->
        <UCard
          data-aos="fade-right"
          class="relative group transition-all duration-300 hover:shadow-xl"
          :ui="{ body: 'p-8 space-y-6' }"
        >
          <!-- Accent -->
          <div
            class="absolute left-0 top-0 h-full w-1 bg-primary rounded-l-xl"
          />

          <div class="flex items-center gap-4">
            <div
              class="size-12 rounded-xl bg-primary/10 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-target"
                class="text-primary text-2xl"
              />
            </div>

            <h3 class="text-2xl font-semibold">
              {{ t('landing.essence.mission.title') }}
            </h3>
          </div>

          <p class="text-muted leading-relaxed text-base text-justify">
            {{ t('landing.essence.mission.content') }}
          </p>
        </UCard>

        <!-- VISIÓN -->
        <UCard
          data-aos="fade-left"
          class="relative group transition-all duration-300 hover:shadow-xl"
          :ui="{ body: 'p-8 space-y-6' }"
        >
          <!-- Accent -->
          <div
            class="absolute left-0 top-0 h-full w-1 bg-secondary rounded-l-xl"
          />

          <div class="flex items-center gap-4">
            <div
              class="size-12 rounded-xl bg-secondary/10 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-eye"
                class="text-secondary text-2xl"
              />
            </div>

            <h3 class="text-2xl font-semibold">
              {{ t('landing.essence.vision.title') }}
            </h3>
          </div>

          <p class="text-muted leading-relaxed text-base text-justify">
            {{ t('landing.essence.vision.content') }}
          </p>
        </UCard>
      </div>

      <!-- Background decorativo corporativo -->
      <div
        class="absolute inset-0 -z-10 opacity-30 pointer-events-none"
      >
        <div
          class="absolute -top-32 -right-32 w-[400px] h-[400px]
               bg-primary/20 blur-3xl rounded-full"
        />
      </div>
    </UPageSection>
    <HomeServices />
    <HomeImportancia />
    <HomeLaboratorio />
    <HomeSeguros />
    <HomePartners />
    <HomeTextSupervision />
    <HomeInsidencias />
    <HomePatrons />
    <UPage>
      <NewsletterSection />
    </UPage>
  </div>
</template>

<style scoped>
</style>
