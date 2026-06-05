<script setup lang="ts">
const { t, locale } = useI18n()
const baseUrl = 'https://cubacontrol-sa.web.app'

useSeoMeta({
  title: () => t('navigation.contact'),
  description: 'Contáctenos para solicitar servicios de supervisión comercial, laboratorio, gestión de almacenes o servicios aduaneros.',
  ogTitle: () => t('navigation.contact'),
  ogDescription: 'Contáctenos para solicitar servicios de supervisión comercial, laboratorio, gestión de almacenes o servicios aduaneros.',
  ogImage: `${baseUrl}/logo.png`,
  ogUrl: () => locale.value === 'es' ? `${baseUrl}/contact` : `${baseUrl}/en/contact`,
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/logo.png`
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})
</script>

<template>
  <UPage>
    <UContainer class="py-12 space-y-10">
      <!-- ================= HEADER ================= -->
      <UPageSection
        :title="t('about-us.contact.office.title')"
        :description="t('about-us.contact.office.description')"
        :ui="{
          container: 'flex flex-col lg:grid py-16 sm:py-24 lg:py-8 gap-8 sm:gap-16'
        }"
      />
    </UContainer>
    <MapContact />
  </UPage>
</template>

<style scoped>

</style>
