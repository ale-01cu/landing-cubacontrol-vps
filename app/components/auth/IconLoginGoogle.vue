<script setup lang="ts">
const { registerWithGoogle, loading } = useAuth()
</script>

<template>
  <div class="flex justify-center items-center my-5">
    <div
      class="w-10 h-10 transition-transform duration-200 ease-in-out cursor-pointer"
      :class="[loading ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-110']"
    >
      <svg
        viewBox="0 0 48 48"
        @click="!loading && registerWithGoogle()"
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.73 2.36 30.26 0 24 0 14.64 0 6.57 5.4 2.73 13.27l8.03 6.24C12.7 13.1 17.87 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.5c0-1.63-.15-3.2-.42-4.73H24v9h12.4c-.53 2.85-2.13 5.27-4.54 6.9l7.03 5.46C43.98 36.2 46.1 30.8 46.1 24.5z"
        />
        <path
          fill="#FBBC05"
          d="M10.76 28.5A14.5 14.5 0 019.5 24c0-1.56.27-3.06.76-4.5l-8.03-6.24A23.9 23.9 0 000 24c0 3.87.93 7.52 2.58 10.74l8.18-6.24z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.26 0 11.52-2.06 15.36-5.6l-7.03-5.46c-2 1.34-4.57 2.14-8.33 2.14-6.13 0-11.3-3.6-13.24-8.73l-8.18 6.24C6.57 42.6 14.64 48 24 48z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>

</style>
