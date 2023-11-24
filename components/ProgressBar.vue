<template lang="pug">
.progress(
  role="progressbar" 
  :aria-label="label"
  :aria-valuenow="progress"
  aria-valuemin="0" 
  aria-valuemax="100"
)
  .progress-bar.bg-success(:style="{width: `${progress}%`}") {{ progress.toFixed(1) }}%
</template>

<script setup lang="ts">
import { calcPercent } from "math-helper-functions";

const props = defineProps<{
  current: number;
  total: number;
  label: string;
}>();

const progress = computed(() => calcPercent(props.current, props.total));
</script>
