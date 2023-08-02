<template lang="pug">
.overflow-y-auto
  .container-lg.py-3
    year-pixels(:year="year")
sheet.mood-bg(
  v-model:visible="showSlideover", 
  :style="sheetStyle",
  :only-header-swipe="true"
)
  .container.py-3
    .row.text-center.pb-3
      .col
        h4 {{ formattedDate }}
        .lead.mb-o Your day was:
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
  dayjs(selectedDate.value).format("dddd DD, MMMM, YYYY")
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
  getGoodContrastColor(selectedMoodBgColor.value)
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
</script>
