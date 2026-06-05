<script setup lang="ts">
import CardBasicService from '~/components/services/CardBasicService.vue'

const { tm, t, rt } = useI18n()
const emit = defineEmits(['update:serviceName'])
// Sin necesidad de returnObjects ni type assertions complejas
const items = computed(() =>
  (tm('services.warehouse-management.items') as any[]).map(i => rt(i))
)
const courses = computed(() =>
  (tm('services.warehouse-management.courses') as any[]).map(i => rt(i))
)
</script>

<template>
  <CardBasicService
    :title="t('services.warehouse-management.title')"
    :description="t('services.warehouse-management.description')"
    image="/services/servicio-almacenes.webp"
    icon="i-lucide-ship"
    @action:service="(nameService) => emit('update:serviceName', nameService)"
  >
    <template #belowInfo>
      <ul class="grid md:grid-cols-2 gap-y-3 gap-x-6 mt-5">
        <li
          v-for="item in items"
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
        {{ t('services.warehouse-management.courseTitle') }}
      </p>
      <ul class="grid md:grid-cols-2 gap-y-3 gap-x-6">
        <li
          v-for="item in courses"
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
    </template>
  </CardBasicService>
</template>
