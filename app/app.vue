<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'CubaControl S.A. - Sociedad mercantil cubana de capital 100% cubano. Servicios de supervisión comercial en origen-destino, laboratorio, gestión de almacenes, servicios aduaneros y Insurance.' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://cubacontrol-sa.web.app' }
    // ponytail: fuente externa eliminada — bloqueaba primer pintado (FOIT). Autoalojar en /public/fonts con @font-face + font-display:swap si se necesita English Vivace.

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
</script>

<template>
  <UApp>
    <NuxtLayout />
  </UApp>
</template>
