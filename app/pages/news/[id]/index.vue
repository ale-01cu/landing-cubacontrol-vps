<script setup lang="ts">
import type { INews } from '~/composables/useNews'

const route = useRoute()
const newsId = route.params.id as string
const { locale } = useI18n()

const baseUrl = 'https://cubacontrol-sa.web.app'

const { fetchNewsById, getNewsImage } = useNews()
const { createComment } = useComments()

const article = ref<INews | null>(null)
const loadingNews = ref(true)
const newsError = ref<string | null>(null)

const seoTitle = computed(() => article.value?.title || 'Noticia - CubaControl S.A.')
const seoDescription = computed(() => article.value?.description || 'Lea esta noticia de CubaControl S.A.')
const seoImage = computed(() => article.value ? getNewsImage(article.value) : `${baseUrl}/logo.png`)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: seoImage,
  ogUrl: () => locale.value === 'es'
    ? `${baseUrl}/news/${newsId}`
    : `${baseUrl}/en/news/${newsId}`,
  twitterCard: 'summary_large_image',
  twitterImage: seoImage
})

useServerSeoMeta({
  author: 'CubaControl S.A.',
  robots: 'index, follow'
})

const loadingComment = ref(false)
const successMessage = ref('')
const validationErrors = ref<string[]>([])

const isFormValid = computed(() => {
  return form.email && form.comment && validateEmail(form.email) && form.comment.length <= 500
})

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateForm = () => {
  validationErrors.value = []

  if (!form.email) {
    validationErrors.value.push('El correo electrónico es requerido')
  } else if (!validateEmail(form.email)) {
    validationErrors.value.push('El correo electrónico no es válido')
  }

  if (!form.comment) {
    validationErrors.value.push('El comentario es requerido')
  } else if (form.comment.length > 500) {
    validationErrors.value.push('El comentario no puede exceder los 500 caracteres')
  }

  return validationErrors.value.length === 0
}

const submitComment = async () => {
  if (!validateForm()) return

  loadingComment.value = true
  validationErrors.value = []

  try {
    await createComment(newsId, form.email, form.comment)

    successMessage.value = '¡Comentario enviado con éxito!'
    form.email = ''
    form.comment = ''

    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch {
    validationErrors.value.push('Error al enviar el comentario. Intente nuevamente.')
  } finally {
    loadingComment.value = false
  }
}

const resetForm = () => {
  form.email = ''
  form.comment = ''
  validationErrors.value = []
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter' && isFormValid.value && !loadingComment.value) {
    submitComment()
  }
}

const form = reactive<{ email: string, comment: string }>({
  email: '',
  comment: ''
})

