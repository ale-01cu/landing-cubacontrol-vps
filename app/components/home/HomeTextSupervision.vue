<script setup lang="ts">
const { t } = useI18n()
const { getText, supervisionImageUrl } = useHomeContent()

const supervisionTitle = computed(() => getText('supervision.title', t('landing.supervision.title')))
const supervisionDescription = computed(() => getText('supervision.description', t('landing.supervision.description')))
const supervisionDescription1 = computed(() => getText('supervision.description1', t('landing.supervision.description1')))
const supervisionNote = computed(() => getText('supervision.note', t('landing.supervision.note')))
const supervisionObjectiveTitle = computed(() => getText('supervision.objective.title', t('landing.supervision.objective.title')))
const supervisionObjectiveDescription = computed(() => getText('supervision.objective.description', t('landing.supervision.objective.description')))

const displayImage = computed(() => supervisionImageUrl.value || '/importancia-supervision.jpg')
</script>

<template>
  <UPageSection
    class="bg-primary/5 rounded-3xl"
    orientation="horizontal"
  >
    <!-- LEFT CONTENT -->
    <div class="space-y-8 max-w-3xl">
      <!-- TITLE -->
      <div>
        <h2 class="text-3xl sm:text-4xl font-semibold text-gray-900">
          {{ supervisionTitle }}
        </h2>
      </div>
      <div class="space-y-3 text-justify">
        <p class="text-base leading-relaxed text-gray-600">
          {{ supervisionDescription }}
        </p>

        <p class="text-base leading-relaxed text-gray-600">
          {{ supervisionDescription1 }}
        </p>
      </div>

      <!-- DIFFERENCE BLOCK -->
      <UCard class="bg-white/80 backdrop-blur-sm border border-gray-200">
        <div class="flex gap-4">
          <UIcon
            name="i-lucide-scale"
            class="w-6 h-6 text-primary shrink-0 mt-1"
          />

          <p class="text-gray-700 leading-relaxed text-justify">
            {{ supervisionNote }}
          </p>
        </div>
      </UCard>

      <!-- OBJECTIVE -->
      <div class="space-y-4 pt-2">
        <h3 class="text-2xl font-semibold text-gray-900">
          {{ supervisionObjectiveTitle }}
        </h3>

        <div class="flex gap-4 text-justify">
          <UIcon
            name="i-lucide-search-check"
            class="w-6 h-6 text-primary shrink-0 mt-1"
          />

          <p class="text-gray-600 leading-relaxed">
            {{ supervisionObjectiveDescription }}
          </p>
        </div>
      </div>
    </div>

    <!-- RIGHT VISUAL AREA -->
    <div class="relative inline-block pl-2 pt-2 sm:pl-4 sm:pt-4">
      <!-- BLOQUE DECORATIVO -->
      <div
        class="absolute inset-0 right-2 bottom-2 sm:right-4 sm:bottom-4
           bg-red-100
           rounded-2xl
           -z-10"
      />

      <!-- IMAGEN -->
      <NuxtImg
        data-aos="fade-left"
        :src="displayImage"
        alt="Supervisión comercial"
        class="w-full h-[320px] object-cover rounded-2xl relative z-10"
      />
    </div>
  </UPageSection>
</template>
