<template lang="pug">
.container.py-3
  .row.row-cols-1.g-3
    .col
      backup-export
    .col
      backup-import
    .col
      .vstack.gap-2
        h4.fw-bolder.mb-0 Delete
        div
          confirm-delete(
            @delete="daysMoods = []",
            text="Delete all data",
            filled
          )
</template>

<script setup lang="ts">
import { useDataStore } from "~~/stores/data";

useHead({
  title: "Backup / Restore - YiP (Year in Pixels)",
  meta: [
    {
      name: "description",
      content: "Backup your data or import it from another device",
    },
  ],
});

const dataStore = useDataStore();
const { daysMoods } = storeToRefs(dataStore);
</script>
