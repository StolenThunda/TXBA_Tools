<template>
  <div>
    <q-toolbar class="bg-primary text-capitalize  shadow-2 tab-title" >
      <q-toolbar-title class="text-capitalize text-caption">Instant Loops</q-toolbar-title>
    </q-toolbar>
    <loop-tabs :tabList="tabs" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "LoopManager",
  data: () => ({
    active: false,
    tabs: [
      {
        name: "TXBA",
        componentName: "TXBA Loops",
        cmp: () => import(/* webpackChunkName: "watch-sidebar" */"./ReadOnlyLoops")
      },
      {
        name: "Yours",
        componentName: "Your Loops",
        icon: "",
        cmp: () => import(/* webpackChunkName: "watch-sidebar" */"./UserLoops")
      },
      {
        name: "Locals",
        componentName: "Locals Loops",
        cmp: () => import(/* webpackChunkName: "watch-sidebar" */"./MemberLoops")
      }
      ]
  }),
  components: {
    loopTabs: () => import(/* webpackMode: "lazy", webpackPrefetch: true, webpackPreload: true */"../../../../components/base/DynamicTab")
  },
  computed: {
    ...mapState("watch", ["currentSegment"])
  }
};
</script>

<style lang="scss">
.tab-title {
  min-height: 25px !important;
}
</style>
