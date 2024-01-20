<template lang="pug">
b-button(variant="primary", @click.prevent="() => copy()", :disabled="copied")
  icon(name="bi:clipboard") 
  |
  | {{ copied ? "Copied" : "Copy" }} to clipboard
</template>

<script setup lang="ts">
const props = defineProps<{
  toCopy: string;
}>();

const { copied, copy } = useClipboard({
  source: () => props.toCopy,
});
</script>
