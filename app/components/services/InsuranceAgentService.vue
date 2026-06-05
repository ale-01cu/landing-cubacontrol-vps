<script setup lang="ts">
import CardBasicService from '~/components/services/CardBasicService.vue'
import type { ButtonProps } from '#ui/components/Button.vue'

const { tm, t, rt } = useI18n()

const emit = defineEmits(['update:serviceName'])

const items = computed(() =>
  (tm('services.insurance-agent.items') as any[]).map(i => rt(i))
)

const links = [
  {
    label: t('services.insurance-agent.action.download-file.label'),
    onClick: () => navigateTo('/services/insurance'),
    color: 'primary',
    target: '_blank',
    variant: 'ghost',
    trailingIcon: 'i-lucide-arrow-right'
  }
] as ButtonProps[]
</script>

<template>
  <CardBasicService
    :title="t('services.insurance-agent.title')"
    :description="t('services.insurance-agent.description')"
    :customs-links="links"
    image="/services/agente-seguros.webp"
    icon="i-lucide-ship"
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
    </template>
  </CardBasicService>
</template>
