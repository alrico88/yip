<template lang="pug">
.hstack.gap-2.align-items-center
  button.btn.btn-light.border.p-0(@click="() => dataStore.decreaseYear()")
    .d-flex.align-items-center.px-3.py-2
      icon(name="bi:arrow-left")
  .fw-bolder {{ year }}
  button.btn.btn-light.border.p-0(@click="() => dataStore.increaseYear()", :disabled="increaseDisabled")
    .d-flex.align-items-center.px-3.py-2
      icon(name="bi:arrow-right")
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";

const dataStore = useDataStore();
const { year, increaseDisabled } = storeToRefs(dataStore);
</script>
