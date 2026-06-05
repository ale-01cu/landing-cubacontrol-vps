import type { User } from '~/types/User'

export interface IAuthPBResponse {
  record?: User
  token?: string
}
