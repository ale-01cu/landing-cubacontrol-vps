<script setup lang="ts">
const items = Array.from({ length: 24 }, (_, i) => `/incidencias/${i + 1}.jpg`)
</script>

<template>
  <UContainer>
    <UPageSection
      :title="$t('incidents.title')"
      :description="$t('incidents.description')"
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
