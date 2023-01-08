<template lang="pug">
.row
  .col
    .card
      .card-body.p-0.bg-white.border.border-dark(ref="tableRef")
        table.table.table-sm-sm.table-bordered.text-center.mb-0
          thead.bg-light.sticky-top
            tr
              th.align-middle
                .text-small.text-muted.d-none.d-md-block Day
              th(v-for="i of months", v-html="getMonthName(i - 1)")
          tbody.align-middle
            tr(v-for="day of 31")
              td.table-light
                .clamper {{ day }}
              mood-cell(
                v-for="month of months",
                :key="`${year}${month}${day}`",
                :day="day",
                :month="month",
                :year="year"
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

const props = defineProps<{
  year: number;
}>();

const months = 12;

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
      await toPng(tableRef.value as HTMLElement),
      `year-${props.year}-in-pixels-png`
    );
  } catch (err) {
    console.error(err);
  } finally {
    exporting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.clamper {
  font-size: 100%;
}
</style>
