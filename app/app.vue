<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'CubaControl S.A. - Sociedad mercantil cubana de capital 100% cubano. Servicios de supervisión comercial en origen-destino, laboratorio, gestión de almacenes, servicios aduaneros y Insurance.' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://cubacontrol-sa.web.app' },
    { rel: 'stylesheet', href: 'https://db.onlinewebfonts.com/c/7231eadf5c2ea1154aa9815e12a6314c?family=English+111+Vivace+BT+V2' }

  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'CubaControl S.A. - Servicios de Supervisión Comercial Internacional'
const description = 'CubaControl S.A. Sociedad mercantil de capital 100% cubano. Servicios de supervisión comercial, laboratorio, gestión de almacenes, servicios aduaneros e Insurance.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/logo.png',
  ogUrl: 'https://cubacontrol-sa.web.app',
  twitterCard: 'summary_large_image',
  twitterImage: '/logo.png',
  twitterTitle: title,
  twitterDescription: description
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const loading = ref(true)
onMounted(async () => {
  loading.value = false
})
</script>

<template>
  <UApp>
    <ClientOnly>
      <loading v-if="loading" />
      <NuxtLayout v-else />
    </ClientOnly>
  </UApp>
</template>
