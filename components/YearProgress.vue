<template lang="pug">
.card.rounded.border.border-dark
  .card-body
    table.table.table-borderless.align-middle.mb-0
      tbody
        tr
          td.w-25 Year progress
          td
            progress-bar(label="Year progress" :current="currentDayOfYear" :total="daysInYear")
        tr
          td.w-25 Days with mood set
          td
            progress-bar(label="Days with mood set" :current="daysWithMood" :total="daysInYear")
        tr
          td.w-25 Days with comments
          td
            progress-bar(label="Days with mood set" :current="daysWithComments" :total="daysInYear")
</template>

<script setup lang="ts">
import is from "@sindresorhus/is";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(dayOfYear);
dayjs.extend(isLeapYear);

const dataStore = useDataStore();
const { year, daysMoods } = storeToRefs(dataStore);

const daysInYear = computed(() =>
  dayjs().year(year.value).isLeapYear() ? 366 : 365,
);

const currentDayOfYear = computed(() => {
  if (year.value < dayjs().year()) {
    return daysInYear.value;
  } else {
    return dayjs().dayOfYear();
  }
});

const currYearMoods = computed(() =>
  daysMoods.value.filter((d) => {
    const moodYear = dayjs(d.date).year();

    return moodYear === year.value;
  }),
);

const daysWithMood = computed(() => currYearMoods.value.length);

const daysWithComments = computed(
  () => currYearMoods.value.filter((d) => is.nonEmptyString(d.comment)).length,
);
</script>

<style lang="scss" scoped></style>
