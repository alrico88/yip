<template lang="pug">
.container.py-3
  .row
    .col
      h4.fw-bolder About YiP (Year in Pixels)
      p YiP is a free private progressive web app (PWA) to track your mood throughout the year. Data never leaves your device unless you use the share functionality.
      p A Year in Pixels chart is a visual representation of your mood over the course of a year, displayed in a grid format. The horizontal rows represent the months and the vertical columns represent the days of the month. Each square, or pixel, in the grid represents your average mood for that day. When viewed as a whole, the chart appears as a highly detailed image with each pixel representing a day in the year, hence the name 'Year in Pixels'.
      p Our stats provide additional insights on your moods throughout different dimensions, such as day of week, weeks, etc.
  .row
    .col
      h4.fw-bolder Tech used
      p.mb-0 YiP was built using:
      ul.list-unstyled
        li
          icon-link(icon="logos:nuxt-icon", text="Nuxt", link="https://nuxt.com", new-tab)
        li
          icon-link(icon="logos:vue", text="Vue 3", link="https://vuejs.org", new-tab)
          li
          icon-link(icon="bi:graph-up-arrow", text="Chart.JS", link="https://www.chartjs.org", new-tab)
      p Your data is persisted in the browsers IndexedDB. If you want to move to another browser / device, please export and restore your data using #[nuxt-link(to="/backup") backup].
  .row.mb-2
    .col
      h4.fw-bolder Seed data
      .hstack.gap-2.align-items-center
        div
          button.btn.btn-warning(
            @click="generateRandomData",
            :disabled="generated",
          ) #[icon(name="mdi:dice-3-outline")] {{ generated ? 'Done!' : 'Generate random data' }}
        .text-danger Caution: it will overwrite your selected year
  .row.mb-2
    .col
      h4.fw-bolder Private mode
      .vstack.gap-2
        div Prevent showing or exporting comments by toggling private mode on.
        div
          .form-check.w-auto
            input.form-check-input(
              type="checkbox" 
              id="privateMode",
              v-model="privateMode"
            )
            label.form-check-label(for="privateMode") Use private mode
  .row
    .col
      h4.fw-bolder Copyright
      p © {{ new Date().getFullYear() }} #[nuxt-link(to="https://alrico.es", target="_blank") Alberto Rico]
      p.text-muted Built: {{ daysBuilt }}
</template>

<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";
import { useDataStore } from "~/stores/data";

useHead({
  title: "About - YiP (Year in Pixels)",
  meta: [
    {
      name: "description",
      content: "Learn more about YiP and Year in Pixels charts",
    },
  ],
});

const date = useAppConfig();

const daysBuilt = formatTimeAgo(new Date(date.buildDate));

const store = useDataStore();
const { privateMode } = storeToRefs(store);

const generated = autoResetRef(false, 3000);

function generateRandomData() {
  generated.value = true;

  store.generateRandomData();
}
</script>
