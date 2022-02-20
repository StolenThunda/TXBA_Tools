<template>
  <q-btn
    v-bind="authBtnProps"
    glossy
    push
    ripple
    icon="account_circle"
  >
    <q-menu>
      <div class="row q-pa-lg no-wrap ">
        <div class="column ">
          <div class="text-h6 q-mb-md">Settings</div>
          <default-tool-list />
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center">
          <div class="text-center text-subtitle1 q-mt-md q-mb-xs">
            {{ userEmail }}
          </div>

          <q-btn
            v-if="loggedIn"
            icon="fa fa-power-off"
            color="primary"
            label="Logout"
            push
          @click.prevent="logout_user"
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>

<script>
import { firebaseAuth } from "boot/firebase";
import { mapActions, mapState } from "vuex";
export default {
  name: "AuthButton",
  components: {
    DefaultToolList: () => import("components/base/DefaultToolList")
  },
  computed: {
    ...mapState("auth", ["loggedIn"]),
    authBtnProps() {
      const props = !this.loggedIn
        ? {
            "icon-right": "fas fa-sign-in-alt",
            label: "Login"
          }
        : {
            round: true
          };
      return Object.assign(
        {
          flat: true,
          dense: true
        },
        props
      );
    },
    round() {
      return this.loggedIn;
    },
    userEmail() {
      return firebaseAuth.currenUser?.email ?? "Default@email.com";
    },
  },
  methods: {
    ...mapActions("auth", ["login_user", "logout_user"])
  }
};
</script>
