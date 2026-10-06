<script setup lang="ts">
import type { INewsletter } from '~/types/Newsletter'

interface Props {
  newsletter: INewsletter
}

const props = defineProps<Props>()

const { $pb } = useNuxtApp()
const { t } = useI18n()
const toast = useToast()
const { isAuthenticated } = useAuth()

const coverUrl = computed(() => {
  if (!props.newsletter.cover) return ''
  return $pb.files.getURL(props.newsletter, props.newsletter.cover)
})

const isDownloading = ref(false)
const showSubscribeModal = ref(false)
const pendingFileToDownload = ref<string | null>(null)
const isSubscribing = ref(false)

const downloadFile = async (file: string) => {
  isDownloading.value = true

  try {
    const response = await fetch(
      `/nxapi/newsletters/${props.newsletter.id}/download/${encodeURIComponent(file)}`
    )

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        pendingFileToDownload.value = file
        showSubscribeModal.value = true
      } else {
        toast.add({ title: t('newsletters.downloadError'), color: 'error' })
      }
      return
    }

    // Esperar a que todo el archivo se descargue
    const blob = await response.blob()

    // Proceso de creación del enlace y descarga en el navegador
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file // Asigna el nombre correcto del archivo
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (err: any) {
    console.error('Error detallado de descarga:', err)
    toast.add({ title: t('newsletters.downloadError'), color: 'error' })
  } finally {
    isDownloading.value = false
  }
}

const downloadAllFiles = async () => {
  for (const file of props.newsletter.files) {
    await downloadFile(file)
  }
}

const handleSubscribe = async () => {
  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }

  isSubscribing.value = true
  try {
    const result = await $fetch('/nxapi/subscriptions/register', {
      method: 'POST'
    })

    if (result.subscribed) {
      toast.add({
        title: t('newsletters.subscribeSuccess'),
        color: 'success'
      })
      showSubscribeModal.value = false
      if (pendingFileToDownload.value) {
        const fileToDownload = pendingFileToDownload.value
        pendingFileToDownload.value = null
        await downloadFile(fileToDownload)
      }
    }
  } catch (err: any) {
    toast.add({
      title: err?.statusMessage || t('newsletters.subscribeError'),
      color: 'error'
    })
  } finally {
    isSubscribing.value = false
  }
}
</script>

<template>
  <div>
    <UPageCard
      v-motion
      :initial="{ opacity: 0, y: 50 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }"
      class="group hover:shadow-xl transition-all duration-300"
    >
      <div class="flex flex-col">
        <div class="relative h-48 overflow-hidden rounded-t-xl">
          <NuxtImg
            v-if="coverUrl"
            :src="coverUrl"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt="Newsletter cover"
            format="webp"
            loading="lazy"
          />
          <div
            v-else
            class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-file-text"
              class="w-16 h-16 text-gray-400"
            />
          </div>
        </div>

        <div class="p-5">
          <p class="text-xs text-muted mb-2">
            {{ new Date(newsletter.created).toLocaleDateString() }}
          </p>

          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ newsletter.name }}
          </h3>

          <div class="flex flex-col gap-2">
            <UButton
              v-if="newsletter.files.length === 1 && newsletter.files[0]"
              color="primary"
              size="sm"
              icon="i-lucide-download"
              :loading="isDownloading"
              @click="downloadFile(newsletter.files[0]!)"
            >
              {{ $t('newsletters.download') }}
            </UButton>
            <UButton
              v-else-if="newsletter.files.length > 1"
              color="primary"
              size="sm"
              icon="i-lucide-download"
              :loading="isDownloading"
              @click="downloadAllFiles"
            >
              {{ $t('newsletters.downloadAll') }} ({{ newsletter.files.length }})
            </UButton>
          </div>
        </div>
      </div>
    </UPageCard>

    <UModal
      v-model:open="showSubscribeModal"
      :title="t('newsletters.modalSubscribeTitle')"
      :description="t('newsletters.modalSubscribeDesc')"
    >
      <template #footer>
        <div class="flex items-center justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            :label="t('newsletters.modalCancel')"
            @click="showSubscribeModal = false"
          />
          <UButton
            v-if="isAuthenticated"
            color="primary"
            icon="i-lucide-check-circle"
            :loading="isSubscribing"
            :label="t('newsletters.modalSubscribeAction')"
            @click="handleSubscribe"
          />
          <UButton
            v-else
            color="primary"
            icon="i-lucide-log-in"
            :label="t('newsletters.modalLoginAction')"
            @click="navigateTo('/login')"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>
