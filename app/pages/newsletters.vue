<script setup lang="ts">
import { useNewsletters } from '~/composables/useNewsletters'
import CardNewsletter from '~/components/newsletter/CardNewsletter.vue'

const { t, locale } = useI18n()
const baseUrl = 'https://cubacontrol-sa.web.app'
const page = ref(1)

useSeoMeta({
  title: () => t('newsletters.title'),
  description: () => t('newsletters.description'),
  ogTitle: () => t('newsletters.title'),
  ogDescription: () => t('newsletters.description'),
  ogImage: `${baseUrl}/logo.png`,
  ogUrl: () => locale.value === 'es' ? `${baseUrl}/newsletters` : `${baseUrl}/en/newsletters`,
  twitterCard: 'summary_large_image',
  twitterImage: `${baseUrl}/logo.png`
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const {
  newsletters,
  loading,
  pagination,
  fetchNewsletters
} = useNewsletters()

const handlePageChange = async (newPage: number) => {
  page.value = newPage
  await fetchNewsletters(newPage)
}

onMounted(async () => {
  await fetchNewsletters()
})
</script>

<template>
  <UContainer class="py-12 space-y-10">
    <header class="py-6">
      <div class="max-w-6xl mx-auto px-4 space-y-4">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
            {{ t('newsletters.title') }}
          </h1>
          <p class="text-sm text-muted mt-2">
            {{ t('newsletters.description') }}
          </p>
        </div>
      </div>
    </header>

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
      v-else-if="newsletters.length === 0"
      class="text-center py-20"
    >
      <UIcon
        name="i-lucide-file-text"
        class="w-16 h-16 text-muted mx-auto mb-4"
      />
      <p class="text-muted text-lg">
        {{ t('newsletters.empty') }}
      </p>
    </div>

    <section
      v-else
      class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <CardNewsletter
        v-for="item in newsletters"
        :key="item.id"
        :newsletter="item"
      />
    </section>

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

<style scoped>
</style>
