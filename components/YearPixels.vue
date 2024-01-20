<template lang="pug">
.row.justify-content-center
  .col
    b-card.overflow-hidden.border.shadow-sm(no-body)
      b-card-body.p-0(ref="tableRef")
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableRef = templateRef<any>("tableRef");

async function saveToImage() {
  console.log(tableRef.value);

  saveAs(
    await toPng(tableRef.value.$el as HTMLElement, {
      filter(node) {
        return !node?.classList?.contains("no-export");
      },
    }),
    `year-${props.year}-in-pixels-png`
  );
}

defineExpose({
  saveToImage,
});
</script>
