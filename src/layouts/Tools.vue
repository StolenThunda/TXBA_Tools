<template>
  <!--q-layout view="hHh lpR fFf">  <q-layout view="hHh Lpr lff"> -->
     <q-layout view="lHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
    <q-header elevated reveal>
      <q-toolbar >
        <q-btn
        color="accent"
        icon="menu"
        aria-label="menu"
        @click="retrieveDrawer = !retrieveDrawer"
      />
      <q-space />
        <q-toolbar-title class="text-capitalize text-subtitle2">
          {{ $route.meta.name || 'TXBA TOOLS'}}
        </q-toolbar-title>
        
        <q-btn label="Back" color="accent" icon="close" to="/tools" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
   
</template>

<script>
import { mapActions } from "vuex"
export default {
  name: "ToolsLayout",
  data: () => ({
    retrieveDrawer: false,
    tab: ''
  }),
  computed: { 
    ...mapActions('auth', ['logout_user'])
  }
};
</script>
<style scoped>
@import url('https://texasbluesalley.com/?css=proplayer7-5/css-TunerTool.v.1601956345');
</style>