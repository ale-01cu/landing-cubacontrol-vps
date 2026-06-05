<script setup lang="ts">
import type { ItemInsurenced } from '~/components/insurence/InsurenceServiceCard.vue'

const { rt, tm } = useI18n()

interface IInsuranceDetails {
  title: string
  descriptions: Array<string>
}
interface InsurenceDetailsPage {
  insuranceDetails: IInsuranceDetails[]
}
const insuranceList = computed(
  () => tm('services.insurance') as InsurenceDetailsPage
)
const images = [
  '/services/insurance/details/seguro-de-vida.jpg',
  '/services/insurance/details/seguro-de-viaje.jpeg',
  '/services/insurance/details/seguro-automotor.jpg',
  '/services/insurance/details/seguro-responsabilidad-civil.webp',
  '/services/insurance/details/seguro-de-incendios.jpg',
  '/services/insurance/details/seguro-agro.jpg',
  '/services/insurance/details/seguro-ganadero.jpg'
]
const readyInsuranceList = computed(() =>
  insuranceList.value.insuranceDetails.map((item, index) => ({
    title: rt(item.title),
    descriptions: item.descriptions.map(desc => rt(desc)),
    img: images[index] ?? ''
  }))
)
</script>

<template>
  <InsurenceServiceCard :items="readyInsuranceList" />
</template>
