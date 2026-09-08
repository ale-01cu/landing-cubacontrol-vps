<script setup lang="ts">
import { useNews } from '~/composables/useNews'

interface News {
  id: number
  slug: string
  title: string
  summary: string
  image: string
  author: string
  date: string
}

const { t, locale } = useI18n()
const baseUrl = 'https://cubacontrol-sa.web.app'

useSeoMeta({
  title: () => t('navigation.news'),
  description: 'Manténgase informado sobre las últimas noticias de CubaControl S.A. y la industria de supervisión comercial.',
  ogTitle: () => t('navigation.news'),
  ogDescription: 'Manténgase informado sobre las últimas noticias de CubaControl S.A. y la industria de supervisión comercial.',
  ogImage: `${baseUrl}/logo.png`,
  ogUrl: () => locale.value === 'es' ? `${baseUrl}/news` : `${baseUrl}/en/news`,
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/logo.png`
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const search = ref('')

const page = ref(1)
const pageSize = 6

const news = ref<News[]>([
  {
    id: 1,
    slug: 'supervision-portuaria',
    title: 'Supervisión comercial en operaciones portuarias',
    summary:
      'La supervisión comercial garantiza el cumplimiento contractual y reduce riesgos durante el proceso logístico internacional...',
    image: '/laboratorio-copia-copia.jpg',
    author: 'Departamento Técnico',
    date: '2026-01-12'
  },
  {
    id: 2,
    slug: 'control-calidad-mercancias',
    title: 'Importancia del control de calidad en mercancías',
    summary:
      'El monitoreo continuo permite detectar desviaciones en parámetros técnicos antes del embarque...',
    image: '/Laboratorio_300.jpg',
    author: 'Equipo Auditor',
    date: '2026-01-02'
  },
  {
    id: 3,
    slug: 'auditoria-logistica',
    title: 'Auditorías logísticas internacionales',
    summary:
      'Las auditorías permiten evaluar procesos de transporte y almacenamiento garantizando eficiencia operativa...',
    image: '/quimica-2.jpg',
    author: 'Área Comercial',
    date: '2025-12-20'
  }
])

/* ---------------------------
   FILTERING
---------------------------- */

const filteredNews = computed(() => {
  return news.value.filter((n) => {
    return !search.value
      || n.title.toLowerCase().includes(search.value.toLowerCase())
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredNews.value.length / pageSize)
)

const { fetchNews, newsList, loading, pagination, getNewsImage } = useNews()

const handlePageChange = async (newPage: number) => {
  page.value = newPage
  await fetchNews(newPage)
}

onMounted(async () => {
  await fetchNews()
})
</script>

<template>
  <UContainer class="py-12 space-y-10">
    <!-- ================= HEADER ================= -->
    <header class="py-6">
      <div class="max-w-6xl mx-auto px-4 space-y-4">
        <!-- Título -->
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
            Noticias
          </h1>
          <p class="text-sm text-muted">
            Actualidad, avisos y novedades importantes.
          </p>
        </div>

        <!-- Navegación + Search -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-3">
          <!-- Search -->
          <div class="w-full md:w-72 flex justify-center">
            <UInput
              v-model="search"
              placeholder="Buscar noticias..."
              icon="i-lucide-search"
              size="md"
              :trailing-icon="search ? 'i-lucide-x' : undefined"
              @click:trailing="search = ''"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- ================= FILTERS ================= -->

    <!-- RESULT COUNT -->
    <!--    <div class="text-sm text-muted"> -->
    <!--      {{ filteredNews.length }} noticias encontradas -->
    <!--    </div> -->

    <!-- ================= NEWS LIST ================= -->
    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="w-8 h-8 animate-spin text-primary"
      />
    </div>

    <div
      v-else-if="newsList.length === 0"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-newspaper"
        class="w-16 h-16 text-muted mx-auto mb-4"
      />
      <p class="text-muted text-lg">
        {{ t('news.empty') }}
      </p>
    </div>

    <section
      v-else
      class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="item in newsList"
        :key="item.id"
        class="group"
      >
        <UCard
          class="h-full flex flex-col overflow-hidden
                 hover:shadow-xl transition-all duration-300"
        >
          <!-- IMAGE -->
          <NuxtLink :to="`/news/${item.id}`">
            <NuxtImg
              :src="getNewsImage(item)"
              class="w-full h-48 object-cover
                     group-hover:scale-105 transition"
              format="webp"
              loading="lazy"
            />
          </NuxtLink>

          <!-- CONTENT -->
          <div class="p-5 flex flex-col flex-1">
            <p class="text-xs text-muted mb-2">
              {{ item.author }} ·
              {{ new Date(item.created).toLocaleDateString() }}
            </p>

            <NuxtLink
              :to="`/news/${item.id}`"
              class="font-semibold text-lg mb-3
                     group-hover:text-primary transition"
            >
              {{ item.title }}
            </NuxtLink>

            <p class="text-sm text-muted line-clamp-4 flex-1">
              {{ item.description }}
            </p>

            <UButton
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              class="mt-4 self-start"
              :to="`/news/${item.id}`"
            >
              Leer más
            </UButton>
          </div>
        </UCard>
      </article>
    </section>

    <!-- ================= PAGINATION ================= -->
    <div
      v-if="pagination.totalPages > 1"
      class="flex justify-center pt-6"
    >
      <UPagination
        v-model="page"
        :total="pagination.totalItems"
        :page-count="pagination.perPage"
        :items-per-page="pagination.perPage"
        @update:model-value="handlePageChange"
      />
    </div>
  </UContainer>
</template>
