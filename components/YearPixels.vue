<template lang="pug">
.row
  .col
    .card
      .card-body.p-0.border.border-dark(ref="tableRef")
        table.table.table-sm.table-bordered.text-center.mb-0.align-middle
          thead.bg-light.sticky-top
            tr
              th
                .text-small.text-muted.d-none.d-md-block Day
              th(v-for="i of months", v-html="getMonthName(i - 1)", :class="{'table-active': parsedSelectedDate?.month === i}")
          tbody
            tr(v-for="day of days")
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
      .card-footer.border.border-dark
        button.btn.btn-primary.w-100(@click="saveToImage", :disabled="exporting")
          icon(name="mdi:checkerboard")
          |  {{ exportingBtnText }}
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { h } from "hachescript";
import { convertToDateStr } from "~/utils/dates";
import { useDataStore } from "~/stores/data";

const dataStore = useDataStore();
const { selectedDate, indexedDateMoods } = storeToRefs(dataStore);

const props = defineProps<{
  year: number;
}>();

const months = 12;
const days = 31;

function getMonthName(month: number): string {
  const name = dayjs().set("month", month).format("MMM");

  return h("div", [
    h("span", name.substring(0, 1)),
    h("span.d-none.d-md-inline-block", name.substring(1)),
  ]);
}

const tableRef = templateRef("tableRef");

const exporting = ref(false);

const exportingBtnText = computed(() => {
  return exporting.value
    ? "Exporting to image..."
    : "Save year pixels as image";
});

async function saveToImage() {
  try {
    exporting.value = true;

    saveAs(
      await toPng(tableRef.value as HTMLElement, {
        filter(node) {
          return !node?.classList?.contains("no-export");
        },
      }),
      `year-${props.year}-in-pixels-png`
    );
  } catch (err) {
    console.error(err);
  } finally {
    exporting.value = false;
  }
}

const parsedSelectedDate = computed(() => {
  const date = dataStore.selectedDate;

  if (date) {
    const parsed = dayjs(date);

    return {
      day: parsed.date(),
      month: parsed.month() + 1,
    };
  } else {
    return null;
  }
});
</script>

<style lang="scss" scoped>
.clamper {
  font-size: 100%;
}
</style>
