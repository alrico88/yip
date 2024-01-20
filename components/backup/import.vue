<template lang="pug">
.vstack.gap-2
  h4.fw-bolder.mb-0 Import
  b-form-text Restore data from another computer or browser
  b-form-textarea(
    v-model="toImport",
    :rows="10",
    :placeholder="importPlaceholder",
    ref="dropzoneRef"
  )
  b-form-file.border.border-dark(accept=".csv", size="sm", @input="handleFile")
  div
    b-alert.mb-2(:model-value="errorImporting", variant="danger") Error importing data
    template(v-if="importSuccess")
      b-alert.mb-2(:model-value="importSuccess", variant="success") Imported successfully
    template(v-else)
      b-button.w-100(
        variant="success",
        @click="importData",
        :disabled="importDisabled"
      )
        icon(name="bi:upload")
        |
        | Import data
  h4.fw-bolder.mb-0 Import from share link
  b-form-text Use a share link to import data. If a passphrase was used, you must provide it.
  .row.g-2
    .col-9
      .vstack.gap-2
        b-input-group(prepend="Remote ID")
          b-form-input(v-model="remoteId")
        b-input-group(prepend="Passphrase")
          b-form-input(v-model="passphrase")
    .col-3
      b-button.w-100.h-100(
        variant="primary",
        @click="loadToImport",
        :disabled="remoteId === ''"
      ) Fetch remote
  b-alert.d-block.mb-0(variant="warning", :model-value="remoteStatus.ready") Enter a passphrase (if required) and click "Fetch remote"
  b-alert.d-block.mb-0(variant="success", :model-value="remoteStatus.success") Got data from remote. Click on "Import data" to apply changes
  b-alert.d-block.mb-0(variant="danger", :model-value="remoteStatus.error") Invalid remote ID or passphrase
</template>

<script setup lang="ts">
import { useDataStore } from "~~/stores/data";
import { readAsText } from "promise-file-reader";
import papa from "papaparse";
import is from "@sindresorhus/is";
import { DayData } from "~~/utils/models/DayData";
import { DayMood } from "~~/utils/enums/DayMood";

const route = useRoute();

const dataStore = useDataStore();
const { daysMoods } = storeToRefs(dataStore);

const toImport = ref("");
const importSuccess = refAutoReset(false, 3000);
const importDisabled = computed(() => !is.nonEmptyString(toImport.value));

const remoteId = ref("");
const remoteStatus = reactive({
  success: false,
  error: false,
  ready: false,
});
const passphrase = ref("");

async function loadToImport() {
  try {
    remoteStatus.success = false;
    remoteStatus.error = false;
    remoteStatus.ready = false;

    const response = await $fetch("/api/store", {
      query: {
        id: remoteId.value,
      },
    });

    if (response.success) {
      const encryptor = new Encryptor(passphrase.value);

      toImport.value = encryptor.decryptString(response.data as string);

      remoteStatus.success = true;
    }
  } catch (err) {
    console.error(err);

    remoteStatus.error = true;
  }
}

onMounted(() => {
  if (is.nonEmptyString(route.query.id)) {
    remoteId.value = route.query.id as string;

    remoteStatus.ready = true;
  }
});

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

    const parsed = papa.parse<{
      date: string;
      mood: DayMood;
      comment?: string;
    }>(toImport.value, {
      header: true,
    });

    const neededColumns = ["date", "mood"];

    if (neededColumns.some((field) => !parsed.meta.fields?.includes(field))) {
      throw new Error("missing required columns");
    }

    daysMoods.value = parsed.data.map(
      (d) => new DayData(d.date, d.mood, d.comment)
    );

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
