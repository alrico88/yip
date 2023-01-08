<template lang="pug">
.row
  .col
    h4 Average mood by day of year
    .chart-div
      line-chart(
        :options="chartOptions",
        :data="byDayOfYear"
      )
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";
import { DayData } from "~~/utils/models/DayData";
import { orderBy } from "lodash-es";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  CategoryScale,
  LineElement,
  PointElement,
} from "chart.js";
import dayjs from "dayjs";

ChartJS.register(Title, Tooltip, LineElement, CategoryScale, PointElement);

const props = defineProps<{
  yearData: DayData[];
  chartOptions: ChartOptions;
}>();

const byDayOfYear = computed<ChartData<"line", number[], string>>(() => {
  const data = orderBy(props.yearData, (d) => Number(d.date), "asc");

  return {
    labels: data.map((d) => dayjs(d.date).format("dd, DD MMM YY")),
    datasets: [
      {
        label: "Mood",
        data: data.map((d) => Number(d.mood)),
        backgroundColor: data.map((d) => colorScale(Number(d.mood)) as string),
      },
    ],
  };
});
</script>
