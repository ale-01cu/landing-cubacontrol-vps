<script setup lang="ts">

</script>

<template>
  <UPageGrid>
    <!-- Feature 1: Prevención de Riesgos -->
    <UPageCard
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
      class="group hover:shadow-xl transition-all duration-300"
    >
      <template #top>
        <div class="relative h-48 overflow-hidden rounded-t-xl">
          <NuxtImg
            src="/images/risk-prevention.jpg"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Prevención de riesgos"
            format="webp"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute bottom-4 left-4">
            <UBadge
              color="primary"
              size="lg"
              class="text-lg"
            >
              #1
            </UBadge>
          </div>
        </div>
      </template>

      <template #title>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Prevención de Riesgos
        </h3>
      </template>

      <template #description>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Constituye una acción preventiva en la disminución de riesgos al eliminar afectaciones
          a la economía de las empresas y del país al detectarse a priori aspectos diferentes
          a los contratados.
        </p>
      </template>

      <template #footer>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
      </template>
    </UPageCard>

    <!-- Feature 2: Identificación de Desviaciones -->
    <UPageCard
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
      class="group hover:shadow-xl transition-all duration-300"
    >
      <template #top>
        <div class="relative h-48 overflow-hidden rounded-t-xl">
          <NuxtImg
            src="/images/deviation-detection.jpg"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Identificación de desviaciones"
            format="webp"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute bottom-4 left-4">
            <UBadge
              color="secondary"
              size="lg"
              class="text-lg"
            >
              #2
            </UBadge>
          </div>
        </div>
      </template>

      <template #title>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Identificación de Desviaciones
        </h3>
      </template>

      <template #description>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Identifica desviaciones en los parámetros y/o especificaciones de las mercancías
          contratadas al recibir información en tiempo real acerca de las condiciones en que
          está siendo operada para su entrega.
        </p>
      </template>

      <template #footer>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            to="#"
            variant="link"
            color="secondary"
            size="sm"
            trailing-icon="i-lucide-arrow-right"
          >
            Más información
          </UButton>
        </div>
      </template>
    </UPageCard>

    <!-- Feature 3: Alertas de Deficiencias -->
    <UPageCard
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 300 } }"
      class="group hover:shadow-xl transition-all duration-300"
    >
      <template #top>
        <div class="relative h-48 overflow-hidden rounded-t-xl">
          <NuxtImg
            src="/images/packaging-alerts.jpg"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Alertas de deficiencias"
            format="webp"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute bottom-4 left-4">
            <UBadge
              color="warning"
              size="lg"
              class="text-lg"
            >
              #3
            </UBadge>
          </div>
        </div>
      </template>

      <template #title>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Alertas de Deficiencias
        </h3>
      </template>

      <template #description>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          Alerta sobre deficiencias en los embalajes, manipulación, estibas, medios de transporte,
          etc. contribuyendo de esa manera a disminuir las pérdidas por averías.
        </p>
      </template>

      <template #footer>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UButton
            to="#"
            variant="link"
            color="warning"
            size="sm"
            trailing-icon="i-lucide-arrow-right"
          >
            Más información
          </UButton>
        </div>
      </template>
    </UPageCard>

    <!-- Feature 4: Detección de Faltantes -->
  </UPageGrid>
</template>

<style scoped>

</style>
