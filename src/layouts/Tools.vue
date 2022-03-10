<template>
  <!--q-layout view="hHh lpR fFf">  <q-layout view="hHh Lpr lff"> -->
  <q-layout view="lHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated reveal>
      <q-bar class="q-electron-drag">
        <q-btn
          data-cy="toggle-menu-btn"
          v-show="hasMenu"
          color="accent"
          icon="menu"
          aria-label="menu"
          class="lt-sm"
          @click="toggleMenu = !toggleMenu"
        />
        <q-toolbar-title class="text-capitalize text-h3 text-center">
          {{ $route.meta.name || "TXBA TOOLS" }}
        </q-toolbar-title>

        <q-btn
          v-if="!isHomePage"
          label="Back"
          color="accent"
          icon="close"
          to="/"
          data-cy="back-btn"
        />
        <q-btn
          v-else
          label="Logout"
          color="accent"
          icon="close"
          @click="logout"
          data-cy="logout-btn"
        />
      </q-bar>
    </q-header>
<!-- 
    <q-drawer v-model="toggleMenu" side="left" v-show="hasMenu" bordered>
      <DynamicTab :tabList="[getMenu]" />
    </q-drawer> -->

    <q-page-container>
      <router-view :key="$route.fullPath" :toggleMenu="toggleMenu" />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "ToolsLayout",
  data: () => ({
    toggleMenu: false,
  }),
  // components: {
  //   DynamicTab: () => import('components/base/DynamicTab.vue'),
  // },
  computed: {
    isHomePage() {
      return this.$route.meta.name === undefined;
    },
    hasMenu() {
      return this.$route.meta.menu !== undefined;
    },
    getMenu() {
      return this.hasMenu ? this.$route.meta.menu : null;
    }, 
  },
  created() {
    // console.log("created");
    this.$root.$on('app-loaded', (app) => {
      this.app = app;
    });
  },
  methods: {
    logout() {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to logout?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => this.$store.dispatch("auth/logout_user"))
        .onCancel(() =>
          this.$q.notify({
            title: "Cancelled",
            color: "negative",
            message: "Logout cancelled",
            timeout: 1000,
          })
        );
    },
  },
};
</script>
