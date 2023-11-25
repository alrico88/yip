<template lang="pug">
nuxt-link(:to="link", :target="newTab ? '_blank' : '_self'", exact-active-class="active")
  .hstack.gap-1
    icon(:name="icon")
    div {{ text }}
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon: string;
    text: string;
    link: string;
    newTab?: boolean;
  }>(),
  {
    newTab: false,
  },
);
</script>
