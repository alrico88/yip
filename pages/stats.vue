<template lang="pug">
.overflow-y-auto
  .container.py-3
    .vstack.gap-3
      .row.row-cols-1.row-cols-lg-2.g-4
        .col
          stats-days-by-mood(
            :year-data="yearData",
            :chart-options="commonOptions"
          )
        .col
          stats-day-of-week(
            :year-data="yearData",
            :chart-options="commonOptions"
          )
      stats-day-of-year(:year-data="yearData", :chart-options="commonOptions")
      stats-week-of-year(:year-data="yearData", :chart-options="commonOptions")
      stats-month-of-year(
        :year-data="yearData",
        :chart-options="commonOptions"
      )
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

const yearData = computed(() =>
  daysMoods.value.filter((d) => dayjs(d.date).year() === year.value)
);

const colorMode = useColorMode();

const commonOptions = computed(() => {
  const isLight = colorMode.value === "light";
  const textColor = isLight ? undefined : "white";
  const gridColor = isLight ? undefined : "#414141";

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          stepSize: 1,
          callback(tickVal: number) {
            return MoodTexts[tickVal as unknown as DayMood] as string;
          },
        },
      },
    },
  } as Partial<ChartOptions>;
});
</script>
