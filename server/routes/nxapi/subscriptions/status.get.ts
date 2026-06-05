export default defineEventHandler(async (event) => {
  const pb = getAuthenticatedPb(event)
  const userId = pb.authStore.record!.id as string

  const subscription = await pb
    .collection('subscriptions')
    .getFirstListItem(`user="${userId}" && status="active"`)
    .catch(() => null)

  return {
    subscribed: !!subscription
  }
})
