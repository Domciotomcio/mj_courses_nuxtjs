// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  content: {
    experimental: { nativeSqlite: true }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-vuefire',
    '@nuxtjs/color-mode',
    '@unlok-co/nuxt-stripe',
    '@nuxt/content',
    'nuxt-mcp'
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
      apiKey: process.env.VUEFIRE_API_KEY,
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
    firestore: {
      enabled: true,
    },
  },
  stripe: {
    // Server
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {
        // your api options override for stripe server side
        // https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration
      },
      // CLIENT
    },
    client: {
      key: process.env.STRIPE_PUBLIC_KEY,
      // manualClientLoad: true, // if you want to have control where you are going to load the client
      // your api options override for stripe client side https://stripe.com/docs/js/initializing#init_stripe_js-options
      options: {},
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})