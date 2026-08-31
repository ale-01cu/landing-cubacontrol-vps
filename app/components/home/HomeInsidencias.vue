<script setup lang="ts">
const { t } = useI18n()
const { getText, incidents, getIncidentsImageUrls, getFileUrl } = useHomeContent()

const fallbackItems = Array.from({ length: 24 }, (_, i) => `/incidencias/${i + 1}.jpg`)

const items = computed(() => {
  const urls = getIncidentsImageUrls.value
  if (urls.length) return urls
  // legacy single-record fallback (pre-schema change)
  const rec: any = incidents.value
  if (rec?.images?.length) {
    return rec.images.map((f: string) => getFileUrl(rec, f) || fallbackItems[0]!)
  }
  return fallbackItems
})

const incidentsTitle = computed(() => getText('incidents.title', t('incidents.title')))
const incidentsDescription = computed(() => getText('incidents.description', t('incidents.description')))
</script>

<template>
  <UContainer>
    <UPageSection
      :title="incidentsTitle"
      :description="incidentsDescription"
    />
    <UCarousel
      v-slot="{ item }"
      loop
      arrows
      :autoplay="{ delay: 2000 }"
      wheel-gestures
      :prev="{ variant: 'solid' }"
      :next="{ variant: 'solid' }"
      :items="items"
      :ui="{
        item: 'basis-1/2 sm:basis-1/4 ',
        prev: 'sm:start-8',
        next: 'sm:end-8'
      }"
    >
      <NuxtImg
        :src="item"
        class="w-full  h-auto object-cover rounded-lg"
        :width="800"
        :height="700"
        loading="lazy"
        sizes="sm:80vw md:80vw lg:33vw xl:25vw"
      />
    </UCarousel>
  </UContainer>
</template>
