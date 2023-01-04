export default defineNuxtConfig({
  app: {
    head: {
      title: "nuxt3-boilerplate",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#212121" },
      ],
      htmlAttrs: {
        "data-bs-theme": "light",
      },
    },
  },
  css: ["@/assets/main.scss"],
  modules: [
    "nuxt-icon",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@kevinmarrec/nuxt-pwa",
  ],
  pwa: {
    manifest: {
      name: "nuxt3-boilerplate",
      description: "BOILERPLATE DESCRIPTION",
      theme_color: "#212121",
    },
  },
});
