<template lang="pug">
td.p-0(
  :title="tooltipContent",
  :class="cellClassNames",
  :style="cellStyle"
  @click="setDay",
  :data-day="dayAsString"
)
  icon(v-if="isToday", size="20px", name="fluent:calendar-today-16-regular")
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDataStore } from "~/stores/data";
import type { StyleValue } from "vue";

const props = defineProps<{
  day: number;
  month: number;
  year: number;
}>();

const dataStore = useDataStore();
const { indexedDateMoods } = storeToRefs(dataStore);

const dayExists = computed(() => {
  return (
    dayjs()
      .set("month", props.month - 1)
      .set("year", props.year)
      .daysInMonth() >= props.day
  );
});

const dayAsString = computed(() =>
  convertToDateStr(props.day, props.month, props.year)
);
const tooltipContent = computed(() =>
  dayjs(dayAsString.value).format("ddd DD, MMMM YYYY")
);

const today = dayjs().format(dayFormat);
const isToday = computed(() => dayAsString.value === today);
const isAfterToday = computed(() => dayAsString.value > today);

const cellClassNames = computed(() => {
  if (!dayExists.value) {
    return {
      "invalid-day": true,
    };
  }

  return {
    "cursor-hover": !isAfterToday.value,
    "bg-light": isAfterToday.value,
    "day-forbidden": isAfterToday.value,
    "border border-3 border-dark": dayAsString.value === dataStore.selectedDate,
  };
});

const mood = eagerComputed(() => indexedDateMoods.value.get(dayAsString.value));

const cellStyle = computed<StyleValue>(() => {
  if (!dayExists.value) {
    return {};
  }

  if (mood === null) {
    return {};
  } else {
    return {
      backgroundColor: colorScale(Number(mood.value)) as string,
    };
  }
});

function setDay(): void {
  if (!dayExists.value || isAfterToday.value) {
    return;
  }

  dataStore.changeSelectedDate(props.day, props.month, props.year);
}
</script>

<style lang="scss" scoped>
.invalid-day {
  background-color: #f7f7f7;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8c8c8' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
