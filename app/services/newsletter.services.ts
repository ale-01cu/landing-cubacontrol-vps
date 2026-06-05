import type PocketBase from 'pocketbase'
import type { INewsletter, IPaginatedNewsletters } from '~/types/Newsletter'

export const newsletterService = {
  async getAll(pb: PocketBase): Promise<INewsletter[]> {
    return pb.collection('newsletters').getFullList() as Promise<INewsletter[]>
  },

  async getList(
    pb: PocketBase,
    page: number,
    perPage: number
  ): Promise<IPaginatedNewsletters> {
    const res = await pb.collection('newsletters').getList(page, perPage, {
      sort: '-created'
    })
    return {
      page: res.page,
      perPage: res.perPage,
      totalPages: res.totalPages,
      totalItems: res.totalItems,
      items: res.items as INewsletter[]
    }
  }
}
