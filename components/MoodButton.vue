<template lang="pug">
b-button.w-100(
  :active="active",
  :variant="colorMode.value === 'light' ? 'light' : 'dark'"
)
  .vstack.gap-2
    div
      icon.mood-icon(:name="iconName")
    .text-truncate {{ text }}
    .mood-bar.w-100.rounded
</template>

<script setup lang="ts">
import is from "@sindresorhus/is";
import { DayMood } from "~~/utils/enums/DayMood";

const props = defineProps<{
  iconName: string;
  mood: DayMood | null;
  active: boolean;
}>();

const text = computed(() => (props.mood ? MoodTexts[props.mood] : "N/A"));

const color = computed(() =>
  is.nullOrUndefined(props.mood)
    ? "black"
    : (colorScale(Number(props.mood)) as string)
);

const colorMode = useColorMode();
</script>

<style lang="scss" scoped>
.mood-bar {
  height: 8px;
  background-color: v-bind("color");
}

.mood-icon {
  @media (max-width: 991px) {
    width: 20px;
    height: 20px;
  }

  @media (min-width: 992px) {
    width: 50px;
    height: 50px;
  }
}
</style>
