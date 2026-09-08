<script setup lang="ts">
const { t } = useI18n()
const { partners, fetched, fetchFailed, getPartnersImageUrls, getText } = useHomeContent()

const fallbackPartnerImages = [
  {
    src: '/partners/partners.webp',
    alt: 'Partners'
  },
  {
    src: '/partners/ops.webp',
    alt: 'OPS'
  }
]

const partnersTitle = computed(() => getText('partners.title', t('landing.partners.title')))
const partnersDesc = computed(() => getText('partners.description', t('landing.partners.description')))

const displayPartners = computed(() => {
  const urls = getPartnersImageUrls.value
  if (urls.length) {
    return urls.map((src, i) => ({
      src,
      alt: `Partner ${i + 1}`,
      href: null as string | null
    }))
  }
  // ponytail: active=false -> vacío; carga/error -> fallback
  if (fetched.value && !fetchFailed.value) return [] as { src: string, alt: string, href: string | null }[]
  return fallbackPartnerImages.map(p => ({ ...p, href: null as string | null }))
})
// ponytail: active=false oculta, carga/error muestra fallback
const isVisible = computed(() => {
  if (!fetched.value || fetchFailed.value) return true
  return !!partners.value
})
</script>

<template>
  <UPageSection
    v-if="isVisible"
    id="partners"
    class="bg-white rounded-3xl"
  >
    <div class="text-center max-w-3xl mx-auto mb-8">
      <h2 class="text-3xl sm:text-4xl font-semibold text-gray-900">
        {{ partnersTitle }}
      </h2>
      <p class="text-gray-600 mt-4 text-justify leading-relaxed">
        {{ partnersDesc }}
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-6 w-full">
      <div
        v-for="img in displayPartners"
        :key="img.alt + img.src"
        class="rounded-2xl lg:w-1/2 overflow-hidden bg-white/80"
      >
        <a
          v-if="img.href"
          :href="img.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NuxtImg
            :src="img.src"
            :alt="img.alt"
            class="w-full h-full md:h-64 lg:h-96 object-contain"
            loading="lazy"
          />
        </a>
        <NuxtImg
          v-else
          :src="img.src"
          :alt="img.alt"
          class="w-full h-full md:h-64 lg:h-96 object-contain"
          loading="lazy"
        />
      </div>
    </div>
  </UPageSection>
</template>
