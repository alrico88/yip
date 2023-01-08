<template lang="pug">
.row
  .col
    h4 Number of days by mood
    .chart-div
      bar(
        :options="options", 
        :data="daysByMood"
      )
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from "chart.js";
import { countBy, orderBy } from "lodash-es";
import { DayMood } from "~~/utils/enums/DayMood";
import { DayData } from "~~/utils/models/DayData";
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
}>();

const daysByMood = computed<ChartData<"bar", number[], string>>(() => {
  const countedByMood = countBy(props.yearData, (d) => d.mood);

  const sorted = orderBy(
    Object.entries(countedByMood).map(([mood, count]) => {
      return {
        mood,
        count,
      };
    }),
    "mood",
    "desc"
  );

  return {
    labels: sorted.map((d) => MoodTexts[d.mood as DayMood]),
    datasets: [
      {
        label: "Number of days",
        data: sorted.map((d) => d.count),
        backgroundColor: sorted.map(
          (d) => colorScale(Number(d.mood)) as string
        ),
      },
    ],
  };
});

const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>
