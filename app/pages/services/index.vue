<script setup lang="ts">
import SupervisionService from '~/components/services/SupervisionService.vue'
import CustomsServices from '~/components/services/CustomsServices.vue'
import LaboratoryService from '~/components/services/LaboratoryService.vue'
import InsuranceService from '~/components/services/InsuranceService.vue'
import WarehouseManagementService from '~/components/services/WarehouseManagementService.vue'
import InsuranceAgentService from '~/components/services/InsuranceAgentService.vue'
import FormRequesServices from '~/components/services/FormRequesServices.vue'

const { t, locale } = useI18n()
const baseUrl = 'https://cubacontrol-sa.web.app'

useSeoMeta({
  title: () => t('navigation.services'),
  description: 'CubaControl S.A. ofrece servicios de supervisión comercial, laboratorio, gestión de almacenes, servicios aduaneros, Insurance y agente de seguros.',
  ogTitle: () => t('navigation.services'),
  ogDescription: 'CubaControl S.A. ofrece servicios de supervisión comercial, laboratorio, gestión de almacenes, servicios aduaneros, Insurance y agente de seguros.',
  ogImage: `${baseUrl}/logo.png`,
  ogUrl: () => locale.value === 'es' ? `${baseUrl}/services` : `${baseUrl}/en/services`,
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/logo.png`
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const showEmailForm = ref<boolean>(false)
const serviceSelected = ref<string>('')
const updateServiceName = (name: string) => {
  serviceSelected.value = name
  console.log(serviceSelected.value)
  showEmailForm.value = true
}
</script>

<template>
  <UPage>
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
    <UPageSection
      :title="t('services.title')"
      :description="t('services.description')"
      :ui="{
        container: 'flex flex-col lg:grid py-16 sm:py-24 lg:py-8 gap-8 sm:gap-16'
      }"
    />
    <!-- SERVICES -->
    <UPageSection
      :ui="{
        container: 'flex flex-col lg:grid py-16 sm:py-24 lg:py-15 gap-8 sm:gap-16'
      }"
    >
      <div class="grid gap-10">
        <SupervisionService @update:service-name="updateServiceName" />
        <WarehouseManagementService @update:service-name="updateServiceName" />
        <InsuranceAgentService @update:service-name="updateServiceName" />
        <InsuranceService @update:service-name="updateServiceName" />
        <CustomsServices @update:service-name="updateServiceName" />
        <LaboratoryService @update:service-name="updateServiceName" />
      </div>
    </UPageSection>
  </UPage>
</template>

<style scoped>

</style>
