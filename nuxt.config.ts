export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: "YiP (Year in Pixels)",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#cedfe0" },
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
        "data-bs-theme": "light",
        lang: "en",
      },
    },
  },
  css: [
    "@/assets/main.scss",
    "@fontsource/source-sans-pro/index.css",
    "@fontsource/source-sans-pro/600.css",
    "@fontsource/source-sans-pro/700.css",
  ],
  modules: [
    "nuxt-icon",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@pinia-plugin-persistedstate/nuxt",
    "@kevinmarrec/nuxt-pwa",
  ],
  pwa: {
    manifest: {
      name: "YiP",
      description: "Web app to track your mood throughout the year",
      theme_color: "#cedfe0",
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
});
