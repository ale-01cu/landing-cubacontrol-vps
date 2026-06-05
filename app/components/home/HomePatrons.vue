<script setup lang="ts">
interface IEntity {
  name: string
  logo: string
}
const { t } = useI18n()
const entities: IEntity[] = [
  {
    name: 'ONARC',
    logo: 'patrons/logo_onarc.png'
  },
  {
    name: 'ONN',
    logo: 'patrons/onn.jpg'
  },
  {
    name: 'Ministerio de Finanzas y Precios',
    logo: 'patrons/mfp.jpg'
  },
  {
    name: 'OSDE CAUDAL',
    logo: 'patrons/grupo-caudal.jpg'
  },
  {
    name: 'MITRANS',
    logo: 'patrons/mitrans.jpg'
  },
  {
    name: 'ESEN',
    logo: 'patrons/esen.jpg'
  },
  {
    name: 'ESICUBA',
    logo: 'patrons/esicuba.jpg'
  },
  {
    name: 'INTERMAR',
    logo: 'patrons/intermar.jpg'
  },
  {
    name: 'GECOME',
    logo: 'patrons/gecome.png'
  },
  {
    name: 'ADUANA',
    logo: 'patrons/aduana.webp'
  },
  {
    name: 'INTERAUDIT',
    logo: 'patrons/interauditlogo.webp'
  },
  {
    name: 'SUPERINTENDENCIA',
    logo: 'patrons/SUPERINTENDENCIA.webp'
  },
  {
    name: 'ONAT',
    logo: 'patrons/onatlogo.webp'
  },
  {
    name: 'CONAS',
    logo: 'patrons/conaslogo.webp'
  },
  {
    name: 'CANEC',
    logo: 'patrons/caneclogo.webp'
  },
  {
    name: 'CUBA ASISTUR',
    logo: 'patrons/asisturlogo.webp'
  }
]
</script>

<template>
  <UPageSection
    class="relative overflow-hidden rounded-3xl bg-primary-50/40"
  >
    <!-- HEADER -->
    <div class="text-center max-w-3xl mx-auto mb-3">
      <h2 class="text-3xl sm:text-4xl font-bold mt-2">
        {{ t('landing.trust.title') }}
      </h2>

      <p class="text-muted mt-4">
        {{ t('landing.trust.description') }}
      </p>
    </div>

    <!-- LOGOS GRID -->
    <div
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center"
    >
      <div
        v-for="entity in entities"
        :key="entity.name"
        class="flex flex-col items-center justify-center
               p-4 rounded-2xl
               bg-white/70 backdrop-blur-sm
               shadow-sm hover:shadow-md
               transition-all duration-300"
      >
        <NuxtImg
          :src="entity.logo"
          :alt="entity.name"
          class="h-20 object-contain"
          loading="lazy"
        />
      </div>
    </div>
  </UPageSection>
</template>
