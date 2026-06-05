<template>
  <div
    class="fixed bottom-6 right-6 z-50"
  >
    <!-- VISTA PARA STAFF: Acceso directo al Panel -->
    <div
      v-if="isStaff"
      class="flex justify-end"
    >
      <UButton
        to="/admin/support"
        icon="i-lucide-headset"
        size="xl"
        color="primary"
        class="rounded-full shadow-xl hover:scale-105 transition-transform duration-200"
        :title="t('admin.support')"
      />
    </div>

    <!-- VISTA PARA CLIENTES/INVITADOS -->
    <template v-else>
      <!-- Ventana del Chat -->
      <div
        v-if="isOpen"
        class="w-80 sm:w-96 h-[500px] flex flex-col shadow-2xl mb-4 border border-gray-200 rounded-2xl overflow-hidden bg-white"
      >
        <!-- Cabecera -->
        <div class="flex justify-between items-center px-4 py-3 bg-primary-50 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-2">
            <UAvatar
              icon="i-lucide-headset"
              size="sm"
              class="bg-primary text-white"
            />
            <span class="font-semibold text-gray-800">{{ t('chat.supportTitle') }}</span>
          </div>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="isOpen = false"
          />
        </div>

        <!-- VISTA: USUARIO NO LOGUEADO -->
        <div
          v-if="!isAuthenticated"
          class="flex flex-col items-center justify-center flex-1 p-6 text-center bg-gray-50/50 min-h-0"
        >
          <div class="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <UIcon
              name="i-lucide-lock"
              class="w-8 h-8 text-primary"
            />
          </div>
          <h3 class="font-semibold text-lg text-gray-800 mb-2">
            {{ t('chat.loginRequiredTitle') }}
          </h3>
          <p class="text-sm text-gray-600 mb-6 leading-relaxed">
            {{ t('chat.loginRequired') }}
          </p>
          <UButton
            to="/login"
            color="primary"
            size="lg"
            icon="i-lucide-log-in"
            class="rounded-xl w-full justify-center shadow-md"
            @click="isOpen = false"
          >
            {{ t('chat.loginButton') }}
          </UButton>
        </div>

        <!-- VISTA: USUARIO LOGUEADO -->
        <template v-else>
          <!-- Lista de mensajes -->
          <div
            ref="chatBox"
            class="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 bg-gray-50/50 min-h-0"
          >
            <template
              v-for="(msg, index) in messages"
              :key="msg.id"
            >
              <!-- Date Separator -->
              <div
                v-if="index === 0 || isDifferentDay(msg.created, messages[index - 1].created)"
                class="flex justify-center my-4"
              >
                <span class="px-3 py-1 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-400 shadow-sm uppercase">
                  {{ formatChatDate(msg.created) }}
                </span>
              </div>

              <div class="flex flex-col">
                <!-- Mensaje del Cliente (Yo) -->
                <div
                  v-if="msg.sender === user?.id"
                  class="self-end bg-primary text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm"
                >
                  <p class="text-sm">
                    {{ msg.text }}
                  </p>
                  <span class="text-[9px] opacity-70 block text-right mt-1 font-medium">
                    {{ formatMessageTime(msg.created) }}
                  </span>
                </div>
                <!-- Mensaje del Admin (Soporte) -->
                <div
                  v-else
                  class="self-start bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm"
                >
                  <p class="text-[10px] text-gray-400 mb-1 font-medium">
                    {{ t('chat.supportAgent') }}
                  </p>
                  <p class="text-sm text-gray-800">
                    {{ msg.text }}
                  </p>
                  <span class="text-[9px] text-gray-400 block mt-1 font-medium">
                    {{ formatMessageTime(msg.created) }}
                  </span>
                </div>
              </div>
            </template>
          </div>
          <!-- Input para enviar -->
          <div class="p-3 border-t border-gray-100 bg-white flex-shrink-0">
            <form
              class="flex gap-2 items-center"
              @submit.prevent="handleSend"
            >
              <UInput
                v-model="newMessage"
                :placeholder="t('chat.placeholder')"
                class="flex-1"
                @keydown.enter.prevent="handleSend"
              />
              <UButton
                type="submit"
                icon="i-lucide-send"
                color="primary"
                class="rounded-full"
                :disabled="!newMessage.trim()"
              />
            </form>
          </div>
        </template>
      </div>

      <!-- Botón Flotante (Solo Clientes) -->
      <div class="flex justify-end">
        <UButton
          v-if="!isOpen"
          icon="i-lucide-message-circle"
          size="xl"
          color="primary"
          class="rounded-full shadow-xl hover:scale-105 transition-transform duration-200"
          @click="isOpen = true"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, nextTick, watch } from 'vue'
import { formatChatDate, formatMessageTime, isDifferentDay } from '~/utils/date'

const { t } = useI18n()
// Extraemos isAuthenticated y isStaff
const { user, isAuthenticated, isStaff } = useAuth()
const { messages, fetchMessages, subscribe, unsubscribe, sendMessage } = useChat()

console.log({ isauthed: isAuthenticated.value })

const isOpen = ref(false)
const newMessage = ref('')
const chatBox = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight
  })
}

// Observamos si se abre la ventana PARA CONECTARNOS solo si está logueado
watch(isOpen, async (val) => {
  if (val && isAuthenticated.value && user.value) {
    await fetchMessages(user.value.id)
    scrollToBottom()
    subscribe(user.value.id, scrollToBottom)
  } else {
    unsubscribe() // Nos desconectamos si se cierra la ventana o no está logueado
  }
})

const handleSend = async () => {
  if (!newMessage.value.trim() || !user.value) return
  await sendMessage(newMessage.value, user.value.id)
  newMessage.value = ''
  scrollToBottom()
}

// Evitar memory leaks al cambiar de página
onUnmounted(() => unsubscribe())
</script>
