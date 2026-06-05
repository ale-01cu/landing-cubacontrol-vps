<template>
  <UContainer class="py-10 max-w-7xl">
    <div
      class="h-[750px] shadow-2xl rounded-2xl border border-gray-200/80 bg-white overflow-hidden flex flex-row min-h-0 w-full"
    >
      <!-- Left: Inbox (Customer List) -->
      <div
        class="w-80 md:w-96 border-r border-gray-200 bg-gray-50 flex flex-col h-full overflow-hidden flex-shrink-0"
      >
        <!-- Header Left -->
        <div class="p-4 border-b border-gray-200 bg-white space-y-3 flex-shrink-0">
          <div class="flex items-center justify-between">
            <h2 class="font-bold text-xl text-gray-900 tracking-tight">
              Soporte Técnico
            </h2>
            <UBadge
              color="primary"
              variant="subtle"
              size="sm"
              class="rounded-full font-medium"
            >
              {{ filteredCustomers.length }} {{ filteredCustomers.length === 1 ? 'cliente' : 'clientes' }}
            </UBadge>
          </div>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar por nombre o email..."
            size="sm"
            color="neutral"
            class="w-full"
            :ui="{ rounded: 'rounded-lg' }"
          />
        </div>

        <!-- Customer List -->
        <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
          <div
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="p-4 cursor-pointer hover:bg-gray-100/70 active:bg-gray-200/50 transition-all duration-200 flex items-center justify-between"
            :class="{
              'bg-primary-50/70 hover:bg-primary-50/90 border-l-4 border-l-primary':
                selectedCustomer?.id === customer.id
            }"
            @click="selectCustomer(customer)"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <UAvatar
                :src="getAvatarUrl(customer)"
                :alt="getCustomerName(customer)"
                size="md"
                class="shadow-sm border border-gray-200/50"
              />
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-sm text-gray-800 truncate">
                  {{ getCustomerName(customer) }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ customer.email || customer.username || `ID: ${customer.id}` }}
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="filteredCustomers.length === 0"
            class="flex flex-col items-center justify-center p-8 text-center text-gray-500 mt-10"
          >
            <UIcon
              name="i-lucide-users"
              class="w-8 h-8 text-gray-400 mb-2"
            />
            <p class="text-sm font-medium">
              No se encontraron clientes
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Active Chat -->
      <div class="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <!-- Empty State -->
        <div
          v-if="!selectedCustomer"
          class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30"
        >
          <div class="size-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 shadow-inner">
            <UIcon
              name="i-lucide-message-square"
              class="w-10 h-10 text-primary"
            />
          </div>
          <h3 class="font-bold text-lg text-gray-800 mb-1">
            Centro de Mensajería
          </h3>
          <p class="text-sm text-gray-500 max-w-sm">
            Selecciona un cliente de la bandeja de entrada para iniciar la conversación y brindar soporte técnico.
          </p>
        </div>

        <template v-else>
          <!-- Chat Header -->
          <div
            class="p-4 border-b border-gray-200 bg-white shadow-sm z-10 flex items-center justify-between flex-shrink-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <UAvatar
                :src="getAvatarUrl(selectedCustomer)"
                :alt="getCustomerName(selectedCustomer)"
                size="md"
                class="shadow-sm border border-gray-200/50"
              />
              <div class="min-w-0">
                <h3 class="font-bold text-gray-900 truncate">
                  {{ getCustomerName(selectedCustomer) }}
                </h3>
                <p class="text-xs text-gray-500 truncate">
                  {{ selectedCustomer.email || selectedCustomer.username || 'ID: ' + selectedCustomer.id }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <UBadge
                color="success"
                variant="subtle"
                size="sm"
                class="rounded-full flex items-center gap-1"
              >
                <span class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Conectado
              </UBadge>
            </div>
          </div>

          <!-- Messages Area -->
          <div
            ref="adminChatBox"
            class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/40 min-h-0"
          >
            <template
              v-for="(msg, index) in messages"
              :key="msg.id"
            >
              <!-- Date Separator -->
              <div
                v-if="index === 0 || isDifferentDay(msg.created, messages[index - 1].created)"
                class="flex justify-center my-6"
              >
                <span class="px-4 py-1 bg-white border border-gray-200/50 rounded-full text-[11px] font-bold text-gray-500 shadow-sm uppercase tracking-wider">
                  {{ formatChatDate(msg.created) }}
                </span>
              </div>

              <div class="flex flex-col">
                <!-- Admin Message (Me) -->
                <div
                  v-if="msg.sender === user?.id"
                  class="self-end bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[75%] shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ msg.text }}
                  </p>
                  <span class="text-[10px] opacity-75 block text-right mt-1 font-medium">
                    {{ formatMessageTime(msg.created) }}
                  </span>
                </div>
                <!-- Customer Message -->
                <div
                  v-else
                  class="self-start bg-white border border-gray-200/80 text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[75%] shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  <p class="text-sm leading-relaxed whitespace-pre-wrap">
                    {{ msg.text }}
                  </p>
                  <span class="text-[10px] text-gray-400 block mt-1 font-medium">
                    {{ formatMessageTime(msg.created) }}
                  </span>
                </div>
              </div>
            </template>

            <div
              v-if="messages.length === 0"
              class="flex flex-col items-center justify-center p-12 text-center text-gray-400 h-full"
            >
              <UIcon
                name="i-lucide-message-circle-x"
                class="w-10 h-10 text-gray-300 mb-2"
              />
              <p class="text-sm">
                No hay mensajes previos con este cliente.
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Escribe un mensaje abajo para iniciar.
              </p>
            </div>
          </div>

          <!-- Input Form -->
          <div class="p-4 bg-white border-t border-gray-200/80 flex-shrink-0">
            <form
              class="flex gap-2 items-center"
              @submit.prevent="handleSend"
            >
              <UInput
                v-model="newMessage"
                placeholder="Escribe una respuesta para el cliente..."
                class="flex-1"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
                @keydown.enter.prevent="handleSend"
              />
              <UButton
                type="submit"
                icon="i-lucide-send"
                color="primary"
                size="lg"
                class="rounded-xl px-5 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                :disabled="!newMessage.trim()"
              />
            </form>
          </div>
        </template>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth-staff']
})
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { User } from '~/types/User'
import { formatChatDate, formatMessageTime, isDifferentDay } from '~/utils/date'

