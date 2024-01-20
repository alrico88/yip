<template lang="pug">
.hstack.gap-2.align-items-center
  b-button.border.p-0(
    :variant="btnVariant",
    @click="() => dataStore.decreaseYear()"
  )
    .d-flex.align-items-center.px-3.py-2
      icon(name="tabler:arrow-left")
  .fw-bolder {{ year }}
  b-button.border.p-0(
    :variant="btnVariant",
    @click="() => dataStore.increaseYear()",
    :disabled="increaseDisabled"
  )
    .d-flex.align-items-center.px-3.py-2
      icon(name="tabler:arrow-right")
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";

const dataStore = useDataStore();
const { year, increaseDisabled } = storeToRefs(dataStore);

const colorMode = useColorMode();
const btnVariant = computed(() =>
  colorMode.value === "light" ? "light" : "secondary"
);
</script>
