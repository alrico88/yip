import { createBottomSheet } from "bottom-sheet-vue3";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createBottomSheet());
});
