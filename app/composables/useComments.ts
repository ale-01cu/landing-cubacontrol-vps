export interface IComment {
  id: string
  collectionId: string
  collectionName: string
  email: string
  text: string
  news: string
  created: string
  updated: string
}

export const useComments = () => {
  const { $pb } = useNuxtApp()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const createComment = async (newsId: string, email: string, text: string) => {
    loading.value = true
    error.value = null

    try {
      const record = await $pb.collection('comment').create({
        news: newsId,
        email,
        text
      })

      return record as IComment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error creating comment'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createComment
  }
}
