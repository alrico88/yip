<template lang="pug">
.vstack.gap-2
  h4.fw-bolder.mb-0 Import
  .form-text Restore data from another computer or browser
  textarea.form-control.border.border-dark(
    v-model="toImport", 
    :rows="10", 
    :placeholder="importPlaceholder",
    ref="dropzoneRef"
  )
  c-form-input.border.border-dark(type="file", accept=".csv", size="sm", @input="handleFile")
  div
    .alert.alert-danger.d-block.mb-0(v-if="errorImporting") Error importing data
    template(v-if="importSuccess")
      .alert.alert-success.d-block.mb-0(v-if="importSuccess") Imported successfully
    template(v-else)
      button.btn.btn-success.w-100(@click="importData", :disabled="importDisabled")
        icon(name="bi:upload")
        |  Import data
  h4.fw-bolder.mb-0 Import from share link
  .form-text Use a share link to import data. If a passphrase was used, you must provide it.
  .row.g-2
    .col-9
      .vstack.gap-2
        .input-group.border.border-dark
          .input-group-text Remote ID
          input.form-control(type="text", v-model="remoteId")
        .input-group.border.border-dark
          .input-group-text Passphrase
          input.form-control(type="text", v-model="passphrase")
    .col-3
      button.btn.btn-primary.w-100.h-100(@click="loadToImport", :disabled="remoteId === ''") Fetch remote
  .alert.alert-warning.d-block.mb-0(v-if="remoteStatus.ready") Enter a passphrase (if required) and click "Fetch remote"
  .alert.alert-success.d-block.mb-0(v-if="remoteStatus.success") Got data from remote. Click on "Import data" to apply changes
  .alert.alert-danger.d-block.mb-0(v-if="remoteStatus.error") Invalid remote ID or passphrase
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
      (d) => new DayData(d.date, d.mood, d.comment),
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
    : "Paste the backup or drag and drop a file",
);
</script>
