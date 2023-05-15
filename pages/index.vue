<template lang="pug">
.overflow-y-auto
  .container-lg.py-3
    year-pixels(:year="year")
.offcanvas.offcanvas-bottom.border-top.border-2.border-dark.text-center.mood-bg.p-relative.show(
  v-if="selectedDate"
  position="bottom"
)
  .close-detail.w-100
    button.btn.btn-lg.btn-light.border.border-dark.py-1(@click="selectedDate = null") #[icon(name="bi:caret-down-fill")]
  .offcanvas-header
    .container
      .row.pt-3
        .col
          h4 {{ formattedDate }}
          .lead Your day was:
  .offcanvas-body
    .container
      mood-board
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";
import dayjs from "dayjs";

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
</script>

<style lang="scss" scoped>
.mood-bg {
  transition: background-color 0.4s ease;
  background-color: v-bind("selectedMoodBgColor");
  color: v-bind("selectedMoodTextColor");
}

.close-detail {
  float: left;
  position: relative;
  top: -20px;
  height: 0px;
}

.offcanvas {
  height: auto;
}
</style>
