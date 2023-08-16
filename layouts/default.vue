<template lang="pug">
.d-flex.vh-100.flex-column.w-100
  c-navbar.border-bottom.border-2.border-dark(expand="lg", color-scheme="light")
    .container-lg.align-items-center
      c-navbar-brand
        h1.mb-0
          .hstack.gap-2.align-items-center
            year-chooser
            div in pixels
      c-navbar-toggler(@click="showNavbar = !showNavbar")
      c-collapse.navbar-collapse(:visible="showNavbar")
        c-navbar-nav.ms-auto
          c-nav-item(v-if="$pwa.needRefresh")
            c-button(
              color="primary", 
              @click="$pwa.updateServiceWorker()"
            ) #[icon(name="bi:repeat")] Update available
          c-nav-item(v-for="nav of navigation", :key="nav.link")
            icon-link.nav-link(:link="nav.link", :icon="nav.icon", :text="nav.text")
  slot
</template>

<script setup lang="ts">
import {
  CNavbar,
  CNavbarBrand,
  CCollapse,
  CNavbarToggler,
  CNavbarNav,
  CNavItem,
  CButton,
} from "@coreui/bootstrap-vue";

const router = useRouter();

const showNavbar = ref(false);

router.afterEach(() => {
  showNavbar.value = false
})

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
  () => $pwa.offlineReady,
  () => {
    console.log("ready to work offline");
  }
);
</script>

<style lang="scss" scoped>
.nav-link {
  font-size: 1.2rem;

  &.active {
    font-weight: 600;
  }
}
</style>
