<template lang="pug">
b-form.vstack.gap-2(@submit.prevent="saveToRemote")
  h4.fw-bolder.mb-0 Share
  b-form-text.mb-0 Get a link to remotely export your data. No identifiable information is stored. Links are valid for 24 hours. You can set a passphrase to encrypt the information.
  b-input-group(prepend="Passphrase (optional)")
    b-form-input(v-model="passphrase")
  b-button.w-100(variant="success", type="submit", :disabled="loading") {{ loading ? "Getting" : "Get" }} share link
  b-alert.text-center.mb-0(:model-value="showSaved", variant="success")
    .vstack.gap-2.text-center
      div Your share link is:
      b-input-group
        template(#append)
          copy-to-clip(:to-copy="saved")
        b-form-input(:model-value="saved", readonly)
      .w-100.text-center
        img.qr.rounded(:src="asQR", alt="QR Code")
</template>

<script setup lang="ts">
import is from "@sindresorhus/is";
import QRCode from "qrcode";

const props = defineProps<{
  data: string;
}>();

const route = useRoute();

const loading = ref(false);
const hasError = ref(false);
const saved = ref("");
const asQR = ref("");

const passphrase = ref("");

const showSaved = computed(
  () => !hasError.value && is.nonEmptyString(saved.value)
);

async function saveToRemote() {
  try {
    hasError.value = false;
    loading.value = true;

    const encryptor = new Encryptor(passphrase.value);

    const response = await $fetch("/api/store", {
      method: "POST",
      body: {
        data: encryptor.encryptString(props.data),
      },
    });

    saved.value = `${location.origin}${route.path}?id=${response.data}`;

    asQR.value = await QRCode.toDataURL(saved.value);
  } catch (err) {
    hasError.value = true;

    console.error(err);
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
