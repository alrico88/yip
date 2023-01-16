<template lang="pug">
.row
  .col
    h4.fw-bold Average mood by week of year
    .chart-div
      line-chart(
        :options="chartOptions",
        :data="byWeekOfYear"
      )
</template>

<script setup lang="ts">
import type { ChartOptions, ChartData } from "chart.js";
import { DayData } from "~~/utils/models/DayData";
import { orderBy, groupBy } from "lodash-es";
import { calcMean } from "math-helper-functions";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  CategoryScale,
  LineElement,
  PointElement,
} from "chart.js";

dayjs.extend(weekOfYear);

ChartJS.register(Title, Tooltip, LineElement, CategoryScale, PointElement);

const props = defineProps<{
  yearData: DayData[];
  chartOptions: ChartOptions;
}>();

const byWeekOfYear = computed<ChartData<"line", number[], string>>(() => {
  const grouped = groupBy(props.yearData, (d) => dayjs(d.date).week());

  const data = orderBy(
    Object.entries(grouped).map(([week, values]) => {
      return {
        week,
        median: calcMean(values, "mood"),
      };
    }),
    (d) => Number(d.week),
    "asc"
  );

  return {
    labels: data.map((d) => d.week as string),
    datasets: [
      {
        label: "Average mood",
        data: data.map((d) => d.median as number),
      },
    ],
  };
});
</script>
