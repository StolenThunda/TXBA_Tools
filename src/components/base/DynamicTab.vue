<template>
  <div :id="componentKey" v-if="myTabs.length > 0">
    <q-tabs v-model="selectedTab" inline-label>
      <q-tab
        
        v-for="tab in myTabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.iconOnly ? '' : tab.name"
        :icon="tab.labelOnly  ? '' : tab.icon"
        @click.prevent="selectedTab = tab.name"
      >
        <q-menu v-if="tab.menu">
          <component :is="tab.menu" :app="app"></component>
        </q-menu>
      </q-tab>
    </q-tabs>

    <q-tab-panels
      v-model="selectedTab"
    >
      <q-tab-panel
        class="q-ma-none q-pa-sm fit"
        v-for="tab in myTabs"
        :key="tab.name"
        :name="tab.name"
      >
        <component :is="tab.cmp" v-bind="tab.props" :app="app" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
export default {
  name: "DynamicTabs",
  data: () => ({
    componentKey: 0,
    selectedTab: null,
      myTabs: [], 
  }),
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    app: { 
      type: Object,
      default: () => null
    },
  },
  mounted() {
    this.myTabs = this.sortedTabs(this.tabList);
  },
  watch: {
    tabList: {
      handler: function(val, old) {
        // console.log('val', val)
        // console.log('old', old)
        this.getFirst();
        this.componentKey++
      },
      deep: true
    }
  }, 
  methods: {
    sortedTabs(list) {
      const tabOrder = [
      ];
      // console.log("orig", JSON.stringify(this.tabList));
      list.sort(function(a, b) {
        return tabOrder.indexOf(a.name) - tabOrder.indexOf(b.name);
      });
      // console.log("sorted", JSON.stringify(this.tabList));
      // console.log("sorted", JSON.stringify(sorted));
      this.getFirst();
      return list
    },
    getFirst() {
      const tl = this.$options.propsData.tabList;
      if (!tl || tl.length === 0) return;
      const list = JSON.parse(JSON.stringify(tl));
      const firstName = list[0]?.name || 0;
      console.log(`Loading Tab: ${firstName} of ${JSON.stringify(list)}`)
      this.selectedTab = typeof list[0]?.name === "undefined" ? "" : firstName;
      console.log(`Selected Sidebar Tab: ${this.selectedTab}`)
    }
  }
};
</script>

<style lang="stylus" scoped>
.q-item {
  padding: 0px;
}
</style>
