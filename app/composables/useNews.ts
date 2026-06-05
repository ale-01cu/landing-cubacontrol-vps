export interface INews {
  id: string
  collectionId: string
  collectionName: string
  title: string
  description: string
  text: string
  img: string
  create_by: string
  author: string
  created: string
  updated: string
}

export interface IPaginatedNews {
  page: number
  perPage: number
  totalPages: number
  totalItems: number
  items: INews[]
}
export const useNews = () => {
  const { $pb } = useNuxtApp()

  const newsList = ref<INews[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const pagination = ref({
    page: 1,
    perPage: 10,
    totalPages: 0,
    totalItems: 0
  })

  const fetchNews = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await $pb.collection('news').getList(pagination.value.page, pagination.value.perPage, {
        sort: 'created',
        expand: 'create_by'
      })

      newsList.value = res.items as INews[]

      pagination.value = {
        page: res.page,
        perPage: res.perPage,
        totalPages: res.totalPages,
        totalItems: res.totalItems
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching news'
    } finally {
      loading.value = false
    }
  }

  const loadMore = async () => {
    if (pagination.value.page >= pagination.value.totalPages) return

    await fetchNews()
  }

  const hasMore = computed(() => {
    return pagination.value.page < pagination.value.totalPages
  })
  const getNewsImage = (record: INews) => {
    if (!record.img) return ''

    return $pb.files.getURL(record, record.img)
  }

  const fetchNewsById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const record = await $pb.collection('news').getOne(id)
      return record as INews
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error fetching news by id'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    getNewsImage,
    newsList,
    loading,
    error,
    pagination,
    fetchNews,
    fetchNewsById,
    loadMore,
    hasMore
  }
}
