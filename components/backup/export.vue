<template lang="pug">
.vstack.gap-2
  h4.fw-bolder.mb-0 Export / Backup
  b-form-text #[b.text-primary -2]: Awful, #[b.text-primary -1]: Bad, #[b.text-primary 0]: Neutral, #[b.text-primary 1]: Good, #[b.text-primary 2]: Great
  .hstack.gap-2
    copy-to-clip.w-100(:to-copy="toExport")
    b-button.w-100(variant="success", @click="saveToFile")
      icon(name="bi:download")
      |
      | Export to file
  backup-export-remote(:data="toExport")
</template>

<script setup lang="ts">
import { orderBy } from "lodash-es";
import { useDataStore } from "~~/stores/data";
import papa from "papaparse";
import { saveAs } from "file-saver";

const dataStore = useDataStore();
const { daysMoods, privateMode } = storeToRefs(dataStore);

const columnsToExport = computed(() => {
  const cols = ["date", "mood"];

  if (!privateMode.value) {
    cols.push("comment");
  }

  return cols;
});

const toExport = computed(() =>
  papa.unparse(orderBy(daysMoods.value, "date", "asc"), {
    header: true,
    columns: columnsToExport.value,
  })
);

function saveToFile() {
  saveAs(new Blob([toExport.value]), `my-year-in-pixels.csv`);
}
</script>
