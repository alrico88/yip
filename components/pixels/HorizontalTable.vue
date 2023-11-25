<template lang="pug">
table.table.table-sm.table-bordered.text-center.mb-0.align-middle
  thead.bg-light.sticky-top
    tr
      th
        .text-small.text-muted Day
      th(
        v-for="day of days",
        :key="day",
        :class="{'table-active': parsedSelectedDate?.day === day}"
      ) {{ day }}
  tbody
    tr(v-for="month of months", :key="month")
      td.table-light(:class="{'table-active': parsedSelectedDate?.month === month}") {{ getMonthName(month - 1) }}
      mood-cell(
        v-for="day of days",
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

  tr {
    td:first-child,
    th:first-child {
      width: 80px;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
