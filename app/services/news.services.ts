import type PocketBase from 'pocketbase'

export const newsService = {
  getAll(pb: PocketBase) {
    return pb.collection('news').getFullList()
  }
}
