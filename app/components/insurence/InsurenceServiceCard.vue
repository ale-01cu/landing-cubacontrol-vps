<script setup lang="ts">
import FormRequesServices from '~/components/services/FormRequesServices.vue'

export interface ItemInsurenced {
  title: string
  descriptions: Array<string>
  img: string
}
defineProps<{
  items?: ItemInsurenced[]
}>()
const { t } = useI18n()

const showEmailForm = ref<boolean>(false)
const serviceSelected = ref<string>('')
const updateServiceName = (name: string) => {
  serviceSelected.value = name
  console.log(serviceSelected.value)
  showEmailForm.value = true
}
</script>

<template>
  <div>
    <UContainer class="py-12 space-y-10">
      <UPageCard
        v-for="(item, index) in items"
        :key="index"
        orientation="horizontal"
        :ui="{
          root: 'shadow-xl ',
          container: 'lg:grid-cols-2 lg:items-start justify-end',
          wrapper: 'flex flex-col items-start'
        }"
      >
        <div class="rounded-2xl w-full overflow-hidden">
          <NuxtImg
            :src="item.img"
            alt="title"
            format="webp"
            quality="90"
            densities="x1 x2"
            class="w-full h-64 object-cover"
            loading="lazy"
          />
        </div>
        <template #description>
          <UPageFeature
            class="w-full"
            :title="item.title"
            :ui="{
              title: 'text-2xl'
            }"
          >
            <template #description>
              <p
                v-for="(description, index) in item.descriptions"
                :key="index"
                class="text-justify pt-2"
              >
                {{ description }}
              </p>
            </template>
          </UPageFeature>
          <div class="flex items-start py-6 justify-end">
            <UButton
              class=""
              trailing-icon="i-lucide-arrow-right"
              color="primary"
              :label="t('landing.hero.links.request')"
              @click="updateServiceName(item.title)"
            />
          </div>
        </template>
      </UPageCard>
    </UContainer>
    <UModal
      v-model:open="showEmailForm"
      :title="t('form.service.request.title')"
      :ui="{
        content: 'w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-5xl'
      }"
    >
      <template #body>
        <FormRequesServices
          :service-name="serviceSelected"
        />
      </template>
    </UModal>
  </div>
</template>
