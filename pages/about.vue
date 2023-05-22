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
  .row
    .col
      h4.fw-bolder Copyright
      p © {{ new Date().getFullYear() }} #[nuxt-link(to="https//alrico.es", target="_blank") Alberto Rico]
</template>

<script setup lang="ts">
useHead({
  title: "About - YiP (Year in Pixels)",
  meta: [
    {
      name: "description",
      content: "Learn more about YiP and Year in Pixels charts",
    },
  ],
});
</script>
