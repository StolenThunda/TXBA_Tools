<template>
  <q-layout
    style="height: 100vh"
    class="shadow-2 rounded-borders"
    view="hhh lpR lFr"
  >
    <!-- 
    <q-layout 
    view="hHh lpR lff"
    view="hHh Lpr lff"
  > -->
    <q-header v-show="showHeader">
      <watch-toolbar class="q-electron-drag">
        <template #toggle>
          <q-btn
            flat
            round
            dense
            :icon="drawerIcon"
            @click="leftDrawer = !leftDrawer"
          />
        </template>
        <template #auth>
          <auth-button />
        </template>
      </watch-toolbar>
    </q-header>

    <!--<q-drawer v-model="leftDrawer" side="left">
      <div class="row lt-md">
        <q-btn
          class="offset-5 col"
          flat
          size="xl"
          icon="mdi-code-less-than"
          @click="leftDrawer = !leftDrawer"
        />
      </div>
      <dynamic-tab :tabList="tabs" />
    </q-drawer>-->

    <q-page-container class="q-ma-none q-pa-none">
      <router-view :key="$route.fullPath" />
    </q-page-container>

    
  </q-layout>
</template>

<script>
import AuthButton from "components/base/AuthButton";
import WatchToolbar from "components/watch/toolbar/Toolbar";
import { mapState, mapActions } from "vuex";
export default {
  name: "WatchLayout",
  components: {
    WatchToolbar,
    AuthButton
  },
  data: () => ({
    showHeader: true,
    currentTime: -1,
    leftDrawer: true,
    currentTab: null,
    favs: false,
    splitterModel: 55,
    thumbStyle: {
      right: "5px",
      borderRadius: "5px",
      backgroundColor: "#027be3",
      width: "10px",
      opacity: 0.35
    }
  }),
  computed: {
    headerInvisible() {
      return this.showHeader === false;
    },
    drawerIcon() {
      return this.leftDrawer ? "mdi-backburger" : "menu";
    },
    getTabs() {
      return this.tabs;
    },
    ...mapState("default", { tabs: "sidebarTabs" }),
    ...mapState("watch", {
      sections: "sections",
      currentCourse: "currentCourse"
    })
  },
  watch: {
    leftDrawer(val) {
      this.splitterModel = val ? 65 : 100;
    }
  },
  created() {
    this.$root.$on("ctime-update", this.currentTimeUpdate);
    this.$root.$on("toggle_header", this.toggleHeader);
    this.getPackageData();
    this.getPackageData();
    this.addSidebarTabs([
      {
        name: "Segments",
        componentName: "SegmentsManager",
        icon: "mdi-segment",
        iconOnly: true,
        cmp: () =>
          import(
            /* webpackChunkName: "watch-sidebar" */ "components/watch/sidebar/segmentTab/Segments"
          ),
        menu: () =>
          import(
            /* webpackChunkName: "watch-sidebar", webpackMode: "lazy" */ "components/watch/settings/playerSettings"
          )
      },
      {
        name: "Comments",
        componentName: "CommentsManager",
        icon: "mdi-comment-multiple-outline",
        iconOnly: true,
        cmp: () =>
          import(
            /* webpackChunkName: "watch-sidebar", webpackMode: "lazy" */ "components/watch/sidebar/commentTab/Comments"
          )
      }
    ]);
  },
  methods: {
    toggleHeader(){
      this.showHeader = !this.showHeader
      console.log('head-togg', this.showHeader)
    },
    currentTimeUpdate(val) {
      this.currentTime = val;
    },
    showTab(tab) {
      this.currentTab = tab;
    },
    goBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push("/").catch(err => {});
    },
    async getPackageData() {
      return await this.fetchPackage(this.$route.params.packageID);
    },
    ...mapActions(["addSidebarTabs"]),
    ...mapActions("watch", ["fetchPackage"])
  }
};
</script>
<style lang="scss" scoped>
.menu-list .q-item {
  border-radius: 0 32px 32px 0;
}
</style>
