<template lang="pug">
b-progress(:value="current", :max="total", variant="success", show-progress)
</template>

<script setup lang="ts">
const props = defineProps<{
  current: number;
  total: number;
  label: string;
}>();
</script>
