<script setup lang="ts">
definePageMeta({
  middleware: 'auth-required'
})

const { t, locale } = useI18n()
const { $pb } = useNuxtApp()
const { user, refresh } = useAuth()
const toast = useToast()

const userAvatar = computed(() => {
  if (!user.value?.avatar) return undefined
  return `${$pb.baseUrl}/api/files/${user.value.collectionId}/${user.value.id}/${user.value.avatar}`
})

const displayName = computed(() => {
  const first = user.value?.first_name || ''
  const last = user.value?.last_name || ''
  return [first, last].filter(Boolean).join(' ') || user.value?.username || user.value?.email || ''
})

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const memberSince = computed(() => formatDate(user.value?.created))
const lastUpdated = computed(() => formatDate(user.value?.updated))

const profileForm = reactive({
  first_name: user.value?.first_name || '',
  last_name: user.value?.last_name || '',
  username: user.value?.username || ''
})

const saving = ref(false)

async function saveProfile() {
  saving.value = true
  try {
    await $pb.collection('users').update(user.value!.id, {
      first_name: profileForm.first_name,
      last_name: profileForm.last_name,
      username: profileForm.username
    })
    await refresh()
    toast.add({ title: t('profile.edit.success'), color: 'success' })
  } catch {
    toast.add({ title: t('profile.edit.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const changingPassword = ref(false)

async function changePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    toast.add({ title: t('auth.register.errors.passwordsDoNotMatch'), color: 'error' })
    return
  }
  changingPassword.value = true
  try {
    await $pb.collection('users').update(user.value!.id, {
      oldPassword: passwordForm.current,
      password: passwordForm.new,
      passwordConfirm: passwordForm.confirm
    })
    toast.add({ title: t('profile.password.success'), color: 'success' })
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } catch {
    toast.add({ title: t('profile.password.error'), color: 'error' })
  } finally {
    changingPassword.value = false
  }
}

const fileInputRef = ref<HTMLInputElement>()

function triggerFileInput() {
  fileInputRef.value?.click()
}

async function onAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  try {
    await $pb.collection('users').update(user.value!.id, formData)
    await refresh()
    toast.add({ title: t('profile.avatar.success'), color: 'success' })
  } catch {
    toast.add({ title: t('profile.avatar.error'), color: 'error' })
  } finally {
    input.value = ''
  }
}
</script>

<template>
  <UPage>
    <UContainer class="py-12 space-y-10">
      <UPageSection
        :title="t('profile.title')"
        :description="t('profile.description')"
      />

      <div class="max-w-2xl mx-auto space-y-8">
        <UCard>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div class="relative group" @click="triggerFileInput">
              <UAvatar
                :src="userAvatar"
                :alt="displayName"
                size="3xl"
                class="cursor-pointer"
              />
              <div
                class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
              >
                <UIcon name="i-lucide-camera" class="text-white size-6" />
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onAvatarChange"
              />
            </div>
            <div class="text-center sm:text-left flex-1">
              <h2 class="text-2xl font-bold">
                {{ displayName }}
              </h2>
              <p class="text-muted">
                {{ user?.email }}
              </p>
              <div class="flex gap-2 mt-2 justify-center sm:justify-start">
                <UBadge
                  v-if="user?.verified"
                  color="success"
                  variant="soft"
                  size="sm"
                >
                  {{ t('profile.verified') }}
                </UBadge>
                <UBadge
                  v-else
                  color="warning"
                  variant="soft"
                  size="sm"
                >
                  {{ t('profile.unverified') }}
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ t('profile.edit.title') }}</h3>
            <p class="text-sm text-muted">{{ t('profile.edit.description') }}</p>
          </template>

          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField :label="t('profile.edit.firstName')">
                <UInput
                  v-model="profileForm.first_name"
                  :placeholder="t('profile.edit.firstNamePlaceholder')"
                />
              </UFormField>
              <UFormField :label="t('profile.edit.lastName')">
                <UInput
                  v-model="profileForm.last_name"
                  :placeholder="t('profile.edit.lastNamePlaceholder')"
                />
              </UFormField>
            </div>
            <UFormField :label="t('profile.edit.username')">
              <UInput
                v-model="profileForm.username"
                :placeholder="t('profile.edit.usernamePlaceholder')"
              />
            </UFormField>
            <div class="flex justify-end pt-2">
              <UButton type="submit" :loading="saving">
                {{ t('profile.edit.submit') }}
              </UButton>
            </div>
          </form>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ t('profile.password.title') }}</h3>
            <p class="text-sm text-muted">{{ t('profile.password.description') }}</p>
          </template>

          <form @submit.prevent="changePassword" class="space-y-4">
            <UFormField :label="t('profile.password.current')">
              <UInput
                v-model="passwordForm.current"
                type="password"
                :placeholder="t('profile.password.currentPlaceholder')"
              />
            </UFormField>
            <UFormField :label="t('profile.password.new')">
              <UInput
                v-model="passwordForm.new"
                type="password"
                :placeholder="t('profile.password.newPlaceholder')"
              />
            </UFormField>
            <UFormField :label="t('profile.password.confirm')">
              <UInput
                v-model="passwordForm.confirm"
                type="password"
                :placeholder="t('profile.password.confirmPlaceholder')"
              />
            </UFormField>
            <div class="flex justify-end pt-2">
              <UButton type="submit" :loading="changingPassword">
                {{ t('profile.password.submit') }}
              </UButton>
            </div>
          </form>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ t('profile.info.title') }}</h3>
          </template>

          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-muted">{{ t('profile.info.email') }}</dt>
              <dd class="font-medium truncate max-w-full">{{ user?.email || '—' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-muted">{{ t('profile.info.group') }}</dt>
              <dd class="font-medium">{{ user?.group || '—' }}</dd>
            </div>
            <div>
              <dt class="text-sm text-muted">{{ t('profile.info.created') }}</dt>
              <dd class="font-medium">{{ memberSince }}</dd>
            </div>
            <div>
              <dt class="text-sm text-muted">{{ t('profile.info.updated') }}</dt>
              <dd class="font-medium">{{ lastUpdated }}</dd>
            </div>
          </dl>
        </UCard>
      </div>
    </UContainer>
  </UPage>
</template>
