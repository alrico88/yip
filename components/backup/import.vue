<template lang="pug">
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
    .alert.alert-danger.d-block.mb-0(v-if="errorImporting") Error importing data
    template(v-if="importSuccess")
      .alert.alert-success.d-block.mb-0(v-if="importSuccess") Imported successfully
    template(v-else)
      button.btn.btn-success.w-100(@click="importData", :disabled="importDisabled")
        icon(name="bi:upload")
        |  Import data
  .alert.alert-success.d-block.mb-0(v-if="remoteSuccess") Got data from remote. Click on "Import data" to apply changes
</template>

<script setup lang="ts">
import { useDataStore } from "~~/stores/data";
import { readAsText } from "promise-file-reader";
import papa from "papaparse";
import is from "@sindresorhus/is";
import { DayData } from "~~/utils/models/DayData";
import { DayMood } from "~~/utils/enums/DayMood";
import { CFormInput } from "@coreui/bootstrap-vue";

const route = useRoute();

const dataStore = useDataStore();
const { daysMoods } = storeToRefs(dataStore);

const toImport = ref("");
const importSuccess = refAutoReset(false, 3000);
const importDisabled = computed(() => !is.nonEmptyString(toImport.value));

const remoteSuccess = ref(false);

async function loadToImport() {
  if (is.nonEmptyString(route.query.id)) {
    try {
      const response = await $fetch("/api/store", {
        query: {
          id: route.query.id,
        },
      });

      if (response.success) {
        toImport.value = response.data as string;

        remoteSuccess.value = true;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

onMounted(loadToImport);

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
