<template lang="pug">
.row.row-cols-md-6.row-cols-3.g-3
  .col
    mood-button(
      :mood="DayMood.Great",
      :day-mood="dayMood",
      icon="gg:smile-mouth-open",
      @click="applyDayMood(DayMood.Great)"
    )
  .col
    mood-button(
      :mood="DayMood.Good",
      :day-mood="dayMood",
      icon="gg:smile",
      @click="applyDayMood(DayMood.Good)"
    )
  .col
    mood-button(
      :mood="DayMood.Neutral",
      :day-mood="dayMood",
      icon="gg:smile-neutral",
      @click="applyDayMood(DayMood.Neutral)"
    )
  .col
    mood-button(
      :mood="DayMood.Bad",
      :day-mood="dayMood",
      icon="gg:smile-sad",
      @click="applyDayMood(DayMood.Bad)"
    )
  .col
    mood-button(
      :mood="DayMood.Awful",
      :day-mood="dayMood",
      icon="gg:smile-upside",
      @click="applyDayMood(DayMood.Awful)"
    )
  .col
    mood-button(
      :mood="null",
      :day-mood="dayMood",
      icon="gg:smile-no-mouth",
      @click="removeDayMood"
    )
</template>

<script setup lang="ts">
import { DayMood } from "~/utils/enums/DayMood";
import { useDataStore } from "~/stores/data";

const dataStore = useDataStore();
const { selectedDate, daysMoods } = storeToRefs(dataStore);

function applyDayMood(mood: DayMood): void {
  dataStore.setDayMood(selectedDate.value as string, mood);
}

function removeDayMood(): void {
  dataStore.removeDayMood(selectedDate.value as string);
}

const dayMood = computed(
  () => daysMoods.value.find((d) => d.date === selectedDate.value)?.mood ?? null
);
</script>
