<template lang="pug">
.vstack.gap-3
  .row.row-cols-md-6.row-cols-3.g-3
    .col
      mood-button(
        :mood="DayMood.Great",
        :active="dayMood === DayMood.Great",
        icon-name="gg:smile-mouth-open",
        @click="applyDayMood(DayMood.Great)"
      )
    .col
      mood-button(
        :mood="DayMood.Good",
        :active="dayMood === DayMood.Good",
        icon-name="gg:smile",
        @click="applyDayMood(DayMood.Good)"
      )
    .col
      mood-button(
        :mood="DayMood.Neutral",
        :active="dayMood === DayMood.Neutral",
        icon-name="gg:smile-neutral",
        @click="applyDayMood(DayMood.Neutral)"
      )
    .col
      mood-button(
        :mood="DayMood.Bad",
        :active="dayMood === DayMood.Bad",
        icon-name="gg:smile-sad",
        @click="applyDayMood(DayMood.Bad)"
      )
    .col
      mood-button(
        :mood="DayMood.Awful",
        :active="dayMood === DayMood.Awful",
        icon-name="gg:smile-upside",
        @click="applyDayMood(DayMood.Awful)"
      )
    .col
      mood-button(
        :mood="null",
        :active="dayMood === null",
        icon-name="gg:smile-no-mouth",
        @click="removeDayMood"
      )
  .row(v-if="!privateMode")
    .col
      b-input-group(prepend="Comments")
        b-form-textarea(
          :model-value="selectedDateData?.comment",
          @input="handleCommentInput",
          :rows="3"
        )
</template>

<script setup lang="ts">
import { DayMood } from "~/utils/enums/DayMood";
import { useDataStore } from "~/stores/data";

const dataStore = useDataStore();
const { selectedDate, selectedDateData, privateMode } = storeToRefs(dataStore);

function applyDayMood(mood: DayMood): void {
  dataStore.setDayMood(selectedDate.value as string, mood);
}

function removeDayMood(): void {
  dataStore.removeDayMood(selectedDate.value as string);
}

const dayMood = computed(() => selectedDateData.value?.mood ?? null);

function handleCommentInput(val: string) {
  dataStore.setDayComment(selectedDate.value as string, val);
}
</script>
