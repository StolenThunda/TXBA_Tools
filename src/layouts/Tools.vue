<template>
  <!--q-layout view="hHh lpR fFf">  <q-layout view="hHh Lpr lff"> -->
  <q-layout view="lHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated reveal>
      <q-bar class="q-electron-drag">
        <q-btn
        v-show="hasMenu"
        color="accent"
        icon="menu"
        aria-label="menu"
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
        />
        <q-btn
          v-else
          label="Logout"
          color="accent"
          icon="close"
          @click="logout"
        />
      </q-bar>
    </q-header>

    <q-drawer
      v-model="toggleMenu"
      side="left"
      v-if="hasMenu"
      bordered
      >
      <div>
        <component :is="getMenu()" />
      </div>
    </q-drawer>

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
    tab: "",
  }),
  computed: {
    isHomePage() {
      return this.$route.meta.name === undefined;
    },
    hasMenu() { return this.$route.meta.menu !== undefined },
    getMenu() { return this.hasMenu ? this.$route.meta.menu : null },
  },
  components: () => {
    const components = {};
    const menu = this.$route.meta.menu;
    if (menu) {
      components[menu] = import(`./${menu}.vue`);
      console.log(`components: ${components}`);
    }
    return components;
  
  },
  methods: {
    logout() {
      this.$q.dialog({
        title: "Confirm",
        message: "Are you sure you want to logout?",
        cancel: true,
        persistent: true,
      })
      .onOk(() => this.$store.dispatch("auth/logout_user"))
      .onCancel(() => this.$q.notify({
        title: "Cancelled",
        color: "negative",
        message: "Logout cancelled",
        timeout: 1000,
      }));
    },
  },
};
</script>