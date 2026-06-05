<script setup lang="ts">
type HomeSiguenos = {
  size: 'sm' | 'xl'
}
defineProps<HomeSiguenos>()
</script>

<template>
  <div class="flex flex-row items-center gap-0">
    <UButton
      icon="i-simple-icons-whatsapp"
      class="text-green-700 "
      :size="size"
      to="https://whatsapp.com/channel/0029VbAfrDiAu3aW7NvTLi3N"
      target="_blank"
      variant="ghost"
      aria-label="whatsapp"
    />
    <UButton
      icon="i-simple-icons-facebook"
      class="text-blue-700"
      to="https://www.facebook.com/siscubacontrolsa"
      :size="size"
      variant="ghost"
      target="_blank"
      aria-label="facebook"
    />
    <UButton
      icon="i-simple-icons-instagram"
      :size="size"
      variant="ghost"
      target="_blank"
      aria-label="GitHub"
    />
    <UButton
      class="text-black"
      icon="i-simple-icons-x"
      to="https://x.com/Supervisin35612"
      :size="size"
      variant="ghost"
      target="_blank"
      aria-label="X"
    />
  </div>
</template>

<style scoped>

</style>
