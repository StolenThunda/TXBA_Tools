<template>
  <q-layout
    view="hHh Lpr lff"
    style="padding-top: env(safe-area-inset-top)"
    class="shadow-2 rounded-borders"
  >
    <!-- <q-layout view="lHh Lpr lff"> -->
    <q-footer elevated>
      <q-toolbar class="q-electron-drag">
        <drawer-toggle
          v-if="loggedIn"
          @toggle-drawer="leftDrawerOpen = !leftDrawerOpen"
          class="q-electron-drag--exception"
        />
        <q-btn
          v-else
          rounded
          color="grey-4"
          text-color="secondary"
          class="absolute-center q-electron-drag--exception"
          label="Click Here to Enter"
          @click="card = !card"
        />

        <q-space />
        <q-toolbar-title class="text-h5 text-bold absolute-center"
          ><span color="secondary">ProPlayer v8</span>
        </q-toolbar-title>

        <q-btn
          size="25px"
          color="secondary"
          to="/browser"
          icon="mdi-magnify"
          split
          flat
        />
        <auth-button v-if="loggedIn" />
        <control-buttons v-if="isElectron" />

        <q-dialog v-model="card">
          <q-card class="auth-tabs">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="login" label="Login" />
              <q-tab name="register" label="Register" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="login">
                <login-register :tab="tab" />
              </q-tab-panel>

              <q-tab-panel name="register">
                <login-register :tab="tab" />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </q-dialog>
      </q-toolbar>
    </q-footer>

    <q-drawer
      v-if="loggedIn"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="350"
      :breakpoint="500"
    >
      <dynamic-tab :tabList="tabs" />
    </q-drawer>

    <q-page-container>
      <transition mode="out-in">
        <router-view @toggle-drawer="leftDrawerOpen = !leftDrawerOpen" />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import ControlButtons from "components/base/ControlButtons.vue";
import DrawerToggle from "components/base/DrawerToggle.vue";
import AuthButton from "components/base/AuthButton.vue";
import LoginRegister from "src/components/auth/LoginRegister.vue";
import { mapState, mapActions } from "vuex";
export default {
  name: "MainLayout",
  components: {
    DynamicTab: () => import(/* webpackMode: "lazy", webpackPrefetch: true, webpackPreload: true */"components/base/DynamicTab.vue"),
    DrawerToggle,
    AuthButton,
    LoginRegister,
    ControlButtons
  },
  data: () => ({
    leftDrawerOpen: false,
    tab: "login",
    card: false
  }),
  mounted() {
    this.$refs.carousel.on('click', () => {
      this.card = !this.card;
    });
  },
  computed: {
    ...mapState("auth", ["loggedIn"]),
    ...mapState("default", { tabs: state => state.sidebarTabs }),
    isElectron() {
      return process.env.MODE === 'electron'
    }
  },
  mounted() {
    this.resetSideBar();
  },
  methods: {
    ...mapActions("default", ["resetSideBar"])
  }
};
</script>

<style>
#mobileAuthNavBar {
  min-height: 125px;
  justify-content: space-between;
}
.auth-tabs {
  /* height: 50vh; */
  max-width: 500px;
  margin: 0 auto;
}
</style>
