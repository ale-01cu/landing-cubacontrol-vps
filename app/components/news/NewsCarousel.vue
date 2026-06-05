<script setup lang="ts">
const items = [
  '/news1.jpg',
  '/news2.jpg',
  '/news3.jpg'
]
</script>

<template>
  <UPageSection>
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold">
        Destacados
      </h2>
    </div>

    <UCarousel
      v-slot="{ item }"
      :items="items"
      loop
      arrows
      dots
      :autoplay="{ delay: 4000 }"
      :ui="{ item: 'basis-full md:basis-1/2 lg:basis-1/3 px-2' }"
    >
      <div class="relative overflow-hidden rounded-2xl">
        <NuxtImg
          :src="item"
          class="w-full h-[320px] object-cover"
          loading="lazy"
        />

        <!-- overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
    </UCarousel>
  </UPageSection>
</template>
