<script setup lang="ts">
interface IEntity {
  name: string
  logo: string
}
const { t } = useI18n()
const { getText, patronRecords, getPatronLogoUrl } = useHomeContent()

const trustTitle = computed(() => getText('trust.title', t('landing.trust.title')))
const trustDescription = computed(() => getText('trust.description', t('landing.trust.description')))

// sin fallback: si no viene nada de la API, no se muestra nada
const isVisible = computed(() => patronRecords.value.length > 0)

const displayEntities = computed(() => {
  if (!patronRecords.value.length) return [] as { name: string, logo: string, href: string | null }[]
  return patronRecords.value.map(p => ({
    name: p.name,
    logo: getPatronLogoUrl(p) || '',
    href: p.website_url || null
  }))
})
</script>

<template>
  <UPageSection
    v-if="isVisible"
    class="relative overflow-hidden rounded-3xl bg-primary-50/40"
  >
    <!-- HEADER -->
    <div class="text-center max-w-3xl mx-auto mb-3">
      <h2 class="text-3xl sm:text-4xl font-bold mt-2">
        {{ trustTitle }}
      </h2>

      <p class="text-muted mt-4">
        {{ trustDescription }}
      </p>
    </div>

    <!-- LOGOS GRID -->
    <div
      v-if="displayEntities.length"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center"
    >
      <div
        v-for="entity in displayEntities"
        :key="entity.name"
        class="flex flex-col items-center justify-center
               p-4 rounded-2xl
               bg-white/70 backdrop-blur-sm
               shadow-sm hover:shadow-md
               transition-all duration-300"
      >
        <a
          v-if="entity.href"
          :href="entity.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NuxtImg
            :src="entity.logo"
            :alt="entity.name"
            class="h-20 object-contain"
            loading="lazy"
          />
        </a>
        <NuxtImg
          v-else
          :src="entity.logo"
          :alt="entity.name"
          class="h-20 object-contain"
          loading="lazy"
        />
      </div>
    </div>
  </UPageSection>
</template>
