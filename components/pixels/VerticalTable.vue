<template lang="pug">
table.table.table-sm.table-bordered.text-center.mb-0.align-middle
  thead.bg-light.sticky-top
    tr
      th
        .text-small.text-muted Day
      th(
        v-for="i of months",
        :key="i",
        :class="{'table-active': parsedSelectedDate?.month === i}"
      )
        .month-name {{ getMonthName(i - 1) }}
  tbody
    tr(v-for="day of days", :key="day")
      td.table-light(:class="{'table-active': parsedSelectedDate?.day === day}")
        .clamper {{ day }}
      mood-cell(
        v-for="month of months",
        :key="convertToDateStr(day, month, year)",
        :day="day",
        :month="month",
        :year="year",
        :is-selected="selectedDate === convertToDateStr(day, month, year)",
        :mood="indexedDateMoods.find(convertToDateStr(day, month, year))"
      )
</template>

<script setup lang="ts">
const props = defineProps<{
  months: number;
  days: number;
}>();

const {
  selectedDate,
  parsedSelectedDate,
  indexedDateMoods,
  year,
  getMonthName,
} = usePixelsTable();
</script>

<style lang="scss" scoped>
table {
  table-layout: fixed;

  th {
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;

    @media (max-width: 500px) {
      .month-name {
        font-size: 0;

        &::first-letter {
          font-size: var(--bs-body-font-size);
        }
      }
    }
  }

  tr {
    td:first-child,
    th:first-child {
      width: 30px;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
