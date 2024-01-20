<template lang="pug">
.overflow-y-auto
  .container-xxl.py-3
    .vstack.gap-4
      year-pixels(:year="year", ref="yearPixelsRef")
      .row
        .col
          year-progress
      .row
        .col.text-center
          b-button(
            variant="primary",
            @click="handleSaveClick",
            :disabled="exporting"
          )
            icon(name="mdi:checkerboard")
            |
            | {{ exportingBtnText }}
sheet.mood-bg(
  v-model:visible="showSlideover",
  :style="sheetStyle",
  :only-header-swipe="true"
)
  .container.py-3
    .row.text-center.pb-3
      .col
        .hstack.gap-2.justify-content-between.align-items-center
          div
            b-button(
              :variant="btnVariant",
              size="lg",
              @click="dataStore.previousDay()",
              v-b-tooltip="'Previous day'"
            )
              icon(name="tabler:arrow-left", size="30")
          .flex-grow-1
            h4 {{ formattedDate }}
            .lead.mb-o Your day was:
          div
            b-button(
              :variant="btnVariant",
              size="lg",
              @click="dataStore.nextDay()",
              v-b-tooltip="'Next day'",
              :disabled="!canGoNext"
            )
              icon(name="tabler:arrow-right", size="30")
    mood-board
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";
import dayjs from "dayjs";
import { Sheet } from "bottom-sheet-vue3";
import { vBTooltip } from "bootstrap-vue-next";

useHead({
  title: "YiP (Year in Pixels)",
  meta: [
    {
      name: "description",
      content: "Track your mood during the year using this free web app",
    },
  ],
});

const dataStore = useDataStore();
const { selectedDate, selectedDateData, year } = storeToRefs(dataStore);
const showSlideover = computed({
  get() {
    return selectedDate.value !== null;
  },
  set(val) {
    if (!val) {
      selectedDate.value = null;
    }
  },
});

const formattedDate = computed(() =>
  dayjs(selectedDate.value).format("dddd DD, MMMM, YYYY")
);

const colorMode = useColorMode();

const btnVariant = computed(() =>
  colorMode.value === "light" ? "light" : "secondary"
);

const selectedMoodBgColor = computed<string>(() => {
  const defaultColor = colorMode.value === "light" ? "white" : "black";

  if (selectedDateData.value === null) {
    return defaultColor;
  }

  const mood = selectedDateData.value?.mood;

  if (!mood) {
    return defaultColor;
  }

  return getMoodBg(mood);
});

const selectedMoodTextColor = computed(() =>
  getGoodContrastColor(selectedMoodBgColor.value)
);

onMounted(() => {
  selectedDate.value = null;
});

const sheetStyle = computed(() => ({
  "--bottom-sheet-bakground-color": selectedMoodBgColor.value,
  "--bottom-sheet-text-color": selectedMoodTextColor.value,
}));

const canGoNext = computed(() =>
  dayjs(selectedDate.value).isBefore(dayjs().startOf("day"))
);

const exporting = ref(false);
const exportingBtnText = computed(() =>
  exporting.value ? "Exporting to image..." : "Save year pixels as image"
);

const yearPixelsRef = templateRef("yearPixelsRef");

async function handleSaveClick() {
  try {
    exporting.value = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (yearPixelsRef.value as any).saveToImage();
  } catch (err) {
    console.error("Error exporting image");
  } finally {
    exporting.value = false;
  }
}
</script>
