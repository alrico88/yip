<template lang="pug">
.overflow-y-auto
  .container.py-3
    .vstack.gap-3
      stats-days-by-mood(:year-data="yearData")
      stats-day-of-week(:year-data="yearData", :chart-options="commonOptions")
      stats-day-of-year(:year-data="yearData", :chart-options="commonOptions")
      stats-week-of-year(:year-data="yearData", :chart-options="commonOptions")
</template>

<script setup lang="ts">
import { useDataStore } from "~~/stores/data";
import dayjs from "dayjs";
import type { ChartOptions } from "chart.js";
import { DayMood } from "~~/utils/enums/DayMood";

useHead({
  title: "Stats - YiP (Year in Pixels)",
  meta: [
    {
      name: "description",
      content: "Check some insights from your year in pixels",
    },
  ],
});

const dataStore = useDataStore();
const { daysMoods, year } = storeToRefs(dataStore);

const yearData = computed(() => {
  return daysMoods.value.filter((d) => dayjs(d.date).year() === year.value);
});

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        stepSize: 1,
        callback(tickVal: number) {
          return MoodTexts[tickVal as unknown as DayMood] as string;
        },
      },
    },
  },
} as unknown as ChartOptions;
</script>