const { $pb } = useNuxtApp()
const { user } = useAuth()
const { messages, fetchMessages, subscribe, unsubscribe, sendMessage }
  = useChat()

const customers = ref<User[]>([])
const selectedCustomer = ref<User | null>(null)
const newMessage = ref('')
const searchQuery = ref('')
const adminChatBox = ref<HTMLElement | null>(null)

// Get fully resolved avatar url or undefined
const getAvatarUrl = (customer: User) => {
  if (customer.avatar && customer.collectionId) {
    return $pb.files.getUrl(customer as any, customer.avatar)
  }
  return undefined
}

// Formatted full name of customer or email/username if blank
const getCustomerName = (customer: User) => {
  if (!customer) return 'Cliente Desconocido'
  const name = `${customer.first_name || ''} ${customer.last_name || ''}`.trim()
  if (name) return name
  if (customer.email) return customer.email
  if (customer.username) return customer.username
  return `Cliente #${customer.id ? customer.id.slice(-5) : 'sin-id'}`
}

// 1. Fetch unique users from messages collection
const fetchInboxUsers = async () => {
  try {
    // Traemos los últimos mensajes para identificar quién ha escrito
    const res = await $pb.collection('messages').getList(1, 200, {
      sort: '-created',
      expand: 'customer'
    })

    // Extraemos los clientes únicos usando un Map para evitar duplicados
    const uniqueCustomersMap = new Map()

    res.items.forEach((msg: any) => {
      const customer = msg.expand?.customer
      if (customer && !uniqueCustomersMap.has(customer.id)) {
        uniqueCustomersMap.set(customer.id, customer)
      }
    })

    customers.value = Array.from(uniqueCustomersMap.values()) as User[]
  } catch (e) {
    console.error('Error fetching inbox users:', e)
  }
}

const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) return customers.value
  const q = searchQuery.value.toLowerCase()
  return customers.value.filter((c) => {
    const name = getCustomerName(c).toLowerCase()
    const email = (c.email || '').toLowerCase()
    const username = (c.username || '').toLowerCase()
    return name.includes(q) || email.includes(q) || username.includes(q)
  })
})

const scrollToBottom = () => {
  nextTick(() => {
    if (adminChatBox.value)
      adminChatBox.value.scrollTop = adminChatBox.value.scrollHeight
  })
}

const selectCustomer = async (customer: User) => {
  if (selectedCustomer.value?.id === customer.id) return

  unsubscribe() // Stop listening to previous customer
  selectedCustomer.value = customer

  await fetchMessages(customer.id)
  scrollToBottom()
  subscribe(customer.id, scrollToBottom)
}

const handleSend = async () => {
  if (!newMessage.value.trim() || !selectedCustomer.value) return
  await sendMessage(newMessage.value, selectedCustomer.value.id)
  newMessage.value = ''
  scrollToBottom()
}

onMounted(() => {
  fetchInboxUsers()
})

onUnmounted(() => unsubscribe())
</script>
