<template lang="pug">
.row
  .col
    h4.fw-bold Average mood by day of week
    .chart-div
      bar(:options="castOptions", :data="byDayOfWeek")
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";
import { groupBy, orderBy } from "lodash-es";
import { calcMean } from "math-helper-functions";
import { DayData } from "~~/utils/models/DayData";
import dayjs from "dayjs";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  yearData: DayData[];
  chartOptions: Partial<ChartOptions>;
}>();

const castOptions = computed(() => props.chartOptions as ChartOptions<"bar">);

const byDayOfWeek = computed<ChartData<"bar", number[], string>>(() => {
  const grouped = groupBy(props.yearData, (d) =>
    dayjs(d.date).day().toString()
  );

  const data = orderBy(
    Object.entries(grouped).map(([dayOfWeek, values]) => ({
      dayOfWeek,
      median: calcMean(values, "mood"),
    })),
    "dayOfWeek",
    "asc"
  ).map((d) => ({
    ...d,
    dayOfWeek: dayjs().day(Number(d.dayOfWeek)).format("dddd"),
  }));

  return {
    labels: data.map((d) => d.dayOfWeek),
    datasets: [
      {
        label: "Average mood",
        data: data.map((d) => d.median as number),
        backgroundColor: data.map(
          (d) => colorScale(d.median as number) as string
        ),
      },
    ],
  };
});
</script>
