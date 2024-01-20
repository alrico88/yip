<template lang="pug">
b-navbar.border-bottom.border-2(toggleable="lg", container)
  b-navbar-brand.fs-3
    .hstack.gap-2.align-items-center
      year-chooser
      div in pixels
  b-navbar-toggle(target="nav-collapse")
  b-collapse#nav-collapse(is-nav)
    b-navbar-nav.ms-auto
      b-nav-item.fs-5(v-if="$pwa?.needRefresh")
        b-button(color="primary", @click="$pwa?.updateServiceWorker()") #[icon(name="bi:repeat")] Update available
      b-nav-item.fs-5(
        @click="toggleTheme",
        v-b-tooltip="`Current theme: ${colorMode.preference}`"
      )
        icon(:name="themeIcon")
      .border-end
      b-nav-item.fs-5(
        v-for="nav of navigation",
        :key="nav.link",
        :to="nav.link",
        active-class="active"
      ) #[icon(:name="nav.icon")] {{ nav.text }}
slot
</template>

<script setup lang="ts">
import { vBTooltip } from "bootstrap-vue-next";

const router = useRouter();

const showNavbar = ref(false);

router.afterEach(() => {
  showNavbar.value = false;
});

const navigation = [
  {
    link: "/",
    icon: "material-symbols:grid-on",
    text: "Pixels",
  },
  {
    link: "/stats",
    icon: "ic:sharp-query-stats",
    text: "Stats",
  },
  {
    link: "/backup",
    icon: "material-symbols:settings-backup-restore-rounded",
    text: "Backup and restore",
  },
  {
    link: "/about",
    icon: "mdi:help-circle-outline",
    text: "About",
  },
];

const { $pwa } = useNuxtApp();

watch(
  () => $pwa?.offlineReady,
  () => {
    console.log("ready to work offline");
  }
);

const colorMode = useColorMode();
const themeIcon = computed(() => {
  switch (colorMode.preference) {
    case "system":
      return "mdi:theme-light-dark";
    case "light":
      return "material-symbols:sunny-outline-rounded";
    default:
      return "tabler:moon";
  }
});

function toggleTheme() {
  switch (colorMode.preference) {
    case "system":
      colorMode.preference = "light";
      break;
    case "light":
      colorMode.preference = "dark";
      break;
    default:
      colorMode.preference = "system";
  }
}
</script>
