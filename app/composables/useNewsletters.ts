import type { INewsletter } from '~/types/Newsletter'

export const useNewsletters = () => {
  const nuxtApp = useNuxtApp()
  const $pb = nuxtApp.$pb as any
  const toast = useToast()
  const t = (key: string) => (nuxtApp.$i18n as any)?.t ? (nuxtApp.$i18n as any).t(key) : key

  const newsletters = ref<INewsletter[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const pagination = ref({
    page: 1,
    perPage: 10,
    totalPages: 0,
    totalItems: 0
  })

  const fetchNewsletters = async (page = 1, perPage = 10) => {
    loading.value = true
    error.value = null

    try {
      const res = await $pb.collection('newsletters').getList(page, perPage, {
        sort: '-created'
      })

      newsletters.value = res.items as INewsletter[]

      pagination.value = {
        page: res.page,
        perPage: res.perPage,
        totalPages: res.totalPages,
        totalItems: res.totalItems
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching newsletters'
    } finally {
      loading.value = false
    }
  }

  const getCoverUrl = (record: INewsletter) => {
    if (!record.cover) return ''
    return $pb.files.getURL(record, record.cover)
  }

  const getFileUrl = (record: INewsletter, file: string) => {
    return $pb.files.getURL(record, file)
  }

  /** Descarga via proxy server-side que valida suscripción */
  const downloadViaProxy = async (newsletterId: string, filename: string) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(
        `/nxapi/newsletters/${newsletterId}/download/${encodeURIComponent(filename)}`,
        { signal: controller.signal }
      )

      if (!response.ok) {
        clearTimeout(timeoutId)
        if (response.status === 403) {
          toast.add({ title: t('newsletters.subscribeRequired'), color: 'warning' })
        } else if (response.status === 401) {
          toast.add({ title: t('newsletters.loginRequired'), color: 'warning' })
        } else {
          toast.add({ title: t('newsletters.downloadError'), color: 'error' })
        }
        return false
      }

      const blob = await response.blob()
      clearTimeout(timeoutId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      return true
    } catch (err: any) {
      clearTimeout(timeoutId)
      toast.add({ title: t('newsletters.downloadError'), color: 'error' })
      return false
    }
  }

  const downloadFile = (record: INewsletter, file: string) => {
    downloadViaProxy(record.id, file)
  }

  const downloadAllFiles = (record: INewsletter) => {
    record.files.forEach((file) => {
      downloadViaProxy(record.id, file)
    })
  }

  return {
    newsletters,
    loading,
    error,
    pagination,
    fetchNewsletters,
    getCoverUrl,
    getFileUrl,
    downloadFile,
    downloadAllFiles,
    downloadViaProxy
  }
}
