<template lang="pug">
.vstack.gap-2
  h4.fw-bolder.mb-0 Share
  .form-text.mb-0 Get a link to remotely export your data. No identifiable information is stored. Links are valid for 24 hours
  button.btn.btn-secondary.w-100(@click="saveToRemote", :disabled="loading") {{ loading ? 'Getting' : 'Get'}} share link
  .alert.alert-success.text-center.mb-0(v-if="showSaved")
    .vstack.gap-2.text-center
      div Your share link is:
      a.mb-0.bg-white.rounded.p-2(:href="saved") {{ saved }}
      .w-100.text-center
        img.qr(:src="asQR", alt="QR Code")
      copy-to-clip(:to-copy="saved")
</template>

<script setup lang="ts">
import is from "@sindresorhus/is";
import QRCode from "qrcode";

const props = defineProps<{
  data: string;
}>();

const config = useRuntimeConfig();
const route = useRoute();

const loading = ref(false);
const hasError = ref(false);
const saved = ref("");
const asQR = ref("");

const showSaved = computed(
  () => !hasError.value && is.nonEmptyString(saved.value)
);

async function saveToRemote() {
  try {
    hasError.value = false;
    loading.value = true;

    const response = await $fetch("/api/store", {
      method: "POST",
      body: {
        data: props.data,
      },
    });

    saved.value = `${location.origin}${route.path}?id=${response.data}`;

    asQR.value = await QRCode.toDataURL(saved.value);
  } catch (err) {
    hasError.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.qr {
  width: 100px;
}
</style>
