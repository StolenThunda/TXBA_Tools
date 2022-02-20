<template>
  <q-btn icon="fa fa-cogs" label="Tools">
    <q-menu transition-show="flip-right" transition-hide="flip-left">
      <q-list style="min-width: 100px;" dense>
        <template v-for="toolSection in this.tools">
          <span :key="toolSection.title">
          <q-item dense>
            <q-item-label class="q-pt-sm text-weight-bolder text-capitalize">{{
              toolSection.title
            }}</q-item-label>
          </q-item>
          <q-separator />
          <template v-for="child in toolSection.children">
            <span :key="child.title">
            <q-item v-if="child.internal" v-ripple clickable :to="child.internal">
              <q-item-section avatar>
                <q-icon :name="child.icon" size="xs" />
              </q-item-section>

              <q-item-section>{{ child.title }}</q-item-section>
            </q-item>
            <q-item v-if="child.external" v-ripple clickable>
              <q-item-section avatar>
                <q-icon  :name="child.icon" size="xs" />
              </q-item-section>
              <q-item-section  @click="go(child.external)">{{ child.title }}</q-item-section>
            </q-item>
            </span>
          </template>
          </span>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  name: "ToolList",
  data: () => ({
    tools: [
      {
        title: "TXBA Exclusives",
        children: [
          {
            title: "Guitar Tuner",
            icon: "mdi-tune",
            internal: "/tools/tuner"
          },
          {
            title: "Spider Drills",
            icon: "mdi-spider-web",
            internal: '/tools/spider'
          },
          {
            title: "Fretboard Tool",
            icon: "mdi-guitar-acoustic",
            internal: '/tools/fretboard'
          }
        ]
      },
      {
        title: "Import",
        children: [
          {
            title: "Load Youtube Video",
            icon: "mdi-youtube",
            external: " "
          }
        ]
      },
      {
        title: "Account",
        children: [
          {
            title: "Account Dashboard",
            icon: "fa fa-user-circle",
            external: "/tools/ex/account"
          },
          {
            title: "Locals Forums",
            icon: "fa fa-users",
            external: "/tools/ex/forums"
          }
        ]
      },
      {
        title: "Update",
        children: [
          {
            title: "Refresh Page",
            icon: "mdi-refresh",
            external: "refresh"
          }
        ]
      }
    ]
  }),
  methods: {
    refresh() {
      window.location.reload(true);
    },
    go(dest) {
      if (dest !== "refresh")
        this.$router.push(`https://texasbluesalley.com/${dest}`).catch(err => {});
      this.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
.section-heading {
    text-transform: uppercase !important;
    font-weight: 900 !important;
    background: #777 !important;
    line-height: 1.25em !important;
    font-size: .8em !important;
}
.q-link{
  background-color: #000000 !important;
}
.q-item{
  background-color: #424242;
}
</style>
