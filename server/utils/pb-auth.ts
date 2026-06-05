import PocketBase from 'pocketbase'
import { getCookie, createError } from 'h3'
import type { H3Event } from 'h3'

export function getPbFromCookie(event: H3Event) {
  const config = useRuntimeConfig(event)
  const pb = new PocketBase(config.public.pocketbaseUrl)

  const cookie = getCookie(event, 'pb_auth')
  if (!cookie) return null

  try {
    const data = JSON.parse(cookie) as { token: string, record?: Record<string, unknown> }
    pb.authStore.save(data.token, data.record)
    return pb
  } catch {
    return null
  }
}

export function getAuthenticatedPb(event: H3Event) {
  const pb = getPbFromCookie(event)
  if (!pb || !pb.authStore.isValid || !pb.authStore.record?.id) {
    throw createError({ statusCode: 401, statusMessage: 'Debes iniciar sesión' })
  }
  return pb
}
