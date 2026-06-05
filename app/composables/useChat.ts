import type { User } from '~/types/User'

export interface ChatMessage {
  id: string
  text: string
  customer: string
  sender: string
  created: string
  expand?: {
    sender?: User
    customer?: User
  }
}

export const useChat = () => {
  const { $pb } = useNuxtApp()
  const { user, isStaff } = useAuth()

  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)

  // Fetch messages for a specific customer
  const fetchMessages = async (customerId: string) => {
    loading.value = true
    try {
      const records = await $pb.collection('messages').getList(1, 100, {
        filter: `customer = "${customerId}"`,
        sort: 'created',
        expand: 'sender,customer'
      })
      messages.value = records.items as unknown as ChatMessage[]
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      loading.value = false
    }
  }

  // Subscribe to real-time updates
  const subscribe = (customerId: string, onNewMessage?: () => void) => {
    $pb.collection('messages').subscribe('*', async (e) => {
      if (e.action === 'create' && e.record.customer === customerId) {
        // Fetch expanded data (to get avatar/name)
        const record = await $pb.collection('messages').getOne(e.record.id, { expand: 'sender,customer' })
        messages.value.push(record as unknown as ChatMessage)
        if (onNewMessage) onNewMessage()
      }
    }, { filter: `customer = "${customerId}"` })
  }

  const unsubscribe = () => {
    $pb.collection('messages').unsubscribe('*')
  }

  // Send a message
  const sendMessage = async (text: string, customerId: string) => {
    if (!text.trim() || !user.value) return
    try {
      await $pb.collection('messages').create({
        text,
        customer: customerId,
        sender: user.value.id
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return {
    messages,
    loading,
    fetchMessages,
    subscribe,
    unsubscribe,
    sendMessage
  }
}
