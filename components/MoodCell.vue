<template lang="pug">
td.p-0(
  :title="tooltipContent",
  :class="cellClassNames",
  :style="cellStyle"
  @click="setDay",
  :data-day="formattedDay"
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

const dayJsDay = computed(() =>
  dayjs()
    .set("date", props.day)
    .set("month", props.month - 1)
    .set("year", props.year)
);

const formattedDay = computed(() => dayJsDay.value.format(dayFormat));
const tooltipContent = computed(() =>
  dayJsDay.value.format("ddd DD, MMMM YYYY")
);

const today = dayjs().format(dayFormat);
const isToday = computed(() => formattedDay.value === today);
const isAfterToday = computed(() => formattedDay.value > today);

const cellClassNames = computed(() => {
  const asStr = convertToDateStr(props.day, props.month, props.year);

  return {
    "cursor-hover": dayExists.value && !isAfterToday.value,
    "bg-light": isAfterToday.value,
    "day-forbidden": isAfterToday.value || !dayExists.value,
    "invalid-day": !dayExists.value,
    "border border-3 border-dark": asStr === dataStore.selectedDate,
  };
});

const cellStyle = computed<StyleValue>(() => {
  const asStr = convertToDateStr(props.day, props.month, props.year);

  const mood = indexedDateMoods.value.get(asStr);

  if (mood === null) {
    return {};
  } else {
    return {
      backgroundColor: colorScale(Number(mood)) as string,
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
  background-color: #dfdbe5;
  background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
