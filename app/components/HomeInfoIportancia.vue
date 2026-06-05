<script setup lang="ts">
const items = [
  {
    icon: 'i-lucide-shield-check',
    title: 'Prevención de riesgos',
    description:
      'Reduce afectaciones económicas al detectar anticipadamente desviaciones respecto a lo contratado, protegiendo a las empresas y la economía nacional.'
  },
  {
    icon: 'i-lucide-activity',
    title: 'Monitoreo en tiempo real',
    description:
      'Identifica desviaciones en parámetros y especificaciones mediante información continua sobre las condiciones operativas durante la entrega.'
  },
  {
    icon: 'i-lucide-package-search',
    title: 'Control del manejo y embalaje',
    description:
      'Alerta sobre deficiencias en embalajes, manipulación, estibas y transporte, disminuyendo pérdidas ocasionadas por averías.'
  },
  {
    icon: 'i-lucide-clipboard-check',
    title: 'Control integral Origen-Destino',
    description:
      'Detecta faltantes, sobrantes, averías y problemas de calidad durante todo el traslado, garantizando resultados comparables según los contratos establecidos.'
  }
]
</script>

<template>
  <UPageSection
    id="supervision"
    class="relative bg-primary-50"
  >
    <!-- HEADER -->
    <div class="max-w-3xl mx-auto text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight">
        Importancia de la Supervisión Comercial
      </h2>

      <p class="mt-4 text-lg text-muted">
        Supervisión integral desde el origen hasta el destino para garantizar
        cumplimiento contractual, calidad y seguridad en cada operación logística.
      </p>
    </div>

    <!-- FEATURES GRID -->
    <div
      class="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4"
    >
      <UCard
        v-for="(item, index) in items"
        :key="index"
        class="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      >
        <div class="flex flex-col gap-4 h-full">
          <!-- ICON -->
          <div class="flex items-center justify-between w-full">
            <div
              class="flex flex-row items-center justify-between w-12 h-12 rounded-xl bg-primary/10 text-primary"
            >
              <UIcon
                :name="item.icon"
                class="size-6 ml-3"
              />
            </div>
            <UButton
              to="#"
              variant="link"
              color="primary"
              size="sm"
              trailing-icon="i-lucide-arrow-right"
            >
              Más información
            </UButton>
          </div>

          <!-- CONTENT -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">
              {{ item.title }}
            </h3>

            <p class="text-sm text-muted leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </UPageSection>
</template>
