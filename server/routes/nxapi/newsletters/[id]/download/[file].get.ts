// FILE: server/api/newsletters/[id]/download/[file].get.ts
import { setHeader, createError, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)
  const userId = pb.authStore.record!.id as string
  const config = useRuntimeConfig(event)
  const newsletterId = getRouterParam(event, 'id')
  const filename = getRouterParam(event, 'file')

  if (!newsletterId || !filename) {
    throw createError({ statusCode: 400, statusMessage: 'Parámetros inválidos' })
  }

  const subscription = await pb
    .collection('subscriptions')
    .getFirstListItem(`user="${userId}" && status="active"`)
    .catch(() => null)

  if (!subscription) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Debes suscribirte para descargar boletines'
    })
  }

  let newsletter
  try {
    newsletter = await pb.collection('newsletters').getOne(newsletterId, {
      requestKey: `newsletter-${newsletterId}`
    })
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Boletín no encontrado' })
  }

  const files: string[] = newsletter.files ?? []
  if (!files.includes(filename)) {
    throw createError({ statusCode: 404, statusMessage: 'Archivo no encontrado' })
  }

  const pbFileUrl = `${config.public.pocketbaseUrl}/api/files/${newsletter.collectionId}/${newsletter.id}/${encodeURIComponent(filename)}`
  const pbResponse = await fetch(pbFileUrl)

  if (!pbResponse.ok) {
    throw createError({ statusCode: 502, statusMessage: 'Error al obtener el archivo' })
  }

  // --- AQUÍ ESTÁ LA MAGIA DEL STREAMING ---
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setHeader(event, 'Content-Type', pbResponse.headers.get('content-type') || 'application/octet-stream')

  // Obtenemos el peso exacto para que el navegador muestre la barra de progreso
  const contentLength = pbResponse.headers.get('content-length')
  if (contentLength) {
    setHeader(event, 'Content-Length', contentLength)
  }

  // Retornamos directamente el "ReadableStream" del fetch original
  // Esto pasa el archivo bloque por bloque sin saturar la RAM de tu servidor
  return pbResponse.body
})
