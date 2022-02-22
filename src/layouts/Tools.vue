<template>
  <!--q-layout view="hHh lpR fFf">  <q-layout view="hHh Lpr lff"> -->
  <q-layout view="lHh Lpr lff" class="shadow-2 rounded-borders">
    <q-header elevated reveal>
      <q-bar class="q-electron-drag">
        <!-- <q-btn
        color="accent"
        icon="menu"
        aria-label="menu"
        @click="retrieveDrawer = !retrieveDrawer"
      /> -->
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
          @click="$store.dispatch('auth/logout_user')"
        />
      </q-bar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "ToolsLayout",
  data: () => ({
    retrieveDrawer: false,
    tab: "",
  }),
  computed: {
    isHomePage() {
      return this.$route.meta.name === undefined;
    },
  },
};
</script>
<style scoped>
@import url("https://texasbluesalley.com/?css=proplayer7-5/css-TunerTool.v.1601956345");
</style>
