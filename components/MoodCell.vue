<template lang="pug">
td.p-0.text-center.align-middle.mood-cell(
  :title="tooltipContent",
  :class="cellClassNames",
  :style="cellStyle"
  @click="setDay",
  :data-day="dayAsString"
)
  .hstack.gap-1.w-100.justify-content-center
    icon.no-export(v-if="mood?.comment", size="15", name="bi:chat-dots")
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { useDataStore } from "~/stores/data";
import type { StyleValue } from "vue";
import { DayMood } from "~/utils/enums/DayMood";
import is from "@sindresorhus/is";

const props = defineProps<{
  day: number;
  month: number;
  year: number;
  isSelected: boolean;
  mood?: {
    mood: DayMood;
    comment: string;
  };
}>();

const dataStore = useDataStore();

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
const isAfterToday = computed(() => dayAsString.value > today);

const cellClassNames = computed(() => {
  if (!dayExists.value) {
    return {
      "invalid-day": true,
    };
  }

  return {
    "cursor-hover": !isAfterToday.value,
    "in-future": isAfterToday.value,
    "day-forbidden": isAfterToday.value,
    "selected-day": props.isSelected,
  };
});

const cellStyle = computed<StyleValue>(() => {
  if (!dayExists.value) {
    return {};
  }

  if (is.nullOrUndefined(props.mood)) {
    return {};
  } else {
    return {
      backgroundColor: colorScale(Number(props.mood.mood)) as string,
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
  background: repeating-linear-gradient(
    135deg,
    #060606 0,
    #060606 10%,
    transparent 0,
    transparent 50%
  );
  background-size: 1em 1em;
  background-color: #ffffff;
  opacity: 0.1;
}

.selected-day {
  background: radial-gradient(circle, #06121e 10%, transparent 5%);
  background-size: 1em 1em;
  background-repeat: repeat;
}
</style>
