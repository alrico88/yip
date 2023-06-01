<template lang="pug">
.row
  .col
    h4.fw-bold Average mood by week of year
    .chart-div
      line-chart(
        :options="chartOptions",
        :data="byMonthOfYear"
      )
</template>

<script setup lang="ts">
import type { ChartOptions, ChartData } from "chart.js";
import { DayData } from "~~/utils/models/DayData";
import { orderBy, groupBy } from "lodash-es";
import { calcMean } from "math-helper-functions";
import dayjs from "dayjs";
import { Line as LineChart } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  CategoryScale,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, LineElement, CategoryScale, PointElement);

const props = defineProps<{
  yearData: DayData[];
  chartOptions: ChartOptions;
}>();

const byMonthOfYear = computed<ChartData<"line", number[], string>>(() => {
  const grouped = groupBy(props.yearData, (d) => dayjs(d.date).month());

  const data = orderBy(
    Object.entries(grouped).map(([month, values]) => {
      return {
        month,
        median: calcMean(values, "mood"),
      };
    }),
    (d) => Number(d.month),
    "asc"
  );

  return {
    labels: data.map(
      (d) =>
        dayjs()
          .set("day", 1)
          .set("month", Number(d.month))
          .format("MMM") as string
    ),
    datasets: [
      {
        label: "Average mood",
        data: data.map((d) => d.median as number),
        backgroundColor: data.map(
          (d) => colorScale(Number(d.median)) as string
        ),
      },
    ],
  };
});
</script>
