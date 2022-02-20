<template>
  <q-list v-if="activeList" bordered separator class="q-mr-xs">
    <LoopListItem
      v-for="(item, i) in Object.entries(loopArray)"
      :set="(loop = loopArray[i])"
      :loop="loop"
      :index="loop[0]"
      :key="i + componentKey"
      :active="isActive(loop)"
    />
  </q-list>
</template>

<script>
import { mapState } from "vuex";
import LoopListItem from "components/watch/sidebar/loopTab/LoopListItem.vue";
export default {
  name: "LoopList",
  data: () => ({ componentKey: 0 }),
  props: {
    loopArray: {
      type: Array,
      default: () => []
    },
    altMessage: {
      type: String,
      default: "No Alt Message or Data"
    },
    collectionID: {
      type: Number,
      default: () => 0
    }
  },
  components: {
    LoopListItem
  },
  created() {
    if (this.loopArray?.length) {
      const list = {};
      for (let [k, v] of Object.entries(this.loopArray)) {
        const loop = v;
        const key = this.getActiveItemName(loop);
        list[key] = false;
        // console.log('loop', key, loop);
      }
      this.$store.commit("watch/SET_ACTIVE_LOOPLIST", list);
    }
    this.$root.$on("loop-cleared", this.clearAllLoops);
    this.$root.$on("get-item-id", this.getItemID);
    this.$root.$on("toggle-active", this.toggleActive);
  },
  computed: {
    ...mapState("watch", {
      activeList: state => state.playerSettings.activeList
    })
  },
  methods: {
    clearAllLoops() {
      Object.entries(this.activeList).map((k, v) => {
        return (this.activeList[k] = false);
      });
    },
    getItemID({ loop, index }) {
      return this.getActiveItemName(loop) + this.collectionID + index;
    },
    isActive(loop) {
      return this.activeList[this.getActiveItemName(loop)];
    },
    getActiveItemName(val) {
      return this.getItemName(val) + "_active";
    },
    toggleActive(loop) {
      const itm = this.getActiveItemName(loop);
      const active =  !this.activeList[itm]
      const objLoop = {
        key : itm,
        active : active,
        loopdata: active ? loop : ["", -1, -1]
      }
      this.$store.dispatch("watch/setLoopWithObject", objLoop)
      // this.componentKey++;
    },
    getItemName(val) {
      if (!val || !val[0]) return val;
      const name = val[0].replace(/\s/g, "") || "";
      // console.log("getIName", name);
      return name;
    }
  }
};
</script>
