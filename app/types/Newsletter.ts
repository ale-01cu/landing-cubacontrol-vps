export interface INewsletter {
  id: string
  collectionId: string
  collectionName: string
  cover: string
  files: string[]
  name: string
  created: string
  updated: string
}

export interface IPaginatedNewsletters {
  page: number
  perPage: number
  totalPages: number
  totalItems: number
  items: INewsletter[]
}

export type {}
