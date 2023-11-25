<template lang="pug">
.row.justify-content-center
  .col
    .card.overflow-hidden.border.shadow-sm
      .card-body.p-0(ref="tableRef")
        .d-block.d-lg-none
          pixels-vertical-table(v-bind="tableProps")
        .d-none.d-lg-block
          pixels-horizontal-table(v-bind="tableProps")
</template>

<script setup lang="ts">
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

const props = defineProps<{
  year: number;
}>();

const months = 12;
const days = 31;

const tableProps = {
  months,
  days,
};

const tableRef = templateRef("tableRef");

async function saveToImage() {
  saveAs(
    await toPng(tableRef.value as HTMLElement, {
      filter(node) {
        return !node?.classList?.contains("no-export");
      },
    }),
    `year-${props.year}-in-pixels-png`,
  );
}

defineExpose({
  saveToImage,
});
</script>
