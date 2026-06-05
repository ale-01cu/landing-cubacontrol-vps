<script setup lang="ts">
import CardBasicService from '~/components/services/CardBasicService.vue'

const { tm, t, rt } = useI18n()
const emit = defineEmits(['update:serviceName'])
// Sin necesidad de returnObjects ni type assertions complejas
const items = computed(() =>
  (tm('services.customs.items') as any[]).map(i => rt(i))
)

const appliesTo = computed(() =>
  (tm('services.customs.appliesTo') as any[]).map(i => rt(i))
)
</script>

<template>
  <CardBasicService
    :title="t('services.customs.title')"
    :items="items"
    image="/services/servicio-aduanales.webp"
    icon="i-lucide-ship"
    @action:service="(nameService) => emit('update:serviceName', nameService)"
  >
    <template #belowInfo>
      <p class="text-start text-highlighted py-8">
        {{ t('services.customs.appliesToTitle') }}
      </p>
      <ul class="grid md:grid-cols-2 gap-y-3 gap-x-6">
        <li
          v-for="item in appliesTo"
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
