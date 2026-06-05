export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)
  const userId = pb.authStore.record!.id as string

  // Verificar si ya tiene una suscripción activa
  const existing = await pb
    .collection('subscriptions')
    .getFirstListItem(`user="${userId}" && status="active"`)
    .catch(() => null)

  if (existing) {
    return {
      subscribed: true,
      message: 'Ya estás suscrito'
    }
  }

  // Crear nueva suscripción activa
  await pb.collection('subscriptions').create({
    user: userId,
    status: 'active',
    start_date: new Date().toISOString()
  })

  return {
    subscribed: true,
    message: 'Suscripción exitosa'
  }
})
