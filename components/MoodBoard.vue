<template lang="pug">
.vstack.gap-3
  .row.row-cols-md-6.row-cols-3.g-3
    .col
      mood-button(
        :mood="DayMood.Great",
        :active="dayMood === DayMood.Great",
        icon="gg:smile-mouth-open",
        @click="applyDayMood(DayMood.Great)"
      )
    .col
      mood-button(
        :mood="DayMood.Good",
        :active="dayMood === DayMood.Good",
        icon="gg:smile",
        @click="applyDayMood(DayMood.Good)"
      )
    .col
      mood-button(
        :mood="DayMood.Neutral",
        :active="dayMood === DayMood.Neutral",
        icon="gg:smile-neutral",
        @click="applyDayMood(DayMood.Neutral)"
      )
    .col
      mood-button(
        :mood="DayMood.Bad",
        :active="dayMood === DayMood.Bad",
        icon="gg:smile-sad",
        @click="applyDayMood(DayMood.Bad)"
      )
    .col
      mood-button(
        :mood="DayMood.Awful",
        :active="dayMood === DayMood.Awful",
        icon="gg:smile-upside",
        @click="applyDayMood(DayMood.Awful)"
      )
    .col
      mood-button(
        :mood="null",
        :active="dayMood === null",
        icon="gg:smile-no-mouth",
        @click="removeDayMood"
      )
  .row(v-if="!privateMode")
    .col
      .input-group
        .input-group-text Comments
        textarea.form-control#dayComment(
          :value="selectedDateData?.comment"
          @input.lazy="handleCommentInput"
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

function handleCommentInput(e: Event) {
  dataStore.setDayComment(
    selectedDate.value as string,
    (e.target as HTMLTextAreaElement).value,
  );
}
</script>
