<template lang="pug">
button.btn.btn-light.border-dark(@click="() => dataStore.decreaseYear()")
  icon(name="bi:arrow-left")
.fw-bolder {{ year }}
button.btn.btn-light.border-dark(@click="() => dataStore.increaseYear()", :disabled="increaseDisabled")
  icon(name="bi:arrow-right")
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/data";

const dataStore = useDataStore();
const { year, increaseDisabled } = storeToRefs(dataStore);
</script>
