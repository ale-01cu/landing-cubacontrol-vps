<script setup lang="ts">
const { tm, t, rt } = useI18n()

// Coordenadas aproximadas Nuevo Vedado (CUBACONTROL)
const mapSrc = 'https://www.openstreetmap.org/export/embed.html?bbox=-82.404159%2C23.110304%2C-82.394159%2C23.120304&layer=mapnik&marker=23.115304%2C-82.399159'

interface PhonesItem {
  label: string
  value: string
}
interface ContactsPhones {
  phones: PhonesItem[]
}

const phones = computed(
  () => tm('about-us.contact.office') as ContactsPhones
)
const readyPhones = computed(() =>
  phones.value.phones.map(item => ({
    label: rt(item.label),
    value: rt(item.value)
  }))
)
</script>

<template>
  <UContainer>
    <div class="grid lg:grid-cols-2 gap-10 items-stretch">
      <!-- INFO CARD -->
      <div class="flex flex-col gap-3">
        <div class="flex gap-4 items-start">
          <UIcon
            name="i-lucide-map-pin"
            class="text-primary text-md mt-1 shrink-0"
          />
          <div>
            <p class="font-semibold">
              {{ t('about-us.contact.office.address.label') }}
            </p>
            <p class="text-neutral-600 text-sm max-w-3/5">
              {{ t('about-us.contact.office.address.value') }}
            </p>
          </div>
        </div>
        <!-- INFO EMAIl -->
        <div class="flex gap-4 items-start">
          <UIcon
            name="i-lucide-mail"
            class="text-primary text-md mt-1 shrink-0"
          />
          <div>
            <p class="font-semibold">
              {{ t('about-us.contact.office.email.label') }}
            </p>
            <p class="text-neutral-600 text-sm">
              {{ t('about-us.contact.office.email.value') }}
            </p>
          </div>
        </div>
        <!-- Schedule -->
        <div class="flex gap-4 items-start">
          <UIcon
            name="i-lucide-clock"
            class="text-primary text-md mt-1 shrink-0"
          />
          <div>
            <p class="font-semibold">
              {{ t('about-us.contact.office.schedule.label') }}
            </p>
            <p class="text-neutral-600 text-sm">
              {{ t('about-us.contact.office.schedule.value') }}
            </p>
          </div>
        </div>
        <div class="flex gap-4 items-start">
          <UIcon
            name="i-lucide-phone"
            class="text-primary text-md mt-1 shrink-0"
          />
          <div class="flex flex-col gap-2">
            <p class="font-semibold">
              {{ t('about-us.contact.office.fixphone.label') }}
            </p>
            <a
              :href="`tel:${t('about-us.contact.office.fixphone.value')}`"
              class="text-primary hover:underline text-sm"
            >
              {{ t('about-us.contact.office.fixphone.value') }}
            </a>
          </div>
        </div>
        <!-- Phone -->
        <div class="flex gap-4 items-start">
          <UIcon
            name="i-lucide-smartphone"
            class="text-primary text-md mt-1 shrink-0"
          />
          <div class="flex flex-col gap-2">
            <div
              v-for="(item, index) of readyPhones"
              :key="index"
            >
              <p class="font-semibold">
                {{ item.label }}
              </p>
              <a
                :href="`tel:${item.value}`"
                class="text-primary hover:underline text-sm"
              >
                {{ item.value }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- MAP -->
      <UCard class="overflow-hidden p-0">
        <iframe
          :src="mapSrc"
          class="w-full h-[420px] border-0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        />
      </UCard>
    </div>
  </UContainer>
</template>
