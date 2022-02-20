<template>
  <q-layout
    view="hHh Lpr lff"
  >
    <!-- container -->
    <!-- <q-footer elevated>
    style="height: 100vh"
    class="shadow-2 absolute-center rounded-borders"
      <q-toolbar class="q-electron-drag">
        <q-btn
          rounded
          icon="key"
          label="Enter"
          color="grey-4"
          text-color="secondary"
          class="q-electron-drag--exception"
          @click="card = !card"
        />

        <q-space />
        <q-toolbar-title class="text-h5 text-bold absolute-center"
          ><span color="secondary">ProPlayer v8</span>
        </q-toolbar-title>


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
    </q-footer> -->

    <q-page-container>      
      <hero-carousel />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
// import LoginRegister from "src/components/auth/LoginRegister.vue";
import HeroCarousel from 'src/components/auth/HeroCarousel.vue';
export default {
  name: "AuthPage",
  components: {
    // LoginRegister,
    HeroCarousel
  },
  data: () => ({
    tab: "login",
    card: false
  }),
  computed: {
    ...mapState("auth", ["loggedIn"]),
    isElectron() {
      return process.env.MODE === "electron";
    }
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
