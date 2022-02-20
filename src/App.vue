<template>
  <div id="q-app" class="d-flex flex-column h-100">
  <div class="container flex-grow-1">
      <div class="mt-5">
    <router-view :key="$route.fullPath" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  mounted() {
    this.handleAuthStateChange()
  },
  methods: {
    ...mapActions('auth', ['handleAuthStateChange'])
  }
};
</script>

<style>
/* @import 'https://fonts.googleapis.com/css?family=Oswald' */
* {
    font-family: "Oswald","Open Sans","Lucida Grande","Lucida Sans Unicode",Helvetica,Sans-Serif  ;

}
</style>