// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  content: {
    experimental: { nativeSqlite: true }
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-vuefire',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    preference: 'light', // default theme
    fallback: 'light',   // fallback theme if not stored
    classSuffix: '',     // don’t add “-light” / “-dark” to class
    storageKey: 'nuxt-color-mode' // localStorage key
  },
  css: ['~/assets/css/main.css'],
  vuefire: {
    config: {
      apiKey: "AIzaSyDfOZfLvg0Mxq7MtySVxYRlD2tJV2YqJEs",
      authDomain: "mj-courses.firebaseapp.com",
      projectId: "mj-courses",
      storageBucket: "mj-courses.firebasestorage.app",
      messagingSenderId: "37501576767",
      appId: "1:37501576767:web:adb37826cf091d89f7fa8a",
      measurementId: "G-BNDDHFND89"
    },
    auth: {
      enabled: true
    },
  }
})