<script setup lang="ts">
export interface INews {
  title: string
  description: string
  image: string
  date: string
  slug: string
}

const news: INews[] = [
  {
    title: 'Supervisión integral en operación portuaria internacional',
    description:
      'S.I.S Cubacontrol S.A ejecutó supervisión comercial garantizando cumplimiento contractual y control de calidad durante todo el proceso logístico.',
    image: '/control-package.jpg',
    date: '10 Febrero 2026',
    slug: 'supervision-portuaria'
  },
  {
    title: 'Implementación de nuevos protocolos de inspección',
    description:
      'Se incorporan metodologías avanzadas para la detección temprana de desviaciones en mercancías durante operaciones origen-destino.',
    image: '/control-package-2.jpg',
    date: '28 Enero 2026',
    slug: 'nuevos-protocolos'
  },
  {
    title: 'Participación en foro internacional de comercio',
    description:
      'La empresa presentó experiencias sobre supervisión comercial y reducción de riesgos en cadenas logísticas internacionales.',
    image: '/barco-package.jpg',
    date: '12 Enero 2026',
    slug: 'foro-comercio'
  }
]

const { t } = useI18n()
</script>

<template>
  <UPageSection
    id="noticias"
    :title="t('landing.news.title')"
    :description="t('landing.news.description')"
  >
    <!-- GRID -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="item in news"
        :key="item.slug"
        class="overflow-hidden hover:shadow-xl transition"
      >
        <NuxtImg
          :src="item.image"
          class="w-full h-48 object-cover rounded-lg"
          loading="lazy"
        />

        <div class="mt-4 space-y-2">
          <p class="text-xs text-muted">
            {{ item.date }}
          </p>

          <h3 class="font-semibold text-lg leading-snug">
            {{ item.title }}
          </h3>

          <p class="text-sm text-muted line-clamp-3">
            {{ item.description }}
          </p>

          <UButton
            :to="`/news/${item.slug}`"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
          >
            {{ t('landing.news.actions.read-more') }}
          </UButton>
        </div>
      </UCard>
    </div>
    <div class="flex items-center justify-center gap-6">
      <UButton
        :to="`/news`"
        color="neutral"
        variant="link"
        trailing-icon="i-lucide-arrow-right"
      >
        {{ t('landing.news.actions.more-news') }}
      </UButton>
    </div>
  </UPageSection>
</template>
