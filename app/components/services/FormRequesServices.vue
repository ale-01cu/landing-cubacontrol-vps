<script setup lang="ts">
const props = defineProps({
  serviceName: {
    type: String,
    required: true
  }
})

const form = reactive({
  email: '',
  service: '',
  comment: ''
})
watch(
  () => props.serviceName,
  (newValue) => {
    form.service = newValue
  },
  { immediate: true }
)

const { t } = useI18n()

const loadingComment = ref(false)
const successMessage = ref('')
const validationErrors = ref<string[]>([])

// Validación mejorada
const isFormValid = computed(() => {
  return form.email && form.comment && validateEmail(form.email) && form.comment.length <= 500
})

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validateForm = () => {
  validationErrors.value = []

  if (!form.email) {
    validationErrors.value.push('El correo electrónico es requerido')
  } else if (!validateEmail(form.email)) {
    validationErrors.value.push('El correo electrónico no es válido')
  }

  if (!form.comment) {
    validationErrors.value.push('El comentario es requerido')
  } else if (form.comment.length > 500) {
    validationErrors.value.push('El comentario no puede exceder los 500 caracteres')
  }

  if (!form.service) {
    validationErrors.value.push('El servicio es requerido')
  } else if (form.comment.length > 500) {
    validationErrors.value.push('El comentario no puede exceder los 500 caracteres')
  }

  return validationErrors.value.length === 0
}

const submitComment = async () => {
  if (!validateForm()) return

  loadingComment.value = true
  validationErrors.value = []

  try {
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1500))

    successMessage.value = t('form.service.request.success-message')
    form.email = ''
    form.comment = ''

    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    validationErrors.value.push(t('form.service.request.error-message'))
  } finally {
    loadingComment.value = false
  }
}

const resetForm = () => {
  form.email = ''
  form.comment = ''
  validationErrors.value = []
}

// Atajo de teclado Ctrl+Enter
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter' && isFormValid.value && !loadingComment.value) {
    submitComment()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <UCard
    class="w-full mx-auto overflow-hidden"
    variant="outline"
    :ui="{
      root: 'border-0 ring-0 shadow-none'
    }"
  >
    <!-- FORM  -->
    <template #default>
      <form
        class="w-full space-y-8"
        @submit.prevent="submitComment"
      >
        <!-- EMAIL  -->
        <UFormField
          :label="t('form.input.email.label')"
          name="email"
          required
        >
          <div class="flex flex-col gap-1.5">
            <UInput
              v-model="form.email"
              type="email"
              size="lg"
              icon="i-heroicons-envelope"
              :placeholder="t('form.input.email.placeholder')"
              autocomplete="email"
              :ui="{
                base: 'pl-10'
              }"
              class="w-12/12 sm:w-8/12 transition-all duration-200 hover:shadow-md focus-within:shadow-lg"
            />
            <div class="flex items-center gap-1 text-gray-500">
              <UIcon
                name="i-lucide-shield-check"
                class="w-3.5 h-3.5 text-primary-600"
              />
              <span>{{ t('form.service.request.infoEmail') }}</span>
            </div>
          </div>
        </UFormField>

        <!-- Services  -->
        <UFormField
          :label="t('form.service.request.input.service.label')"
          name="email"
          required
        >
          <div class="flex flex-col gap-1.5">
            <UInput
              v-model="form.service"
              size="lg"
              icon="i-lucide-briefcase"
              disabled
              class="w-12/12 sm:w-8/12 transition-all duration-200 hover:shadow-md focus-within:shadow-lg"
              :ui="{
                base: 'pl-10'
              }"
            />
          </div>
        </UFormField>

        <!-- COMMENT -->
        <UFormField
          class="w-full"
          :label="t('form.service.request.input.text.label')"
          name="comment"
          required
          :ui="{
          }"
        >
          <div class="flex flex-col gap-1.5">
            <UTextarea
              v-model="form.comment"
              :rows="5"
              size="lg"
              autoresize
              :placeholder="t('form.service.request.input.text.placeholder')"
              class="w-full resize-none transition-all duration-200 hover:shadow-md focus-within:shadow-lg rounded-xl"
              :ui="{
                base: 'rounded-xl'
              }"
            />

            <!-- Contador de caracteres -->
            <div class="flex justify-end mt-2">
              <span
                class="text-xs font-medium px-2 py-1 rounded-full"
              >
                {{ form.comment?.length || 0 }}/500
              </span>
            </div>
          </div>
        </UFormField>

        <!-- FOOTER  -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <!-- SUCCESS MESSAGE ANIMADO -->
          <Transition
            enter-active-class="transform transition duration-300 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transform transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-2 opacity-0"
          >
            <div
              v-if="successMessage"
              class="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2.5 rounded-xl border border-green-200 dark:border-green-800"
            >
              <UIcon
                name="i-heroicons-check-circle-16-solid"
                class="w-5 h-5"
              />
              <span>{{ successMessage }}</span>
            </div>
          </Transition>

          <!-- BOTÓN  -->
          <div class="flex flex-row justify-between gap-3 sm:ml-auto">
            <UButton
              type="button"
              size="lg"
              color="neutral"
              variant="outline"
              class="rounded-xl px-6"
              @click="resetForm"
            >
              {{ t('form.button.clean') }}
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="loadingComment"
              :disabled="!isFormValid"
              icon="i-heroicons-paper-airplane"
              class="rounded-xl px-8 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span class="flex items-center gap-2">
                {{ t('form.button.send') }}
                <span class="text-xs hidden lg:block  bg-white/20 px-2 py-0.5 rounded-full">
                  Ctrl+Enter
                </span>
              </span>
            </UButton>
          </div>
        </div>

        <!-- VALIDATION SUMMARY -->
        <Transition name="fade">
          <div
            v-if="validationErrors.length"
            class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4"
          >
            <div class="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-2">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-5 h-5"
              />
              <span>Por favor corrige los siguientes errores:</span>
            </div>
            <ul class="list-disc list-inside space-y-1">
              <li
                v-for="(error, index) in validationErrors"
                :key="index"
                class="text-sm text-red-600 dark:text-red-400"
              >
                {{ error }}
              </li>
            </ul>
          </div>
        </Transition>
      </form>
    </template>
  </UCard>
</template>

<style scoped>

</style>
