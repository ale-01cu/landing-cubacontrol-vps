<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { useMediaQuery } from '@vueuse/core'

export interface IBanner {
  headline?: string | null
  headlineColor?: string | null
  title?: string | null
  orientation?: 'horizontal' | 'vertical' | null
  description?: string | null
  background?: string | null
  titleColor?: string | null
  descriptionColor?: string | null
  gradientColor?: string | null
  links?: ButtonProps[] | null
}

defineProps<{
  banners: IBanner[]
}>()

const isMobile = useMediaQuery('(max-width: 639px)')

const ready = ref<boolean>(false)
onMounted(() => {
  ready.value = true
})

const logoLoaded = ref<boolean>(false)
const onLogoLoad = () => {
  logoLoaded.value = true
}
</script>

<template>
  <UCarousel
    v-slot="{ item }"
    class="py-0 min-h-[93svh] **:select-none [ -webkit-tap-highlight-color:transparent ] touch-pan-y"
    :items="banners"
    loop
    dots
    :draggable="isMobile"
    :autoplay="{ delay: 5000 }"
    :ui="{ item: 'basis-full' }"
  >
    <!-- HERO COMO SLIDE -->
    <UPageHero
      class="flex items-center justify-center sm:justify-start z-20 min-h-[93svh]"
      :orientation="item.orientation || 'horizontal' "
      :links="item.links || []"
      :ui="{
        container: 'pt-0'
      }"
    >
      <!-- BACKGROUND IMAGE CAROUSEL -->
      <div class="pointer-events-none absolute inset-0 -z-10 lg:block min-h-[93svh]">
        <div
          class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 min-h-[93svh]"
          :style="{ backgroundImage: `url(${item.background || ''})` }"
        />
        <!-- GRADIENT OVERLAY (sobre el carrusel) -->
        <div
          class="absolute inset-0 bg-linear-to-r
           sm:bg-linear-to-r min-h-[93svh]"
          :class="[item.gradientColor || '']"
        />
        <!-- Imagen decorativa inferior derecha -->
        <img
          src="/marca-pais.png"
          alt=""
          class="absolute bottom-3 right-3 w-24 md:w-32 lg:w-40 opacity-90 bg-white rounded-sm"
        >
      </div>
      <template #headline>
        <div class="flex flex-row justify-start items-center">
          <div class="inline-block relative">
            <div
              class="absolute size-24 z-10 bg-white/90 backdrop-blur-sm shadow-lg rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
              :class="logoLoaded ? 'opacity-100' : 'opacity-0'"
            />
            <NuxtImg
              class="h-30 w-auto shrink-0 relative z-50"
              src="/logo.png"
              alt="S.I.S CUBACONTROL S.A"
              @load="onLogoLoad"
            />
          </div>
        </div>
        <span
          class="text-3xl sm:text-4xl leading-tight"
          :class="[`${item.headlineColor}`]"
          style="font-family: 'English 111 Vivace BT V2',serif;"
          data-aos="fade-top"
          data-aos-delay="400"
        >
          {{ item.headline }}
        </span>
      </template>
      <template #title>
        <h1
          v-if="ready"
          data-aos="fade-right"
          data-aos-delay="400"
          class="uppercase"
          :class="[`${item.titleColor || 'primary'}`]"
        >
          {{ item.title }}
        </h1>
      </template>

      <template #description>
        <p
          v-if="ready"
          class="leading-relaxed"
          :class="[`${item.descriptionColor}`, `italic`]"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          {{ item.description }}
        </p>
      </template>
    </UPageHero>
  </UCarousel>
</template>

<style scoped>
</style>
