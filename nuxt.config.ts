export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "YiP (Year in Pixels)",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#fcf8f4" },
        { name: "author", content: "Alberto Rico" },
        {
          name: "keywords",
          content: [
            "year",
            "mood",
            "pixels",
            "year in pixels",
            "free",
            "pwa",
            "private",
          ],
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  appConfig: {
    buildDate: new Date().toISOString(),
  },
  css: [
    "@/assets/main.scss",
    "@fontsource/source-sans-pro/index.css",
    "@fontsource/source-sans-pro/600.css",
    "@fontsource/source-sans-pro/700.css",
    "bottom-sheet-vue3/style.css",
  ],
  modules: [
    "nuxt-icon",
    "@vueuse/nuxt",
    "@bootstrap-vue-next/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@pinia-plugin-persistedstate/nuxt",
    "@vite-pwa/nuxt",
    "@nuxtjs/color-mode",
  ],
  experimental: {
    payloadExtraction: false,
  },
  routeRules: {
    "/": {
      prerender: true,
    },
    "/stats": {
      prerender: true,
    },
    "/backup": {
      prerender: true,
    },
    "/about": {
      prerender: true,
    },
  },
  pwa: {
    registerType: "prompt",
    manifest: {
      name: "YiP",
      description: "Web app to track your mood throughout the year",
      theme_color: "#fcf8f4",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff,woff2}"],
      cleanupOutdatedCaches: true,
    },
  },
  piniaPersistedstate: {
    storage: "localStorage",
  },
  runtimeConfig: {
    redisUrl: "",
    redisPass: "",
    encryptPass: "",
  },
  colorMode: {
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode",
  },
});
