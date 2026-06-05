<script setup lang="ts">
import CardBasicService from '~/components/services/CardBasicService.vue'

const { tm, t, rt } = useI18n()
const emit = defineEmits(['update:serviceName'])
// Sin necesidad de returnObjects ni type assertions complejas
const items = computed(() =>
  (tm('services.supervision.items') as any[]).map(i => rt(i))
)
</script>

<template>
  <CardBasicService
    :title="t('services.supervision.title')"
    :items="items"
    image="/barco-remolque.jpg"
    icon="i-lucide-ship"
    @action:service="(nameService) => emit('update:serviceName', nameService)"
  />
</template>
