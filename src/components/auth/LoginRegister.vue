l<template>
  <form @submit.prevent="submitForm" @keyup.enter="submitForm">
    <div class="row q-mb-md">
      <q-banner >
        <template v-slot:avatar>
          <q-icon name="account_circle" color="primary" />
        </template>
        <span class="text-capitalize">{{tab}}</span> to access your TXBA experience!
      </q-banner>
    </div>
    <div class="row q-mb-md">
      <q-input
        v-model="formData.email"
        :rules="[
          val =>
            isValidEmailAddress(val) || 'Please enter a valid email address'
        ]"
        ref="email"
        lazy-rules
        outlined
        class="col"
        label="Email"
        stack-label
      >
      <template v-slot:prepend>
          <q-icon 
            name="email"
          />
        </template>
      </q-input>
    </div>
    <div class="row q-mb-md">
      <q-input
        ref="password"
        class="col"
        outlined
        stack-label
        v-model="formData.password"
        :type="passwordVisible ? 'text' : 'password'"
        label="Password"
        :rules="[
          val => val.length >= 6 || 'Please enter at least six characters'
        ]"
        lazy-rules
      >
      <template v-slot:prepend>
          <q-icon 
            :name="passwordVisible ? 'visibility_off' : 'visibility'" 
            @click="passwordVisible = !passwordVisible"
          />
        </template>
      </q-input>
    </div>
    <div class="row">
      <q-btn label="Cancel" icon="close" color="primary" v-close-popup />
      <q-space />
      <q-btn color="primary" :label="tab" type="submit" />
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ['tab'],
  data: () => ({
    passwordVisible: false,
    formData: {
      email: "",
      password: ""
    }
  }),
  methods: {
    ...mapActions('auth', ['register_user', 'login_user']),
    submitForm() {
      this.$refs.email.validate() 
      this.$refs.password.validate()
      if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
        if (this.tab == 'login') {
          this.login_user(this.formData)
        }else{
          this.register_user(this.formData);
        }
      }
    },
    isValidEmailAddress(email) {
      const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return res.test(String(email).toLowerCase());
    }
  }
};
</script>
