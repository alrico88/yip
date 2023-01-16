<template lang="pug">
.overflow-y-auto
  .container-lg.py-3
    year-pixels(:year="year")
.border-top.border-2.border-dark.text-center.p-relative.mood-bg(
  v-if="selectedDate !== null"
)
  .close-detail.w-100
    button.btn.btn-light.border.border-dark.py-1(@click="selectedDate = null") #[icon(name="bi:caret-down-fill")]
  .container.py-3
    .row
      .col
        h4.mb-0 {{ formattedDate }}
        .lead.mb-2 Your day was:
    .row
      .col
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
const { selectedDate, year, daysMoods } = storeToRefs(dataStore);

const formattedDate = computed(() =>
  dayjs(selectedDate.value).format("dddd DD, MMMM, YYYY")
);

const selectedMoodBgColor = computed<string>(() => {
  const defaultColor = "white";

  if (selectedDate.value === null) {
    return defaultColor;
  }

  const mood = daysMoods.value.find((d) => d.date === selectedDate.value)?.mood;

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
.close-detail {
  float: left;
  position: relative;
  top: -20px;
  height: 0px;
}
</style>

<style lang="scss" scoped>
.mood-bg {
  transition: background-color 0.4s ease;
  background-color: v-bind("selectedMoodBgColor");
  color: v-bind("selectedMoodTextColor");
}
</style>
