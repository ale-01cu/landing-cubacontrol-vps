<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <UContainer>
      <div class="text-center space-y-6">
        <!-- Hero Title -->
        <h1 class="text-4xl font-bold tracking-tight text-foreground">
          {{ title }}
        </h1>

        <!-- Subtitle -->
        <p class="text-lg text-muted">
          {{ subtitle }}
        </p>

        <!-- Loader -->
        <div class="flex flex-col items-center gap-3 pt-4">
          <UProgress v-model="value" />

          <span class="text-sm text-muted">
            {{ loadingText }}
          </span>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
  loadingText?: string
}>(), {
  title: 'Cargando página',
  subtitle: 'Verificando sesión',
  loadingText: 'Por favor, espere...'
})

const value = ref(null)
</script>
