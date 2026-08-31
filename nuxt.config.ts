// https://nuxt.com/docs/api/configuration/nuxt-config
const defaultLocale = 'es'
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/i18n'
  ],

  ssr: true,

  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
        prefix: 'og: http://ogp.me/ns#'
      }
    }
  },

  css: ['~/assets/css/main.css', 'aos/dist/aos.css'],
  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090',
      siteUrl: process.env.SITE_URL || 'https://cubacontrol-sa.web.app'
    }
  },
  routeRules: {
    '/': { isr: 60 },
    '/en': { isr: 60 }
  },
  compatibilityDate: '2025-01-15',
  nitro: {
    prerender: {
      routes: ['/']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    defaultLocale
  }
})