const articleImage = computed(() => {
  if (!article.value) return ''
  return getNewsImage(article.value)
})

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)

  const newsData = await fetchNewsById(newsId)
  if (newsData) {
    article.value = newsData
  } else {
    newsError.value = 'No se pudo cargar la noticia'
  }
  loadingNews.value = false
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <UContainer class="py-10">
    <div
      v-if="loadingNews"
      class="flex justify-center py-20"
    >
      <ULoader size="lg" />
    </div>

    <UAlert
      v-else-if="newsError"
      color="primary"
      variant="soft"
      :title="newsError"
    />

    <article
      v-else-if="article"
      class="mx-auto max-w-4xl"
    >
      <header class="mb-10">
        <h1
          class="text-3xl md:text-4xl font-bold leading-tight mb-4"
        >
          {{ article.title }}
        </h1>

        <p class="text-lg text-gray-500 dark:text-gray-400 mb-6">
          {{ article.description }}
        </p>

        <div
          class="flex items-center gap-4 text-sm text-gray-500"
        >
          <strong>
            Por:
          </strong>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ article.author }}
          </UBadge>

          <span>
            {{ new Date(article.created).toLocaleDateString() }}
          </span>
        </div>
      </header>

      <div class="overflow-hidden rounded-2xl mb-8">
        <NuxtImg
          v-if="articleImage"
          :src="articleImage"
          class="w-full h-[260px] md:h-[420px] object-cover"
          placeholder
          format="webp"
        />
      </div>

      <section
        class="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
        v-html="article.text"
      />

      <USeparator class="my-14" />

      <section class="w-full">
        <UCard
          class="w-full mx-auto shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          :ui="{
            header: 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700'
          }"
        >
          <template #header>
            <div class="flex items-start gap-4">
              <div class="p-3 bg-primary-200">
                <UIcon
                  name="i-heroicons-chat-bubble-left-right"
                  class="w-6 h-6 text-primary-600 dark:text-primary-400"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                  Dejar un comentario
                </h3>
                <p class="text-sm flex flex-row items-start text-gray-600 dark:text-gray-400 mt-1 gap-1">
                  <UIcon
                    name="i-lucide-info"
                    class="w-6 h-5 sm:w-4 sm:h-4"
                  />
                  Su opinión es importante para nosotros. Nuestro equipo revisará su mensaje.
                </p>
              </div>
            </div>
          </template>

          <template #default>
            <form
              class="w-full space-y-8"
              @submit.prevent="submitComment"
            >
              <UFormField
                label="Correo electrónico"
                name="email"
                required
              >
                <div class="flex flex-col gap-1.5">
                  <UInput
                    v-model="form.email"
                    type="email"
                    size="lg"
                    icon="i-heroicons-envelope"
                    placeholder="nombre@empresa.com"
                    autocomplete="email"
                    :ui="{
                      base: 'pl-10'
                    }"
                    class="w-10/12 sm:w-6/12 transition-all duration-200 hover:shadow-md focus-within:shadow-lg"
                  />
                  <div class="flex items-center gap-1 text-gray-500">
                    <UIcon
                      name="i-lucide-shield-check"
                      class="w-3.5 h-3.5 text-primary-600"
                    />
                    <span>Usaremos este correo solo para responder su comentario</span>
                  </div>
                </div>
              </UFormField>

              <UFormField
                class="w-full"
                label="Comentario"
                name="comment"
                required
              >
                <div class="flex flex-col gap-1.5">
                  <UTextarea
                    v-model="form.comment"
                    :rows="5"
                    size="lg"
                    autoresize
                    placeholder="Escriba aquí su comentario o sugerencia..."
                    class="w-full resize-none transition-all duration-200 hover:shadow-md focus-within:shadow-lg rounded-xl"
                    :ui="{
                      base: 'rounded-xl'
                    }"
                  />

                  <div class="flex justify-end mt-2">
                    <span
                      class="text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {{ form.comment?.length || 0 }}/500
                    </span>
                  </div>
                </div>
              </UFormField>

              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Transition
                  enter-active-class="transform transition duration-300 ease-out"
                  enter-from-class="translate-y-2 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transform transition duration-200 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-2 opacity-0"
                >
                  <div
                    v-if="successMessage"
                    class="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800"
                  >
                    <UIcon
                      name="i-heroicons-check-circle-16-solid"
                      class="w-5 h-5"
                    />
                    <span>{{ successMessage }}</span>
                  </div>
                </Transition>

                <div class="flex flex-row justify-between gap-3 sm:ml-auto">
                  <UButton
                    type="button"
                    size="lg"
                    color="neutral"
                    variant="ghost"
                    class="rounded-xl px-6"
                    @click="resetForm"
                  >
                    Cancelar
                  </UButton>
                  <UButton
                    type="submit"
                    color="primary"
                    :loading="loadingComment"
                    :disabled="!isFormValid"
                    icon="i-heroicons-paper-airplane"
                    class="rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span class="flex items-center gap-2">
                      Enviar
                      <span class="text-xs hidden lg:block  bg-white/20 px-2 py-0.5 rounded-full">
                        Ctrl+Enter
                      </span>
                    </span>
                  </UButton>
                </div>
              </div>

              <Transition name="fade">
                <div
                  v-if="validationErrors.length"
                  class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4"
                >
                  <div class="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-2">
                    <UIcon
                      name="i-heroicons-exclamation-triangle"
                      class="w-5 h-5"
                    />
                    <span>Por favor corrige los siguientes errores:</span>
                  </div>
                  <ul class="list-disc list-inside space-y-1">
                    <li
                      v-for="(error, index) in validationErrors"
                      :key="index"
                      class="text-sm text-red-600 dark:text-red-400"
                    >
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </Transition>
            </form>
          </template>
        </UCard>
      </section>
    </article>
  </UContainer>
</template>
