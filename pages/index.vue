<template lang="pug">
.overflow-y-auto
  .container-xxl.py-3
    .vstack.gap-4
      year-pixels(:year="year" ref="yearPixelsRef")
      .row
        .col
          year-progress
      .row
        .col.text-center
          button.btn.btn-primary(@click="handleSaveClick", :disabled="exporting")
            icon(name="mdi:checkerboard")
            |  {{ exportingBtnText }}
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
            button.btn.btn-light.btn-lg(
              type="button", 
              @click="dataStore.previousDay()",
              title="Previous day"
            )
              icon(name="bi:arrow-left")
          .flex-grow-1
            h4 {{ formattedDate }}
            .lead.mb-o Your day was:
          div
            button.btn.btn-light.btn-lg(
              type="button", 
              @click="dataStore.nextDay()",
              title="Next day",
              :disabled="!canGoNext"
            )
              icon(name="bi:arrow-right")
    mood-board
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";
import dayjs from "dayjs";
import { Sheet } from "bottom-sheet-vue3";

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
  dayjs(selectedDate.value).format("dddd DD, MMMM, YYYY"),
);

const selectedMoodBgColor = computed<string>(() => {
  const defaultColor = "white";

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
  getGoodContrastColor(selectedMoodBgColor.value),
);

onMounted(() => {
  selectedDate.value = null;
});

const sheetStyle = computed(() => {
  return {
    "--bottom-sheet-bakground-color": selectedMoodBgColor.value,
    "--bottom-sheet-text-color": selectedMoodTextColor.value,
  };
});

const canGoNext = computed(() =>
  dayjs(selectedDate.value).isBefore(dayjs().startOf("day")),
);

const exporting = ref(false);
const exportingBtnText = computed(() => {
  return exporting.value
    ? "Exporting to image..."
    : "Save year pixels as image";
});

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
