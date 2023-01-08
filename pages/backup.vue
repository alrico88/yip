<template lang="pug">
.container.py-3
  .row.row-cols-lg-2.row-cols-1.g-3
    .col
      .vstack.gap-2
        h4.fw-bolder.mb-0 Export / Backup
        .form-text #[b.text-primary -2]: Awful, #[b.text-primary -1]: Bad, #[b.text-primary 0]: Neutral, #[b.text-primary 1]: Good, #[b.text-primary 2]: Great
        textarea.form-control.bg-light.border.border-dark(v-model="toExport", :rows="10", readonly)
        .hstack.gap-2
          button.btn.btn-primary(@click="() => copy(toExport)", :disabled="copied")
            icon(name="bi:clipboard") 
            |  {{ copied ? 'Copied' : 'Copy' }} to clipboard
          button.btn.btn-success(@click="saveToFile")
            icon(name="bi:download")
            |  Export to file
    .col
      .vstack.gap-2
        h4.fw-bolder.mb-0 Import
        .form-text Restore data from another computer or browser
        textarea.form-control.bg-white.border.border-dark(
          v-model="toImport", 
          :rows="10", 
          :placeholder="importPlaceholder",
          ref="dropzoneRef"
        )
        .bg-white.border.border-dark.p-2
          c-form-input.bg-white(type="file", accept=".csv", size="sm", @input="handleFile")
        div
          .alert.alert-danger.d-block(v-if="errorImporting") Error importing data
          template(v-if="importSuccess")
            .alert.alert-success.d-block(v-if="importSuccess") Imported successfully
          template(v-else)
            button.btn.btn-success(@click="importData", :disabled="importDisabled")
              icon(name="bi:upload")
              |  Import data
    .col
      .vstack.gap-2
        h4.fw-bolder.mb-0 Delete
        div
          confirm-delete(@delete="daysMoods = []", text="Delete all data", filled)
</template>

<script setup lang="ts">
import { orderBy } from "lodash-es";
import papa from "papaparse";
import { useDataStore } from "~~/stores/data";
import { readAsText } from "promise-file-reader";
import { DayData } from "~~/utils/models/DayData";
import { DayMood } from "~~/utils/enums/DayMood";
import { saveAs } from "file-saver";
import is from "@sindresorhus/is";
import { CFormInput } from "@coreui/bootstrap-vue";

useHead({
  title: "Backup / Restore - YiP (Year in Pixels)",
  meta: [
    {
      name: "description",
      content: "Backup your data or import it from another device",
    },
  ],
});

const dataStore = useDataStore();
const { daysMoods } = storeToRefs(dataStore);

const { copied, copy } = useClipboard();

const toExport = computed(() => {
  return papa.unparse(orderBy(daysMoods.value, "date", "asc"), {
    header: true,
  });
});

function saveToFile() {
  saveAs(new Blob([toExport.value]), `my-year-in-pixels.csv`);
}

const toImport = ref("");
const importSuccess = refAutoReset(false, 3000);
const importDisabled = computed(() => is.emptyString(toImport.value));

async function onDrop(file: File[] | null): Promise<void> {
  if (!file) {
    return;
  }

  const csv = await readAsText(file[0]);

  toImport.value = csv;
}

function handleFile(e: InputEvent): void {
  onDrop((e.target as HTMLInputElement).files as File[] | null);
}

const errorImporting = ref(false);

function importData() {
  try {
    errorImporting.value = false;

    const parsed = papa.parse<{ date: string; mood: DayMood }>(toImport.value, {
      header: true,
    });

    const neededColumns = ["date", "mood"];

    console.log(parsed.meta.fields);

    if (neededColumns.some((field) => !parsed.meta.fields?.includes(field))) {
      throw new Error("missing required columns");
    }

    daysMoods.value = parsed.data.map((d) => new DayData(d.date, d.mood));

    importSuccess.value = true;
  } catch (err) {
    errorImporting.value = true;

    console.error(err);
  }
}

const dropzoneRef = ref<HTMLDivElement | null>(null);

const { isOverDropZone } = useDropZone(dropzoneRef, onDrop);

const importPlaceholder = computed(() =>
  isOverDropZone.value
    ? "Drop the file"
    : "Paste the backup or drag and drop a file"
);
</script>
