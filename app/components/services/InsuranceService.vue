<script setup lang="ts">
import CardBasicService from '~/components/services/CardBasicService.vue'

const { tm, t, rt } = useI18n()

const emit = defineEmits(['update:serviceName'])

const insuranceServices = computed(() =>
  (tm('services.insurance.insuranceServices') as any[]).map(i => rt(i))
)

const intelligence = computed(() =>
  (tm('services.insurance.intelligence') as any[]).map(i => rt(i))
)
const description = computed(() => t('services.insurance.description'))
</script>

<template>
  <CardBasicService
    :title="t('services.insurance.title')"
    :description="description"
    image="/services/seguros-inteligentes.webp"
    icon="i-lucide-ship"
    @action:service="(nameService) => emit('update:serviceName', nameService)"
  >
    <template #belowInfo>
      <p class="text-start text-highlighted py-8">
        {{ t('services.insurance.insuranceServicesTitle') }}
      </p>
      <ul class="grid md:grid-cols-2 gap-y-3 gap-x-6">
        <li
          v-for="item in insuranceServices"
          :key="item"
          class="flex items-start gap-2 text-sm text-neutral-700"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="text-primary mt-0.5 shrink-0"
          />
          <span>{{ item }}</span>
        </li>
      </ul>
      <p class="text-start text-highlighted py-8">
        {{ t('services.insurance.intelligenceTitle') }}
      </p>
      <ul class="grid md:grid-cols-2 gap-y-3 gap-x-6">
        <li
          v-for="item in intelligence"
          :key="item"
          class="flex items-start gap-2 text-sm text-neutral-700"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="text-primary mt-0.5 shrink-0"
          />
          <span>{{ item }}</span>
        </li>
      </ul>

      <p class="text-start text-highlighted py-8">
        {{ t('services.insurance.evaluationTitle') }}
      </p>
      <ul class="grid md:grid-cols-1 gap-y-3 gap-x-6">
        <li
          class="flex items-start gap-2 text-sm text-neutral-700"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            class="text-primary mt-0.5 shrink-0"
          />
          <span>{{ t('services.insurance.evaluationDescription') }}</span>
        </li>
      </ul>
    </template>
  </CardBasicService>
</template>
