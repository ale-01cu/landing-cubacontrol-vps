<script setup lang="ts">
const { t } = useI18n()

const partnerImages = [
  {
    src: '/partners/partners.webp',
    alt: 'Partners'
  },
  {
    src: '/partners/ops.webp',
    alt: 'OPS'
  }
]
</script>

<template>
  <UPageSection
    id="partners"
    class="bg-white rounded-3xl"
  >
    <div class="text-center max-w-3xl mx-auto mb-8">
      <h2 class="text-3xl sm:text-4xl font-semibold text-gray-900">
        {{ t('landing.partners.title') }}
      </h2>
      <p class="text-gray-600 mt-4 text-justify leading-relaxed">
        {{ t('landing.partners.description') }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-6 w-full">
      <div
        v-for="img in partnerImages"
        :key="img.alt"
        class="rounded-2xl lg:w-1/2 overflow-hidden bg-white/80"
      >
        <NuxtImg
          :src="img.src"
          :alt="img.alt"
          class="w-full h-full md:h-64 lg:h-96 object-contain"
          loading="lazy"
        />
      </div>
    </div>
  </UPageSection>
</template>
