<script setup lang="ts">
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const { baseUrl, siteName, socialLinks } = config.public

// Obtener la URL actual
const route = useRoute()
const currentUrl = computed(() => {
  return `${baseUrl}${route.path}`
})

// Fecha actual en formato ISO
const currentDate = new Date().toISOString()

// Schema.org para Organización (global)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  'name': siteName || 'S.I.S CUBACONTROL S.A',
  'url': baseUrl,
  'logo': {
    '@type': 'ImageObject',
    'url': `${baseUrl}/logo.jpg`,
    'width': 180,
    'height': 60
  },
  'description': 'Servicios profesionales de supervisión comercial en origen-destino. Prevención de riesgos, identificación de desviaciones y detección de faltantes en operaciones comerciales.',
  'address': {
    '@type': 'PostalAddress',
    'addressCountry': 'CU'
  },
  'sameAs': socialLinks || [
    'https://www.linkedin.com/company/cubacontrol',
    'https://twitter.com/cubacontrol'
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'customer service',
    'email': 'info@cubacontrol.sa.cu',
    'availableLanguage': ['Spanish', 'English']
  }
}

// Schema.org para NewsArticle (para la página principal)
const newsArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  '@id': `${currentUrl.value}#article`,
  'headline': 'Importancia de la Supervisión Comercial en Origen-Destino',
  'description': 'Descubre los 4 beneficios clave de la supervisión comercial: prevención de riesgos, identificación de desviaciones, alertas de deficiencias y detección de faltantes.',
  'image': [
    `${baseUrl}/images/risk-prevention.jpg`,
    `${baseUrl}/images/deviation-detection.jpg`,
    `${baseUrl}/images/packaging-alerts.jpg`,
    `${baseUrl}/images/shortage-detection.jpg`
  ],
  'datePublished': '2024-01-15T08:00:00+00:00',
  'dateModified': currentDate,
  'author': {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    'name': siteName
  },
  'publisher': {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    'name': siteName,
    'logo': {
      '@type': 'ImageObject',
      'url': `${baseUrl}/logo.jpg`
    }
  },
  'mainEntityOfPage': {
    '@type': 'WebPage',
    '@id': currentUrl.value
  },
  'articleSection': 'Servicios',
  'keywords': 'supervisión comercial, origen-destino, prevención de riesgos, detección de faltantes, logística, control de calidad, Cuba',
  'articleBody': `Nuestro servicio de supervisión comercial en origen-destino ofrece cuatro beneficios fundamentales:

  1. Constituye una acción preventiva en la disminución de riesgos al eliminar afectaciones a la economía de las empresas y del país al detectarse a priori aspectos diferentes a los contratados.

  2. Identifica desviaciones en los parámetros y/o especificaciones de las mercancías contratadas al recibir información en tiempo real acerca de las condiciones en que está siendo operada para su entrega.

  3. Alerta sobre deficiencias en los embalajes, manipulación, estibas, medios de transporte, etc. contribuyendo de esa manera a disminuir las pérdidas por averías.

  4. Detecta faltantes, sobrantes y averías, así como problemas de calidad que se hayan producido, no solo antes del proceso de entrega de la mercancía en origen, sino durante los diferentes momentos en que esta ha sido operada en su traslado hacia el destino.`
}

// Schema.org para WebSite (para el sitio completo)
const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  'name': siteName,
  'url': baseUrl,
  'description': 'Supervisión comercial profesional en origen-destino para empresas cubanas e internacionales.',
  'publisher': {
    '@id': `${baseUrl}/#organization`
  },
  'potentialAction': {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': `${baseUrl}/buscar?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
}

// Schema.org para BreadcrumbList (migas de pan)
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${currentUrl.value}#breadcrumb`,
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Inicio',
      'item': baseUrl
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Supervisión Origen-Destino',
      'item': currentUrl.value
    }
  ]
}

// Schema.org para las características (ItemList)
const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Beneficios de la Supervisión Origen-Destino',
  'description': 'Los 4 beneficios clave de nuestro servicio',
  'numberOfItems': 4,
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Prevención de Riesgos',
      'description': 'Acción preventiva en la disminución de riesgos al eliminar afectaciones a la economía de las empresas'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Identificación de Desviaciones',
      'description': 'Detección de desviaciones en parámetros y especificaciones de mercancías contratadas'
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': 'Alertas de Deficiencias',
      'description': 'Alertas sobre deficiencias en embalajes, manipulación, estibas y medios de transporte'
    },
    {
      '@type': 'ListItem',
      'position': 4,
      'name': 'Detección de Faltantes',
      'description': 'Detección de faltantes, sobrantes y averías en todo el proceso logístico'
    }
  ]
}

// Combinar todos los schemas en un array
const schemas = [
  organizationSchema,
  newsArticleSchema,
  webSiteSchema,
  breadcrumbSchema,
  itemListSchema
]

// Usar useHead para inyectar los JSON-LD
useHead({
  script: [
    ...schemas.map((schema, index) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema),
      key: `schema-${index}`
    }))
  ]
})
</script>

<template>
  <div />
</template>
